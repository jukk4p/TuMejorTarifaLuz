import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { Zap, AlertCircle, Info, LayoutGrid, Clock as ClockIcon, BarChart3, TrendingDown } from "lucide-react";
import Link from "next/link";
import { getElectricityPrices } from "@/lib/electricity-prices";
import PriceClock from "./PriceClock";

export const metadata: Metadata = {
    title: "Precio de la Luz Hoy 2026: Horas más BARATAS y CARAS | TuMejorTarifaLuz",
    description: "Consulta el precio de la luz por horas en tiempo real para hoy con nuestro reloj interactivo. Descubre cuándo ahorrar en tu factura con datos oficiales del mercado regulado (PVPC).",
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
    const currentHour = parseInt(currentHourStr) || new Date().getHours();

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Zap size={14} />
                            Mercado Regulado (PVPC)
                        </div>
                        <h1 className="text-4xl md:text-7xl font-900 text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            Analizador de <span className="text-primary italic">Precio Hoy</span>
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Interactúa con nuestra <span className="text-slate-900 dark:text-slate-200 font-bold">Consola Energética</span>. Pulsa sobre las horas del reloj para ver el desglose detallado de cada tramo en tiempo real.
                        </p>
                    </div>

                    {/* Interactive Clock & Data Blocks */}
                    <div className="mb-24">
                        <PriceClock 
                            pricesArray={pricesArray} 
                            currentHour={currentHour} 
                            stats={{
                                min: prices.min,
                                avg: prices.average,
                                max: prices.max
                            }}
                        />
                    </div>

                    {/* Secondary Data: Quick Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        <div className="premium-card p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                <LayoutGrid size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Mínimo Diario</p>
                                <p className="text-3xl font-900 text-slate-900 dark:text-white">{prices.min.toFixed(5)} <span className="text-sm font-bold opacity-40">€/kWh</span></p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter mt-1">A las {prices.minHour}</p>
                            </div>
                        </div>

                        <div className="premium-card p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-6 ring-2 ring-primary/20">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <ClockIcon size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Precio Ahora mismo</p>
                                <p className="text-3xl font-900 text-slate-900 dark:text-white">{prices.current.toFixed(5)} <span className="text-sm font-bold opacity-40">€/kWh</span></p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Actualizado: {prices.time}</p>
                            </div>
                        </div>

                        <div className="premium-card p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-500/10 text-slate-500 flex items-center justify-center shrink-0">
                                <BarChart3 size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Media de la jornada</p>
                                <p className="text-3xl font-900 text-slate-900 dark:text-white">{prices.average.toFixed(5)} <span className="text-sm font-bold opacity-40">€/kWh</span></p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Pool mayorista 24h</p>
                            </div>
                        </div>
                    </div>

                    {/* Advice Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-800 text-slate-900 dark:text-white mb-2 tracking-tight">¿Por qué usar el reloj?</h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Entender visualmente el ciclo diario del mercado eléctrico te permite anticipar las zonas "Valle" y "Punta" de forma intuitiva. Los precios corresponden al mercado regulado (PVPC), base de todos los ahorros en España.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                    <Info className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-800 text-slate-900 dark:text-white mb-2 tracking-tight">Efecto del Pool</h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Si tu factura está en el mercado libre con precio fijo, este reloj te sirve para validar si tu actual tarifa es más barata que el precio de mercado o si deberías considerar un cambio.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="premium-card p-12 bg-slate-900 text-white relative overflow-hidden border border-white/5 shadow-3xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            <h3 className="text-4xl font-900 mb-6 leading-[1.1] tracking-tight">Libérate del <br/><span className="text-primary italic">Horario Pool</span></h3>
                            <p className="text-lg opacity-60 mb-10 leading-relaxed font-medium">Olvídate de mirar el reloj. Analizamos todas las ofertas de precio fijo del mercado para que pagues siempre lo mismo, sea la hora que sea.</p>
                            <Link href="/comparador" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-900 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/40">
                                ANALIZAR MI FACTURA
                                <TrendingDown className="w-5 h-5 text-primary" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
