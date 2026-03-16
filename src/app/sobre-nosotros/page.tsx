import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Rocket, Eye, PhoneOff, CreditCard, Lock, Zap, BadgeCheck, ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = {
    title: 'Sobre Nosotros | Iván González, Fundador de TuMejorTarifaLuz',
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
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            Nuestra Historia
                        </div>
                        <h1 className="text-4xl md:text-6xl font-900 text-slate-900 dark:text-white leading-tight tracking-tight">
                            Democratizando el <span className="text-primary italic">ahorro energético</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            Nacimos de una frustración compartida: la complejidad innecesaria de las facturas de luz. Nuestra misión es darte el poder de decidir con datos reales.
                        </p>
                    </div>

                    {/* Mission & Vision cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        <div className="premium-card p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                                <Lightbulb className="w-24 h-24 stroke-[1.5]" />
                            </div>
                            <h2 className="text-2xl font-800 text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Rocket className="w-4 h-4 text-primary" />
                                </span>
                                Nuestra Misión
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                Facilitar una herramienta 100% gratuita, independiente y basada en tecnología propia que analice el consumo real de cada familia española para encontrar la tarifa de luz más baja del mercado sin sesgos comerciales.
                            </p>
                        </div>

                        <div className="premium-card p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                                <Eye className="w-24 h-24 stroke-[1.5]" />
                            </div>
                            <h2 className="text-2xl font-800 text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-success" />
                                </span>
                                Nuestra Visión
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                Convertirnos en el estándar de transparencia en el mercado energético español, donde cada usuario comprenda su consumo y pague el precio justo, impulsando un consumo más consciente y eficiente.
                            </p>
                        </div>
                    </div>

                    {/* The Story Section */}
                    <div className="grid lg:grid-cols-12 gap-12 items-start py-20 px-8 md:px-12 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 mb-24 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                        <div className="lg:col-span-12 space-y-8 relative z-10">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="space-y-4 text-center mb-12">
                                    <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-xs">El Fundador</h2>
                                    <p className="text-4xl md:text-5xl font-900 text-slate-900 dark:text-white tracking-tight">
                                        Iván González
                                    </p>
                                    <p className="text-lg text-slate-500 font-700">Desarrollador y fundador de TuMejorTarifaLuz</p>
                                </div>

                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none space-y-8">
                                    <blockquote className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed italic border-l-8 border-primary pl-8 py-6 bg-primary/5 rounded-r-3xl my-10 font-medium">
                                        "Durante más de dos años estuve analizando y optimizando las facturas de luz de mis familiares y amigos. Lo que empezó como un favor puntual se convirtió en una rutina: alguien me mandaba su factura, yo la cruzaba con el mercado, y casi siempre encontraba un ahorro significativo que nadie les había contado."
                                    </blockquote>

                                    <div className="grid md:grid-cols-2 gap-12 pt-6">
                                        <div className="space-y-6">
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                                Me di cuenta de que el problema no era la gente, era la <strong>opacidad del sistema</strong>. Los comparadores existentes o te pedían el teléfono para que te llamara un comercial, o solo mostraban las compañías con las que tenían acuerdo. Nadie te daba una respuesta limpia y sin intereses.
                                            </p>

                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                                Cuando me di de alta como <strong>autónomo en 2025</strong>, tenía claro lo que quería construir: el comparador que ya llevaba meses desarrollando de forma personal, pero ahora terminado y abierto a cualquiera.
                                            </p>
                                        </div>
                                        <div className="space-y-6">
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                                TuMejorTarifaLuz nació en 2025 como proyecto personal de Iván González, desarrollador que durante más de dos años analizó facturas de luz de forma manual para familiares y amigos.
                                            </p>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                                Hoy, el comparador analiza más de 150 tarifas activas de más de 20 compañías, actualizado diariamente con datos de OMIE y las comercializadoras. Todo esto sin pedir el teléfono, sin vender datos y sin cobrar un euro al usuario.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-6 pt-12">
                                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors">
                                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                                <PhoneOff className="text-primary w-8 h-8" />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Sin Llamadas</p>
                                            <p className="text-xs text-slate-500 mt-2">Nunca te pediremos tu teléfono</p>
                                        </div>
                                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors">
                                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                                <CreditCard className="text-primary w-8 h-8" />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Sin Comisiones</p>
                                            <p className="text-xs text-slate-500 mt-2">100% gratuito para el usuario</p>
                                        </div>
                                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors">
                                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                                <Lock className="text-primary w-8 h-8" />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Privacidad Total</p>
                                            <p className="text-xs text-slate-500 mt-2">Tus datos nunca serán vendidos</p>
                                        </div>
                                    </div>

                                    <div className="pt-16 border-t border-slate-100 dark:border-slate-800">
                                        <div className="grid md:grid-cols-2 gap-12 items-center">
                                            <div className="space-y-4">
                                                <h3 className="text-2xl font-900 text-slate-900 dark:text-white">Transparencia Real</h3>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                                    Nuestro comparador no tiene acuerdos comerciales con ninguna comercializadora. Si decides cambiarte, lo haces por tu cuenta a través de los enlaces oficiales que te facilitamos. Sin trampa ni cartón.
                                                </p>
                                            </div>
                                            <div className="bg-slate-900 rounded-[2rem] p-8 flex items-center justify-around text-center">
                                                <div className="space-y-1">
                                                    <p className="text-white font-900 text-3xl">2025</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fundación</p>
                                                </div>
                                                <div className="w-px h-12 bg-white/10"></div>
                                                <div className="space-y-1">
                                                    <p className="text-primary font-900 text-3xl">100%</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Independiente</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats or Call to action */}
                    <div className="text-center space-y-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {[
                                { number: "150+", label: "Tarifas Activas" },
                                { number: "20+", label: "Compañías" },
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
