import { getElectricityPrices } from "@/lib/energy-prices";
import { Bolt, TrendingDown, RefreshCcw, Clock, Info, UserX } from "lucide-react";
import Link from "next/link";

export default async function ElectricityPriceWidget() {
    const pricesData = await getElectricityPrices();

    const prices = pricesData || {
        current: 0.1250,
        average: 0.1100,
        min: 0.0800,
        minHour: "--:--",
        max: 0.2000,
        maxHour: "--:--",
        time: "--:--",
        isLive: false,
        allHours: []
    };

    return (
        <div className="relative premium-card p-6 md:p-10 overflow-hidden border border-border">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
                <span className="text-8xl md:text-[160px] block rotate-12">⚡</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative z-10">
                <div className="text-center md:text-left space-y-4 max-w-md w-full">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-primary">
                        <span className="text-xl md:text-2xl">⚡</span>
                        <h3 className="text-sm md:text-base font-bold tracking-tight whitespace-nowrap">Precio de la luz hoy</h3>
                        <div className="flex items-center gap-2">
                            {prices.isLive ? (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-accent-bg text-accent-bg-text rounded text-[7px] md:text-[8px] font-bold tracking-wider">
                                    <span className="w-1 h-1 bg-accent rounded-full animate-pulse"></span>
                                    En vivo
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded text-[7px] md:text-[8px] font-bold tracking-wider">
                                    Muestra
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-0">
                        <p className="text-[9px] md:text-[10px] font-bold text-text-muted tracking-[0.2em] mb-1">Media nacional pool</p>
                        <div className="flex items-baseline justify-center md:justify-start gap-2">
                            <span className="text-5xl md:text-6xl font-800 text-text-primary tracking-tight leading-none">{prices.average.toFixed(4)}</span>
                            <span className="text-base md:text-lg font-bold text-slate-400">€/kWh</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-bg text-accent-bg-text rounded-full text-[10px] md:text-[11px] font-bold">
                            <TrendingDown size={14} className="md:size-[16px]" />
                            {prices.current < prices.average ? 'Bajo media' : 'Estable'}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 text-text-secondary rounded-full text-[10px] md:text-[11px] font-bold">
                            <RefreshCcw size={14} className="md:size-[16px]" />
                            {prices.time}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto">
                    <div className="bg-surface-2 p-3 md:p-5 rounded-3xl border border-border text-center space-y-2 min-w-[110px] md:min-w-[130px]">
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-400 tracking-widest">Mínimo</p>
                        <p className="text-base md:text-xl font-800 text-savings">{prices.min.toFixed(4)}€</p>
                        <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] font-bold text-slate-400/70">
                            <Clock size={14} />
                            {prices.minHour}
                        </div>
                    </div>
                    <div className="bg-surface-2 p-3 md:p-5 rounded-3xl border border-border text-center space-y-2 min-w-[110px] md:min-w-[130px]">
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-400 tracking-widest">Máximo</p>
                        <p className="text-base md:text-xl font-800 text-text-primary">{prices.max.toFixed(4)}€</p>
                        <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] font-bold text-slate-400/70">
                            <Clock size={14} />
                            {prices.maxHour}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-text-secondary">
                    <Info size={14} className="text-primary" />
                    <p className="text-[11px] leading-relaxed italic">
                        POOL mayorista. Si tienes **tarifa fija**, tu precio no depende de estos valores.
                    </p>
                </div>
                <Link href="/comparador" className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[11px] font-bold border border-primary/20 tracking-tight transition-all active:scale-95 shadow-sm">
                    <UserX size={14} className="opacity-80" />
                    Comparador de uso libre sin registro
                </Link>
            </div>
        </div>
    );
}
