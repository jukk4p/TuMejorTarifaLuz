"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blogData";

export default function GuiasPage() {
    const featuredGuide = blogPosts[0];
    const otherGuides = blogPosts.slice(1);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <BookOpen className="w-4 h-4" />
                            Guías de Ahorro
                        </div>
                        <h1 className="text-4xl md:text-6xl font-800 text-text-primary leading-tight">
                            Guías Maestras para <span className="text-primary italic">Ahorrar Luz</span>
                        </h1>
                        <p className="text-xl text-text-secondary font-medium">
                            Contenido experto y detallado para que entiendas tu factura y optimices tu consumo en 2026.
                        </p>
                    </div>

                    {/* Featured Guide */}
                    <div className="mb-20">
                        <div className="relative premium-card overflow-hidden group bg-white dark:bg-surface border border-border">
                            <div className="grid lg:grid-cols-2">
                                <div className="aspect-[16/9] lg:aspect-auto relative overflow-hidden">
                                    <Image
                                        src={featuredGuide.image}
                                        alt={featuredGuide.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6 bg-white dark:bg-surface">
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-tighter">
                                            {featuredGuide.category}
                                        </span>
                                        <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{new Date(featuredGuide.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <h2 className="text-3xl font-900 text-text-primary leading-tight group-hover:text-primary transition-colors">{featuredGuide.title}</h2>
                                    <p className="text-lg text-text-secondary leading-relaxed font-medium line-clamp-3">{featuredGuide.excerpt}</p>
                                    <Link href={`/blog/${featuredGuide.slug}`} className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl w-fit hover:shadow-xl hover:-translate-y-1 transition-all">
                                        Leer Guía Completa
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherGuides.map((guide) => (
                            <article key={guide.id} className="premium-card bg-white dark:bg-surface p-8 flex flex-col group border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">{guide.category}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {new Date(guide.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-xl font-800 text-text-primary mb-4 group-hover:text-primary transition-colors leading-tight h-[3.5rem] overflow-hidden line-clamp-2">
                                    <Link href={`/blog/${guide.slug}`}>
                                        {guide.title}
                                    </Link>
                                </h3>
                                <div className="aspect-video mb-6 rounded-2xl overflow-hidden bg-surface-2 relative">
                                    <Image
                                        src={guide.image}
                                        alt={guide.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-grow line-clamp-3 h-[4rem] overflow-hidden">
                                    {guide.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${guide.slug}`}
                                    className="pt-6 border-t border-border flex items-center justify-between group-hover:bg-slate-50 dark:group-hover:bg-slate-800/10 -mx-8 px-8 transition-colors"
                                >
                                    <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">Leer más</span>
                                    <ArrowRight className="text-primary w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </article>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-20 p-12 md:p-20 bg-[#0f172a] dark:bg-slate-800/50 rounded-[3rem] text-center text-white relative overflow-hidden border border-slate-700 shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <h3 className="text-3xl md:text-4xl font-900 tracking-tight uppercase">¿Quieres ahorrar de verdad?</h3>
                            <p className="text-slate-300 text-lg font-medium">Usa nuestro comparador independiente para analizar tu factura en 30 segundos.</p>
                            <Link href="/comparador" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary-hover shadow-xl shadow-primary/20 hover:scale-105 transition-all outline-none">
                                Comparar mi factura ahora
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
