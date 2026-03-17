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

    if (!mounted) return <div className="h-20 bg-[#f6f7f8] dark:bg-[#101922] sticky top-0 z-50 animate-pulse"></div>;

    const navLinks = [
        { name: "Comparador", href: "/comparador" },
        { name: "Tarifas", href: "/tarifas" },
        { name: "Precio Hoy", href: "/precio-luz-hoy", badge: "EN VIVO" },
        { name: "Blog", href: "/blog" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#f6f7f8] dark:bg-[#101922] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="w-10 h-10 active:scale-95 transition-all flex items-center justify-center">
                            <Image src="/Logo.png" alt="TuMejorTarifaLuz" width={38} height={38} className="object-contain" priority />
                        </div>
                        <span className="text-xl font-800 tracking-tight text-slate-900 dark:text-white hidden sm:inline">
                            TuMejorTarifa<span className="text-primary">Luz</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="/comparador" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#137fec] transition-colors">Comparador</Link>
                        <Link href="/tarifas" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#137fec] transition-colors">Tarifas</Link>
                        
                        {/* Companies Dropdown */}
                        <div className="relative group">
                            <button 
                                className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#137fec] transition-colors h-20"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                Compañías <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            
                            <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[320px] bg-[#1a2632] border border-slate-800 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
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
                                            className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-[#137fec]/20 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <div className="w-1 h-1 bg-[#137fec] rounded-full"></div>
                                            <span className="truncate">{company}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link 
                            href="/precio-luz-hoy" 
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 hover:bg-emerald-500/15 transition-all group"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">Precio hoy</span>
                        </Link>
                        <Link href="/blog" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#137fec] transition-colors">Blog</Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Theme Toggle (Optional but nice) */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-slate-500 hover:text-[#137fec] transition-colors lg:block hidden"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <div className="flex items-center">
                            <NotificationBell />
                        </div>

                        {/* User Profile Action */}
                        {user ? (
                            <Link 
                                href="/mi-cuenta"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-all"
                                aria-label="Mi Cuenta"
                            >
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={16} className="text-primary" />
                                )}
                            </Link>
                        ) : (
                            <Link 
                                href="/?auth=login" 
                                className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-all"
                            >
                                <User size={18} /> Entrar
                            </Link>
                        )}

                        {/* Separator before CTA */}
                        <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                        {/* CTA Button */}
                        <Link 
                            href="/comparador?mode=upload" 
                            className="bg-[#137fec] text-white text-[10px] sm:text-xs font-900 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full tracking-wide flex items-center gap-2 shadow-lg shadow-[#137fec]/20 hover:shadow-[#137fec]/35 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-[#137fec]/50 whitespace-nowrap"
                        >
                            <FileUp size={14} className="hidden xxs:block" />
                            Subir factura
                        </Link>

                        {/* Mobile Menu Button */}
                        <button 
                            className="lg:hidden p-2 text-slate-700 dark:text-slate-300 min-h-[48px] min-w-[48px] flex items-center justify-center -mr-2"
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
            <div className={`fixed top-0 right-0 h-full w-[80%] max-w-[400px] bg-[#101922] z-[101] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between border-b border-slate-800">
                        <span className="text-lg font-900 text-white">Menú</span>
                        <button 
                            className="p-2 text-slate-400 hover:text-white transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                            onClick={() => setIsDrawerOpen(false)}
                            aria-label="Cerrar menú"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Profile for Mobile */}
                    <div className="p-6 border-b border-slate-800 bg-[#151f2a]">
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
                                    <p className="text-sm font-black text-white truncate">{user.displayName || user.email?.split('@')[0]}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                </div>
                                <button 
                                    onClick={() => { setIsDrawerOpen(false); logout(); }}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link 
                                href="/?auth=login" 
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white text-xs font-900 uppercase tracking-widest shadow-lg shadow-primary/20"
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
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-[#1a2632] text-white font-bold hover:bg-[#137fec]/10 transition-all border border-transparent hover:border-[#137fec]/30"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Comparador <ChevronRight size={18} className="text-[#137fec]" />
                        </Link>

                        {/* Mobile Accordion - Companies */}
                        <div className="space-y-2">
                            <button 
                                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl font-bold transition-all border ${isCompaniesOpen ? 'bg-[#137fec]/10 border-[#137fec]/30 text-white' : 'bg-[#1a2632] text-white border-transparent'}`}
                                onClick={() => setIsCompaniesOpen(!isCompaniesOpen)}
                            >
                                Compañías <ChevronDown size={18} className={`text-[#137fec] transition-transform duration-300 ${isCompaniesOpen ? 'rotate-180' : ''}`} />
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
                                            className="px-4 py-3 text-sm font-bold text-slate-400 hover:text-[#137fec] transition-colors flex items-center gap-2"
                                            onClick={() => setIsDrawerOpen(false)}
                                        >
                                            <div className="w-1.5 h-1.5 bg-[#137fec] rounded-full"></div>
                                            {company}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link 
                            href="/tarifas" 
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-[#1a2632] text-white font-bold hover:bg-[#137fec]/10 transition-all border border-transparent hover:border-[#137fec]/30"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Tarifas <ChevronRight size={18} className="text-[#137fec]" />
                        </Link>

                        <Link 
                            href="/precio-luz-hoy" 
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-[#1a2632] text-white font-bold hover:bg-[#137fec]/10 transition-all border border-transparent hover:border-[#137fec]/30"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <span className="flex items-center gap-2">
                                Precio Hoy
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-[9px] font-black text-emerald-400 border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    EN VIVO
                                </span>
                            </span>
                            <ChevronRight size={18} className="text-[#137fec]" />
                        </Link>

                        <Link 
                            href="/blog" 
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-[#1a2632] text-white font-bold hover:bg-[#137fec]/10 transition-all border border-transparent hover:border-[#137fec]/30"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Blog <ChevronRight size={18} className="text-[#137fec]" />
                        </Link>
                    </div>

                    {/* Footer / Copyright */}
                    <div className="p-8 border-t border-slate-800 text-center">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="w-full py-4 rounded-2xl bg-[#1a2632] text-slate-300 font-bold mb-6 flex items-center justify-center gap-3 border border-slate-700"
                        >
                            {theme === "dark" ? <><Sun size={20} /> Cambiar Modo Claro</> : <><Moon size={20} /> Cambiar Modo Oscuro</>}
                        </button>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">tumejortarifaluz eS</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
