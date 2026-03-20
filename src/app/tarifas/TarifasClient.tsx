"use client";

import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getLogoPath, calculateTariffCost, CalculationInput, Tariff } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Archive, Search, Lock, CheckCircle2, ExternalLink, Rocket, Info, ChevronDown, Check } from "lucide-react";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

const COMPANIES = [
    { label: "Todas las compañías", value: "all" },
    { label: "Niba", value: "Niba" },
    { label: "Octopus", value: "Octopus" },
    { label: "Imagina", value: "Imagina" },
    { label: "Visalia", value: "Doméstica - Visalia" },
    { label: "Repsol", value: "Repsol" },
    { label: "Energía Nufri", value: "Energía Nufri" },
    { label: "Iberdrola", value: "Iberdrola" },
    { label: "Endesa", value: "Endesa" },
    { label: "Naturgy", value: "Naturgy" },
    { label: "Energya VM", value: "Energya VM" },
    { label: "TotalEnergies", value: "Total Energies" },
    { label: "CHC Energía", value: "CHC Energía" },
    { label: "Esluz", value: "Esluz" },
    { label: "COR", value: "Comercializadoras de Referencia" },
];

const COMPANY_SLUGS: Record<string, string> = {
    "Niba": "niba",
    "Octopus": "octopus-energy",
    "Imagina": "imagina-energia",
    "Doméstica - Visalia": "visalia",
    "Repsol": "repsol",
    "Energía Nufri": "energia-nufri",
    "Iberdrola": "iberdrola",
    "Endesa": "endesa",
    "Naturgy": "naturgy",
    "Energya VM": "energia-vm",
    "Total Energies": "total-energies",
    "CHC Energía": "chc-energia",
    "Esluz": "esluz",
    "Comercializadoras de Referencia": "comercializadoras-referencia"
};

