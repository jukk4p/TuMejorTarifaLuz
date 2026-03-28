"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactForm } from "./actions";

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };

        try {
            const result = await submitContactForm(data);
            if (result.success) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
                setMessage(result.error || "Ocurrió un error.");
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage("Error de conexión al servidor.");
        }
    };

    if (status === 'success') {
        return (
            <div className="glass-card premium-card p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-text-primary">¡Mensaje enviado!</h3>
                <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
                    Muchas gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá en menos de 24 horas.
                </p>
                <button 
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover shadow-lg transition-all"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card premium-card p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/50"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label htmlFor="name" className="text-xs font-black text-text-primary uppercase tracking-widest pl-1">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Ej. Laura García"
                            className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all placeholder:text-text-subtle font-medium outline-none text-text-primary"
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="email" className="text-xs font-black text-text-primary uppercase tracking-widest pl-1">Email de contacto</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="laura@ejemplo.com"
                            className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all placeholder:text-text-subtle font-medium outline-none text-text-primary"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="subject" className="text-xs font-black text-text-primary uppercase tracking-widest pl-1">Motivo de la consulta</label>
                    <div className="relative">
                        <select
                            id="subject"
                            name="subject"
                            required
                            className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all text-text-primary font-medium appearance-none outline-none"
                        >
                            <option value="Analizar mi factura actual (Gratis)">Analizar mi factura actual (Gratis)</option>
                            <option value="Problema con el comparador">Problema con el comparador</option>
                            <option value="Sugerencia de mejora">Sugerencia de mejora</option>
                            <option value="Otro motivo">Otro motivo</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="message" className="text-xs font-black text-text-primary uppercase tracking-widest pl-1">Mensaje o Comentarios</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Cuéntanos brevemente en qué podemos ayudarte..."
                        className="w-full bg-surface-2 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 transition-all resize-none placeholder:text-text-subtle font-medium outline-none text-text-primary"
                    ></textarea>
                </div>

                {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {message}
                    </div>
                )}

                <div className="space-y-6 pt-4">
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full flex justify-center items-center gap-3 bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:grayscale disabled:translate-y-0`}
                    >
                        {status === 'loading' ? (
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Enviar mensaje ahora
                            </>
                        )}
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
    );
}
