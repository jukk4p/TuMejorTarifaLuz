import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { Zap, TrendingDown, Clock, BarChart3, AlertCircle, Info } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Precio de la Luz Hoy 2026: Horas más BARATAS y CARAS | TuMejorTarifaLuz",
    description: "Consulta el precio de la luz por horas en tiempo real para hoy. Descubre cuándo poner la lavadora para ahorrar. Datos oficiales del mercado regulado (PVPC) actualizados.",
    alternates: {
        canonical: "https://tumejortarifaluz.es/precio-luz-hoy"
    }
};

async function getPrices() {
    try {
        // Usamos una API pública de precios de luz en España
        const res = await fetch('https://api.preciodelaluz.org/v1/prices/all?zone=PCB', {
            next: { revalidate: 3600 } // Revalidar cada hora
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

export default async function PrecioLuzHoyPage() {
    const pricesData = await getPrices();
    
    // Sort prices to find min and max
    const pricesArray = pricesData ? Object.values(pricesData).map((p: any) => ({
        hour: p.hour,
        price: p.price / 1000, // Convert to €/kWh
        isCheap: p['is-cheap'],
        isUnderAvg: p['is-under-avg']
    })) : [];

    const minPrice = pricesArray.length > 0 ? Math.min(...pricesArray.map(p => p.price)) : 0;
    const maxPrice = pricesArray.length > 0 ? Math.max(...pricesArray.map(p => p.price)) : 0;
    const avgPrice = pricesArray.length > 0 ? pricesArray.reduce((acc, p) => acc + p.price, 0) / pricesArray.length : 0;

    const currentHour = new Date().getHours();
    const currentPrice = pricesArray.find(p => parseInt(p.hour.split("-")[0]) === currentHour)?.price || 0;

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
                            <div className="text-4xl font-900 mb-2">{minPrice.toFixed(5)} <span className="text-lg">€/kWh</span></div>
                            <p className="text-sm font-medium opacity-90">Hora más barata del día</p>
                        </div>
                        
                        <div className="premium-card p-8 bg-slate-900 text-white shadow-xl shadow-slate-900/10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Precio Actual</span>
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-4xl font-900 mb-2 text-primary">{currentPrice.toFixed(5)} <span className="text-lg text-white">€/kWh</span></div>
                            <p className="text-sm font-medium opacity-60">Media del pool ahora mismo</p>
                        </div>

                        <div className="premium-card p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media del Día</span>
                                <BarChart3 className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="text-4xl font-900 mb-2 text-slate-900 dark:text-white">{avgPrice.toFixed(5)} <span className="text-lg opacity-40">€/kWh</span></div>
                            <p className="text-sm font-medium text-slate-500">Promedio de las 24 horas</p>
                        </div>
                    </div>

                    {/* Hourly Table */}
                    <div className="premium-card overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                            <h3 className="text-xl font-800 text-slate-900 dark:text-white uppercase tracking-tight">Evolución Horaria</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Barata</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Cara</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-slate-50 dark:divide-slate-800/50">
                            {pricesArray.length > 0 ? pricesArray.map((p, i) => (
                                <div key={i} className={`p-6 flex flex-col items-center justify-center space-y-3 transition-colors ${parseInt(p.hour.split("-")[0]) === currentHour ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.hour}h</span>
                                    <span className={`text-xl font-900 ${p.price === minPrice ? 'text-emerald-500' : p.price === maxPrice ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                                        {p.price.toFixed(5)}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${p.price < avgPrice ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                </div>
                            )) : (
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
