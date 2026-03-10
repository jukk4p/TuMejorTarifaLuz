import { getElectricityPrices } from "@/lib/electricity-prices";

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
        <div className="relative premium-card p-6 md:p-10 overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
                <span className="material-icons text-[120px] md:text-[160px]">bolt</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative z-10">
                <div className="text-center md:text-left space-y-4 max-w-md w-full">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-primary">
                        <span className="material-icons text-xl md:text-2xl">bolt_outline</span>
                        <h3 className="text-sm md:text-base font-bold tracking-tight whitespace-nowrap">Precio de la Luz Hoy</h3>
                        <div className="flex items-center gap-2">
                            {prices.isLive ? (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-success/10 text-success rounded text-[7px] md:text-[8px] font-bold uppercase tracking-wider">
                                    <span className="w-1 h-1 bg-success rounded-full animate-pulse"></span>
                                    En vivo
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded text-[7px] md:text-[8px] font-bold uppercase tracking-wider">
                                    Muestra
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-0">
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">MEDIA NACIONAL POOL</p>
                        <div className="flex items-baseline justify-center md:justify-start gap-2">
                            <span className="text-5xl md:text-6xl font-800 text-slate-900 dark:text-white tracking-tight leading-none">{prices.average.toFixed(4)}</span>
                            <span className="text-base md:text-lg font-bold text-slate-400">€/kWh</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-[10px] md:text-[11px] font-bold">
                            <span className="material-icons text-xs md:text-sm">trending_down</span>
                            {prices.current < prices.average ? 'Bajo media' : 'Estable'}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] md:text-[11px] font-bold">
                            <span className="material-icons text-xs md:text-sm">update</span>
                            {prices.time}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto">
                    <div className="bg-slate-50/50 dark:bg-slate-800/20 p-3 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 text-center space-y-2 min-w-[110px] md:min-w-[130px]">
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mínimo</p>
                        <p className="text-base md:text-xl font-800 text-success">{prices.min.toFixed(4)}€</p>
                        <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] font-bold text-slate-400/70">
                            <span className="material-icons text-[12px] md:text-[14px]">schedule</span>
                            {prices.minHour}
                        </div>
                    </div>
                    <div className="bg-slate-50/50 dark:bg-slate-800/20 p-3 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 text-center space-y-2 min-w-[110px] md:min-w-[130px]">
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Máximo</p>
                        <p className="text-base md:text-xl font-800 text-slate-900 dark:text-white">{prices.max.toFixed(4)}€</p>
                        <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] font-bold text-slate-400/70">
                            <span className="material-icons text-[12px] md:text-[14px]">schedule</span>
                            {prices.maxHour}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="material-icons text-sm text-primary">info</span>
                    <p className="text-[11px] leading-relaxed italic">
                        POOL mayorista. Si tienes **tarifa fija**, tu precio no depende de estos valores.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-bold border border-primary/10 uppercase tracking-tight">
                    <span className="material-icons text-xs">no_accounts</span>
                    Comparador de uso libre sin registro
                </div>
            </div>
        </div>
    );
}
