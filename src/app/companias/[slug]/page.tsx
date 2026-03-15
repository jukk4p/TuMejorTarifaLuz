"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { providers } from "../providersData";
import { useTariffs } from "@/hooks/useTariffs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArrowLeft, Star, ThumbsUp, Check, ThumbsDown, Minus, Info } from "lucide-react";

export default function ProviderDetail() {
    const params = useParams();
    const provider = providers.find(p => p.slug === params.slug) || providers[0];

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { tariffs } = useTariffs();

    // Filtramos las tarifas de esta compañía desde nuestra base de datos real
    const companyTariffs = tariffs.filter(t => {
        const tComp = (t.company?.toLowerCase() || "").replace(/[^a-z0-9]/g, '');
        const pId = provider.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        const pName = provider.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return tComp.includes(pId) || pId.includes(tComp) || pName.includes(tComp);
    });

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-background-dark pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with Back Button */}
                    <div className="mb-12">
                        <Link href="/companias" className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            Volver al listado
                        </Link>
                    </div>

                    {/* Brand Profile Section */}
                    <div className="premium-card p-12 mb-12 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-48 h-24 bg-white dark:bg-white/5 rounded-2xl p-6 flex items-center justify-center shadow-sm">
                                <img
                                    src={mounted && resolvedTheme === 'dark' && provider.logo_dark ? provider.logo_dark : provider.logo}
                                    alt={provider.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <div className="flex-grow text-center md:text-left space-y-4">
                                <h1 className="text-4xl md:text-5xl font-800 text-slate-900 dark:text-white">{provider.name}</h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">{provider.description}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-primary/10">
                                <div className="text-5xl font-900 text-primary mb-2">{provider.rating}</div>
                                <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'fill-current' : ''}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Ranking 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Pros & Cons Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Pros */}
                        <div className="premium-card p-10 border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <ThumbsUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-800 text-slate-900 dark:text-white">Lo mejor</h3>
                            </div>
                            <ul className="space-y-4">
                                {provider.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons */}
                        <div className="premium-card p-10 border-rose-100 dark:border-rose-500/20 bg-rose-50/30 dark:bg-rose-500/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                                    <ThumbsDown className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-800 text-slate-900 dark:text-white">A mejorar</h3>
                            </div>
                            <ul className="space-y-4">
                                {provider.cons.map((con, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <Minus className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Active Tariffs Section */}
                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-900 text-slate-900 dark:text-white tracking-tight">Tarifas Disponibles</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Precios actualizados mercado 2026</p>
                            </div>
                            <div className="hidden md:block h-px flex-grow mx-8 bg-gradient-to-r from-slate-100 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-700 dark:to-transparent"></div>
                        </div>

                        <div className="grid gap-8">
                            {companyTariffs.length > 0 ? (
                                companyTariffs.map((tariff, i) => (
                                    <div key={i} className="group relative">
                                        {/* Decorative Shadow Blur */}
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                        
                                        <div className="relative premium-card !p-0 overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition-all duration-500">
                                            {/* Card Top Header */}
                                            <div className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                                    <h4 className="text-xl font-900 text-slate-900 dark:text-white tracking-tight">{tariff.name}</h4>
                                                </div>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                                    {tariff.type}
                                                </span>
                                            </div>

                                            {/* Card Content Interior */}
                                            <div className="p-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                                                {/* Information Grid */}
                                                <div className="grid sm:grid-cols-2 gap-10 lg:gap-16">
                                                    {/* Energía Block */}
                                                    <div className="space-y-6 text-center sm:text-left">
                                                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                                                            <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                                <span className="text-[14px]">⚡</span>
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Energía</span>
                                                        </div>
                                                        
                                                        {(tariff.type || "").includes("3 Periodos") ? (
                                                            <div className="grid grid-cols-3 gap-4">
                                                                {[
                                                                    { label: "Punta", val: tariff.e1_kwh },
                                                                    { label: "Llano", val: tariff.e2_kwh },
                                                                    { label: "Valle", val: tariff.e3_kwh }
                                                                ].map((item, idx) => (
                                                                    <div key={idx} className="space-y-1">
                                                                        <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">{item.label}</span>
                                                                        <span className="text-xl md:text-2xl font-900 text-slate-900 dark:text-white">{(item.val ?? 0).toFixed(4)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-baseline justify-center sm:justify-start gap-2">
                                                                <span className="text-3xl lg:text-4xl font-900 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{(tariff.e1_kwh ?? 0).toFixed(4)}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Potencia Block */}
                                                    <div className="space-y-6 text-center sm:text-left lg:border-l lg:border-slate-50 lg:dark:border-slate-800/50 lg:pl-16">
                                                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                                                            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                                <span className="text-[14px]">🔌</span>
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Potencia</span>
                                                        </div>

                                                        {(tariff.type || "").includes("3 Periodos") ? (
                                                            <div className="grid grid-cols-2 gap-8">
                                                                {[
                                                                    { label: "Punta (P1)", val: tariff.p1_kw_day },
                                                                    { label: "Valle (P2)", val: tariff.p2_kw_day }
                                                                ].map((item, idx) => (
                                                                    <div key={idx} className="space-y-1">
                                                                        <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">{item.label}</span>
                                                                        <span className="text-xl md:text-2xl font-900 text-slate-900 dark:text-white">{(item.val ?? 0).toFixed(4)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-baseline justify-center sm:justify-start gap-2">
                                                                <span className="text-3xl lg:text-4xl font-900 text-slate-900 dark:text-white">{(tariff.p1_kw_day ?? 0).toFixed(4)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* CTA Section */}
                                                <div className="flex flex-col gap-3">
                                                    <Link
                                                        href="/comparador"
                                                        className="px-10 py-5 bg-slate-900 dark:bg-primary text-white font-black rounded-2xl md:min-w-[200px] text-center shadow-2xl shadow-slate-900/10 dark:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
                                                    >
                                                        Optimizar mi ahorro
                                                    </Link>
                                                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Sin permanencia</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                                    <p className="text-slate-500">Consulta nuestro comparador para ver las ofertas personalizadas de {provider.name}.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-primary to-primary-dark text-white text-center space-y-8 shadow-2xl shadow-primary/20">
                        <h3 className="text-3xl md:text-4xl font-900 leading-tight">¿Es {provider.name} la mejor opción para ti?</h3>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">Nuestro algoritmo analiza tu consumo real en segundos para confirmarte si esta es tu tarifa ganadora o si existe una opción más barata.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/comparador" className="px-10 py-5 bg-white text-primary rounded-[2rem] font-900 hover:shadow-xl hover:-translate-y-1 transition-all">
                                Calcular Ahorro Ahora
                            </Link>
                            <Link href="/guias" className="px-10 py-5 bg-black/20 backdrop-blur-md text-white rounded-[2rem] font-900 hover:bg-black/30 transition-all flex items-center justify-center gap-2">
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
