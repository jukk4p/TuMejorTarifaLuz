"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogData";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { Search, PiggyBank, GraduationCap, ArrowLeftRight, Sun, BarChart3, ArrowRight, X, ThermometerSnowflake, CarFront } from "lucide-react";

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

    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesCategory = selectedCategory === "Todos" || post.category.toLowerCase().includes(selectedCategory.toLowerCase()) || (selectedCategory === "Comparativas" && post.category === "Comparativa");
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <>
            <Navbar />
            <JsonLd data={getBreadcrumbSchema([
                { name: "Inicio", item: "/" },
                { name: "Blog de Ahorro", item: "/blog" }
            ])} />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 px-4">
                        <h1 className="text-4xl md:text-6xl font-900 text-slate-900 dark:text-white mb-6 uppercase tracking-tight leading-[1.1]">
                            Blog de <span className="text-primary italic">Ahorro Energético</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                            Consejos, guías y noticias para que tomes el control de tu factura de luz y descubras cómo optimizar tu consumo.
                        </p>
                    </div>

                    {/* Search and Category Navigation */}
                    <div className="max-w-4xl mx-auto mb-16 space-y-8">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Busca guías de ahorro, tarifas, autoconsumo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:border-primary/50 focus:shadow-2xl focus:shadow-primary/5 transition-all text-sm font-medium dark:text-white"
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
                        <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
                            {categories.map((cat, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border shadow-sm shrink-0
                                        ${selectedCategory === cat.name
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl shadow-slate-900/10"
                                            : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {cat.icon && <cat.icon size={16} />}
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
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
                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-xl font-800 text-slate-900 dark:text-white mb-2">No se encontraron guías</h3>
                            <p className="text-slate-500 dark:text-slate-400">Intenta con otros términos o cambia la categoría.</p>
                            <button 
                                onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
                                className="mt-8 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}

                    {/* Newsletter / CTA */}
                    <div className="mt-24 p-8 md:p-16 bg-slate-900 dark:bg-slate-800 rounded-[2rem] text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-800 mb-6 font-display">¿Quieres más consejos de ahorro?</h2>
                            <p className="text-slate-400 mb-10">Únete a nuestra newsletter y recibe una selección quincenal de las mejores tarifas y trucos energéticos.</p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
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
