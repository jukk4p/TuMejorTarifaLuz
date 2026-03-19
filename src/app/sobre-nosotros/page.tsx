import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Rocket, Eye, ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { Metadata } from 'next';
import FundadorSection from '@/components/sobre-nosotros/FundadorSection';
import FundadorAnimado from '@/components/sobre-nosotros/FundadorAnimado';

export const metadata: Metadata = {
    title: 'Sobre Nosotros | Iván González, Fundador',
    description: 'TuMejorTarifaLuz es un proyecto independiente creado por Iván González en 2025. Sin comisiones ni llamadas comerciales. Solo tecnología y datos reales para ayudarte a ahorrar en tu factura de luz.',
    alternates: {
        canonical: 'https://tumejortarifaluz.es/sobre-nosotros'
    },
    openGraph: {
        title: 'Iván González — Fundador de TuMejorTarifaLuz',
        description: 'El proyecto independiente que democratiza el ahorro energético en España. Sin acuerdos con eléctricas, sin comisiones.',
        url: 'https://tumejortarifaluz.es/sobre-nosotros',
        type: 'profile',
    }
};

const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": "https://tumejortarifaluz.es/sobre-nosotros#founder",
            "name": "Iván González",
            "jobTitle": "Desarrollador y Fundador",
            "description": "Desarrollador independiente y fundador de TuMejorTarifaLuz. Más de dos años analizando facturas de luz para encontrar ahorros reales para familias españolas.",
            "worksFor": {
                "@type": "Organization",
                "name": "TuMejorTarifaLuz",
                "url": "https://tumejortarifaluz.es"
            },
            "url": "https://tumejortarifaluz.es/sobre-nosotros",
            "knowsAbout": [
                "Tarifas eléctricas España",
                "Mercado mayorista OMIE",
                "Optimización de facturas de luz",
                "Discriminación horaria PVPC"
            ]
        },
        {
            "@type": "Organization",
            "@id": "https://tumejortarifaluz.es/#organization",
            "name": "TuMejorTarifaLuz",
            "foundingDate": "2025",
            "founder": {
                "@id": "https://tumejortarifaluz.es/sobre-nosotros#founder"
            },
            "description": "Comparador independiente de tarifas de luz en España. Sin comisiones ni acuerdos comerciales.",
            "url": "https://tumejortarifaluz.es",
            "logo": "https://tumejortarifaluz.es/Logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "hola@tumejortarifaluz.es",
                "contactType": "customer support"
            }
        }
    ]
};

export default function SobreNosotros() {
    return (
        <>
            <JsonLd data={aboutSchema} />
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            Nuestra Historia
                        </div>
                        <h1 className="text-4xl md:text-6xl font-900 text-text-primary leading-tight tracking-tight">
                            Democratizando el <span className="text-primary italic">ahorro energético</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed">
                            Nacimos de una frustración compartida: la complejidad innecesaria de las facturas de luz. Nuestra misión es darte el poder de decidir con datos reales.
                        </p>
                    </div>

                    {/* Mission & Vision cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        <div className="premium-card p-10 bg-surface border border-border space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                                <Lightbulb className="w-24 h-24 stroke-[1.5]" />
                            </div>
                            <h2 className="text-2xl font-800 text-text-primary flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Rocket className="w-4 h-4 text-primary" />
                                </span>
                                Nuestra Misión
                            </h2>
                            <p className="text-text-secondary leading-relaxed text-lg text-pretty">
                                Facilitar una herramienta 100% gratuita, independiente y basada en tecnología propia que analice el consumo real de cada familia española para encontrar la tarifa de luz más baja del mercado sin sesgos comerciales.
                            </p>
                        </div>

                        <div className="premium-card p-10 bg-surface border border-border space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                                <Eye className="w-24 h-24 stroke-[1.5]" />
                            </div>
                            <h2 className="text-2xl font-800 text-text-primary flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-accent-bg flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-accent-bg-text" />
                                </span>
                                Nuestra Visión
                            </h2>
                            <p className="text-text-secondary leading-relaxed text-lg text-pretty">
                                Convertirnos en el estándar de transparencia en el mercado energético español, donde cada usuario comprenda su consumo y pague el precio justo, impulsando un consumo más consciente y eficiente.
                            </p>
                        </div>
                    </div>

                    {/* The Story Section - SSR pure content */}
                    <FundadorSection />

                    {/* Interactivity Section - isolated and optimized */}
                    <div className="max-w-4xl mx-auto -mt-12 mb-24">
                       <FundadorAnimado />
                    </div>

                    {/* Stats or Call to action */}
                    <div className="text-center space-y-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {[
                                { number: "25+", label: "Tarifas Activas" },
                                { number: "14+", label: "Compañías" },
                                { number: "312€", label: "Ahorro Medio" },
                                { number: "100%", label: "Gratis" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-4xl font-900 text-primary">{stat.number}</p>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                            <Link href="/comparador" className="inline-flex items-center justify-center px-12 py-6 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-xl group">
                                Analizar mi factura gratis
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
