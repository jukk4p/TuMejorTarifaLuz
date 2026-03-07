"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function TarifasHub() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    const { tariffs } = useTariffs();

    const filteredTariffs = useMemo(() => {
        return tariffs.filter(tariff => {
            const matchesSearch = (tariff.company?.toLowerCase() || "").includes(search.toLowerCase()) ||
                (tariff.name?.toLowerCase() || "").includes(search.toLowerCase());
            const tariffType = tariff.type || "";
            const matchesType = filterType === "all" ||
                (filterType === "fixed" && tariffType.includes("1 Periodo")) ||
                (filterType === "three" && tariffType.includes("3 Periodos"));
            return matchesSearch && matchesType;
        });
    }, [tariffs, search, filterType]);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-24 overflow-hidden relative">
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-success/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <span className="material-icons text-sm">inventory_2</span>
                            Catálogo Completo 2026
                        </div>
                        <h1 className="text-4xl md:text-6xl font-900 text-slate-900 dark:text-white leading-[1.1]">
                            Todas las <span className="text-primary">Tarifas</span> en un solo lugar
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Explora nuestra base de datos actualizada diariamente con las mejores ofertas del mercado español. Transparencia total, sin trampa ni cartón.
                        </p>
                    </div>

                    {/* Filters & Search */}
                    <div className="premium-card p-6 md:p-8 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 mb-12 flex flex-col lg:flex-row gap-6 items-center">
                        <div className="relative flex-grow w-full lg:max-w-2xl">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Buscar por compañía o nombre de tarifa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 justify-center lg:justify-end lg:flex-nowrap">
                            <button
                                onClick={() => setFilterType("all")}
                                className={`px-6 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap lg:flex-1 text-center ${filterType === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setFilterType("fixed")}
                                className={`px-6 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap lg:flex-1 text-center ${filterType === 'fixed' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                Precio Fijo
                            </button>
                            <button
                                onClick={() => setFilterType("three")}
                                className={`px-6 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap lg:flex-1 text-center ${filterType === 'three' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                3 Periodos
                            </button>
                        </div>
                    </div>

                    {/* Tariffs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTariffs.map((tariff, i) => (
                            <div key={i} className="group premium-card p-4 md:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="w-24 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50">
                                        <div className="w-24 h-12 bg-white dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
                                            {tariff.logo_url ? (
                                                <img src={tariff.logo_url} alt={tariff.company} className="max-h-full max-w-full object-contain" />
                                            ) : getLogoPath(tariff.company, mounted && resolvedTheme === 'dark') ? (
                                                <img src={getLogoPath(tariff.company, mounted && resolvedTheme === 'dark')!} alt={tariff.company} className="max-h-full max-w-full object-contain transition-all" />
                                            ) : (
                                                <span className="text-xl font-900 text-slate-300">{(tariff.company || "?").charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${(tariff.type || "").includes('3 Periodos') ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                                        {tariff.type || "Desconocida"}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8 grow flex flex-col items-center md:items-start text-center md:text-left">
                                    <h3 className="text-2xl font-800 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{tariff.name}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{tariff.company}</p>
                                    <div className="pt-4 space-y-4 w-full">
                                        {/* Energía */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 text-center md:text-left">⚡ Energía</p>
                                            {(tariff.type || "").includes("3 Periodos") ? (
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                                        <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Punta</span>
                                                        <span className="font-800 text-slate-900 dark:text-white text-xs">{(tariff.e1_kwh ?? 0).toFixed(4)}</span>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                                        <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Llano</span>
                                                        <span className="font-800 text-slate-900 dark:text-white text-xs">{(tariff.e2_kwh ?? 0).toFixed(4)}</span>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                                        <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Valle</span>
                                                        <span className="font-800 text-slate-900 dark:text-white text-xs">{(tariff.e3_kwh ?? 0).toFixed(4)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Precio Fijo</span>
                                                    <span className="font-800 text-slate-900 dark:text-white">{(tariff.e1_kwh ?? 0).toFixed(4)} <span className="text-[10px] text-slate-400 font-medium">€/kWh</span></span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Potencia */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 text-center md:text-left">🔌 Potencia</p>
                                            {(tariff.type || "").includes("3 Periodos") ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                                        <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Punta</span>
                                                        <span className="font-800 text-slate-900 dark:text-white text-xs">{(tariff.p1_kw_day ?? 0).toFixed(4)}</span>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                                        <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Valle</span>
                                                        <span className="font-800 text-slate-900 dark:text-white text-xs">{(tariff.p2_kw_day ?? 0).toFixed(4)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Punta</span>
                                                    <span className="font-800 text-slate-900 dark:text-white">{(tariff.p1_kw_day ?? 0).toFixed(4)} <span className="text-[10px] text-slate-400 font-medium">€/kW/día</span></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                                    {tariff.permanence ? (
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                            <span className="material-icons text-sm text-amber-500">lock</span> Permanencia
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest text-center">
                                            <span className="material-icons text-sm">check_circle</span> Sin Permanencia
                                        </span>
                                    )}
                                    <Link href={tariff.url} target="_blank" className="bg-primary text-white p-4 md:p-2 w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 hover:scale-105 md:hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                                        <span className="material-icons text-lg">open_in_new</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <h2 className="text-3xl md:text-5xl font-900 text-white relative z-10 leading-tight">¿No sabes cuál elegir?<br /><span className="text-primary italic">Deja que nuestra IA decida.</span></h2>
                        <Link href="/comparador" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-900 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10">
                            EJECUTAR COMPARADOR INTELIGENTE
                            <span className="material-icons">rocket_launch</span>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
