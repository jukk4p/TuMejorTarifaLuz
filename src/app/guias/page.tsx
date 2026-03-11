"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const guides = [
    {
        slug: "guia-factura-luz-2026",
        date: "01/03/2026",
        title: "Guía Definitiva 2026: Entiende cada concepto de tu factura de la luz",
        summary: "Desglosamos término a término tu recibo: potencia contratada, energía consumida, peajes e impuestos para que dejes de pagar por lo que no entiendes.",
        content: "La factura de la luz no tiene por qué ser un jeroglífico. En esta guía exploramos la estructura de la nueva factura 2.0TD, explicando la diferencia entre el término de potencia (lo que pagas por 'poder' conectar aparatos) y el término de energía (lo que realmente consumes). Además, analizamos los peajes de transporte y distribución, y cómo los impuestos (IVA e Impuesto Eléctrico) afectan al total final...",
        category: "Educación Financiera",
        image: "/guides/bill_expert_analysis.png"
    },
    {
        slug: "mercado-libre-vs-regulado",
        date: "26/02/2026",
        title: "Mercado Libre vs Regulado (PVPC): ¿Cuál es más rentable tras la reforma?",
        summary: "Analizamos el nuevo sistema de cálculo del PVPC frente a las tarifas fijas del mercado libre. Datos reales para una elección inteligente.",
        content: "El eterno dilema: ¿PVPC o mercado libre? Con la reciente reforma del Precio Voluntario para el Pequeño Consumidor (PVPC), el precio ahora incluye una cesta de futuros que reduce la volatilidad. Sin embargo, muchas comercializadoras del mercado libre están lanzando ofertas agresivas que podrían ser más estables para consumidores con perfiles de uso muy marcados. Analizamos pros y contras de cada modelo...",
        category: "Comparativa",
        image: "/guides/market_comparison.png"
    },
    {
        slug: "optimizacion-potencia-ahorro",
        date: "20/02/2026",
        title: "Optimización de Potencia: El ahorro directo que el 90% de los hogares ignora",
        summary: "Te enseñamos a identificar si tienes contratada más potencia de la necesaria y cómo ajustarla para ahorrar hasta 150€ al año sin esfuerzo.",
        content: "Muchas familias pagan una potencia 'por si acaso' que nunca llegan a utilizar. Si nunca te han saltado los plomos al poner el horno y la lavadora a la vez, es probable que tengas margen para bajar tu potencia contratada. Cada kW de potencia menos puede suponer un ahorro de unos 50€ al año. Explicamos cómo mirar tu 'pico de potencia máximo' en el área de cliente de tu distribuidora...",
        category: "Ahorro Técnico",
        image: "/guides/energy_efficiency.png"
    },
    {
        slug: "discriminacion-horaria-estrategias",
        date: "15/02/2026",
        title: "Discriminación Horaria: Cómo reducir un 40% tu gasto sin cambiar de hábitos",
        summary: "Domina los tramos Punta, Llano y Valle. Estrategias prácticas para desplazar consumos críticos a las horas más económicas del día.",
        content: "Organizar tu consumo no significa poner la lavadora a las 3 de la mañana. Significa entender que el periodo Valle (el más barato) también incluye los fines de semana completos y festivos nacionales. Conocer los horarios de los periodos Punta (caro), Llano (medio) y Valle te permite programar tus electrodomésticos más pesados de forma inteligente y ver una reducción real en tu próxima factura...",
        category: "Eficiencia",
        image: "/guides/electricity_clock.png"
    },
    {
        slug: "autoconsumo-solar-pisos",
        date: "10/02/2026",
        title: "Autoconsumo Solar en Pisos: ¿Es posible y rentable instalar paneles en 2026?",
        summary: "Todo sobre el autoconsumo compartido, subvenciones vigentes y plazos de amortización para comunidades de vecinos y bloques de apartamentos.",
        content: "Vivir en un piso ya no es un impedimento para disfrutar de la energía solar. El autoconsumo compartido permite a los vecinos de una comunidad repartirse la energía generada por una instalación común en la azotea. Explicamos la normativa de los 2.000 metros de distancia, cómo se reparte el coeficiente de energía y cuáles son las deducciones de IRPF que puedes solicitar este año...",
        category: "Energías Renovables",
        image: "/guides/solar_panels.png"
    },
    {
        slug: "guia-carga-coche-electrico",
        date: "05/03/2026",
        title: "Carga de Vehículo Eléctrico: Cómo configurar tu tarifa para no pagar de más",
        summary: "Analizamos las mejores tarifas para VE y cómo aprovechar la potencia en horas valle para cargar por menos de 2€.",
        content: `Cargar un coche eléctrico en casa es la forma más económica de movilidad, siempre que se haga con la tarifa correcta. En 2026, la mayoría de comercializadoras ofrecen tarifas específicas con un precio de energía ultra-rebajado durante la madrugada (habitualmente de 01:00 a 07:00).

        Para sacar el máximo provecho, es vital contar con un cargador inteligente (Wallbox) que permita programar la carga en esas horas. Además, la normativa actual permite contratar una potencia diferente para el horario nocturno sin coste adicional en el término de potencia, lo que facilita cargas rápidas sin comprometer el suministro del resto del hogar durante el día.

        Analizamos también los costes de instalación del punto de carga y las ayudas del Plan MOVES III que siguen vigentes este año para particulares y comunidades de vecinos.`,
        category: "Movilidad Sostenible",
        image: "/guides/ev_charging.png"
    }
];

