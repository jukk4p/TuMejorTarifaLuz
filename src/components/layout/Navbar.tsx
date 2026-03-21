"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight, FileUp, Sun, Moon, User, LogOut, Settings, Layout } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";

const COMPANIES = [
    "Endesa", "Iberdrola", "Naturgy", "Repsol", 
    "TotalEnergies", "Octopus", "Niba", "Imagina", 
    "Visalia", "Energía Nufri", "Energya VM", "CHC Energía", "Esluz",
    "COR"
];

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isDrawerOpen]);

    if (!mounted) return <div className="h-20 bg-background sticky top-0 z-50 animate-pulse"></div>;

    const navLinks = [
        { name: "Comparador", href: "/comparador" },
        { name: "Tarifas", href: "/tarifas" },
        { name: "Precio Hoy", href: "/precio-luz-hoy", badge: "EN VIVO" },
        { name: "Blog", href: "/blog" },
    ];

    return (
        <nav 
            className="sticky top-0 z-50 backdrop-blur-md border-b border-border/50 transition-all duration-300"
            style={{ background: 'var(--color-section-white)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="h-6 w-auto active:scale-95 transition-all flex items-center justify-center">
                            <div className="relative h-6 w-6">
                                <Image 
                                    src="/Logo.png" 
                                    alt="TuMejorTarifaLuz" 
                                    fill
                                    className="object-contain" 
                                    priority 
                                />
                            </div>
                        </div>
                        <span className="text-[16px] font-700 tracking-tight text-text-primary hidden sm:inline group-hover:text-primary transition-colors">
                            TuMejorTarifa<span className="text-primary group-hover:text-primary-dark">Luz</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="/comparador" className="text-[14px] font-500 text-text-secondary hover:text-primary transition-colors">Comparador</Link>
                        <Link href="/tarifas" className="text-[14px] font-500 text-text-secondary hover:text-primary transition-colors">Tarifas</Link>
                        
                        {/* Companies Dropdown */}
                        <div className="relative group">
                            <button 
                                className="flex items-center gap-1.5 text-[14px] font-500 text-text-secondary group-hover:text-primary transition-colors h-20"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                Compañías <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            
                            <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[320px] bg-surface border border-border rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPANIES.map((company) => (
                                        <Link 
                                            key={company} 
                                            href={company === "COR" 
                                                ? "/companias/comercializadoras-referencia" 
                                                : `/companias/${
                                                    company === "TotalEnergies" ? "total-energies" :
                                                    company === "Octopus" ? "octopus-energy" :
                                                    company === "Imagina" ? "imagina-energia" :
                                                    company === "Energía Nufri" ? "energia-nufri" :
                                                    company === "Energya VM" ? "energia-vm" :
                                                    company === "CHC Energía" ? "chc-energia" :
                                                    company.toLowerCase().replace(" ", "-")
                                                }`}
                                            className="px-3 py-2 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                                            <span className="truncate">{company}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link 
                            href="/precio-luz-hoy" 
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 hover:bg-accent/15 transition-all group"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/40 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            <span className="text-[11px] font-500 text-accent-bg-text tracking-[0.06em] uppercase">Precio hoy</span>
                        </Link>
                        <Link href="/blog" className="text-[14px] font-500 text-text-secondary hover:text-primary transition-colors">Blog</Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Notifications - Hidden on very small screens */}
                        <div className="hidden sm:flex items-center">
                            <NotificationBell />
                        </div>

                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="hidden lg:flex w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-all"
                                    aria-label="Menú de usuario"
                                    aria-haspopup="true"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} className="text-primary" />
                                    )}
                                </button>
                                {isUserMenuOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsUserMenuOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-2 border-b border-border mb-1">
                                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Usuario</p>
                                                <p className="text-xs font-bold text-text-primary truncate">{user.displayName || user.email?.split('@')[0]}</p>
                                            </div>
                                            <Link 
                                                href="/mi-cuenta" 
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-primary/10 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Layout size={14} className="text-primary" />
                                                Mi Cuenta
                                            </Link>
                                            <button 
                                                onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut size={14} />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link 
                                href="/?auth=login" 
                                className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-[14px] font-500 text-text-secondary hover:text-primary transition-all"
                            >
                                Entrar
                            </Link>
                        )}

                        {/* Separator before CTA */}
                        <div className="hidden sm:block h-8 w-px bg-border mx-2"></div>

                        {/* CTA Button - Hidden on mobile, shown from sm up */}
                        <Link 
                            href="/comparador?mode=upload" 
                            className="hidden sm:flex bg-primary text-white text-[14px] font-600 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full tracking-wide items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-primary/50 whitespace-nowrap"
                        >
                            <FileUp size={14} className="hidden md:block" />
                            Subir factura
                        </Link>

                        {/* Theme Toggle (Optional but nice) */}
                        <div className="hidden sm:block h-8 w-px bg-border mx-2"></div>
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface-2 transition-all lg:flex hidden"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Mobile Menu Button */}
                        <button 
                            className="lg:hidden p-2 text-text-secondary min-h-[48px] min-w-[48px] flex items-center justify-center -mr-2"
                            onClick={() => setIsDrawerOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Mobile Drawer Panel */}
            <div 
                className={`fixed top-0 right-0 h-[100dvh] w-[85%] max-w-[360px] shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all duration-500 ease-out border-l border-border/50 ${isDrawerOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'}`}
                style={{ 
                    zIndex: 9999, 
                    backgroundColor: 'var(--color-section-white)',
                    opacity: 1
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between border-b border-border">
                        <span className="text-lg font-900" style={{ color: 'var(--color-text-heading)' }}>Menú</span>
                        <button 
                            className="p-2 text-text-muted hover:text-text-primary transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                            onClick={() => setIsDrawerOpen(false)}
                            aria-label="Cerrar menú"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Profile for Mobile */}
                    <div className="p-6 border-b border-border bg-surface-2">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-primary" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black truncate" style={{ color: 'var(--color-text-heading)' }}>{user.displayName || user.email?.split('@')[0]}</p>
                                    <p className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
                                </div>
                                <button 
                                    onClick={() => { setIsDrawerOpen(false); logout(); }}
                                    className="p-2 text-text-muted hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link 
                                href="/?auth=login" 
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white text-xs font-900 tracking-widest shadow-lg shadow-primary/20"
                            >
                                <User size={18} /> Entrar en mi cuenta
                            </Link>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-2">
                        {user && (
                            <Link 
                                href="/mi-cuenta" 
                                className="flex items-center justify-between px-4 py-4 rounded-2xl bg-primary/5 text-primary font-bold border border-primary/10 mb-4"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <span className="flex items-center gap-2">
                                    <Layout size={18} /> Mi Panel de Control
                                </span>
                                <ChevronRight size={18} />
                            </Link>
                        )}
                        <Link 
                            href="/comparador" 
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-surface-2 font-500 hover:bg-primary/10 transition-all border border-transparent hover:border-primary/30"
                            style={{ color: 'var(--color-text-body)', fontSize: '14px' }}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Comparador <ChevronRight size={18} className="text-primary" />
                        </Link>

                        {/* Mobile Accordion - Companies */}
                        <div className="space-y-2">
                            <button 
                                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl font-500 transition-all border ${isCompaniesOpen ? 'bg-primary/10 border-primary/30' : 'bg-surface-2 border-transparent'}`}
                                style={{ color: 'var(--color-text-body)', fontSize: '14px' }}
                                onClick={() => setIsCompaniesOpen(!isCompaniesOpen)}
                            >
                                Compañías <ChevronDown size={18} className={`text-primary transition-transform duration-300 ${isCompaniesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isCompaniesOpen && (
                                <div className="grid grid-cols-1 gap-1 pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {COMPANIES.map((company) => (
                                        <Link 
                                            key={company} 
                                            href={company === "COR" 
                                                ? "/companias/comercializadoras-referencia" 
                                                : `/companias/${
                                                    company === "TotalEnergies" ? "total-energies" :
                                                    company === "Octopus" ? "octopus-energy" :
                                                    company === "Imagina" ? "imagina-energia" :
                                                    company === "Energía Nufri" ? "energia-nufri" :
                                                    company === "Energya VM" ? "energia-vm" :
                                                    company === "CHC Energía" ? "chc-energia" :
                                                    company.toLowerCase().replace(" ", "-")
                                                }`}
                                            className="px-4 py-3 text-sm font-bold text-text-muted hover:text-primary transition-colors flex items-center gap-2"
                                            onClick={() => setIsDrawerOpen(false)}
                                        >
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                            {company}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link 
                            href="/tarifas" 
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-surface-2 text-text-primary text-[14px] font-500 hover:bg-primary/10 transition-all border border-transparent hover:border-primary/30"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Tarifas <ChevronRight size={18} className="text-primary" />
                        </Link>

                        <Link 
                            href="/precio-luz-hoy" 
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-surface-2 text-text-primary text-[14px] font-500 hover:bg-primary/10 transition-all border border-transparent hover:border-primary/30"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <span className="flex items-center gap-2">
                                Precio Hoy
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/10 text-[11px] font-500 text-accent-bg-text border border-accent/30 tracking-[0.06em] uppercase">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                                    En vivo
                                </span>
                            </span>
                            <ChevronRight size={18} className="text-primary" />
                        </Link>

                        <Link 
                            href="/blog" 
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-surface-2 text-text-primary text-[14px] font-500 hover:bg-primary/10 transition-all border border-transparent hover:border-primary/30"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Blog <ChevronRight size={18} className="text-primary" />
                        </Link>
                    </div>

                    {/* Footer / Copyright */}
                    <div className="p-8 border-t border-border text-center">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="w-full py-4 rounded-2xl bg-surface text-text-secondary font-bold mb-6 flex items-center justify-center gap-3 border border-border"
                        >
                            {theme === "dark" ? <><Sun size={20} /> Cambiar Modo Claro</> : <><Moon size={20} /> Cambiar Modo Oscuro</>}
                        </button>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">tumejortarifaluz eS</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
