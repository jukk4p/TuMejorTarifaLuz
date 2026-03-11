import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Send } from "lucide-react";

export default function ContactoPage() {
    return (
        <>
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">¿Hablamos?</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Estamos aquí para ayudarte a entender tu factura o resolver cualquier duda sobre nuestro comparador.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                    <form className="relative z-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300">Nombre completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Ej. Laura García"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="laura@ejemplo.com"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-bold text-slate-700 dark:text-slate-300">Motivo de la consulta</label>
                            <select
                                id="subject"
                                name="subject"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all text-slate-700 dark:text-slate-200"
                            >
                                <option value="duda_factura">Duda sobre mi factura</option>
                                <option value="duda_comparador">Problema con el comparador</option>
                                <option value="sugerencia">Sugerencia de mejora</option>
                                <option value="otro">Otro motivo</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-bold text-slate-700 dark:text-slate-300">Mensaje</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                placeholder="¿En qué te podemos ayudar?"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all resize-y placeholder:text-slate-400"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                            Enviar Mensaje
                        </button>
                        <p className="text-center text-[10px] text-slate-500 max-w-md mx-auto">
                            Al hacer clic en enviar, aceptas nuestra Política de Privacidad. Protegemos tus datos con cifrado SSL.
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}