export default function GuiasPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <BookOpen className="w-4 h-4" />
                            Centro de Aprendizaje
                        </div>
                        <h1 className="text-4xl md:text-6xl font-800 text-slate-900 dark:text-white leading-tight">
                            Guías Profesionales para el <span className="text-primary">Ahorro Energético</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Contenido experto actualizado a la normativa de 2026 para ayudarte a tomar el control de tu gasto eléctrico.
                        </p>
                    </div>

                    {/* Featured Guide */}
                    <div className="mb-20">
                        <div className="relative premium-card overflow-hidden group">
                            <div className="grid lg:grid-cols-2">
                                <div className="aspect-[16/9] lg:aspect-auto bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={guides[0].image}
                                        alt={guides[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">{guides[0].category}</span>
                                        <span className="text-sm text-slate-400 font-medium">{guides[0].date}</span>
                                    </div>
                                    <h2 className="text-3xl font-800 text-slate-900 dark:text-white leading-tight">{guides[0].title}</h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{guides[0].summary}</p>
                                    <Link href={`/guias/${guides[0].slug}`} className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl w-fit hover:shadow-xl transition-all">
                                        Leer Guía Completa
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.slice(1).map((guide, i) => (
                            <div key={i} className="premium-card p-8 flex flex-col group border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">{guide.category}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{guide.date}</span>
                                </div>
                                <h3 className="text-xl font-800 text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                                    {guide.title}
                                </h3>
                                <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={guide.image}
                                        alt={guide.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                                    {guide.summary}
                                </p>
                                <Link
                                    href={`/guias/${guide.slug}`}
                                    className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between group-hover:bg-slate-50 dark:group-hover:bg-slate-800/20 -mx-8 px-8 transition-colors"
                                >
                                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Leer más</span>
                                    <ArrowRight className="text-primary w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter / CTA for AdSense Value */}
                    <div className="mt-20 p-12 bg-slate-900 dark:bg-slate-800/50 rounded-[2rem] text-center text-white relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h3 className="text-3xl font-800">¿Quieres recibir consejos de ahorro semanales?</h3>
                            <p className="text-slate-300 text-lg">Únete a nuestra newsletter y recibe las últimas actualizaciones del mercado mayorista y trucos exclusivos.</p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Tu email..."
                                    className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
                                    Suscribirse
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
