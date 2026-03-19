"use client";

import { useMemo } from "react";
import { Zap, TrendingDown, TrendingUp, Clock, Info, ShieldCheck, ZapOff } from "lucide-react";

interface PriceItem {
    hour: string;
    price: number;
    isCheap: boolean;
    hourNum: number;
}

interface PriceClockProps {
    pricesArray: PriceItem[];
    currentHour: number;
    selectedHour: number;
    onHourChange: (hour: number) => void;
    stats: {
        min: number;
        avg: number;
        max: number;
    }
}

export default function PriceClock({ pricesArray, currentHour, selectedHour, onHourChange, stats }: PriceClockProps) {
    const activeItem = pricesArray.find(p => p.hourNum === selectedHour) || pricesArray[0] || { hour: "00-01", price: 0, isCheap: false, hourNum: 0 };

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
        if (price === stats.max) return 'text-warning';
        const ratio = (price - stats.min) / (stats.max - stats.min || 1);
        if (ratio < 0.3) return 'text-emerald-500';
        if (ratio < 0.7) return 'text-warning';
        return 'text-warning';
    };

    // Generar el tramo dinámico según el precio
    const getDynamicDescription = () => {
        const diff = ((activeItem.price - stats.avg) / stats.avg) * 100;
        if (diff < -20) {
            return "Hora ideal para encender lavadora, lavavajillas y cargar el vehículo eléctrico.";
        } else if (diff > 20) {
            return "Hora cara. Pospón lavadora, horno y climatización hasta las horas de menor precio.";
        } else {
            return "Precio en rango normal. Evita los grandes electrodomésticos si puedes esperar a las horas valle.";
        }
    };

    const savingsPercentage = useMemo(() => {
        return (((stats.max - stats.min) / stats.max) * 100).toFixed(1);
    }, [stats.min, stats.max]);

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
            
            return { x1, y1, x2, y2, color, hour: p.hourNum };
        });
    }, [pricesArray, stats]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Bloque Izquierdo: La Consola Visual */}
            <div className="premium-card p-4 md:p-8 flex flex-col items-center justify-center bg-surface border border-border shadow-2xl relative overflow-hidden min-h-[500px] md:min-h-[600px]">
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
                                onClick={() => onHourChange(s.hour)}
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
                                    onClick={() => onHourChange(i)}
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
                                            : 'bg-white dark:bg-slate-800 text-slate-400 border-border'
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
                    <div className="absolute w-[180px] h-[180px] bg-surface backdrop-blur-xl rounded-full border border-border shadow-inner flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tramo</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-900 text-text-primary leading-none">
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
                        <div className="w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
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
                    <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
                        <span className="text-8xl md:text-[160px] block rotate-12">⚡</span>
                    </div>
                    
                    <div className="relative z-10 space-y-8 flex-1">
                        <div className="flex justify-between items-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest border border-white/5">
                                <span>⚡</span> Análisis de Energía
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
                                {getDynamicDescription()}
                            </p>
                        </div>

                        {/* Sparkline Visual (Full Area Trend) */}
                        <div className="pt-8 space-y-4">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tendencia 24h</p>
                             <div className="h-28 w-full flex items-end gap-1 px-1 relative">
                                {pricesArray.map((p, i) => {
                                    const h = ((p.price - stats.min) / (stats.max - stats.min || 1)) * 100;
                                    const isSelected = selectedHour === p.hourNum;
                                    const isBelowAvg = p.price < stats.avg;
                                    
                                    return (
                                        <div 
                                            key={i}
                                            className={`flex-1 relative transition-all duration-300 cursor-pointer ${isSelected ? 'opacity-100 scale-y-110' : 'opacity-40 hover:opacity-100'}`}
                                            style={{ height: `${Math.max(10, h)}%` }}
                                            onClick={() => onHourChange(p.hourNum)}
                                        >
                                            {/* Bar part */}
                                            <div 
                                                className="absolute inset-0 rounded-t-sm"
                                                style={{ backgroundColor: getPriceColor(p.price) }}
                                            />
                                            {/* Area coloring (Simulated with simple conditional background extension) */}
                                            <div 
                                                className={`absolute bottom-0 left-0 right-0 w-full h-[300%] -z-10 transition-colors opacity-10 
                                                    ${isBelowAvg ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                            />
                                        </div>
                                    );
                                })}
                             </div>
                             <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest pt-3 px-1 border-t border-white/5">
                                <span>00h</span>
                                <span>06h</span>
                                <span>12h</span>
                                <span>18h</span>
                                <span>23h</span>
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
                                    {activeItem.price < stats.avg ? 'Ahorro' : 'Elevado'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-6 bg-emerald-500 text-slate-900 rounded-[2rem] flex items-center gap-6 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                        <TrendingDown size={28} />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="font-black uppercase tracking-tighter leading-none opacity-80">Meta-Ahorro</h4>
                        <p className="text-xl font-900 leading-tight">Gasta un {savingsPercentage}% menos</p>
                        <p className="text-[10px] font-bold opacity-60 uppercase">Diferencia entre Máximo y Mínimo</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
