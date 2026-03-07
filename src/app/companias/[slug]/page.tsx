"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { providers } from "../providersData";
import { useTariffs } from "@/hooks/useTariffs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
                            <span className="material-icons text-sm">west</span>
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
                                        <span key={i} className="material-icons text-sm">
                                            {i < Math.floor(provider.rating) ? 'star' : 'star_outline'}
                                        </span>
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
                                    <span className="material-icons">thumb_up</span>
                                </div>
                                <h3 className="text-2xl font-800 text-slate-900 dark:text-white">Lo mejor</h3>
                            </div>
                            <ul className="space-y-4">
                                {provider.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <span className="material-icons text-emerald-500 mt-1">check</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons */}
                        <div className="premium-card p-10 border-rose-100 dark:border-rose-500/20 bg-rose-50/30 dark:bg-rose-500/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                                    <span className="material-icons">thumb_down</span>
                                </div>
                                <h3 className="text-2xl font-800 text-slate-900 dark:text-white">A mejorar</h3>
                            </div>
                            <ul className="space-y-4">
                                {provider.cons.map((con, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className="material-icons text-rose-500 mt-1">remove</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Active Tariffs Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-800 text-slate-900 dark:text-white">Tarifas Destacadas</h2>
                            <div className="h-0.5 flex-grow mx-8 bg-slate-100 dark:bg-slate-800"></div>
                        </div>

                        <div className="grid gap-6">
                            {companyTariffs.length > 0 ? (
                                companyTariffs.map((tariff, i) => (
                                    <div key={i} className="premium-card p-8 flex flex-col md:flex-row items-center justify-between hover:border-primary/30 transition-all group bg-slate-50 dark:bg-slate-900/40">
                                        <div className="space-y-1 mb-4 md:mb-0">
                                            <p className="text-xs font-bold text-primary uppercase tracking-widest">{tariff.type}</p>
                                            <h4 className="text-xl font-800 text-slate-900 dark:text-white">{tariff.name}</h4>
                                        </div>
                                        <div className="flex gap-8 md:gap-12">
                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">⚡ Energía (€/kWh)</p>
                                                {(tariff.type || "").includes("3 Periodos") ? (
                                                    <div className="flex gap-4">
                                                        <div className="text-center">
                                                            <span className="block text-[8px] font-bold text-slate-400 uppercase">Punta</span>
                                                            <span className="text-lg font-900 text-slate-900 dark:text-white">{(tariff.e1_kwh ?? 0).toFixed(4)}</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="block text-[8px] font-bold text-slate-400 uppercase">Llano</span>
                                                            <span className="text-lg font-900 text-slate-900 dark:text-white">{(tariff.e2_kwh ?? 0).toFixed(4)}</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="block text-[8px] font-bold text-slate-400 uppercase">Valle</span>
                                                            <span className="text-lg font-900 text-slate-900 dark:text-white">{(tariff.e3_kwh ?? 0).toFixed(4)}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xl font-900 text-slate-900 dark:text-white">{(tariff.e1_kwh ?? 0).toFixed(4)} <span className="text-xs font-normal text-slate-400">/kWh</span></p>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">🔌 Potencia (€/kW·día)</p>
                                                {(tariff.type || "").includes("3 Periodos") ? (
                                                    <div className="flex gap-4">
                                                        <div className="text-center">
                                                            <span className="block text-[8px] font-bold text-slate-400 uppercase">Punta</span>
                                                            <span className="text-lg font-900 text-slate-900 dark:text-white">{(tariff.p1_kw_day ?? 0).toFixed(4)}</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="block text-[8px] font-bold text-slate-400 uppercase">Valle</span>
                                                            <span className="text-lg font-900 text-slate-900 dark:text-white">{(tariff.p2_kw_day ?? 0).toFixed(4)}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xl font-900 text-slate-900 dark:text-white">{(tariff.p1_kw_day ?? 0).toFixed(4)} <span className="text-xs font-normal text-slate-400">/kW·día</span></p>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href="/comparador"
                                            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                                        >
                                            Comparar esta tarifa
                                        </Link>
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
                                <span className="material-icons">info</span>
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
