import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Send, Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle2 } from "lucide-react";

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
                                            <p className="text-lg font-bold text-text-primary">hola@tumejortarifaluz.es</p>
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
                            <div className="glass-card premium-card p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-primary/50"></div>
                                
                                <form className="relative z-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label htmlFor="name" className="text-xs font-black text-text-primary uppercase tracking-widest">Nombre Completo</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Ej. Laura García"
                                                className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all placeholder:text-text-subtle font-medium outline-none"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label htmlFor="email" className="text-xs font-black text-text-primary uppercase tracking-widest">Email Corporativo</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="laura@ejemplo.com"
                                                className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all placeholder:text-text-subtle font-medium outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="subject" className="text-xs font-black text-text-primary uppercase tracking-widest">Motivo de la consulta</label>
                                        <div className="relative">
                                            <select
                                                id="subject"
                                                name="subject"
                                                className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all text-text-primary font-medium appearance-none outline-none"
                                            >
                                                <option value="duda_factura">Analizar mi factura actual (Gratis)</option>
                                                <option value="duda_comparador">Problema con el comparador</option>
                                                <option value="sugerencia">Sugerencia de mejora</option>
                                                <option value="otro">Otro motivo</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="message" className="text-xs font-black text-text-primary uppercase tracking-widest">Mensaje o Comentarios</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            required
                                            placeholder="Cuéntanos brevemente en qué podemos ayudarte..."
                                            className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all resize-none placeholder:text-text-subtle font-medium outline-none"
                                        ></textarea>
                                    </div>

                                    <div className="space-y-6 pt-4">
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center items-center gap-3 bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
                                        >
                                            <Send className="w-5 h-5" />
                                            Enviar mensaje ahora
                                        </button>
                                        
                                        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border">
                                            <div className="w-5 h-5 shrink-0 text-accent mt-0.5">
                                                <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                                            </div>
                                            <p className="text-[11px] text-text-muted leading-relaxed">
                                                Tus datos están protegidos por cifrado SSL de 256 bits. Al enviar el formulario, confirmas que has leído y aceptas nuestra <a href="/legal/privacidad" className="text-primary font-bold hover:underline">Política de Privacidad</a>.
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
