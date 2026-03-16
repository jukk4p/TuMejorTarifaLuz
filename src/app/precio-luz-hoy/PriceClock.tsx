"use client";

import { useState, useMemo } from "react";
import { Zap, TrendingDown, TrendingUp, Clock, Info, ShieldCheck, ZapOff } from "lucide-react";

interface PriceItem {
    hour: string;
    price: number;
    isCheap: boolean;
}

interface PriceClockProps {
    pricesArray: PriceItem[];
    currentHour: number;
    stats: {
        min: number;
        avg: number;
        max: number;
    }
}

export default function PriceClock({ pricesArray, currentHour, stats }: PriceClockProps) {
    const [selectedHour, setSelectedHour] = useState(currentHour);

    const activeItem = pricesArray.find(p => parseInt(p.hour.split("-")[0]) === selectedHour) || pricesArray[0] || { hour: "00-01", price: 0, isCheap: false };

    // Colores dinámicos basados en el valor relativo
    const getPriceColor = (price: number) => {
        if (price === stats.min) return '#10b981'; // emerald-500
        if (price === stats.max) return '#f43f5e'; // rose-500
        const ratio = (price - stats.min) / (stats.max - stats.min || 1);
        if (ratio < 0.3) return '#10b981';
        if (ratio < 0.7) return '#f59e0b'; // amber-500
        return '#f43f5e';
    };

    const getPriceTailwindColor = (price: number) => {
        if (price === stats.min) return 'text-emerald-500';
        if (price === stats.max) return 'text-rose-500';
        const ratio = (price - stats.min) / (stats.max - stats.min || 1);
        if (ratio < 0.3) return 'text-emerald-500';
        if (ratio < 0.7) return 'text-amber-500';
        return 'text-rose-500';
    };

    // Generar el path del anillo de calor (Heatmap Ring)
    const heatmapSegments = useMemo(() => {
        return pricesArray.map((p, i) => {
            const startAngle = (i * 15) - 90;
            const endAngle = ((i + 1) * 15) - 90;
            const color = getPriceColor(p.price);
            
            // Convertir polares a cartesianas para SVG
            const radius = 155;
            const x1 = 200 + radius * Math.cos(startAngle * Math.PI / 180);
            const y1 = 200 + radius * Math.sin(startAngle * Math.PI / 180);
            const x2 = 200 + radius * Math.cos(endAngle * Math.PI / 180);
            const y2 = 200 + radius * Math.sin(endAngle * Math.PI / 180);
            
            return { x1, y1, x2, y2, color, hour: i };
        });
    }, [pricesArray, stats]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Bloque Izquierdo: La Consola Visual */}
            <div className="premium-card p-4 md:p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden min-h-[500px] md:min-h-[600px]">
                {/* Fondo Decorativo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-50"></div>
                </div>

                <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                        {/* Círculo base con textura */}
                        <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 8" />
                        
                        {/* Anillo de Calor (Heatmap) */}
                        {heatmapSegments.map((s, i) => (
                            <path
                                key={i}
                                d={`M ${s.x1} ${s.y1} A 155 155 0 0 1 ${s.x2} ${s.y2}`}
                                fill="none"
                                stroke={s.color}
                                strokeWidth="8"
                                strokeLinecap="round"
                                className="transition-all duration-300 opacity-80 hover:opacity-100 cursor-pointer"
                                onClick={() => setSelectedHour(s.hour)}
                            />
                        ))}

                        {/* Indicador de hora actual (Punto exterior) */}
                        <circle 
                            cx={200 + 175 * Math.cos(((currentHour * 15) - 90) * Math.PI / 180)} 
                            cy={200 + 175 * Math.sin(((currentHour * 15) - 90) * Math.PI / 180)} 
                            r="6" 
                            fill="#0ea5e9"
                            className="animate-pulse shadow-lg"
                        />
                    </svg>

                    {/* Botones de Horas (Posicionados en círculo) */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(24)].map((_, i) => {
                            const angle = (i * 15) - 90;
                            const isSelected = selectedHour === i;
                            const isCurrent = currentHour === i;
                            
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedHour(i)}
                                    className={`absolute pointer-events-auto w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center transition-all duration-500
                                        ${isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'}
                                    `}
                                    style={{
                                        left: `${50 + 34 * Math.cos(angle * Math.PI / 180)}%`,
                                        top: `${50 + 34 * Math.sin(angle * Math.PI / 180)}%`
                                    }}
                                >
                                    <div className={`w-full h-full rounded-full flex items-center justify-center text-[10px] font-black transition-all border-2
                                        ${isSelected 
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-primary shadow-[0_0_20px_rgba(14,165,233,0.3)]' 
                                            : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-800'
                                        }
                                        ${isCurrent && !isSelected ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''}
                                    `}>
                                        {i}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Display Central */}
                    <div className="absolute w-[180px] h-[180px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full border border-slate-100 dark:border-slate-800 shadow-inner flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tramo</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-900 text-slate-900 dark:text-white leading-none">
                                {String(selectedHour).padStart(2, '0')}
                            </span>
                            <span className="text-xl font-black text-primary">:00</span>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                            <span className={`text-xl font-900 leading-none ${getPriceTailwindColor(activeItem.price)}`}>
                                {activeItem.price.toFixed(4)}
                            </span>
                            <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase mt-1">€/kWh</span>
                        </div>
                    </div>
                </div>

                {/* Leyenda Inferior */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Muy Barato</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Muy Caro</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ahora</span>
                    </div>
                </div>
            </div>

            {/* Bloque Derecho: Análisis y Gráfico de Tendencia */}
            <div className="flex flex-col gap-6">
                <div className="premium-card p-8 md:p-10 flex-1 flex flex-col bg-slate-900 text-white relative overflow-hidden border border-white/10 shadow-3xl group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Zap size={140} className="rotate-12" />
                    </div>
                    
                    <div className="relative z-10 space-y-8 flex-1">
                        <div className="flex justify-between items-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest border border-white/5">
                                <Zap size={14} /> Análisis de Energía
                            </div>
                            {activeItem.price < stats.avg ? (
                                <div className="text-emerald-400 flex items-center gap-1 animate-bounce">
                                    <ShieldCheck size={20} />
                                    <span className="text-[9px] font-black uppercase">¡Ahorra ahora!</span>
                                </div>
                            ) : (
                                <div className="text-rose-400 flex items-center gap-1">
                                    <ZapOff size={20} />
                                    <span className="text-[9px] font-black uppercase">Carga Elevada</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-6xl md:text-8xl font-900 tracking-tighter transition-colors duration-500 ${getPriceTailwindColor(activeItem.price)}`}>
                                    {activeItem.price.toFixed(4)}
                                </span>
                                <span className="text-xl md:text-2xl font-bold text-slate-500">€/kWh</span>
                            </div>
                            
                            <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm">
                                Este tramo horario representa una <span className="text-white font-bold">{activeItem.price < stats.avg ? 'oportunidad de ahorro' : 'zona punta de consumo'}</span>. 
                                {activeItem.price < stats.avg 
                                    ? " Es el momento ideal para programar lavadoras y sistemas de climatización."
                                    : " Recomendamos posponer consumos intensivos a horarios marcados en verde."}
                            </p>
                        </div>

                        {/* Sparkline Visual (Simple SVG Trend) */}
                        <div className="pt-8 space-y-4">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tendencia 24h</p>
                             <div className="h-20 w-full flex items-end gap-1 px-1">
                                {pricesArray.map((p, i) => {
                                    const h = ((p.price - stats.min) / (stats.max - stats.min || 1)) * 100;
                                    const isSelected = selectedHour === i;
                                    return (
                                        <div 
                                            key={i}
                                            className={`flex-1 rounded-t-sm transition-all duration-300 cursor-pointer ${isSelected ? 'opacity-100 scale-y-110 !w-4' : 'opacity-40 hover:opacity-100 hover:scale-y-105'}`}
                                            style={{ 
                                                height: `${Math.max(5, h)}%`,
                                                backgroundColor: getPriceColor(p.price)
                                            }}
                                            onClick={() => setSelectedHour(i)}
                                        />
                                    );
                                })}
                             </div>
                             <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest pt-1">
                                <span>00:00</span>
                                <span>12:00</span>
                                <span>23:00</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1 group/item hover:border-primary/50 transition-colors">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Variación vs Media</p>
                                <p className={`text-2xl font-black ${activeItem.price < stats.avg ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {activeItem.price > stats.avg ? '+' : ''}
                                    {(((activeItem.price - stats.avg) / stats.avg) * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1 group/item hover:border-primary/50 transition-colors">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Impacto Factura</p>
                                <p className="text-2xl font-black text-white">
                                    {activeItem.price < stats.avg ? 'Bajo' : 'Medio-Alto'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-6 bg-emerald-500 text-white rounded-[2rem] flex items-center gap-6 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                        <TrendingDown size={28} />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="font-black uppercase tracking-tighter leading-none text-white/80">Meta-Ahorro</h4>
                        <p className="text-xl font-900 leading-tight">Gasta un 40% menos</p>
                        <p className="text-[10px] font-bold text-white/60 uppercase">Siguiendo los horarios valle</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
