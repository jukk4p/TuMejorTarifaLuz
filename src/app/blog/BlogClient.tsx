"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, BlogPost } from "@/lib/blogData";
import JsonLd, { getBreadcrumbSchema, getBlogPostingSchema } from "@/components/seo/JsonLd";
import { Search, PiggyBank, GraduationCap, ArrowLeftRight, Sun, BarChart3, ArrowRight, X, ThermometerSnowflake, CarFront, Check } from "lucide-react";

export default function BlogClient() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const categories = [
        { name: "Todos", icon: null },
        { name: "Ahorro", icon: PiggyBank },
        { name: "Educación", icon: GraduationCap },
        { name: "Climatización", icon: ThermometerSnowflake },
        { name: "Movilidad", icon: CarFront },
        { name: "Comparativas", icon: ArrowLeftRight },
        { name: "Solar", icon: Sun },
        { name: "Estrategia", icon: BarChart3 }
    ];

    // Calculate counts for each category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { "Todos": blogPosts.length };
        blogPosts.forEach(post => {
            counts[post.category] = (counts[post.category] || 0) + 1;
        });
        return counts;
    }, []);

    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    // Featured post (latest Climatización or Reclamación)
    const featuredPost = useMemo(() => {
        return blogPosts.find(p => p.slug.includes("aerotermia")) || blogPosts[0];
    }, []);

    // Posts for the grid (excluding featured if search is empty and "Todos" selected)
    const gridPosts = useMemo(() => {
        if (searchQuery || selectedCategory !== "Todos") return filteredPosts;
        return filteredPosts.filter(p => p.id !== featuredPost.id);
    }, [filteredPosts, featuredPost, searchQuery, selectedCategory]);

    return (
        <>
            <Navbar />
            <JsonLd data={getBreadcrumbSchema([
                { name: "Inicio", item: "/" },
                { name: "Blog", item: "/blog" }
            ])} />
            <JsonLd data={getBlogPostingSchema(blogPosts.slice(0, 3))} />
            <main className="min-h-screen bg-slate-50 dark:bg-background pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="mb-8">
                        <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                            <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                            <li className="flex items-center gap-2">
                                <span className="text-[10px]">›</span>
                                <span className="text-slate-600 dark:text-slate-200">Blog</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 px-4">
                        <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary mb-6 uppercase tracking-tight leading-[1.1]">
                            Blog de <span className="text-primary italic">Ahorro Energético</span>
                        </h1>
                        <p className="text-lg text-text-secondary font-medium mb-4">
                            Consejos, guías y noticias para que tomes el control de tu factura de luz y descubras cómo optimizar tu consumo.
                        </p>
                        <div className="text-[13px] text-slate-500 font-medium">
                            12 guías publicadas · Actualizado en marzo 2026
                        </div>
                    </div>

                    {/* Featured Article - Only shown in "Todos" and no search */}
                    {!searchQuery && selectedCategory === "Todos" && (
                        <div className="mb-16">
                            <article className="relative bg-surface-2 rounded-[2rem] overflow-hidden border border-border shadow-xl group">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-[60%] relative aspect-video lg:aspect-auto min-h-[300px]">
                                        <Image
                                            src={featuredPost.image}
                                            alt={featuredPost.imageAlt}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                    <div className="lg:w-[40%] p-8 lg:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                {featuredPost.category}
                                            </span>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(featuredPost.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl lg:text-3xl font-900 text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-primary transition-colors">
                                            <Link href={`/blog/${featuredPost.slug}`}>
                                                {featuredPost.title}
                                            </Link>
                                        </h2>
                                        <p className="text-text-muted mb-8 line-clamp-3 leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-100 dark:border-slate-700">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                {featuredPost.readTime} de lectura
                                            </span>
                                            <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg hover:-translate-y-1">
                                                Leer guía completa
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    )}

                    {/* Search and Category Navigation */}
                    <div className="max-w-4xl mx-auto mb-16 space-y-8 relative">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
                            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
                        </div>
                        {/* Search Bar */}
                        <div className="relative group z-10">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Busca guías de ahorro, tarifas, autoconsumo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface-2 border-2 border-border rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:border-primary/50 focus:shadow-2xl focus:shadow-primary/5 transition-all text-sm font-medium dark:text-white"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Category Navigation */}
                        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
                            {categories.map((cat, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border
                                            ${selectedCategory === cat.name
                                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105"
                                                : "bg-surface-2 text-text-secondary border-transparent hover:bg-surface-3"
                                            }`}
                                    >
                                    {cat.icon && <cat.icon size={14} />}
                                    {cat.name} ({categoryCounts[cat.name] || 0})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {gridPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gridPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="premium-card group bg-surface-2 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 rounded-3xl"
                                >
                                    <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.imageAlt}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                {post.category}
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-4">
                                            <span>{new Date(post.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{post.readTime} de lectura</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight min-h-[5.5rem] flex-none">
                                            <Link href={`/blog/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h2>
                                        <div className="flex-grow min-h-[7rem]">
                                            <p className="text-sm text-text-muted leading-relaxed mb-6">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                        
                                        {/* Tags */}
                                        {post.tags && (
                                            <div className="flex flex-wrap gap-2 mb-8 min-h-[5.5rem] items-start flex-none">
                                                {post.tags.map((tag: string, idx: number) => (
                                                    <span key={idx} className="bg-surface-2 text-text-secondary dark:bg-slate-700 dark:text-slate-200 text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-tighter">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between mt-auto">
                                            <Link href={`/blog/${post.slug}`} className="text-[11px] font-black text-primary border-b-2 border-primary/20 hover:border-primary uppercase tracking-widest flex items-center gap-2 group/btn transition-all">
                                                Leer más
                                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-surface-2/50 rounded-[2rem] p-16 text-center border-2 border-dashed border-border">
                            <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-xl font-800 text-text-primary mb-2">No se encontraron guías</h3>
                            <p className="text-text-secondary">Intenta con otros términos o cambia la categoría.</p>
                            <button 
                                onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
                                className="mt-8 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}

                    {/* Newsletter / CTA */}
                    <div className="mt-32 bg-surface-3 dark:bg-slate-800/50 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden border border-primary/10 dark:border-slate-700">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-900 text-slate-900 dark:text-white mb-6 uppercase tracking-tight">¿Quieres más consejos de ahorro?</h2>
                            <p className="text-lg text-text-muted mb-12 font-medium">Únete a nuestra newsletter y recibe una selección quincenal de las mejores tarifas y trucos energéticos.</p>
                            
                            <ul className="grid sm:grid-cols-3 gap-12 mb-12 text-left">
                                {[
                                    "Las mejores tarifas de la semana",
                                    "Alertas de bajada del Pool",
                                    "Guías exclusivas anticipadas"
                                ].map((bullet, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check size={12} className="text-primary" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight uppercase tracking-tighter md:whitespace-nowrap">{bullet}</span>
                                    </li>
                                ))}
                            </ul>

                            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="flex-grow bg-surface-2 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-8 py-5 outline-none focus:border-primary/30 transition-all text-sm font-bold"
                                />
                                <button className="bg-primary hover:bg-primary-hover text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-105 flex items-center justify-center gap-3">
                                    Suscribirme
                                </button>
                            </form>
                            <p className="text-[12px] text-[#94a3b8] font-bold uppercase tracking-widest">
                                Sin spam. Baja cuando quieras.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
