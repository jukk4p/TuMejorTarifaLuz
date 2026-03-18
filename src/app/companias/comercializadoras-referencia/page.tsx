import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Info, CheckCircle2, Building2, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Comercializadoras de Referencia 2026: Guía Completa y Listado",
    description: "Descubre qué son las comercializadoras de referencia, por qué son necesarias para el bono social y el listado oficial actualizado de 2026.",
    alternates: {
        canonical: "https://tumejortarifaluz.es/companias/comercializadoras-referencia"
    }
};

const COR_COMPANIES = [
    {
        name: "Energía XXI",
        group: "Grupo Endesa",
        website: "https://www.energiaxxi.com",
        description: "Es la comercializadora de referencia de Endesa, la principal en Cataluña, Aragón, Andalucía, Extremadura y Baleares.",
        logo: "/logos/Endesa.png",
    },
    {
        name: "Curenergía",
        group: "Grupo Iberdrola",
        website: "https://www.curenergia.es",
        description: "Comercializadora de referencia del grupo Iberdrola. Líder en la zona de Levante, Madrid, Castilla y León y País Vasco.",
        logo: "/logos/Iberdrola.png",
    },
    {
        name: "Comercializadora Regulada",
        group: "Grupo Naturgy (Gas & Power)",
        website: "https://www.comercializadoraregulada.es",
        description: "La rama regulada de Naturgy, con gran presencia nacional y especialistas en gestión del bono social.",
        logo: "/logos/Naturgy.png",
    },
    {
        name: "Baser Comercializadora",
        group: "Grupo TotalEnergies / EDP",
        website: "https://www.basercor.es",
        description: "Antigua comercializadora de EDP, ahora bajo el paraguas de TotalEnergies. Principal referencia en Asturias y Cantabria.",
        logo: "/logos/TotalEnergies.png",
    },
    {
        name: "Régsiti",
        group: "Grupo Repsol",
        website: "https://www.regsiti.com",
        description: "Nueva denominación de la comercializadora de referencia de Repsol (antigua Viesgo).",
        logo: "/logos/Repsol.png",
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

                    {/* List of Companies */}
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-800 text-text-primary mb-4">Listado de Compañías (2026)</h2>
                            <p className="text-text-secondary">Las comercializadoras autorizadas para ofrecer el PVPC.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {COR_COMPANIES.map((company) => (
                                <div key={company.name} className="group premium-card bg-surface p-8 border border-border hover:border-primary/30 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-surface-2 rounded-2xl border border-border">
                                            <Building2 className="w-8 h-8 text-primary" />
                                        </div>
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-primary transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                    <h3 className="text-2xl font-800 text-text-primary mb-2 group-hover:text-primary transition-colors">
                                        {company.name}
                                    </h3>
                                    <p className="text-sm font-bold text-primary/80 mb-4 uppercase tracking-widest">{company.group}</p>
                                    <p className="text-text-secondary leading-relaxed text-sm">
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