export default function TarifasClient() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [selectedCompany, setSelectedCompany] = useState("all");
    const [sortBy, setSortBy] = useState("price-asc");
    const [showWithTaxes, setShowWithTaxes] = useState(false);

    const applyTaxes = (price: number) => {
        if (!showWithTaxes) return price;
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
            
            return matchesSearch && matchesType && matchesCompany;
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
    }, [tariffs, search, filterType, selectedCompany, sortBy, showWithTaxes]);

    const cheapestPerType = useMemo(() => {
        const fixed = tariffs.filter(t => t.type.includes('1 Periodo')).sort((a, b) => (a.e1_kwh ?? 0) - (b.e1_kwh ?? 0))[0];
        const threePeriod = tariffs.filter(t => t.type.includes('3 Periodos')).sort((a, b) => (a.e3_kwh ?? 0) - (b.e3_kwh ?? 0))[0];
        return { fixedId: fixed?.id, threeId: threePeriod?.id };
    }, [tariffs]);

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
                    <div className="bg-surface p-6 rounded-[2rem] border border-border mb-12 shadow-sm space-y-6">
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
                            const isCheapest = (tariff.type.includes('1 Periodo') && tariff.id === cheapestPerType.fixedId) || 
                                             (tariff.type.includes('3 Periodos') && tariff.id === cheapestPerType.threeId);
                            const monthlyEstimation = calculateMonthlyEstimation(tariff);

                            return (
                                <div key={tariff.id} className="group bg-surface rounded-[2.5rem] p-8 border border-border hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative flex flex-col h-full overflow-hidden">
                                    {isCheapest && (
                                        <div className="absolute top-4 right-4 bg-[#0f69c5] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg z-10 shadow-lg uppercase tracking-wider">
                                            Mejor precio
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-8 relative z-10 pt-2">
                                        <div className="w-28 h-12 flex items-center justify-center shrink-0">
                                            {tariff.logo_url ? (
                                                <Image src={tariff.logo_url} alt={tariff.company} width={96} height={48} className="w-full h-full object-contain" />
                                            ) : getLogoPath(tariff.company, mounted && resolvedTheme === 'dark') ? (
                                                <Image src={getLogoPath(tariff.company, mounted && resolvedTheme === 'dark')!} alt={tariff.company} width={96} height={48} className="w-full h-full object-contain transition-all group-hover:scale-105" />
                                            ) : (
                                                <span className="text-xl font-900 text-text-muted">{(tariff.company || "?").charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 grow">
                                        <div className="space-y-1 min-h-[60px] flex flex-col justify-start">
                                            <h3 className="text-xl font-900 text-text-primary leading-tight group-hover:text-primary transition-colors line-clamp-2">{tariff.name}</h3>
                                            <Link 
                                                href={`/companias/${COMPANY_SLUGS[tariff.company] || tariff.company.toLowerCase().replace(/\s+/g, '-')}`} 
                                                className="inline-block text-[11px] text-[#0f69c5] font-black uppercase tracking-widest hover:underline"
                                            >
                                                {tariff.company}
                                            </Link>
                                        </div>

                                        <div className="pt-6 space-y-6">
                                            {/* Energía */}
                                            <div className="space-y-3">
                                                <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                    ⚡ Energía
                                                </p>
                                                <div className="grid grid-cols-1 gap-2 min-h-[85px]">
                                                    {tariff.type.includes('1 Periodo') ? (
                                                        <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex justify-between items-center h-full group/price transition-all hover:bg-primary/10">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Precio Único</span>
                                                                <span className="text-[10px] text-text-muted font-bold font-mono">Consumo 24h</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="font-900 text-primary text-xl leading-none">{formatPrice(applyTaxes(tariff.e1_kwh ?? 0))}</span>
                                                                <span className="text-[10px] font-bold text-primary/60 ml-1">€/kWh</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2 h-full">
                                                            <div className="bg-orange-500/5 dark:bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20 text-center flex flex-col justify-center shadow-sm">
                                                                <span className="block text-[9px] font-black text-orange-700 dark:text-orange-400 uppercase mb-1 tracking-tighter">Punta</span>
                                                                <span className="font-900 text-orange-800 dark:text-orange-200 text-sm block">{formatPrice(applyTaxes(tariff.e1_kwh ?? 0))}</span>
                                                                <span className="text-[8px] font-bold text-orange-700/60 uppercase">€/kWh</span>
                                                            </div>
                                                            <div className="bg-blue-500/5 dark:bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-center flex flex-col justify-center shadow-sm">
                                                                <span className="block text-[9px] font-black text-blue-700 dark:text-blue-400 uppercase mb-1 tracking-tighter">Llano</span>
                                                                <span className="font-900 text-blue-800 dark:text-blue-200 text-sm block">{formatPrice(applyTaxes(tariff.e2_kwh || 0))}</span>
                                                                <span className="text-[8px] font-bold text-blue-700/60 uppercase">€/kWh</span>
                                                            </div>
                                                            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-center flex flex-col justify-center shadow-sm">
                                                                <span className="block text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-1 tracking-tighter">Valle</span>
                                                                <span className="font-900 text-emerald-800 dark:text-emerald-200 text-sm block">{formatPrice(applyTaxes(tariff.e3_kwh || 0))}</span>
                                                                <span className="text-[8px] font-bold text-emerald-700/60 uppercase">€/kWh</span>
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
                                                <div className="grid grid-cols-2 gap-2 min-h-[70px]">
                                                    <div className="bg-surface-2 p-4 rounded-xl border border-border text-center flex flex-col justify-center transition-all hover:border-primary/20 group/p1">
                                                        <span className="block text-[10px] font-black text-text-primary uppercase mb-1 tracking-widest group-hover/p1:text-primary transition-colors">Punta (P1)</span>
                                                        <div className="flex flex-col">
                                                            <span className="font-900 text-text-primary text-[13px] leading-tight">{formatPrice(applyTaxes(tariff.p1_kw_day ?? 0))}</span>
                                                            <span className="text-[9px] font-bold text-text-secondary uppercase">€/kW día</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center flex flex-col justify-center transition-all hover:bg-emerald-500/10 group/p2 shadow-sm">
                                                        <span className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-1 tracking-widest transition-colors">Valle (P2)</span>
                                                        <div className="flex flex-col">
                                                            <span className="font-900 text-emerald-800 dark:text-emerald-200 text-[13px] leading-tight">{formatPrice(applyTaxes(tariff.p2_kw_day || tariff.p1_kw_day || 0))}</span>
                                                            <span className="text-[9px] font-bold text-emerald-700/60 uppercase">€/kW día</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Estimation */}
                                        <div className="pt-6 mt-2 border-t border-border border-dashed">
                                            <div 
                                                className="flex items-center justify-between group/est cursor-help"
                                                title={`Estimación basada en 250 kWh/mes y 3.45 kW contratados, ${showWithTaxes ? 'con IVA e Impuesto Eléctrico incluidos' : 'sin IVA ni Impuestos Eléctricos'}`}
                                            >
                                                <span className="text-xs font-bold text-slate-500">Estimación:</span>
                                                <span className="text-[15px] font-900 text-[#0f69c5]">
                                                    ≈ {monthlyEstimation.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€/mes
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex flex-col items-stretch">
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
                            )
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
            <Footer />
        </>
    );
}
