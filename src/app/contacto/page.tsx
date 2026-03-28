import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Clock, CheckCircle2 } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-mesh selection:bg-primary/20">
            <Navbar />
            
            <main className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header Section */}
                    <div className="text-center mb-20 space-y-4">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-2">
                            Canales de atención
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tight leading-[0.9]">
                            Estamos aquí para <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ayudarte a ahorrar.</span>
                        </h1>
                        <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
                            Resuelve tus dudas sobre el mercado eléctrico o recibe asesoramiento gratuito sobre tu factura de luz.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
                            <div className="premium-3d-card p-8 bg-surface/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-2xl">
                                <h3 className="text-2xl font-black text-text-primary mb-8">Información Directa</h3>
                                
                                <div className="space-y-8">
                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg shadow-primary/5">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">Escríbenos</p>
                                            <p className="text-lg font-bold text-text-primary">contacto@tumejortarifaluz.es</p>
                                            <p className="text-sm text-text-secondary mt-1">Respondemos en menos de 24h laborables.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-primary shrink-0 group-hover:scale-110 transition-all duration-300">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">Horarios</p>
                                            <p className="text-lg font-bold text-text-primary">Lunes a Viernes</p>
                                            <p className="text-sm text-text-secondary mt-1">Atención personalizada de 09:00 a 19:00.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-primary to-primary-hover rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="w-5 h-5 text-accent" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Servicio Gratuito</span>
                                    </div>
                                    <h4 className="text-xl font-black mb-2">¿Quieres que te llamemos?</h4>
                                    <p className="text-white/80 text-sm mb-6 leading-relaxed">
                                        Uno de nuestros expertos energéticos puede analizar tu factura actual totalmente gratis y sin compromiso.
                                    </p>
                                    <button className="w-full bg-white text-primary font-black py-4 rounded-2xl shadow-lg hover:shadow-white/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
                                        Agendar una llamada
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-7">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

