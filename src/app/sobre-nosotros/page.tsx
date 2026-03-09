import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Sobre Nosotros | Nuestra Misión para tu Ahorro Energético",
    description: "Conoce al equipo detrás de TuMejorTarifaLuz y nuestra misión de democratizar el acceso a las mejores tarifas de luz en España.",
};

export default function SobreNosotros() {
    return (
        <>
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
                                <span className="material-icons text-8xl">lightbulb</span>
                            </div>
                            <h2 className="text-2xl font-800 text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="material-icons text-primary text-sm">rocket_launch</span>
                                </span>
                                Nuestra Misión
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                Facilitar una herramienta 100% gratuita, independiente y basada en inteligencia artificial que analice el consumo real de cada familia española para encontrar la tarifa de luz más baja del mercado sin sesgos comerciales.
                            </p>
                        </div>

                        <div className="premium-card p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                                <span className="material-icons text-8xl">visibility</span>
                            </div>
                            <h2 className="text-2xl font-800 text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                                    <span className="material-icons text-success text-sm">visibility</span>
                                </span>
                                Nuestra Visión
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                Convertirnos en el estándar de transparencia en el mercado energético español, donde cada usuario comprenda su consumo y pague el precio justo, impulsando un consumo más consciente y eficiente.
                            </p>
                        </div>
                    </div>

                    {/* The Team / The Name */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center py-16 px-8 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 mb-24 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-800 text-slate-900 dark:text-white tracking-tight">
                                    Independencia Real <br />
                                    <span className="text-primary">Sin Comisiones</span>
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Soy <strong>JukkaP</strong>, el desarrollador detrás de este proyecto. Mi objetivo con TuMejorTarifaLuz es ofrecer una alternativa libre a los comparadores tradicionales que suelen estar vinculados a acuerdos comerciales con grandes eléctricas.
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Aquí no hay llamadas comerciales, ni venta de datos. Solo código, algoritmos y el deseo de ayudar a otros a navegar por el complejo mercado mayorista de la luz.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                                    <span className="material-icons text-primary text-lg">shield_check</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">100% Privado</span>
                                </div>
                                <div className="px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                                    <span className="material-icons text-primary text-lg">verified</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Algoritmo Verificado</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-[80px] group-hover:bg-primary/30 transition-all"></div>
                            <div className="relative premium-card overflow-hidden bg-slate-900 aspect-square flex items-center justify-center p-12 border-8 border-white dark:border-slate-800 shadow-3xl">
                                <div className="text-center space-y-6">
                                    <div className="w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 relative">
                                        <span className="material-icons text-white text-6xl">electric_bolt</span>
                                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-4 border-primary">
                                            <span className="material-icons text-primary text-xl">favorite</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-900 text-white italic">Tu Mejor Tarifa Luz</h3>
                                        <p className="text-primary font-bold uppercase tracking-widest text-xs mt-2">Tecnología con propósito</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats or Call to action */}
                    <div className="text-center space-y-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {[
                                { number: "+20", label: "Compañías" },
                                { number: "150+", label: "Tarifas Activas" },
                                { number: "30sec", label: "Análisis Rápido" },
                                { number: "0€", label: "Coste Usuario" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-4xl font-900 text-primary">{stat.number}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                            <Link href="/comparador" className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-lg">
                                Prueba nuestra tecnología ahora
                                <span className="material-icons ml-3">east</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
