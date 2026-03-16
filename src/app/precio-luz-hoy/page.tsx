import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { Zap, TrendingDown, Clock, BarChart3, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { getElectricityPrices } from "@/lib/electricity-prices";

export const metadata: Metadata = {
    title: "Precio de la Luz Hoy 2026: Horas más BARATAS y CARAS | TuMejorTarifaLuz",
    description: "Consulta el precio de la luz por horas en tiempo real para hoy. Descubre cuándo poner la lavadora para ahorrar. Datos oficiales del mercado regulado (PVPC) actualizados.",
    alternates: {
        canonical: "https://tumejortarifaluz.es/precio-luz-hoy"
    }
};

export default async function PrecioLuzHoyPage() {
    const pricesData = await getElectricityPrices();
    
    const prices = pricesData || {
        current: 0,
        average: 0,
        min: 0,
        minHour: "--:--",
        max: 0,
        maxHour: "--:--",
        time: "--:--",
        isLive: false,
        allHours: []
    };

    const pricesArray = (prices.allHours || []).map((p) => ({
        hour: `${String(p.hour).padStart(2, '0')}-${String(p.hour + 1).padStart(2, '0')}`,
        price: p.value,
        isCheap: p.value < prices.average
    }));

    const currentHourStr = prices.time.split(":")[0];
    const currentHour = parseInt(currentHourStr);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <Zap className="w-4 h-4" />
                            Mercado Regulado (PVPC)
                        </div>
                        <h1 className="text-4xl md:text-6xl font-900 text-slate-900 dark:text-white leading-tight">
                            Precio de la <span className="text-primary italic">Luz Hoy</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                            Datos actualizados en tiempo real del mercado mayorista para que optimices tu consumo y pagues lo mínimo.
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="premium-card p-8 bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Mínimo Hoy</span>
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <div className="text-4xl font-900 mb-2">{prices.min.toFixed(5)} <span className="text-lg">€/kWh</span></div>
                            <p className="text-sm font-medium opacity-90">Hora más barata del día ({prices.minHour})</p>
                        </div>
                        
                        <div className="premium-card p-8 bg-slate-900 text-white shadow-xl shadow-slate-900/10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Precio Actual</span>
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-4xl font-900 mb-2 text-primary">{prices.current.toFixed(5)} <span className="text-lg text-white">€/kWh</span></div>
                            <p className="text-sm font-medium opacity-60">Media del pool ahora mismo</p>
                        </div>

                        <div className="premium-card p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media del Día</span>
                                <BarChart3 className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="text-4xl font-900 mb-2 text-slate-900 dark:text-white">{prices.average.toFixed(5)} <span className="text-lg opacity-40">€/kWh</span></div>
                            <p className="text-sm font-medium text-slate-500">Promedio de las 24 horas</p>
                        </div>
                    </div>

                    {/* Hourly Table */}
                    <div className="premium-card overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-800 text-slate-900 dark:text-white uppercase tracking-tight">Evolución Horaria</h3>
                                <p className="text-xs text-slate-400 font-medium">Precios por tramos de 1 hora para hoy</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lo mejor</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lo peor</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-slate-50 dark:divide-slate-800/50">
                            {pricesArray.length > 0 ? pricesArray.map((p, i) => {
                                const startHour = parseInt(p.hour.split("-")[0]);
                                const isCurrent = startHour === currentHour;
                                const isBest = p.price === prices.min;
                                const isWorst = p.price === prices.max;
                                
                                return (
                                    <div key={i} className={`p-6 flex flex-col items-center justify-center gap-2 transition-all duration-300 relative ${isCurrent ? 'bg-primary/[0.03] ring-1 ring-inset ring-primary/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}>
                                        <span className={`text-[10px] font-bold tracking-tighter ${isCurrent ? 'text-primary' : 'text-slate-400'}`}>
                                            {String(startHour).padStart(2, '0')}:00
                                        </span>
                                        <div className="text-center">
                                            <span className={`text-lg font-900 block leading-none ${isBest ? 'text-emerald-500' : isWorst ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {p.price.toFixed(4)}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-300 dark:text-slate-500">€/kWh</span>
                                        </div>
                                        <div className={`w-full h-1 rounded-full mt-1 ${isBest ? 'bg-emerald-500' : isWorst ? 'bg-rose-500' : p.price < prices.average ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}></div>
                                        {isCurrent && <span className="absolute top-2 right-2 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>}
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full p-20 text-center text-slate-400 italic">
                                    No se han podido cargar los precios en este momento. Inténtalo de nuevo más tarde.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Advice Section */}
                    <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-800 text-slate-900 dark:text-white mb-2">¿Cómo interpretar estos datos?</h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Los precios mostrados corresponden al mercado regulado (PVPC). Si tienes una tarifa de mercado libre con precio fijo, este precio no te afecta directamente hoy, pero te sirve de referencia para saber si tu compañía te está cobrando demasiado.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                    <Info className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-800 text-slate-900 dark:text-white mb-2">Consejo de Ahorro</h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Intenta desplazar el uso de electrodomésticos de alto consumo (lavadora, lavavajillas, horno) a las zonas marcadas en verde. El ahorro respecto a las zonas rojas puede ser de más del 50% por cada uso.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="premium-card p-12 bg-slate-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            <h3 className="text-3xl font-900 mb-6 leading-tight">¿Cansado de mirar el reloj?</h3>
                            <p className="text-lg opacity-80 mb-10 leading-relaxed">Pásate a una tarifa de precio fijo y despreocúpate de las horas. Analizamos todas las ofertas del mercado para encontrarte la más barata.</p>
                            <Link href="/comparador" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-900 rounded-2xl hover:scale-105 active:scale-95 transition-all">
                                ENCONTRAR MEJOR TARIFA FIJA
                                <TrendingDown className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
