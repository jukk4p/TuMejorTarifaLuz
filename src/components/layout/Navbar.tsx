"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false });

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 active:scale-95 transition-transform flex items-center justify-center">
                                <img src="/Logo.png" alt="TuMejorTarifaLuz" className="h-full w-auto object-contain" />
                            </div>
                            <span className="text-xl font-800 tracking-tight text-slate-900 dark:text-white">
                                TuMejorTarifa<span className="text-primary">Luz</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 active:scale-95 transition-transform flex items-center justify-center">
                                <img src="/Logo.png" alt="TuMejorTarifaLuz" className="h-full w-auto object-contain" />
                            </div>
                            <span className="text-xl font-800 tracking-tight text-slate-900 dark:text-white">
                                TuMejorTarifa<span className="text-primary">Luz</span>
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-8">
                            <Link href="/comparador" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Comparador</Link>
                            <Link href="/companias" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Compañías</Link>
                            <Link href="/#guias" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Guias</Link>

                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="relative h-9 w-16 rounded-full bg-slate-100 dark:bg-slate-800/50 p-1 flex items-center justify-between border border-slate-200 dark:border-slate-700 transition-all hover:border-primary/30 shadow-inner"
                                aria-label="Toggle theme"
                            >
                                <div className={`absolute h-7 w-7 rounded-full bg-white dark:bg-primary shadow-lg transform transition-all duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`} />
                                <span className={`material-icons text-[14px] z-10 w-7 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-500' : 'text-amber-500'}`}>light_mode</span>
                                <span className={`material-icons text-[14px] z-10 w-7 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>dark_mode</span>
                            </button>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/mi-cuenta"
                                        className="flex items-center gap-2 group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-icons text-primary text-sm">person</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Mi Perfil</span>
                                            <span className="text-sm font-800 text-slate-900 dark:text-white truncate max-w-[120px]">
                                                {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                                            </span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => logout()}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Cerrar Sesión"
                                    >
                                        <span className="material-icons text-lg">logout</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="inline-flex items-center px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-900 uppercase tracking-widest shadow-xl shadow-slate-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
                                >
                                    Entrar
                                </button>
                            )}
                        </div>

                        {/* Mobile controls */}
                        <div className="lg:hidden flex items-center gap-3">
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="relative h-8 w-14 rounded-full bg-slate-100 dark:bg-slate-800/50 p-1 flex items-center justify-between border border-slate-200 dark:border-slate-700 transition-all shadow-inner"
                                aria-label="Toggle theme"
                            >
                                <div className={`absolute h-6 w-6 rounded-full bg-white dark:bg-primary shadow transform transition-all duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                                <span className={`material-icons text-[12px] z-10 w-6 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-500' : 'text-amber-500'}`}>light_mode</span>
                                <span className={`material-icons text-[12px] z-10 w-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>dark_mode</span>
                            </button>

                            {user ? (
                                <Link
                                    href="/mi-cuenta"
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-icons text-primary text-xs">person</span>
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                                >
                                    <span className="material-icons text-xl">login</span>
                                </button>
                            )}

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                                aria-label={isMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
                            >
                                <span className="material-icons text-xl">{isMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top duration-300">
                        <div className="px-4 py-8 space-y-6">
                            <Link href="/comparador" className="block text-lg font-800 text-slate-900 dark:text-white hover:text-primary transition-colors">Comparador Inteligente</Link>
                            <Link href="/companias" className="block text-lg font-800 text-slate-900 dark:text-white hover:text-primary transition-colors">Comercializadoras</Link>
                            <Link href="/#guias" className="block text-lg font-800 text-slate-900 dark:text-white hover:text-primary transition-colors">Guias de Ahorro</Link>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                {user ? (
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold text-center"
                                    >
                                        Cerrar Sesión Correo
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                                        className="w-full p-4 rounded-2xl bg-primary text-white font-900 text-center uppercase tracking-widest shadow-xl shadow-primary/20"
                                    >
                                        Iniciar Sesión
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
