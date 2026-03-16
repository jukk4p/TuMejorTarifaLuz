import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogData";
import { notFound } from "next/navigation";
import JsonLd, { getBreadcrumbSchema, getArticleSchema } from "@/components/seo/JsonLd";
import { ChevronRight, Facebook, Twitter, Linkedin } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    return { title: 'Artículo no encontrado' }
  }
  
  return {
    title: `${post.title} | Guía 2026`,
    description: post.excerpt?.slice(0, 155) ?? post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt?.slice(0, 155) ?? '',
      url: `https://tumejortarifaluz.es/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
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

    // Get related posts (excluding current)
    const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

    return (
        <>
            <Navbar />
            <JsonLd data={getBreadcrumbSchema([
                { name: "Inicio", item: "/" },
                { name: "Blog", item: "/blog" },
                { name: post.title, item: `/blog/${post.slug}` }
            ])} />
            <JsonLd data={getArticleSchema(post)} />
            <main className="min-h-screen bg-white dark:bg-background-dark pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <ChevronRight size={10} />
                        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <ChevronRight size={10} />
                        <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{post.title}</span>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                                {post.category}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {post.readTime} de lectura
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-900 text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 py-6 border-y border-slate-100 dark:border-slate-800/50">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Publicado el {new Date(post.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
                        <Image
                            src={post.image}
                            alt={post.imageAlt}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-900 prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
              prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-li:text-slate-600 dark:prose-li:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Footer Share */}
                    <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">¿Te ha resultado útil? Compártelo:</p>
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-slate-500 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700" title="Compartir en Facebook">
                                <Facebook size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-all text-slate-500 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700" title="Compartir en X (Twitter)">
                                <Twitter size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all text-slate-500 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700" title="Compartir en LinkedIn">
                                <Linkedin size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Related Posts */}
                    <div className="mt-24">
                        <h3 className="text-2xl font-800 text-slate-900 dark:text-white mb-8 tracking-tight">Artículos relacionados</h3>
                        <div className="grid sm:grid-cols-2 gap-8">
                            {relatedPosts.map((rPost) => (
                                <Link key={rPost.id} href={`/blog/${rPost.slug}`} className="group">
                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            src={rPost.image}
                                            alt={rPost.imageAlt}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h4 className="font-800 text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                                        {rPost.title}
                                    </h4>
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
