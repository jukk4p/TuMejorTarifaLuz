"use client";

import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getLogoPath, calculateTariffCost, CalculationInput, Tariff } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Archive, Search, Lock, CheckCircle2, ExternalLink, Rocket, Info, ChevronDown, Check, Sun, SunDim, Scale, X, Building2 } from "lucide-react";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

const COMPANIES = [
    { label: "Todas las compañías", value: "all" },
    { label: "Niba", value: "Niba" },
    { label: "Octopus", value: "Octopus" },
    { label: "Imagina", value: "Imagina" },
    { label: "Visalia", value: "Visalia" },
    { label: "Repsol", value: "Repsol" },
    { label: "Energía Nufri", value: "Energía Nufri" },
    { label: "Iberdrola", value: "Iberdrola" },
    { label: "Endesa", value: "Endesa" },
    { label: "Naturgy", value: "Naturgy" },
    { label: "Energya VM", value: "Energya VM" },
    { label: "TotalEnergies", value: "Total Energies" },
    { label: "Neolux Energy", value: "Neolux Energy" },
    { label: "Esluz", value: "Esluz" },
    { label: "COR", value: "Comercializadoras de Referencia" },
];

const COMPANY_SLUGS: Record<string, string> = {
    "Niba": "niba",
    "Octopus": "octopus-energy",
    "Imagina": "imagina-energia",
    "Visalia": "visalia",
    "Repsol": "repsol",
    "Energía Nufri": "energia-nufri",
    "Iberdrola": "iberdrola",
    "Endesa": "endesa",
    "Naturgy": "naturgy",
    "Energya VM": "energia-vm",
    "Total Energies": "total-energies",
    "Neolux Energy": "neolux-energy",
    "Esluz": "esluz",
    "Comercializadoras de Referencia": "comercializadoras-referencia"
};

