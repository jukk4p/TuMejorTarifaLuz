"use client";

import { useState } from "react";
import { Zap, TrendingDown, TrendingUp, Clock, Info } from "lucide-react";

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

    const activeItem = pricesArray.find(p => parseInt(p.hour.split("-")[0]) === selectedHour) || pricesArray[0];

    // Calculamos el color basado en si es min, max o comparado con la media
    const getPriceColor = (price: number) => {
        if (price === stats.min) return 'text-emerald-500';
        if (price === stats.max) return 'text-rose-500';
        return price < stats.avg ? 'text-emerald-400' : 'text-rose-400';
    };

    const getBgColor = (price: number) => {
        if (price === stats.min) return 'bg-emerald-500';
        if (price === stats.max) return 'bg-rose-500';
        return price < stats.avg ? 'bg-emerald-400' : 'bg-rose-400';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Bloque Izquierdo: El Reloj Interactivo */}
            <div className="premium-card p-10 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none"></div>
                
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-12 relative z-10">Selector de Horario</h3>
                
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-[12px] border-slate-50 dark:border-slate-800 shadow-inner flex items-center justify-center">
                    {/* Marcas de las horas */}
                    {[...Array(24)].map((_, i) => {
                        const angle = (i * 15) - 90; // 360/24 = 15 grados por hora
                        const priceItem = pricesArray.find(p => parseInt(p.hour.split("-")[0]) === i);
                        const isSelected = selectedHour === i;
                        const isCurrent = currentHour === i;
                        
                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedHour(i)}
                                className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group
                                    ${isSelected ? 'scale-125 z-20 shadow-lg' : 'hover:scale-110 z-10'}
                                    ${isCurrent && !isSelected ? 'ring-2 ring-primary ring-offset-4 dark:ring-offset-slate-900' : ''}
                                `}
                                style={{
                                    transform: `rotate(${angle}deg) translate(140px) rotate(-${angle}deg)`
                                }}
                            >
                                <div className={`w-full h-full rounded-full flex items-center justify-center text-[10px] font-black transition-colors border-2
                                    ${isSelected 
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xl ring-4 ring-primary/20' 
                                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-primary/50'
                                    }
                                `}>
                                    {i}
                                </div>
                                {priceItem && (
                                    <div 
                                        className={`absolute -bottom-1 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${getBgColor(priceItem.price)}`}
                                        style={{ transform: 'translateY(12px)' }}
                                    ></div>
                                )}
                            </button>
                        );
                    })}

                    {/* Centro del reloj */}
                    <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-full w-44 h-44 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tramo</span>
                        <span className="text-4xl font-900 text-slate-900 dark:text-white leading-none mb-1">
                            {String(selectedHour).padStart(2, '0')}:00
                        </span>
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                             <Clock size={10} /> {selectedHour}:59
                        </span>
                    </div>

                    {/* Agujas decorativas o indicadores */}
                    <div 
                        className="absolute h-1 w-24 bg-primary/20 origin-left rounded-full transition-all duration-1000 ease-out pointer-events-none"
                        style={{ 
                            left: '50%',
                            transform: `rotate(${(selectedHour * 15) - 90}deg)` 
                        }}
                    ></div>
                </div>
                
                <div className="mt-12 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Mínimo</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Máximo</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Eléctrico</div>
                </div>
            </div>

            {/* Bloque Derecho: Datos Dinámicos */}
            <div className="flex flex-col gap-6">
                <div className="premium-card p-10 flex-1 flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden border border-white/10 shadow-3xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={100} />
                    </div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest border border-white/5">
                            <Zap size={14} />
                            Análisis del Tramo
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-7xl font-900 tracking-tighter ${getPriceColor(activeItem.price)}`}>
                                    {activeItem.price.toFixed(4)}
                                </span>
                                <span className="text-xl font-bold text-slate-400">€/kWh</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {activeItem.price === stats.min ? (
                                    <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <TrendingDown size={14} /> La mejor hora del día
                                    </div>
                                ) : activeItem.price === stats.max ? (
                                    <div className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp size={14} /> Hora punta de gasto
                                    </div>
                                ) : activeItem.price < stats.avg ? (
                                    <div className="px-4 py-2 bg-emerald-400/10 text-emerald-400/80 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <Info size={14} /> Precio Valle (Bajo media)
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 bg-rose-400/10 text-rose-400/80 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <Info size={14} /> Precio Llano (Sobre media)
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-primary underline-offset-4">Diferencia vs Media</p>
                                <p className="text-xl font-bold">
                                    {activeItem.price > stats.avg ? '+' : ''}
                                    {(((activeItem.price - stats.avg) / stats.avg) * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-primary underline-offset-4">Estado Red</p>
                                <p className="text-xl font-bold">
                                    {activeItem.price < stats.avg ? 'Óptimo' : 'Saturado'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-8 bg-emerald-500/10 dark:bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-[2rem] flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <Info size={32} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-900 text-slate-900 dark:text-white uppercase tracking-tight">Consejo Inteligente</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                            {activeItem.price < stats.avg 
                                ? "¡Es un buen momento! El coste está por debajo de la media diaria. Puedes usar grandes electrodomésticos con tranquilidad."
                                : "Cuidado, precio elevado. Si puedes esperar, desplaza tus consumos pesados a las horas marcadas en verde en el reloj."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
