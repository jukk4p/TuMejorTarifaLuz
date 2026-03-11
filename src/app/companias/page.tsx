"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Star, CheckCircle, ArrowRight, BadgeCheck, Radar, Shield } from "lucide-react";
import { providers } from "./providersData";
import { useEffect, useState } from "react";

export default function CompaniasHub() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            Análisis Imparcial
                        </div>
                        <h1 className="text-4xl md:text-6xl font-800 text-slate-900 dark:text-white leading-tight">
                            Mejores <span className="text-primary">Comercializadoras</span> Eléctricas 2026
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Analizamos a fondo cada compañía para que elijas basándote en datos reales, atención al cliente y transparencia.
                        </p>
                    </div>

                    {/* Providers Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {providers.map((provider) => (
                            <Link
                                key={provider.id}
                                href={`/companias/${provider.slug}`}
                                className="group premium-card p-10 flex flex-col hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900"
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
                                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                                            <Star className="w-5 h-5 fill-current" />
                                            <span className="font-bold text-lg">{provider.rating}</span>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Puntuación</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-800 text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                                    {provider.name}
                                </h3>

                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                                    {provider.description.substring(0, 120)}...
                                </p>

                                <div className="space-y-3 mb-8">
                                    {provider.pros.slice(0, 2).map((pro, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            {pro}
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between mt-auto">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                        Ver análisis completo
                                        <ArrowRight className="w-4 h-4 text-primary" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* FAQ / Trust Content */}
                    <div className="mt-32 p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-800 text-slate-900 dark:text-white mb-6">¿Cómo puntuamos a las compañías?</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                                    Nuestro equipo de expertos revisa mensualmente tres pilares fundamentales:
                                </p>
                                <ul className="mt-8 space-y-4">
                                    {[
                                        { t: "Estabilidad de Precios", d: "Analizamos la letra pequeña y la frecuencia de cambios en tarifas." },
                                        { t: "Calidad de Atención", d: "Medimos tiempos de espera y capacidad resolutiva." },
                                        { t: "Transparencia", d: "Valoramos la claridad en las facturas y la ausencia de costes ocultos." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                                                <BadgeCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{item.t}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.d}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative aspect-square rounded-full bg-primary/5 flex items-center justify-center">
                                <Radar className="w-48 h-48 text-primary/10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="premium-card p-8 bg-white dark:bg-slate-800 shadow-2xl space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Garantía TuMejorTarifaLuz</p>
                                                <p className="text-xs text-slate-400 italic">Análisis 100% independiente</p>
                                            </div>
                                        </div>
                                    </div>
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
