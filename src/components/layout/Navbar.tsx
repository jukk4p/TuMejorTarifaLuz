"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { Suspense } from "react";
import { Sun, Moon, User, LogOut, LogIn, Menu, X, ChevronRight } from "lucide-react";

const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false });
import NotificationBell from "./NotificationBell";

function NavbarContent() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const authParam = searchParams.get('auth');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (authParam === 'login' || authParam === 'register') {
            setIsAuthModalOpen(true);
        }
    }, [authParam]);

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
        // Clear auth param from URL if it exists
        if (authParam) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('auth');
            router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
        }
    };

    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-12 h-12 active:scale-95 transition-transform flex items-center justify-center overflow-hidden">
                                <Image src="/Logo.png" alt="TuMejorTarifaLuz" width={48} height={48} className="object-contain" priority />
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
            <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#0A0D14]/80 backdrop-blur-xl border-b border-primary/5 dark:border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-12 h-12 active:scale-95 transition-transform flex items-center justify-center overflow-hidden">
                                <Image src="/Logo.png" alt="TuMejorTarifaLuz" width={48} height={48} className="object-contain group-hover:scale-110 transition-transform duration-500" priority />
                            </div>
                            <span className="text-xl font-800 tracking-tight text-slate-900 dark:text-white hidden sm:inline">
                                TuMejorTarifa<span className="text-primary">Luz</span>
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-8">
                            <Link href="/comparador" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Comparador</Link>
                            <Link href="/companias" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Compañías</Link>
                            <Link href="/blog" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Guías</Link>
                            <Link href="/sobre-nosotros" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Nosotros</Link>
                            <Link href="/#faq" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">FAQ</Link>

                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                            <NotificationBell />

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="relative h-10 w-18 rounded-full bg-slate-100/50 dark:bg-slate-800/40 p-1 flex items-center justify-between border border-slate-200 dark:border-white/10 transition-all hover:border-primary/40 shadow-inner group/toggle"
                                aria-label="Toggle theme"
                                role="switch"
                                aria-checked={theme === 'dark'}
                            >
                                <div className={`absolute h-8 w-8 rounded-full bg-white dark:bg-primary shadow-md transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${theme === 'dark' ? 'translate-x-[32px]' : 'translate-x-0'} group-hover/toggle:scale-105`} />
                                <span className={`z-10 w-8 flex items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'text-slate-500' : 'text-amber-500'}`}>
                                    <Sun size={15} strokeWidth={2.5} />
                                </span>
                                <span className={`z-10 w-8 flex items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>
                                    <Moon size={15} strokeWidth={2.5} />
                                </span>
                            </button>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/mi-cuenta"
                                        className="flex items-center gap-2 group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                            {user.photoURL ? (
                                                <Image 
                                                    src={user.photoURL} 
                                                    alt={user.displayName || "User"} 
                                                    width={36} 
                                                    height={36} 
                                                    className="w-full h-full object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                            <User size={16} className="text-primary" />
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
                                        <LogOut size={18} />
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
                        <div className="lg:hidden flex items-center gap-1 sm:gap-2">
                            <NotificationBell />
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="relative h-9 w-16 rounded-full bg-slate-100 dark:bg-slate-800/50 p-1 flex items-center justify-between border border-slate-200 dark:border-slate-700 transition-all shadow-inner shrink-0"
                                aria-label="Toggle theme"
                            >
                                <div className={`absolute h-7 w-7 rounded-full bg-white dark:bg-primary shadow transform transition-all duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-[28px]' : 'translate-x-0'}`} />
                                <span className={`z-10 w-7 flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'text-slate-500' : 'text-amber-500'}`}>
                                    <Sun size={14} />
                                </span>
                                <span className={`z-10 w-7 flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>
                                    <Moon size={14} />
                                </span>
                            </button>

                            {user ? (
                                <Link
                                    href="/mi-cuenta"
                                    className="w-9 h-9 flex items-center justify-center shrink-0"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                        {user.photoURL ? (
                                            <Image 
                                                src={user.photoURL} 
                                                alt={user.displayName || "User"} 
                                                width={32} 
                                                height={32} 
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <User size={12} className="text-primary" />
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shrink-0"
                                >
                                    <LogIn size={20} />
                                </button>
                            )}

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shrink-0"
                                aria-label={isMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute top-20 left-0 right-0 bg-white dark:bg-[#0D1117] border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top duration-300 shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)]">
                        <div className="px-6 py-10 space-y-8">
                            <nav className="space-y-4">
                                <Link href="/comparador" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                                    <span className="text-xl font-800 text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">Comparador Inteligente</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-primary" />
                                    </div>
                                </Link>
                                <Link href="/companias" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                                    <span className="text-xl font-800 text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">Comercializadoras</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-primary" />
                                    </div>
                                </Link>
                                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                                    <span className="text-xl font-800 text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">Guías de Ahorro</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-primary" />
                                    </div>
                                </Link>
                                <Link href="/#faq" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                                    <span className="text-xl font-800 text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">Preguntas Frecuentes</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-primary" />
                                    </div>
                                </Link>
                            </nav>
                            
                            <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                {user ? (
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-center active:scale-95 transition-transform"
                                    >
                                        Cerrar Sesión
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                                        className="w-full py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-900 text-center uppercase tracking-widest shadow-2xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all"
                                    >
                                        Iniciar Sesión
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={handleCloseAuthModal}
                initialMode={authParam === 'register' ? 'register' : 'login'}
            />
        </>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<nav className="sticky top-0 z-50 h-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 transition-colors duration-300"></nav>}>
            <NavbarContent />
        </Suspense>
    );
}
