import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Info, CheckCircle2, Building2, HelpCircle, ArrowRight, ExternalLink, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Comercializadoras de Referencia 2026: Guía Completa y Listado",
    description: "Descubre qué son las comercializadoras de referencia, por qué son necesarias para el bono social y el listado oficial actualizado de 2026.",
    alternates: {
        canonical: "https://www.tumejortarifaluz.es/companias/comercializadoras-referencia"
    }
};

const COR_COMPANIES = [
    {
        name: "Energía XXI",
        group: "Grupo Endesa",
        website: "https://www.energiaxxi.com",
        description: "Perteneciente al Grupo Endesa, es la comercializadora de referencia líder en Cataluña, Aragón, Andalucía, Extremadura y Baleares. Destaca por su extensísima red de oficinas de atención presencial y su agilidad en la tramitación del Bono Social para familias vulnerables.",
        logo: "/logos/EnergiaXXI.svg",
    },
    {
        name: "Curenergía",
        group: "Grupo Iberdrola",
        website: "https://www.curenergia.es",
        description: "Es la filial del Grupo Iberdrola designada para el mercado regulado. Con una posición dominante en Madrid, la Comunidad Valenciana, Castilla y León y el País Vasco, ofrece herramientas digitales avanzadas para que sus clientes puedan monitorizar su consumo horario en la tarifa PVPC.",
        logo: "/logos/Cultimorecurso.svg",
    },
    {
        name: "Comercializadora Regulada",
        group: "Grupo Naturgy (Gas & Power)",
        website: "https://www.comercializadoraregulada.es",
        description: "La marca del Grupo Naturgy especializada en tarifas reguladas (PVPC y TUR). Tiene una presencia histórica en todo el territorio nacional y se caracteriza por una comunicación transparente y un fuerte enfoque en la gestión de colectivos con derecho al Bono Social Térmico.",
        logo: "/logos/Corgruporepsol.svg",
    },
    {
        name: "Baser Comercializadora",
        group: "Grupo TotalEnergies / EDP",
        website: "https://www.basercor.es",
        description: "Anteriormente parte de EDP y ahora bajo el Grupo TotalEnergies, mantiene su liderazgo indiscutible como comercializadora de referencia en Asturias y Cantabria. Se diferencia por su arraigo local y un servicio de atención al cliente muy valorado por el consumidor doméstico tradicional.",
        logo: "/logos/Baser.svg",
    },
    {
        name: "Régsiti",
        group: "Grupo Repsol",
        website: "https://www.regsiti.com",
        description: "Es la comercializadora regulada del Grupo Repsol, consolidada tras la integración de Viesgo. Ha renovado sus sistemas para ofrecer una de las gestiones más rápidas del mercado en cambios de tarifa y solicitudes del Bono Social, aprovechando la infraestructura tecnológica del grupo.",
        logo: "/logos/Regsiti.png",
    },
    {
        name: "Cor Energía",
        group: "CHC Energía",
        website: "https://www.corenergetico.es/",
        description: "La entidad del grupo CHC para operar en el mercado regulado. Es especialmente relevante en zonas rurales y municipios medianos, donde su modelo de proximidad permite a los consumidores una gestión directa y cercana, alejada de la impersonalidad de las grandes corporaciones.",
        logo: "/logos/Corenergia.png",
    }
];

