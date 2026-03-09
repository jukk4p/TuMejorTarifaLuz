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

                    {/* The Story Section */}
                    <div className="grid lg:grid-cols-12 gap-12 items-start py-20 px-8 md:px-12 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 mb-24 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                        <div className="lg:col-span-7 space-y-8 relative z-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-xs">El Fundador</h2>
                                    <p className="text-2xl md:text-3xl font-900 text-slate-900 dark:text-white tracking-tight">
                                        Iván González — <span className="text-slate-400 font-700">Desarrollador y fundador de TuMejorTarifaLuz</span>
                                    </p>
                                </div>

                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none space-y-6">
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2 bg-primary/5 rounded-r-xl">
                                        "Durante más de dos años estuve analizando y optimizando las facturas de luz de mis familiares y amigos. Lo que empezó como un favor puntual se convirtió en una rutina: alguien me mandaba su factura, yo la cruzaba con el mercado, y casi siempre encontraba un ahorro significativo que nadie les había contado."
                                    </p>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Me di cuenta de que el problema no era la gente, era la <strong>opacidad del sistema</strong>. Los comparadores existentes o te pedían el teléfono para que te llamara un comercial, o solo mostraban las compañías con las que tenían acuerdo. Nadie te daba una respuesta limpia y sin intereses.
                                    </p>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Cuando me di de alta como <strong>autónomo en 2025</strong>, tenía claro lo que quería construir: el comparador que ya llevaba meses desarrollando de forma personal, pero ahora terminado y abierto a cualquiera.
                                    </p>

                                    <div className="grid sm:grid-cols-3 gap-4 pt-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                            <span className="material-icons text-primary mb-2">call_off</span>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sin Llamadas</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                            <span className="material-icons text-primary mb-2">payments</span>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sin Comisiones</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                            <span className="material-icons text-primary mb-2">lock</span>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Privacidad Total</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg pt-4">
                                        Solo el análisis que siempre le había hecho a mis cercanos, ahora disponible para cualquier familia española.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative group mt-8 lg:mt-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-[60px] group-hover:bg-primary/30 transition-all"></div>
                            <div className="relative premium-card overflow-hidden bg-slate-950 aspect-[4/5] flex items-center justify-center p-8 md:p-12 border-4 border-white dark:border-slate-800 shadow-3xl rounded-[2.5rem]">
                                <div className="text-center space-y-8 w-full">
                                    <div className="w-24 h-24 mx-auto bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 relative rotate-3 group-hover:rotate-6 transition-transform">
                                        <span className="material-icons text-white text-4xl">electric_bolt</span>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-4 border-primary">
                                            <span className="material-icons text-primary text-base">verified</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-900 text-white tracking-tight">Tu Mejor Tarifa Luz</h3>
                                        <div className="h-1 w-12 bg-primary mx-auto rounded-full"></div>
                                        <p className="text-slate-400 text-sm leading-relaxed px-4">
                                            Un proyecto nacido de la honestidad y la necesidad de transparencia en el mercado eléctrico.
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-6">
                                        <div className="text-center">
                                            <p className="text-white font-900 text-xl">2025</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Lanzamiento</p>
                                        </div>
                                        <div className="w-px h-8 bg-white/10"></div>
                                        <div className="text-center">
                                            <p className="text-primary font-900 text-xl">100%</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Independiente</p>
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
