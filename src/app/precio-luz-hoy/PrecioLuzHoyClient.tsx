"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { 
    Zap, AlertCircle, Info, LayoutGrid, Clock as ClockIcon, 
    BarChart3, TrendingDown, TrendingUp, Download, Check,
    WashingMachine, Refrigerator, Car, Microwave, Wind, Thermometer
} from "lucide-react";
import Link from "next/link";
import PriceClock from "./PriceClock";
import { ElectricityPriceData } from "@/lib/electricity-prices";

interface BetterPriceData extends ElectricityPriceData {
    pricesArray: {
        hour: string;
        price: number;
        isCheap: boolean;
        hourNum: number;
    }[];
}

export default function PrecioLuzHoyClient({ data, initialHour }: { data: BetterPriceData; initialHour: number }) {
    const [selectedHour, setSelectedHour] = useState(initialHour);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeItem = useMemo(() => {
        return data.pricesArray.find(p => p.hourNum === selectedHour) || data.pricesArray[0];
    }, [selectedHour, data.pricesArray]);

    const stats = {
        min: data.min,
        avg: data.average,
        max: data.max
    };

    const downloadCSV = () => {
        const headers = ["Hora", "Precio (€/kWh)", "Tramo", "vs Media (%)"];
        const rows = data.pricesArray.map(p => {
            const tramo = p.price < stats.avg ? "Valle" : p.price > (stats.avg * 1.2) ? "Punta" : "Llano";
            const vsMedia = (((p.price - stats.avg) / stats.avg) * 100).toFixed(2);
            return [`${String(p.hourNum).padStart(2, '0')}:00`, p.price.toFixed(5), tramo, `${vsMedia}%`];
        });

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `precio-luz-hoy-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getApplianceRecommendations = () => {
        const appliances = [
            { id: 'wash', name: 'Lavadora', consumption: 1, icon: <TrendingDown size={16} /> },
            { id: 'dish', name: 'Lavavajillas', consumption: 1.2, icon: <LayoutGrid size={16} /> },
            { id: 'car', name: 'Coche eléctrico', consumption: 7, icon: <Car size={16} /> },
            { id: 'oven', name: 'Horno', consumption: 1.5, icon: <Microwave size={16} /> },
            { id: 'ac', name: 'Aire acondicionado', consumption: 1.2, icon: <Wind size={16} /> },
            { id: 'water', name: 'Acumulador de agua', consumption: 2, icon: <Thermometer size={16} /> },
        ];

        // Find 3 best hours (consecutive or not? Better 3 best discrete hours or window)
        // User said "3 mejores horas", let's pick the 3 lowest individual hours
        const sortedHours = [...data.pricesArray].sort((a, b) => a.price - b.price);
        const best3 = sortedHours.slice(0, 3).map(h => h.hourNum).sort((a, b) => a - b);

        return appliances.map(app => {
            const avgPrice = (data.pricesArray.find(p => p.hourNum === best3[0])?.price || 0);
            const estCost = avgPrice * app.consumption;
            
            const hoursList = best3.map(h => `${String(h).padStart(2, '0')}:00`).join(", ");

            return {
                ...app,
                bestHour: hoursList,
                estCost: estCost.toFixed(2)
            };
        });
    };

    const appliances = useMemo(() => getApplianceRecommendations(), [data.pricesArray]);

    const getBadgeStyle = (price: number) => {
        const ratio = price / data.average;
        if (ratio < 0.8) return { label: "BAJO", classes: "bg-[#f0fdf4] text-[#064e3b]" };
        if (ratio > 1.2) return { label: "ALTO", classes: "bg-[#fef2f2] text-[#991b1b]" };
        return { label: "MEDIO", classes: "bg-[#fefce8] text-[#854f0b]" };
    };

    const currentBadge = getBadgeStyle(data.current);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. Header & Quick Context */}
                <div className="text-center max-w-4xl mx-auto mb-12 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        <span>⚡</span> Mercado Regulado (PVPC)
                    </div>
                    <h1 className="text-4xl md:text-7xl font-900 text-text-primary leading-[1.1] tracking-tight">
                        Analizador de <span className="text-primary italic">Precio Hoy</span>
                    </h1>
                    
                    {/* Block 0: Quick metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        <div className="bg-white dark:bg-surface border border-border/50 rounded-[1.25rem] p-4 flex flex-col items-start shadow-sm">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Precio ahora</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-900 text-slate-900 dark:text-white">{data.current.toFixed(3)}</span>
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-tighter ${currentBadge.classes}`}>
                                    {currentBadge.label}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface border border-border/50 rounded-[1.25rem] p-4 flex flex-col items-start shadow-sm">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Mínimo hoy</span>
                            <span className="text-xl font-900 text-slate-900 dark:text-white">{data.min.toFixed(3)}</span>
                        </div>
                        <div className="bg-white dark:bg-surface border border-border/50 rounded-[1.25rem] p-4 flex flex-col items-start shadow-sm">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Máximo hoy</span>
                            <span className="text-xl font-900 text-slate-900 dark:text-white">{data.max.toFixed(3)}</span>
                        </div>
                        <div className="bg-white dark:bg-surface border border-border/50 rounded-[1.25rem] p-4 flex flex-col items-start shadow-sm">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Media jornada</span>
                            <span className="text-xl font-900 text-slate-900 dark:text-white">{data.average.toFixed(3)}</span>
                        </div>
                    </div>

                {/* SEO Paragraph */}
                <p className="text-base text-text-secondary leading-relaxed max-w-3xl mx-auto pt-8">
                    Mantente informado sobre el <strong>precio de la luz hoy en España</strong> en tiempo real con nuestra avanzada herramienta de análisis. 
                    Este monitor dinámico utiliza los datos oficiales publicados por OMIE para ofrecerte el <strong>precio kWh hoy en España</strong> bajo la 
                    modalidad de la tarifa regulada (<strong>PVPC hoy</strong>), fundamental para cualquier hogar que busque optimizar su consumo. 
                    Nuestra consola te ayuda a identificar rápidamente las <strong>horas baratas luz hoy</strong> para que puedas programar tus 
                    electrodomésticos más pesados, como lavadoras o sistemas de climatización, en los tramos más económicos del pool eléctrico. 
                    Anticipa las variaciones del mercado mayorista, evita los picos de demanda máxima y consigue un ahorro real y tangible en tu 
                    factura eléctrica mensual siguiendo las tendencias de la jornada actual.
                </p>
                </div>

                {/* 2. Interactive Clock */}
                <div className="mb-24">
                    <PriceClock 
                        pricesArray={data.pricesArray} 
                        currentHour={initialHour} 
                        selectedHour={selectedHour}
                        onHourChange={setSelectedHour}
                        stats={stats}
                    />
                </div>

                {/* 3. 24h Table Section */}
                <div className="mb-24 mt-32">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                        <h2 className="text-3xl font-900 text-text-primary tracking-tight">Precios hora a hora — hoy</h2>
                        <button 
                            onClick={downloadCSV}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-surface border border-border rounded-xl text-xs font-black uppercase text-text-primary hover:bg-slate-100 transition-all shadow-sm"
                        >
                            <Download size={16} /> Descargar CSV
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white dark:bg-surface rounded-3xl border border-border shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-surface-2 border-b border-border">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio €/kWh</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tramo</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">vs Media</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.pricesArray.map((p, i) => {
                                    const hNum = p.hourNum;
                                    const isCurrent = initialHour === hNum;
                                    const isSelected = selectedHour === hNum;
                                    const diff = ((p.price - stats.avg) / stats.avg) * 100;
                                    
                                    let priceColor = "text-slate-900 dark:text-white";
                                    let actionText = "Espera si puedes";
                                    if (diff < -15) {
                                        priceColor = "text-[#059669]";
                                        actionText = "Ideal lavadora";
                                    } else if (diff > 15) {
                                        priceColor = "text-[#dc2626]";
                                        actionText = "Evitar consumo";
                                    } else if (diff < 0) {
                                        priceColor = "text-[#d97706]";
                                    }

                                    const tramoType = p.price < stats.avg ? "Valle" : p.price > (stats.avg * 1.2) ? "Punta" : "Llano";
                                    const tramoBadge = tramoType === "Valle" ? "bg-emerald-500/10 text-emerald-600" : tramoType === "Punta" ? "bg-rose-500/10 text-rose-600" : "bg-warning/10 text-amber-600";

                                    return (
                                        <tr 
                                            key={i} 
                                            onClick={() => setSelectedHour(hNum)}
                                            className={`group cursor-pointer border-b border-border transition-all hover:bg-slate-50 dark:hover:bg-white/5 
                                                ${isCurrent ? 'bg-[#eff6ff] dark:bg-primary/5 border-l-4 border-l-primary' : ''}
                                                ${isSelected && !isCurrent ? 'bg-slate-100 dark:bg-white/10' : ''}
                                            `}
                                        >
                                            <td className="px-6 py-4 font-bold text-sm text-text-primary">{p.hour}</td>
                                            <td className={`px-6 py-4 font-900 text-sm ${priceColor}`}>{p.price.toFixed(3)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${tramoBadge}`}>
                                                    {tramoType}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-xs font-black hidden md:table-cell ${diff < 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                                            </td>
                                            <td className="px-6 py-4 text-[11px] font-medium text-slate-500 hidden md:table-cell">{actionText}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Appliances Recommendation */}
                <div className="mb-24 mt-32">
                    <h2 className="text-3xl font-900 text-text-primary tracking-tight mb-8">¿Cuándo encender cada electrodoméstico hoy?</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {appliances.map((app, i) => (
                            <div key={i} className="bg-white dark:bg-surface border border-border/50 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-[#eff6ff] text-primary flex items-center justify-center shrink-0">
                                    {app.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-700 text-text-primary">{app.name}</h4>
                                    <p className="text-emerald-600 font-bold text-[13px]">Mejor hora: {app.bestHour}</p>
                                    <p className="text-[11px] text-slate-500">Precio estimado: <span className="font-bold text-slate-900 dark:text-white">{app.estCost}€</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Explanatory Blocks */}
                <div className="grid md:grid-cols-3 gap-8 mt-32">
                    <div className="bg-white dark:bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <AlertCircle size={24} />
                        </div>
                        <h4 className="text-xl font-900 text-text-primary mb-4 tracking-tight">¿Por qué usar el reloj?</h4>
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                            Entender visualmente el ciclo diario del mercado eléctrico te permite anticipar las zonas "Valle" y "Punta" de forma intuitiva. Los precios corresponden al mercado regulado (PVPC), que varía cada hora según la demanda y la generación de renovables. Consultar el PVPC es el primer paso para ahorrar sustancialmente en hogares con discriminación horaria.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning mb-6">
                            <Info size={24} />
                        </div>
                        <h4 className="text-xl font-900 text-text-primary mb-4 tracking-tight">Efecto del Pool</h4>
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                            El mercado mayorista (pool) dicta cuánto pagan las comercializadoras por la energía. Si tienes una tarifa de precio fijo, te sirve para monitorizar si lo que pagas está alineado con la realidad del mercado. Si el precio pool es consistentemente más bajo que tu contrato fijo, podrías estar perdiendo dinero y sería el momento ideal para renegociar con tu compañía.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6">
                            <Check size={24} />
                        </div>
                        <h4 className="text-xl font-900 text-text-primary mb-4 tracking-tight">¿Qué es el PVPC?</h4>
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                            El Precio Voluntario para el Pequeño Consumidor (PVPC) es el sistema regulado por el Gobierno para contratos inferiores a 10 kW. Su principal ventaja es que repercute directamente el precio real del mercado sin márgenes comerciales ocultos. Es obligatorio para poder solicitar el Bono Social Eléctrico y suele ser la opción más económica a largo plazo si adaptas tus consumos.
                        </p>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-32 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden border border-white/5 shadow-3xl flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <h3 className="text-3xl md:text-5xl font-900 mb-6 leading-[1.1] tracking-tight">¿Prefieres pagar siempre <span className="text-primary italic">lo mismo?</span></h3>
                    <p className="text-lg opacity-60 mb-10 leading-relaxed font-medium max-w-2xl">Analizamos todas las ofertas de precio fijo del mercado para que te olvides de mirar el reloj y pagues lo mínimo garantizado todos los meses.</p>
                    <Link href="/comparador" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-900 font-900 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/40">
                        ENCUENTRA TU TARIFA FIJA
                        <TrendingDown className="w-6 h-6 text-primary" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