export default function ComercializadorasReferenciaPage() {
    return (
        <div className="bg-slate-50 dark:bg-[#0B1219]">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            Mercado Regulado
                        </div>
                        <h1 className="text-4xl md:text-6xl font-900 text-text-primary leading-tight">
                            Comercializadoras de <span className="text-primary">Referencia</span>
                        </h1>
                        <p className="text-xl text-text-secondary">
                            Las únicas autorizadas por el Gobierno para ofrecer la tarifa PVPC y gestionar el Bono Social Eléctrico.
                        </p>
                    </div>

                    {/* What is a COR? */}
                    <div className="grid md:grid-cols-2 gap-12 mb-32 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-800 text-text-primary">¿Qué son exactamente?</h2>
                            <p className="text-text-secondary leading-relaxed text-lg">
                                Son compañías eléctricas designadas por el Gobierno bajo unos requisitos muy estrictos de solvencia y capacidad para operar en el <strong>mercado regulado</strong>.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Ofrecen el precio regulado PVPC (Precio Voluntario para el Pequeño Consumidor).",
                                    "Son las únicas que pueden tramitar el Bono Social Eléctrico.",
                                    "Su margen de beneficio está limitado y fijado por ley.",
                                    "Tienen la obligación de suministrar a cualquier consumidor que lo solicite."
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                        <p className="text-slate-700 dark:text-slate-300 font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-xl space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
                                    <Info className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-800 text-text-primary">Información Clave</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-surface-2 border border-border">
                                    <p className="text-sm font-bold text-text-primary mb-2">¿Cómo diferenciarlas?</p>
                                    <p className="text-sm text-text-secondary">
                                        Aunque pertenecen a los mismos grupos que las grandes eléctricas (Endesa, Iberdrola...), tienen nombres y CIF distintos para evitar confusión con el mercado libre.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-surface-2 border border-border">
                                    <p className="text-sm font-bold text-text-primary mb-2">¿Cuál es mejor?</p>
                                    <p className="text-sm text-text-secondary">
                                        En el mercado regulado, <strong>todas ofrecen exactamente el mismo precio</strong>, ya que este lo fija el mercado diario y la REE. La única diferencia es la calidad de su atención al cliente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tariff Format Section */}
                    <div className="max-w-4xl mx-auto mb-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-900 text-text-primary tracking-tight">Tarifa Oficial PVPC</h2>
                                <p className="text-text-secondary font-medium italic">Referencia del mercado regulado</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute -top-3 right-8 z-10 bg-primary px-3 py-1 rounded-md text-[11px] font-black text-white uppercase tracking-widest shadow-lg">
                                Regulada
                            </div>
                            <div className="relative premium-card !p-0 overflow-hidden bg-white dark:bg-slate-900 border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
                                <div className="px-8 py-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-xl font-900 text-text-primary tracking-tight">PVPC - Mercado Regulado</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[13px] font-700 text-primary">Media marzo 2026</span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                            3 Periodos
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                                    <div className="grid sm:grid-cols-2 gap-10 lg:gap-16">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xl">⚡</span>
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Energía (€/kWh)</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-6">
                                                {[
                                                    { l: "Punta", v: 0.1709, c: "text-rose-500" },
                                                    { l: "Llano", v: 0.1019, c: "text-warning" },
                                                    { l: "Valle", v: 0.0839, c: "text-emerald-500" }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <span className="block text-[9px] font-black text-slate-400 uppercase">{item.l}</span>
                                                        <span className={`text-xl font-900 ${item.c}`}>{item.v.toFixed(4)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6 lg:border-l lg:border-border lg:pl-16">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xl">🔌</span>
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Potencia (€/kW/día)</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="block text-[9px] font-black text-slate-400 uppercase">Punta</span>
                                                    <span className="text-xl font-900 text-text-primary">0.0844</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="block text-[9px] font-black text-slate-400 uppercase">Valle</span>
                                                    <span className="text-xl font-900 text-text-primary">0.0020</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/comparador"
                                            className="px-10 py-5 bg-slate-900 dark:bg-primary text-white font-black rounded-2xl md:min-w-[200px] text-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                                        >
                                            Optimizar mi ahorro
                                        </Link>
                                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Sin permanencia · Variable</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List of Companies */}
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-800 text-text-primary mb-4">Listado de Compañías (2026)</h2>
                            <p className="text-text-secondary">Las comercializadoras autorizadas para ofrecer el PVPC.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {COR_COMPANIES.map((company) => (
                                <div key={company.name} className="group premium-card bg-surface p-8 border border-border hover:border-primary/30 transition-all duration-300 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-36 h-16 bg-surface-2 rounded-xl border border-border flex items-center justify-center p-3 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                                            <img 
                                                src={company.logo} 
                                                alt={company.name} 
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-primary transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                    <h3 className="text-2xl font-800 text-text-primary mb-2 group-hover:text-primary transition-colors">
                                        {company.name}
                                    </h3>
                                    <p className="text-sm font-bold text-primary/80 mb-4 uppercase tracking-widest">{company.group}</p>
                                    <p className="text-text-secondary leading-relaxed text-sm flex-grow">
                                        {company.description}
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mercado Regulado</span>
                                        <a 
                                            href={company.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
                                        >
                                            Visitar Web <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Mini Section */}
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-800 text-text-primary mb-4 flex items-center justify-center gap-3">
                                <HelpCircle className="w-8 h-8 text-primary" />
                                Dudas Frecuentes
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "¿Necesito estar en una de estas para el Bono Social?",
                                    a: "Sí, obligatoriamente. El Bono Social solo se puede solicitar a través de una Comercializadora de Referencia. Si estás en el mercado libre, deberás cambiarte a una de estas primero."
                                },
                                {
                                    q: "¿El precio es el mismo en todas?",
                                    a: "Sí. El PVPC es un precio regulado y es idéntico independientemente de con qué compañía de referencia lo tengas contratado."
                                },
                                {
                                    q: "¿Tienen todas oficinas físicas?",
                                    a: "No todas, pero las ligadas a las grandes (Iberdrola, Endesa, Naturgy) suelen permitir gestiones del mercado regulado en sus centros de atención presencial."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                                    <h4 className="text-lg font-800 text-text-primary mb-3">{faq.q}</h4>
                                    <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
