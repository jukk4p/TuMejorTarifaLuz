import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogData";

export default function BlogPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-800 text-slate-900 dark:text-white mb-6 uppercase tracking-tight">
                            Blog de <span className="text-primary">Ahorro Energético</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Consejos, guías y noticias para que tomes el control de tu factura de luz y descubras cómo optimizar tu consumo.
                        </p>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article
                                key={post.id}
                                className="premium-card group bg-white dark:bg-slate-900 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800"
                            >
                                <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.imageAlt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                            {post.category}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        <span>{new Date(post.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h2 className="text-xl font-800 text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h2>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between mt-auto">
                                        <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 group/btn">
                                            Leer más
                                            <span className="material-icons text-sm group-hover/btn:translate-x-1 transition-transform">east</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="mt-24 p-8 md:p-16 bg-slate-900 dark:bg-slate-800 rounded-[2rem] text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-800 mb-6 font-display">¿Quieres más consejos de ahorro?</h2>
                            <p className="text-slate-400 mb-10">Únete a nuestra newsletter y recibe una selección quincenal de las mejores tarifas y trucos energéticos.</p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="flex-grow bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/20">
                                    Suscribirme
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
