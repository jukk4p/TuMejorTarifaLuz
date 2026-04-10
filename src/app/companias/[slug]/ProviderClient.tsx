"use client";

import { useMemo, useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Provider, providers } from "../providersData";
import { useTariffs } from "@/hooks/useTariffs";
import { useTheme } from "next-themes";
import { 
    ArrowLeft, Star, StarHalf, ThumbsUp, ThumbsDown, Info, 
    CheckCircle2, AlertCircle, ChevronRight, BarChart3, 
    ShieldCheck, Zap, AppWindow, Users, ShieldAlert,
    Newspaper, ArrowRight
} from "lucide-react";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { calculateTariffCost, Tariff } from "@/lib/tariffs";

export default function ProviderClient({ provider }: { provider: Provider }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { tariffs } = useTariffs();

    // Matching company logic
    const companyTariffs = tariffs.filter(t => {
        const tComp = (t.company?.toLowerCase() || "").replace(/[^a-z0-9]/g, '');
        const pId = provider.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        const pName = provider.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return tComp.includes(pId) || pId.includes(tComp) || pName.includes(tComp);
    });

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

    const calculateEstimation = (tariff: Tariff) => {
        const input = {
            days: 30,
            power_p1: 3.45,
            power_p2: 3.45,
            energy_p1: tariff.type === '3 Periodos' ? 250 * 0.23 : 250,
            energy_p2: tariff.type === '3 Periodos' ? 250 * 0.26 : 0,
            energy_p3: tariff.type === '3 Periodos' ? 250 * 0.51 : 0,
        };
        const result = calculateTariffCost(tariff, input);
        return result.total;
    };

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Inicio", item: "https://tumejortarifaluz.es" },
        { name: "Compañías eléctricas", item: "https://tumejortarifaluz.es/companias" },
        { name: provider.name, item: `https://tumejortarifaluz.es/companias/${provider.slug}` }
    ]);

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": provider.name,
        "logo": `https://tumejortarifaluz.es${provider.logo}`,
        "url": `https://tumejortarifaluz.es/companias/${provider.slug}`,
        "description": provider.description,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": provider.rating,
            "reviewCount": "120"
        }
    };

    const similarProviders = useMemo(() => {
        let options: Provider[] = [];
        if (provider.category === 'big') {
            options = providers.filter(p => p.category === 'big' && p.id !== provider.id);
        } else if (provider.category === 'independent') {
            options = providers.filter(p => p.category === 'independent' && p.id !== provider.id).slice(0, 3);
        } else {
            options = providers.filter(p => p.id !== provider.id).slice(0, 3);
        }
        return options;
    }, [provider]);

    return (
        <>
            <Navbar />
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={organizationSchema} />
            <main className="min-h-screen bg-slate-50 dark:bg-background pt-32 pb-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
                            <li className="flex items-center gap-2">
                                <ChevronRight size={10} />
                                <Link href="/companias" className="hover:text-primary">Compañías eléctricas</Link>
                            </li>
                            <li className="flex items-center gap-2">
                                <ChevronRight size={10} />
                                <span className="text-slate-500">{provider.name}</span>
                            </li>
                        </ol>
                    </nav>

                    <div className="mb-8">
                        <Link href="/companias" className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            ← Volver al listado
                        </Link>
                    </div>

                    {/* Brand Profile Section */}
                    <div className="premium-card p-12 mb-12 relative overflow-hidden bg-white dark:bg-slate-900 border border-border shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start">
                            <div className="w-64 h-32 bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 flex items-center justify-center shadow-inner border border-border group-hover:shadow-xl transition-all duration-500">
                                <img
                                    src={mounted && resolvedTheme === 'dark' && provider.logo_dark ? provider.logo_dark : provider.logo}
                                    alt={provider.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <div className="flex-grow text-center md:text-left space-y-4">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-900 text-text-primary tracking-tight leading-[1.1]">
                                    Tarifas {provider.name} 2026: Precios y Análisis
                                </h1>
                                <p className="text-base md:text-lg text-text-secondary leading-relaxed font-medium">{provider.description}</p>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                                    <span className="text-[12px] font-bold text-slate-500 flex items-center gap-2">
                                        Tarifas disponibles: {companyTariffs.length}
                                    </span>
                                    <span className="text-slate-300">·</span>
                                    {!provider.hasPermanence && (
                                        <>
                                            <span className="text-[12px] font-bold text-emerald-500 flex items-center gap-1.5">
                                                <CheckCircle2 size={14} /> Sin permanencia
                                            </span>
                                            <span className="text-slate-300">·</span>
                                        </>
                                    )}
                                    <span className="text-[12px] font-bold text-primary">
                                        Desde {provider.minPrice.toFixed(4)} €/kWh
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-border min-w-[160px]">
                                <div className="text-5xl font-900 text-text-primary mb-3 leading-none">{provider.rating}</div>
                                <div className="mb-2">{renderStars(provider.rating)}</div>
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Ranking 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Pros & Cons Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                        {/* Pros */}
                        <div className="premium-card p-10 border-emerald-100 dark:border-emerald-500/10 bg-emerald-50/20 dark:bg-emerald-500/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
                                    <ThumbsUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-800 text-text-primary">Lo mejor</h3>
                            </div>
                            <ul className="space-y-6">
                                {provider.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                        <div className="space-y-1">
                                            <span className="text-slate-900 dark:text-slate-100 font-bold block">{pro}</span>
                                            {provider.prosDetail?.[i] && (
                                                <span className="text-[12px] text-slate-500 dark:text-slate-400 block font-medium">
                                                    {provider.prosDetail[i]}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons */}
                        <div className="premium-card p-10 border-warning/20 bg-warning/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-warning text-white flex items-center justify-center shadow-xl shadow-warning/20">
                                    <ThumbsDown className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-800 text-text-primary">A mejorar</h3>
                            </div>
                            <ul className="space-y-6">
                                {provider.cons.map((con, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <AlertCircle className="w-5 h-5 text-warning mt-1 shrink-0" />
                                        <div className="space-y-1">
                                            <span className="text-slate-900 dark:text-slate-100 font-bold block">{con}</span>
                                            {provider.consDetail?.[i] && (
                                                <span className="text-[12px] text-slate-500 dark:text-slate-400 block font-medium">
                                                    {provider.consDetail[i]}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Active Tariffs Section */}
                    <div className="space-y-12 mb-24">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-900 text-text-primary tracking-tight">Tarifas Disponibles</h2>
                                <p className="text-text-secondary font-medium italic">Selección recomendada para hoy</p>
                            </div>
                            <Link 
                                href={`/tarifas?company=${encodeURIComponent(provider.name)}`} 
                                className="text-primary text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2"
                            >
                                Ver en catálogo completo
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="grid gap-8">
                            {companyTariffs.length > 0 ? (
                                companyTariffs.map((tariff, i) => {
                                    const isPopular = tariff.name === provider.popularTariffName || (i === 0 && !provider.popularTariffName);
                                    const monthlyEstimation = calculateEstimation(tariff);

                                    return (
                                        <div key={i} className="group relative">
                                            {isPopular && (
                                                <div className="absolute -top-3 right-8 z-10 bg-primary px-3 py-1 rounded-md text-[11px] font-black text-white uppercase tracking-widest shadow-lg">
                                                    Más popular
                                                </div>
                                            )}
                                            <div className="relative premium-card !p-0 overflow-hidden bg-white dark:bg-slate-900 border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
                                                <div className="px-8 py-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(15,105,197,0.5)]"></div>
                                                        <h4 className="text-xl font-900 text-text-primary tracking-tight">{tariff.name}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[13px] font-700 text-primary">≈ {monthlyEstimation.toFixed(0)}€/mes</span>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                                            {tariff.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                                                    <div className="grid sm:grid-cols-2 gap-10 lg:gap-16">
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-xl">⚡</span>
                                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Energía (€/kWh)</span>
                                                            </div>
                                                            
                                                            {tariff.type === '3 Periodos' ? (
                                                                <div className="grid grid-cols-3 gap-6">
                                                                    {[
                                                                        { l: "Punta", v: tariff.e1_kwh, c: "text-rose-500" },
                                                                        { l: "Llano", v: tariff.e2_kwh, c: "text-warning" },
                                                                        { l: "Valle", v: tariff.e3_kwh, c: "text-emerald-500" }
                                                                    ].map((item, idx) => (
                                                                        <div key={idx} className="space-y-1">
                                                                            <span className="block text-[9px] font-black text-slate-400 uppercase">{item.l}</span>
                                                                            <span className={`text-xl font-900 ${item.c}`}>{item.v.toFixed(4)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-4xl font-900 text-text-primary">{(tariff.e1_kwh ?? 0).toFixed(4)}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-6 lg:border-l lg:border-border lg:pl-16">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-xl">🔌</span>
                                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Potencia (€/kW/día)</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <span className="block text-[9px] font-black text-slate-400 uppercase">Punta</span>
                                                                    <span className="text-xl font-900 text-text-primary">{tariff.p1_kw_day.toFixed(4)}</span>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="block text-[9px] font-black text-slate-400 uppercase">Valle</span>
                                                                    <span className="text-xl font-900 text-text-primary">{tariff.p2_kw_day.toFixed(4)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <Link
                                                            href="/comparador"
                                                            className="px-10 py-5 bg-slate-900 dark:bg-primary text-white font-black rounded-2xl md:min-w-[200px] text-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                                                        >
                                                            Optimizar mi ahorro
                                                        </Link>
                                                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Sin permanencia · Actualizado</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-20 p-8 border-2 border-dashed border-border rounded-[2.5rem] bg-slate-50/50">
                                    <ShieldAlert size={48} className="mx-auto text-slate-300 mb-6" />
                                    <p className="text-slate-500 font-medium">No hay tarifas específicas cargadas para {provider.name} en este momento.</p>
                                    <Link href="/tarifas" className="text-primary text-sm font-bold mt-4 inline-block hover:underline">Ir al catálogo general →</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detailed Analysis Section */}
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-10">
                            <h3 className="text-3xl font-900 text-text-primary tracking-tight">Análisis detallado</h3>
                            <div className="h-px flex-grow bg-slate-200"></div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-border p-12 rounded-[2.5rem] shadow-sm space-y-10">
                            {[
                                { label: "Precio y Competitividad", score: provider.scores.price, icon: <span>⚡</span> },
                                { label: "Atención al Cliente", score: provider.scores.support, icon: <Users size={18} /> },
                                { label: "Ecosistema Digital / App", score: provider.scores.app, icon: <AppWindow size={18} /> },
                                { label: "Transparencia Contractual", score: provider.scores.transparency, icon: <ShieldCheck size={18} /> },
                                { label: "Experiencia de Contratación", score: provider.scores.onboarding, icon: <CheckCircle2 size={18} /> }
                            ].map((row, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold text-sm">
                                            <span className="text-primary/60">{row.icon}</span>
                                            {row.label}
                                        </div>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{row.score.toFixed(1)}/5.0</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                                            style={{ width: `${(row.score / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Similar Providers Section */}
                    <div className="mb-24">
                        <h3 className="text-2xl font-900 text-text-primary mb-10 tracking-tight">Compara también con</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarProviders.map((sim, i) => (
                                <Link 
                                    key={i} 
                                    href={`/companias/${sim.slug}`}
                                    className="bg-white dark:bg-slate-900 border border-border p-8 rounded-2xl hover:shadow-xl transition-all group"
                                >
                                    <div className="h-16 w-32 mb-6 flex items-center">
                                        <img 
                                            src={mounted && resolvedTheme === 'dark' && sim.logo_dark ? sim.logo_dark : sim.logo} 
                                            alt={sim.name} 
                                            className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                                        />
                                    </div>
                                    <h4 className="text-lg font-800 text-text-primary mb-2">{sim.name}</h4>
                                    <div className="flex items-center gap-2 mb-4">
                                        {renderStars(sim.rating)}
                                        <span className="text-xs font-bold text-slate-400">{sim.rating}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                        <span className="text-[11px] font-bold text-primary">Desde {sim.minPrice.toFixed(3)} €</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 inline-flex items-center gap-1 group-hover:text-primary transition-colors">
                                            Análisis
                                            <ChevronRight size={12} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Blog Cross-linking */}
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-900 text-text-primary tracking-tight">Guías y Recursos</h3>
                            <div className="h-px flex-grow bg-slate-200"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link href="/blog/como-leer-entender-factura-luz-2026" className="premium-card p-6 border border-border flex items-center gap-6 group hover:border-primary/50 transition-all bg-white dark:bg-slate-900">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Newspaper size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-800 text-text-primary group-hover:text-primary transition-colors">Manual: Cómo leer tu factura</h4>
                                    <p className="text-[12px] text-text-secondary leading-tight">Aprende a identificar cada concepto y evitar cobros indebidos.</p>
                                </div>
                                <ArrowRight className="ml-auto text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
                            </Link>
                            <Link href="/blog/mercado-libre-pvpc" className="premium-card p-6 border border-border flex items-center gap-6 group hover:border-primary/50 transition-all bg-white dark:bg-slate-900">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Zap size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-800 text-text-primary group-hover:text-primary transition-colors">Mercado Libre vs PVPC</h4>
                                    <p className="text-[12px] text-text-secondary leading-tight">Descubre qué mercado te protege mejor en 2026 tras la reforma.</p>
                                </div>
                                <ArrowRight className="ml-auto text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Final CTA Section */}
                    <div className="p-12 rounded-[3.5rem] bg-surface-3 dark:bg-slate-800/20 text-center space-y-10 border border-primary/10 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
                        <h3 className="text-3xl md:text-5xl font-900 text-text-primary tracking-tight leading-tight">¿Es {provider.name} la mejor <br/>opción para ahorrar hoy?</h3>
                        <p className="text-text-secondary text-lg font-medium max-w-2xl mx-auto">Nuestro algoritmo analiza tu consumo real para confirmarte si esta es tu tarifa ganadora o si existe una opción más barata.</p>
                        
                        <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center justify-center gap-x-8 gap-y-3 md:gap-y-4 max-w-[280px] md:max-w-xl mx-auto py-2">
                             {[
                                "Sin registro obligatorio",
                                "Resultado en menos de 30 segundos",
                                "Comparamos entre 24 tarifas del mercado"
                             ].map((b, i) => (
                                 <div key={i} className="flex items-start gap-3 text-sm font-700 text-text-secondary w-full md:w-auto">
                                     <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 mt-0.5">
                                         <CheckCircle2 size={12} />
                                     </div>
                                     <span className="text-left leading-snug">{b}</span>
                                 </div>
                             ))}
                        </div>
 
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 relative z-10">
                            <Link href="/comparador" className="px-12 py-5 bg-primary text-white rounded-[2.5rem] font-900 text-lg hover:shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
                                Calcular Ahorro Ahora
                            </Link>
                            <Link href="/blog/como-leer-entender-factura-luz-2026" className="px-12 py-5 bg-surface-2 border border-primary text-primary rounded-[2.5rem] font-900 text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                                <Info className="w-5 h-5" />
                                Guía de conceptos
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
