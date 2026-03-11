"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bolt, User, Lock, Eye, Check, Loader2, ArrowRight, ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            router.push("/admin/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] dark:bg-[#0f1411] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #137fec 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
            </div>

            {/* Back to Landing */}
            <Link 
                href="/" 
                className="fixed top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all hover:-translate-x-1 shadow-sm"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a la web
            </Link>

            <div className="relative z-10 w-full max-w-[450px] flex flex-col items-center">
                {/* Logo Header */}
                <div className="mb-10 text-center space-y-6">
                    <Link href="/" className="inline-flex flex-col items-center group">
                        <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Bolt className="text-primary w-8 h-8 fill-current" />
                        </div>
                        <div className="mt-6 space-y-2">
                            <h1 className="text-3xl font-900 tracking-tighter text-slate-900 dark:text-white uppercase">
                                TuMejorTarifa<span className="text-primary">Luz</span>
                            </h1>
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-px w-8 bg-slate-200 dark:bg-slate-800"></span>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Gestión Central</p>
                                <span className="h-px w-8 bg-slate-200 dark:bg-slate-800"></span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
                    <div className="mb-8">
                        <h2 className="text-xl font-800 text-slate-900 dark:text-white mb-2">Acceso Administrador</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Introduce tus credenciales para continuar.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-xs font-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Usuario o Email</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="nombre@empresa.com"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl pl-12 pr-12 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none"
                                    required
                                />
                                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="w-5 h-5 rounded-md border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary transition-colors flex items-center justify-center">
                                    <input type="checkbox" className="hidden" />
                                    <Check className="w-3 h-3 text-primary hidden" />
                                </div>
                                <span className="font-bold text-slate-500 dark:text-slate-400">Recordarme</span>
                            </label>
                            <Link href="#" className="font-bold text-success hover:underline">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-success hover:bg-success/90 dark:bg-success dark:hover:bg-success/90 text-white font-800 py-5 rounded-2xl shadow-xl shadow-success/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center space-y-6">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-[300px] flex items-center gap-2 justify-center">
                        <ShieldAlert className="w-4 h-4" />
                        Uso exclusivo para administradores autorizados. El acceso no autorizado será monitoreado y reportado.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-900 text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <span>ESPAÑOL</span>
                        <span className="w-[120px] h-[40px] flex items-center justify-center 1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                        <Link href="#" className="hover:text-primary transition-colors">SOPORTE TÉCNICO</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
