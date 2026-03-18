"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, User, Share2, Link as LinkIcon, Bookmark } from "lucide-react";

const guides = [
    {
        slug: "guia-factura-luz-2026",
        date: "01/03/2026",
        title: "Guía Definitiva 2026: Entiende cada concepto de tu factura de la luz",
        summary: "Desglosamos término a término tu recibo: potencia contratada, energía consumida, peajes e impuestos para que dejes de pagar por lo que no entiendes.",
        content: `La factura de la luz no tiene por qué ser un jeroglífico. En esta guía exploramos la estructura de la nueva factura 2.0TD, explicando la diferencia entre el término de potencia (lo que pagas por 'poder' conectar aparatos) y el término de energía (lo que realmente consumes).

        A nivel técnico, el término de potencia es un coste fijo que pagas por la capacidad de conexión de tu instalación. Si contratas 4.6kW, esa es la carga máxima que puedes sostener antes de que el ICP (Interruptor de Control de Potencia) actúe.

        El término de energía, por otro lado, es variable y se mide en kWh. Aquí es donde los tramos horarios (Punta, Llano y Valle) juegan un papel fundamental, afectando directamente al precio unitario que pagas por cada unidad de energía consumida.

        Finalmente, no debemos olvidar los peajes de acceso, cargos e impuestos. El IVA, que ha sufrido variaciones recientes, se aplica sobre la suma de todos los conceptos anteriores, lo que eleva el total de la factura de forma proporcional.`,
        category: "Educación Financiera",
        imageUrl: "/guides/bill_expert_analysis.webp"
    },
    {
        slug: "mercado-libre-vs-regulado",
        date: "26/02/2026",
        title: "Mercado Libre vs Regulado (PVPC): ¿Cuál es más rentable tras la reforma?",
        summary: "Analizamos el nuevo sistema de cálculo del PVPC frente a las tarifas fijas del mercado libre.",
        content: `El eterno dilema: ¿PVPC o mercado libre? Con la reciente reforma del Precio Voluntario para el Pequeño Consumidor (PVPC), el precio ahora incluye una cesta de futuros que reduce la volatilidad. 

        Esto significa que ya no estamos tan expuestos a los picos diarios del mercado mayorista (POOL), ofreciendo una mayor estabilidad a largo plazo. Sin embargo, esta estabilidad tiene un coste en forma de primas de riesgo que se repercuten en el precio.

        En el mercado libre, las comercializadoras ofrecen una variedad casi infinita de tarifas: fijas, planas, con horas gratuitas o indexadas. La clave está en analizar tu perfil de consumo real. Si concentras tu gasto en horas nocturnas o fines de semana, el PVPC suele seguir siendo muy competitivo. Si prefieres la tranquilidad de saber exactamente qué vas a pagar sin mirar el reloj, una tarifa fija del mercado libre es tu mejor opción.`,
        category: "Comparativa",
        imageUrl: "/guides/market_comparison.webp"
    },
    {
        slug: "optimizacion-potencia-ahorro",
        date: "20/02/2026",
        title: "Optimización de Potencia: El ahorro directo que el 90% de los hogares ignora",
        summary: "Te enseñamos a identificar si tienes contratada más potencia de la necesaria.",
        content: `Es el ahorro más fácil y directo, pero pocos lo aplican. La potencia contratada representa una parte significativa de tu recibo, y muchos hogares pagan por una capacidad que nunca utilizan al completo.

        ¿Cómo saber si te sobra potencia? La mayoría de contadores inteligentes modernos registran el 'pico máximo' de potencia alcanzado en el último mes o año. Puedes consultar este dato en el área de cliente de tu distribuidora (no tu comercializadora). Si tu potencia contratada es de 5.75kW pero tu pico máximo nunca ha pasado de 4kW, estás regalando dinero a la eléctrica todos los meses.

        Reducir la potencia es un trámite sencillo que cuesta unos 10€ aproximadamente por la gestión técnica de la distribuidora, pero que amortizas en apenas dos o tres meses con el ahorro generado.`,
        category: "Ahorro Técnico",
        imageUrl: "/guides/energy_efficiency.webp"
    },
    {
        slug: "discriminacion-horaria-estrategias",
        date: "15/02/2026",
        title: "Discriminación Horaria: Cómo reducir un 40% tu gasto sin cambiar de hábitos",
        summary: "Domina los tramos Punta, Llano y Valle para optimizar tu gasto.",
        content: `La discriminación horaria es la herramienta más potente que tienes como consumidor para bajar tu factura. Entender los horarios del sistema 2.0TD es crucial para no pagar de más de forma innecesaria. 

        Recordemos los tramos: Valle (la más barata, de 00h a 08h de lunes a viernes y fines de semana completos), Llano (precio medio) y Punta (el más caro). Desplazar el uso de electrodomésticos de alto consumo como lavavajillas, lavadora o carga de coche eléctrico a las horas Valle puede suponer un ahorro de hasta el 40% en el término de energía.

        No necesitas cambiar tu estilo de vida radicalmente; basta con usar la programación diferida de tus aparatos o simplemente concentrar las tareas de limpieza pesada en el fin de semana.`,
        category: "Eficiencia",
        imageUrl: "/guides/electricity_clock.webp"
    },
    {
        slug: "autoconsumo-solar-pisos",
        date: "10/02/2026",
        title: "Autoconsumo Solar en Pisos: ¿Es posible y rentable instalar paneles en 2026?",
        summary: "Todo sobre el autoconsumo compartido en comunidades de vecinos.",
        content: `El autoconsumo ya no es exclusivo de los chalets unifamiliares. Gracias a la normativa actual de autoconsumo compartido, una comunidad de propietarios puede instalar paneles solares en su tejado y repartir la energía generada entre los vecinos participantes.

        La rentabilidad ha aumentado significativamente en 2026 debido a la madurez de la tecnología y a las subvenciones europeas vigentes. Además de la reducción directa en la factura, existen importantes beneficios fiscales, como deducciones en el IRPF o reducciones en el IBI de hasta el 50% según el municipio.

        El sistema permite incluso compensar excedentes: si tu instalación produce más energía de la que consumes en un momento dado, esa energía se vierte a la red y se te compensa económicamente en tu factura mensual, reduciendo el término de energía a cero en muchos casos.`,
        category: "Energías Renovables",
        imageUrl: "/guides/solar_panels.webp"
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
        imageUrl: "/guides/ev_charging.webp"
    }
];

export default function GuiaDetalle() {
    const params = useParams();
    const guide = guides.find(g => g.slug === params.slug) || guides[0];

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-background pt-24 pb-20">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="space-y-6 mb-12">
                        <Link href="/guias" className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            Volver al centro de guías
                        </Link>
                        <div className="flex items-center gap-4 text-slate-400 text-sm">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">{guide.category}</span>
                            <span>•</span>
                            <span>{guide.date}</span>
                            <span>•</span>
                            <span>8 min de lectura</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-800 text-text-primary leading-tight">
                            {guide.title}
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed font-medium">
                            {guide.summary}
                        </p>
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none space-y-8">
                        {guide.content.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>

                    {/* Author / Share Placeholder for AdSense */}
                    <div className="mt-16 pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <User className="text-slate-400 w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">Equipo Editorial</p>
                                <p className="text-xs text-slate-400">Expertos en Normativa Eléctrica</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-bold text-slate-400 uppercase">Compartir:</p>
                            <div className="flex gap-2">
                                {[{icon: Share2, label: 'share'}, {icon: LinkIcon, label: 'link'}, {icon: Bookmark, label: 'bookmark'}].map((btn, idx) => (
                                    <button key={idx} className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                                        <btn.icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
