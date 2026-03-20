import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogData";
import { notFound } from "next/navigation";
import JsonLd, { getBreadcrumbSchema, getArticleSchema } from "@/components/seo/JsonLd";
import { ChevronRight, Facebook, Twitter, Linkedin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import TableOfContents from "@/components/blog/TableOfContents";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    return { title: 'Artículo no encontrado' }
  }
  
  return {
    title: `${post.title} | Blog TuMejorTarifaLuz 2026`,
    description: post.metaDescription ?? post.excerpt?.slice(0, 155),
    openGraph: {
      title: post.title,
      description: post.metaDescription ?? post.excerpt?.slice(0, 155),
      url: `https://tumejortarifaluz.es/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.dateUpdated,
      images: post.image 
        ? [{ url: `https://tumejortarifaluz.es${post.image}`, 
             width: 1200, height: 630 }] 
        : [],
    },
    alternates: {
      canonical: `https://tumejortarifaluz.es/blog/${slug}`
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Get related posts (excluding current) - 3 posts as requested
    const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

    return (
        <>
            <Navbar />
            <JsonLd data={getBreadcrumbSchema([
                { name: "Inicio", item: "/" },
                { name: "Blog", item: "/blog" },
                { name: post.title, item: `/blog/${post.slug}` }
            ])} />
            <JsonLd data={{
                ...getArticleSchema(post),
                datePublished: post.date,
                dateModified: post.dateUpdated || post.date,
                author: {
                    "@type": "Person",
                    "name": "Iván González",
                    "url": "https://tumejortarifaluz.es/sobre-nosotros"
                }
            }} />
            {post.id === "preguntas-frecuentes-luz" && post.faqData && (
                <JsonLd data={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": post.faqData.map((faq: { question: string; answer: string }) => ({
                        "@type": "Question",
                        "name": faq.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.answer
                        }
                    }))
                }} />
            )}
            <main className="min-h-screen bg-white dark:bg-background pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <ChevronRight size={10} />
                        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <ChevronRight size={10} />
                        <span className="text-text-primary truncate max-w-[200px]">{post.title}</span>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <Link 
                                href="/blog" 
                                className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] hover:bg-primary-hover transition-colors shadow-lg shadow-primary/10"
                            >
                                {post.category}
                            </Link>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Clock size={12} />
                                {post.readTime} lect.
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Calendar size={12} />
                                Última actualización: {new Date(post.dateUpdated || post.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-900 text-text-primary mb-8 leading-[1.15] tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 py-6 border-y border-border">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner overflow-hidden">
                                {post.author.avatar ? (
                                    <Image src={post.author.avatar} alt={post.author.name} width={48} height={48} className="object-cover" />
                                ) : (
                                    post.author.name.charAt(0)
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-900 text-text-primary">{post.author.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Especialista en Ahorro Energético
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl group">
                        <Image
                            src={post.image}
                            alt={post.imageAlt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            priority
                        />
                    </div>

                    {/* Table of Contents */}
                    <TableOfContents content={post.content} />

                    {/* Content */}
                    <article
                        className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-900 prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-h2:text-3xl prose-h2:mb-8 prose-h2:mt-16 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-6
              prose-h3:text-xl prose-h3:mt-12
              prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
              prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-li:text-slate-600 dark:prose-li:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Author Bio Section */}
                    <div className="mt-20 p-10 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-border flex flex-col md:flex-row items-center gap-8 text-center md:text-left shadow-sm">
                        <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shadow-2xl shrink-0">
                            {post.author.avatar ? (
                                <Image src={post.author.avatar} alt={post.author.name} width={96} height={96} className="object-cover" />
                            ) : (
                                <span className="text-4xl">{post.author.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xl font-900 text-text-primary">Acerca del autor: <span className="text-primary">{post.author.name}</span></h4>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {post.author.description}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                <Link href="/sobre-nosotros" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Saber más sobre nosotros</Link>
                            </div>
                        </div>
                    </div>

                    {/* Share Section */}
                    <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">¿Te ha resultado útil? Compártelo:</p>
                        <div className="flex items-center gap-3">
                            <button className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-slate-500 dark:text-slate-300 shadow-sm border border-border group" title="Compartir en Facebook">
                                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center hover:bg-black hover:text-white transition-all text-slate-500 dark:text-slate-300 shadow-sm border border-border group" title="Compartir en X (Twitter)">
                                <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all text-slate-500 dark:text-slate-300 shadow-sm border border-border group" title="Compartir en LinkedIn">
                                <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Related Posts */}
                    <div className="mt-32">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Sigue aprendiendo</p>
                                <h3 className="text-3xl md:text-4xl font-900 text-text-primary tracking-tighter">Artículos relacionados</h3>
                            </div>
                            <Link href="/blog" className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group">
                                Ver todo el blog
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map((rPost) => (
                                <Link key={rPost.id} href={`/blog/${rPost.slug}`} className="group space-y-4">
                                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
                                        <Image
                                            src={rPost.image}
                                            alt={rPost.imageAlt}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-slate-900">
                                                {rPost.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Clock size={10} />
                                            {rPost.readTime}
                                        </div>
                                        <h4 className="text-lg font-900 text-text-primary group-hover:text-primary transition-colors leading-tight">
                                            {rPost.title}
                                        </h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
