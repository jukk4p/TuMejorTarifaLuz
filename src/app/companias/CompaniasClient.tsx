"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
    ShieldCheck, Star, StarHalf, CheckCircle, ChevronRight, 
    BadgeCheck, Radar, Shield, Search, ChevronDown, ListFilter,
    Activity, Headphones, Scale, Zap
} from "lucide-react";
import { providers, Provider } from "./providersData";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export default function CompaniasClient() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("rating"); // rating, name, price
    const [filterType, setFilterType] = useState("all"); // all, big, independent, regulated

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredAndSortedProviders = useMemo(() => {
        let result = providers.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === "all" || p.category === filterType;
            return matchesSearch && matchesType;
        });

        if (sortBy === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "price") {
            result.sort((a, b) => a.minPrice - b.minPrice);
        }

        return result;
    }, [searchTerm, sortBy, filterType]);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-0.5 text-warning">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`f-${i}`} size={14} className="fill-current" />
                ))}
                {hasHalfStar && <StarHalf size={14} className="fill-current" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`e-${i}`} size={14} />
                ))}
            </div>
        );
    };

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Inicio", item: "/" },
        { name: "Compañías eléctricas", item: "/companias" }
    ]);

    return (
        <>
            <Navbar />
            <JsonLd data={breadcrumbSchema} />
            <main className="min-h-screen bg-slate-50 dark:bg-background pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs View */}
                    <nav className="mb-8 flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3 text-[10px] font-black uppercase tracking-widest">
                            <li className="inline-flex items-center">
                                <Link href="/" className="text-slate-400 hover:text-primary transition-colors">Inicio</Link>
                            </li>
                            <li>
                                <div className="flex items-center gap-2">
                                    <ChevronRight size={10} className="text-slate-300" />
                                    <span className="text-slate-500">Compañías eléctricas</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" />
                            Análisis Imparcial
                        </div>
                        <h1 className="text-4xl md:text-7xl font-900 text-text-primary leading-[1.1] tracking-tight">
                            Mejores <span className="text-primary italic">Comercializadoras</span> 2026
                        </h1>
                        <p className="text-base text-text-secondary leading-relaxed max-w-3xl mx-auto">
                            Compara las <strong>mejores comercializadoras de luz en España 2026</strong> de forma 
                            profesional y objetiva. Nuestro equipo de expertos analiza mensualmente el 
                            <strong>ranking de eléctricas en España</strong> para ofrecerte datos actualizados sobre 
                            tarifas, calidad de atención al cliente y transparencia contractual. 
                            Utiliza nuestra herramienta avanzada para <strong>comparar compañías eléctricas</strong>, 
                            descubrir los precios por kWh más bajos del mercado y elegir una comercializadora 
                            que realmente se adapte a tus hábitos de consumo, ya sea para tu vivienda particular o tu empresa.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white dark:bg-surface border border-border shadow-sm rounded-2xl p-4 md:p-6 mb-12 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar compañía..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
                            <div className="relative group w-full md:w-56">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                                >
                                    <option value="rating">Ordenar por valoración</option>
                                    <option value="name">Ordenar A-Z</option>
                                    <option value="price">Precio más bajo</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                            </div>
                            <div className="relative group w-full md:w-64">
                                <select 
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                                >
                                    <option value="all">Tipo de compañía: Todas</option>
                                    <option value="big">Grandes compañías</option>
                                    <option value="independent">Independientes</option>
                                    <option value="regulated">Mercado regulado</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAndSortedProviders.map((provider) => (
                            <Link
                                key={provider.id}
                                href={`/companias/${provider.slug}`}
                                title={`Ver análisis completo de ${provider.name}`}
                                className="group premium-card p-10 flex flex-col hover:shadow-2xl transition-all duration-500 border border-border bg-surface relative"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-24 h-12 relative flex items-center justify-center transition-all duration-500">
                                        <img
                                            src={mounted && resolvedTheme === 'dark' && provider.logo_dark ? provider.logo_dark : provider.logo}
                                            alt={provider.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            {renderStars(provider.rating)}
                                            <span className="font-700 text-lg text-text-primary ml-1">{provider.rating}</span>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Puntuación</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-800 text-text-primary mb-4 group-hover:text-primary transition-colors">
                                    {provider.name}
                                </h3>

                                <p className="text-sm text-text-secondary leading-relaxed mb-8 h-[2.8rem] line-clamp-2 overflow-hidden">
                                    {provider.description}
                                </p>

                                <div className="space-y-3 mb-6">
                                    {provider.pros.slice(0, 2).map((pro, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            {pro}
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-8">
                                    <span className="text-[12px] font-600 text-[#0f69c5] bg-[#0f69c5]/5 px-3 py-1 rounded-full">
                                        Desde {provider.minPrice.toFixed(3)} €/kWh
                                    </span>
                                </div>

                                <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                                    <span className="text-xs font-bold text-text-primary transition-all inline-flex items-center gap-2">
                                        Ver análisis completo
                                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Why Section */}
                    <div className="mt-32">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-5xl font-900 text-text-primary mb-6 tracking-tight">¿Cómo puntuamos a las eléctricas?</h2>
                            <p className="text-text-secondary font-medium leading-relaxed">
                                Aplicamos una metodología de análisis 100% independiente basada en datos empíricos y servicio real al cliente.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { t: "Estabilidad de Precios", d: "Analizamos la letra pequeña y penalizamos las subidas de precio sorpresa o renovaciones abusivas.", icon: <Activity className="text-primary" /> },
                                { t: "Calidad de Atención", d: "Medimos tiempos de espera telefónicos, resolución en primer contacto y facilidad de trámites.", icon: <Headphones className="text-emerald-500" /> },
                                { t: "Transparencia Total", d: "Valoramos la claridad en las facturas, la ausencia de seguros ocultos y la sencillez en la contratación.", icon: <Scale className="text-warning" /> },
                                { t: "Precio Competitivo", d: "Comparamos mensualmente las tarifas de cada compañía con la media del mercado y el pool eléctrico.", icon: <span className="text-primary">⚡</span> }
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-surface border border-border p-8 rounded-3xl group hover:shadow-xl transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-lg font-800 text-text-primary mb-3">{item.t}</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed font-medium">{item.d}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-center gap-4">
                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white dark:bg-surface border border-border rounded-2xl shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-text-primary uppercase tracking-widest">Análisis 100% independiente</p>
                                    <p className="text-[10px] text-slate-400 italic">Última revisión: marzo 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