export default function TarifasClient() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [surplusFilter, setSurplusFilter] = useState<'all' | 'with' | 'without'>('all');
    const [selectedCompany, setSelectedCompany] = useState("all");
    const [sortBy, setSortBy] = useState("price-asc");
    const [showWithTaxes, setShowWithTaxes] = useState(false);
    const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);

    const applyTaxes = (price: number, priceWithTaxes?: number) => {
        if (!showWithTaxes) return price;
        if (priceWithTaxes && priceWithTaxes > 0) return priceWithTaxes;
        return price * 1.0511 * 1.21;
    };

    const formatPrice = (price: number) => {
        return price.toFixed(3);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const { tariffs } = useTariffs();

    const estimationInput: CalculationInput = {
        days: 30,
        power_p1: 3.45,
        power_p2: 3.45,
        energy_p1: 50, // default if not 1 period
        energy_p2: 75,
        energy_p3: 125,
    };

    const calculateMonthlyEstimation = (tariff: Tariff) => {
        const input = tariff.type.includes('1 Periodo') 
            ? { ...estimationInput, energy_p1: 250, energy_p2: 0, energy_p3: 0 }
            : estimationInput;
        const result = calculateTariffCost(tariff, input);
        return showWithTaxes ? result.total : result.subtotal;
    };

    const sortedAndFilteredTariffs = useMemo(() => {
        let result = tariffs.filter(tariff => {
            const matchesSearch = (tariff.company?.toLowerCase() || "").includes(search.toLowerCase()) ||
                (tariff.name?.toLowerCase() || "").includes(search.toLowerCase());
            const tariffType = tariff.type || "";
            const matchesType = filterType === "all" ||
                (filterType === "fixed" && tariffType.includes("1 Periodo")) ||
                (filterType === "three" && tariffType.includes("3 Periodos"));
            const matchesCompany = selectedCompany === "all" || tariff.company === selectedCompany;
            
            const hasSurplus = (tariff.surplus_kwh ?? 0) > 0;
            const matchesSurplus = surplusFilter === "all" || 
                (surplusFilter === "with" && hasSurplus) || 
                (surplusFilter === "without" && !hasSurplus);
            
            return matchesSearch && matchesType && matchesCompany && matchesSurplus;
        });

        // Sort by estimation (Total Monthly Cost)
        if (sortBy === "price-asc") {
            result.sort((a, b) => calculateMonthlyEstimation(a) - calculateMonthlyEstimation(b));
        } else if (sortBy === "price-desc") {
            result.sort((a, b) => calculateMonthlyEstimation(b) - calculateMonthlyEstimation(a));
        } else if (sortBy === "company") {
            result.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
        }

        return result;
    }, [tariffs, search, filterType, surplusFilter, selectedCompany, sortBy, showWithTaxes]);

    const absoluteCheapestId = useMemo(() => {
        if (tariffs.length === 0) return null;
        const sorted = [...tariffs].sort((a, b) => calculateMonthlyEstimation(a) - calculateMonthlyEstimation(b));
        return sorted[0]?.id;
    }, [tariffs, showWithTaxes]);

    const toggleCompare = (id: string) => {
        setSelectedCompareIds(prev => {
            if (prev.includes(id)) return prev.filter(i => i !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    };

    const selectedCompareTariffs = useMemo(() => {
        return tariffs.filter(t => selectedCompareIds.includes(t.id || ''));
    }, [tariffs, selectedCompareIds]);

    return (
        <>
            <Navbar />
            <JsonLd data={getBreadcrumbSchema([
                { name: "Inicio", item: "/" },
                { name: "Tarifas", item: "/tarifas" }
            ])} />
            <main className="min-h-screen bg-background pt-32 pb-24 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header Section */}
                    <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                            <Archive className="w-3.5 h-3.5" />
                            Catálogo Completo 2026
                        </div>
                        <h1 className="text-4xl md:text-7xl font-900 text-text-primary leading-[1.05] tracking-tight">
                            Todas las <span className="text-primary italic">Tarifas</span> de Luz
                        </h1>
                        <p className="text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
                            Compara las <strong>mejores tarifas eléctricas en España</strong> para 2026. Nuestro catálogo incluye precios actualizados de 
                            Iberdrola, Endesa, Octopus y 11 compañías más, permitiéndote <strong>comparar precios de luz</strong> de forma transparente. 
                            Ya busques una tarifa fija o con discriminación horaria, aquí encontrarás la opción más económica para tu hogar.
                        </p>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-surface p-6 rounded-[2rem] border border-border mb-12 shadow-sm space-y-6 max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-grow w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por compañía o nombre de tarifa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-surface-2 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex flex-wrap md:flex-nowrap gap-4 w-full lg:w-auto">
                                <select 
                                    value={selectedCompany} 
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                    className="bg-surface-2 border border-border rounded-xl px-4 py-4 text-xs font-black uppercase tracking-widest text-text-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer w-full md:w-56"
                                >
                                    {COMPANIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-surface-2 border border-border rounded-xl px-4 py-4 text-xs font-black uppercase tracking-widest text-text-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer w-full md:w-56"
                                >
                                    <option value="price-asc">Estimación ↑</option>
                                    <option value="price-desc">Estimación ↓</option>
                                    <option value="company">Compañía A-Z</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-border/50">
                            <div className="flex gap-2 p-1 bg-surface-2 rounded-2xl border border-border w-full sm:w-auto">
                                <button
                                    onClick={() => setFilterType("all")}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${filterType === 'all' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:bg-surface'}`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setFilterType("fixed")}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${filterType === 'fixed' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:bg-surface'}`}
                                >
                                    Precio Fijo
                                </button>
                                <button
                                    onClick={() => setFilterType("three")}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${filterType === 'three' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:bg-surface'}`}
                                >
                                    3 Periodos
                                </button>
                            </div>

                            <div className="flex gap-2 p-1 bg-surface-2 rounded-2xl border border-border w-full sm:w-auto">
                                <button
                                    onClick={() => setSurplusFilter("all")}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${surplusFilter === 'all' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:bg-surface'}`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setSurplusFilter("with")}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all flex items-center justify-center gap-1.5 ${surplusFilter === 'with' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-emerald-500/50 hover:text-emerald-600'}`}
                                >
                                    <Sun size={12} />
                                    Con
                                </button>
                                <button
                                    onClick={() => setSurplusFilter("without")}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all flex items-center justify-center gap-1.5 ${surplusFilter === 'without' ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/25' : 'text-slate-500/50 hover:text-slate-600'}`}
                                >
                                    <SunDim size={12} />
                                    Sin
                                </button>
                            </div>

                            <div className="flex items-center gap-4 bg-surface-2 border border-border rounded-2xl py-2 px-5">
                                <div className="flex items-center gap-2 group relative">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest cursor-default select-none">
                                        {showWithTaxes ? 'Con impuestos' : 'Sin impuestos'}
                                    </span>
                                    <Info size={14} className="text-slate-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-[#0f172a] text-white text-[10px] p-3 rounded-lg shadow-2xl z-20 leading-relaxed text-center pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#0f172a]">
                                        Sin impuestos: se muestra el precio base sin IVA (21%) ni Impuesto Eléctrico (5.11%)
                                    </div>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={showWithTaxes}
                                    onClick={() => setShowWithTaxes(!showWithTaxes)}
                                    className={`${showWithTaxes ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                                >
                                    <span className={`${showWithTaxes ? 'translate-x-5' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tariffs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedAndFilteredTariffs.map((tariff) => {
                            const isCheapest = tariff.id === absoluteCheapestId;
                            const monthlyEstimation = calculateMonthlyEstimation(tariff);

                            return (
                                <div key={tariff.id} className="group bg-surface rounded-[2.5rem] p-8 border border-border hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative flex flex-col min-h-[560px] md:min-h-[580px] h-full overflow-hidden">
                                    {isCheapest && (
                                        <div className="absolute top-4 left-4 bg-[#0f69c5] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg z-10 shadow-lg uppercase tracking-wider">
                                            Mejor precio
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => toggleCompare(tariff.id || '')}
                                        className={`hidden md:flex absolute top-4 right-4 z-10 p-2 rounded-xl transition-all border ${
                                            selectedCompareIds.includes(tariff.id || '') 
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                            : 'bg-surface/80 backdrop-blur-sm text-slate-400 border-border hover:border-primary/40 hover:text-primary'
                                        }`}
                                        title={selectedCompareIds.includes(tariff.id || '') ? "Quitar de la comparativa" : "Añadir a la comparativa"}
                                    >
                                        <Scale size={18} className={selectedCompareIds.includes(tariff.id || '') ? "animate-pulse" : ""} />
                                    </button>

                                    <div className="flex flex-col grow pt-4">
                                        <div className="space-y-1 mb-6 min-h-[72px] flex flex-col justify-center">
                                            <h3 className="text-xl font-900 text-text-primary leading-tight group-hover:text-primary transition-colors line-clamp-3">{tariff.name}</h3>
                                            <Link 
                                                href={`/companias/${COMPANY_SLUGS[tariff.company] || tariff.company.toLowerCase().replace(/\s+/g, '-')}`} 
                                                className="inline-block text-[11px] text-[#0f69c5] font-black uppercase tracking-widest hover:underline"
                                            >
                                                {tariff.company}
                                            </Link>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Energía */}
                                            <div className="space-y-3">
                                                <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                    ⚡ Energía
                                                </p>
                                                <div className="grid grid-cols-1 gap-2 min-h-[86px]">
                                                    {tariff.type.includes('1 Periodo') ? (
                                                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex justify-between items-center group/price transition-all hover:bg-primary/10">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Precio Único</span>
                                                                <span className="text-[9px] text-text-muted font-bold">24h</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="font-900 text-primary text-lg leading-none">{formatPrice(applyTaxes(tariff.e1_kwh ?? 0, tariff.e1_kwh_with_taxes))}</span>
                                                                <span className="text-[10px] font-bold text-primary/60 ml-1">€/kWh</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="bg-orange-500/5 dark:bg-orange-500/10 p-2.5 rounded-xl border border-orange-500/20 text-center flex flex-col justify-center transition-all hover:bg-orange-500/15">
                                                                <span className="block text-[8px] font-black text-orange-700 dark:text-orange-400 uppercase mb-0.5 tracking-tighter">Punta</span>
                                                                <span className="font-900 text-orange-800 dark:text-orange-200 text-[13px] block">{formatPrice(applyTaxes(tariff.e1_kwh ?? 0, tariff.e1_kwh_with_taxes))}</span>
                                                            </div>
                                                            <div className="bg-blue-500/5 dark:bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-center flex flex-col justify-center transition-all hover:bg-blue-500/15">
                                                                <span className="block text-[8px] font-black text-blue-700 dark:text-blue-400 uppercase mb-0.5 tracking-tighter">Llano</span>
                                                                <span className="font-900 text-blue-800 dark:text-blue-200 text-[13px] block">{formatPrice(applyTaxes(tariff.e2_kwh || 0, tariff.e2_kwh_with_taxes))}</span>
                                                            </div>
                                                            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-center flex flex-col justify-center transition-all hover:bg-emerald-500/15">
                                                                <span className="block text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-0.5 tracking-tighter">Valle</span>
                                                                <span className="font-900 text-emerald-800 dark:text-emerald-200 text-[13px] block">{formatPrice(applyTaxes(tariff.e3_kwh || 0, tariff.e3_kwh_with_taxes))}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Potencia */}
                                            <div className="space-y-3">
                                                <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                    🔌 Potencia
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 min-h-[66px]">
                                                    <div className="bg-surface-2 p-3 rounded-xl border border-border text-center flex flex-col justify-center transition-all hover:border-primary/20">
                                                        <span className="block text-[9px] font-black text-text-primary uppercase mb-0.5 tracking-widest">Punta (P1)</span>
                                                        <span className="font-900 text-text-primary text-[12px]">{formatPrice(applyTaxes(tariff.p1_kw_day ?? 0, tariff.p1_kw_day_with_taxes))}</span>
                                                    </div>
                                                    <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center flex flex-col justify-center transition-all hover:bg-emerald-500/10">
                                                        <span className="block text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-0.5 tracking-widest">Valle (P2)</span>
                                                        <span className="font-900 text-emerald-800 dark:text-emerald-200 text-[12px]">{formatPrice(applyTaxes(tariff.p2_kw_day || tariff.p1_kw_day || 0, tariff.p2_kw_day_with_taxes))}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Excedentes */}
                                            <div className="space-y-3">
                                                <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    <Sun className="w-3 h-3 text-emerald-500" />
                                                    Excedentes
                                                </p>
                                                <div className="min-h-[66px]">
                                                    {tariff.surplus_kwh && tariff.surplus_kwh > 0 ? (
                                                        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 h-full p-4 rounded-xl border border-emerald-500/20 flex justify-between items-center transition-all hover:bg-emerald-500/10 shadow-sm relative group/surplus">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">Compensación</span>
                                                                <span className="text-[9px] text-text-muted font-bold mt-1 uppercase">Solar</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="font-900 text-emerald-600 dark:text-emerald-400 text-xl leading-none">{tariff.surplus_kwh.toFixed(2)}</span>
                                                                <span className="text-[10px] font-bold text-emerald-600/60 ml-1 uppercase">€/kWh</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full p-4 rounded-xl border border-dashed border-border flex justify-between items-center bg-slate-50/10 opacity-40">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Sin Excedentes</span>
                                                            <span className="text-xl font-900 text-slate-300">-</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Section - Aligned to bottom */}
                                    <div className="mt-8 pt-6 border-t border-border border-dashed space-y-4">
                                        <div 
                                            className="flex items-center justify-between group/est cursor-help"
                                            title={`Estimación basada en 250 kWh/mes y 3.45 kW contratados, ${showWithTaxes ? 'con IVA e Impuesto Eléctrico incluidos' : 'sin IVA ni Impuestos Eléctricos'}`}
                                        >
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimación</span>
                                            <span className="text-lg font-900 text-[#0f69c5]">
                                                ≈ {monthlyEstimation.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€/mes
                                            </span>
                                        </div>

                                        <Link 
                                            href={tariff.url} 
                                            target="_blank" 
                                            className="bg-primary text-white py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-widest"
                                        >
                                            CONTRATAR AHORA
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-32 p-8 md:p-16 bg-primary/5 dark:bg-primary/10 rounded-[3rem] border border-primary/20 text-center relative overflow-hidden shadow-sm">
                        <div className="max-w-3xl mx-auto space-y-10 relative z-10">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-5xl font-900 text-text-primary leading-[1.1] tracking-tight">
                                    ¿No sabes cuál elegir? <br />
                                    <span className="text-primary italic">Deja que nuestra IA decida.</span>
                                </h2>
                                <p className="text-lg text-text-secondary font-medium leading-relaxed">
                                    Sube tu factura y nuestro algoritmo cruza tu consumo real con las 24 tarifas del catálogo 
                                    para encontrar tu ahorro garantizado.
                                </p>
                            </div>
                            
                            <div className="grid sm:grid-cols-3 gap-4 md:gap-6 text-left">
                                <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                    <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">Análisis en &lt;30 seg.</span>
                                </div>
                                <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                    <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">Resultado preciso</span>
                                </div>
                                <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                    <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">Sin registro</span>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col items-center gap-4">
                                <Link 
                                    href="/comparador" 
                                    className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-white font-900 text-lg rounded-[2rem] hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-primary/40 transition-all shadow-xl shadow-primary/20"
                                >
                                    EJECUTAR ANALIZADOR
                                    <Rocket className="w-7 h-7" />
                                </Link>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Gratis para siempre • Proyecto independiente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Compare Bar - HIDDEN ON MOBILE */}
            {selectedCompareIds.length > 0 && (
                <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4 grow">
                            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20 text-primary shrink-0 border border-primary/20">
                                <Scale size={24} />
                            </div>
                            <div className="flex -space-x-4 overflow-hidden">
                                {selectedCompareTariffs.map(t => (
                                    <div key={t.id} className="w-10 h-10 rounded-full bg-white border-2 border-[#0f172a] flex items-center justify-center p-1.5 shadow-xl relative group">
                                        {getLogoPath(t.company || '') ? (
                                            <img src={getLogoPath(t.company || '')!} alt={t.company} className="w-full h-full object-contain" />
                                        ) : (
                                            <Building2 size={16} className="text-slate-400" />
                                        )}
                                        <button 
                                            onClick={() => toggleCompare(t.id || '')}
                                            className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={10} strokeWidth={4} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-xs uppercase tracking-widest">{selectedCompareIds.length} {selectedCompareIds.length === 1 ? 'Tarifa seleccionada' : 'Tarifas seleccionadas'}</span>
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter hidden sm:block">Compara condiciones cara a cara</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setSelectedCompareIds([])}
                                className="text-slate-400 hover:text-white transition-colors p-2"
                            >
                                <X size={20} />
                            </button>
                            <button 
                                onClick={() => setIsComparisonOpen(true)}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                            >
                                COMPARAR AHORA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Modal */}
            {isComparisonOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-[#020617]/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-surface w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl border border-border overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-8 border-b border-border flex items-center justify-between bg-surface-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                    <Scale size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-900 text-text-primary tracking-tight">Comparativa Side-by-Side</h2>
                                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Análisis detallado de {selectedCompareIds.length} tarifas</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsComparisonOpen(false)}
                                className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-text-primary flex items-center justify-center transition-all hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-auto grow custom-scrollbar bg-slate-50/30 dark:bg-slate-900/10">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-30">
                                    <tr className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border shadow-sm">
                                        {selectedCompareTariffs.map((t, idx) => {
                                            const monthlyCost = calculateMonthlyEstimation(t);
                                            const allCosts = selectedCompareTariffs.map(st => calculateMonthlyEstimation(st));
                                            const isCheapestOverall = monthlyCost === Math.min(...allCosts);

                                            return (
                                                <th key={t.id} className={`p-8 text-center border-r border-border last:border-r-0 min-w-[240px] transition-colors relative ${isCheapestOverall ? 'bg-primary/[0.02] dark:bg-primary/[0.05]' : 'bg-white dark:bg-slate-900'}`}>
                                                    {isCheapestOverall && (
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-[#0f172a] text-[8px] font-black uppercase tracking-widest rounded-b-lg shadow-lg">
                                                            Tarifa Recomendada
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-20 h-10 relative flex items-center justify-center bg-white rounded-lg p-1.5 shadow-sm border border-border/50">
                                                            {getLogoPath(t.company || '') ? (
                                                                <img src={getLogoPath(t.company || '')!} alt={t.company} className="max-h-full max-w-full object-contain" />
                                                            ) : (
                                                                <div className="text-primary font-black uppercase text-xs text-center leading-tight">
                                                                    {t.company}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-900 text-text-primary leading-[1.2] text-center max-w-[180px] mx-auto tracking-tight uppercase">{t.name}</h4>
                                                            <span className="text-[8px] font-black uppercase text-primary tracking-widest block opacity-60">
                                                                {t.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-slate-100/30 dark:bg-slate-800/30">
                                        <td colSpan={selectedCompareTariffs.length} className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center border-b border-border">
                                            Coste Mensual
                                        </td>
                                    </tr>
                                    <tr className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-border">
                                        {selectedCompareTariffs.map(t => {
                                            const cost = calculateMonthlyEstimation(t);
                                            const allCosts = selectedCompareTariffs.map(st => calculateMonthlyEstimation(st));
                                            const isCheapest = cost === Math.min(...allCosts);
                                            return (
                                                <td key={t.id} className={`p-6 border-r last:border-r-0 text-center transition-all ${isCheapest ? 'bg-emerald-50/20 dark:bg-emerald-500/10' : ''}`}>
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-3xl font-900 tracking-tighter ${isCheapest ? 'text-emerald-500 dark:text-emerald-400' : 'text-primary'}`}>
                                                            {cost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}<small className="text-base ml-0.5">€</small>
                                                        </span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    <tr className="bg-slate-100/30 dark:bg-slate-800/30">
                                        <td colSpan={selectedCompareTariffs.length} className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center border-b border-border">
                                            Potencias (P1 / P2)
                                        </td>
                                    </tr>
                                    <tr className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-border">
                                        {selectedCompareTariffs.map(t => (
                                            <td key={t.id} className="p-6 border-r last:border-r-0 text-center">
                                                <div className="flex flex-col gap-1.5 max-w-[140px] mx-auto">
                                                    <div className="bg-slate-100/50 dark:bg-slate-800/50 py-1.5 rounded-lg border border-border/50">
                                                        <span className="text-sm font-900 text-text-primary">{formatPrice(applyTaxes(t.p1_kw_day ?? 0, t.p1_kw_day_with_taxes))}</span>
                                                    </div>
                                                    <div className="bg-emerald-100/30 dark:bg-emerald-900/10 py-1.5 rounded-lg border border-emerald-500/10">
                                                        <span className="text-sm font-900 text-text-primary">{formatPrice(applyTaxes(t.p2_kw_day || t.p1_kw_day || 0, t.p2_kw_day_with_taxes))}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    <tr className="bg-slate-100/30 dark:bg-slate-800/30">
                                        <td colSpan={selectedCompareTariffs.length} className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center border-b border-border">
                                            Energía (E1 / E2 / E3)
                                        </td>
                                    </tr>
                                    <tr className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-border">
                                        {selectedCompareTariffs.map(t => {
                                            const isFixed = t.type.includes('1 Periodo');
                                            return (
                                                <td key={t.id} className="p-6 border-r last:border-r-0 text-center">
                                                    {isFixed ? (
                                                        <div className="bg-primary/5 py-2 px-4 rounded-xl border border-primary/20">
                                                            <span className="text-lg font-900 text-primary">{formatPrice(applyTaxes(t.e1_kwh ?? 0, t.e1_kwh_with_taxes))}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-1 max-w-[140px] mx-auto">
                                                            <div className="bg-orange-500/5 py-1 rounded-lg border border-orange-500/10">
                                                                <span className="text-sm font-900 text-text-primary">{formatPrice(applyTaxes(t.e1_kwh ?? 0, t.e1_kwh_with_taxes))}</span>
                                                            </div>
                                                            <div className="bg-blue-500/5 py-1 rounded-lg border border-blue-500/10">
                                                                <span className="text-sm font-900 text-text-primary">{formatPrice(applyTaxes(t.e2_kwh || 0, t.e2_kwh_with_taxes))}</span>
                                                            </div>
                                                            <div className="bg-emerald-500/5 py-1 rounded-lg border border-emerald-500/10">
                                                                <span className="text-sm font-900 text-text-primary">{formatPrice(applyTaxes(t.e3_kwh || 0, t.e3_kwh_with_taxes))}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    <tr className="bg-slate-100/30 dark:bg-slate-800/30">
                                        <td colSpan={selectedCompareTariffs.length} className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center border-b border-border">
                                            Solar & Permanencia
                                        </td>
                                    </tr>
                                    <tr className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        {selectedCompareTariffs.map(t => (
                                            <td key={t.id} className="p-6 border-r last:border-r-0 text-center">
                                                <div className="flex flex-col gap-3 items-center">
                                                    {t.surplus_kwh ? (
                                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 bg-emerald-500/5 rounded-lg">
                                                            {t.surplus_kwh.toFixed(2)} € Solar
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-300">Sin Solar</span>
                                                    )}
                                                    
                                                    {!t.permanence ? (
                                                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest border border-indigo-500/20 px-3 py-1 bg-indigo-500/5 rounded-lg">
                                                            Sin Permanencia
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-500/10 px-3 py-1 bg-slate-500/5 rounded-lg">
                                                            Permanencia
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-surface-2 gap-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest max-w-sm text-center sm:text-left">
                                Los precios mostrados incluyen {showWithTaxes ? 'todos los impuestos vigentes' : 'la base imponible sin impuestos'}.
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setSelectedCompareIds([])}
                                    className="px-8 py-4 border border-border text-text-primary rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Limpiar Todo
                                </button>
                                <button 
                                    onClick={() => setIsComparisonOpen(false)}
                                    className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Volver al catálogo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
