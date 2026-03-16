"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight, FileUp, Sun, Moon } from "lucide-react";

const COMPANIES = [
    "Endesa", "Iberdrola", "Naturgy", "Repsol", 
    "TotalEnergies", "Octopus", "Niba", "Imagina", 
    "Visalia", "Nufri", "Energya VM", "CHC Energía", "Esluz"
];

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);

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
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-14 h-14 active:scale-95 transition-transform flex items-center justify-center overflow-hidden">
                            <Image src="/Logo.png" alt="TuMejorTarifaLuz" width={44} height={44} className="object-contain" priority />
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
                            
                            {/* Dropdown Menu */}
                            <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[320px] bg-[#1a2632] border border-slate-800 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPANIES.map((company) => (
                                        <Link 
                                            key={company} 
                                            href={`/companias/${
                                                company === "TotalEnergies" ? "total-energies" :
                                                company === "Octopus" ? "octopus-energy" :
                                                company === "Imagina" ? "imagina-energia" :
                                                company === "Nufri" ? "energia-nufri" :
                                                company === "Energya VM" ? "energia-vm" :
                                                company.toLowerCase().replace(" ", "-")
                                            }`}
                                            className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-[#137fec]/20 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <div className="w-1 h-1 bg-[#137fec] rounded-full"></div>
                                            {company}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link href="/precio-luz-hoy" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#137fec] transition-colors group">
                            Precio Hoy
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-black text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse group-hover:bg-white"></span>
                                EN VIVO
                            </span>
                        </Link>
                        <Link href="/blog" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#137fec] transition-colors">Blog</Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle (Optional but nice) */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-slate-500 hover:text-[#137fec] transition-colors lg:block hidden"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* CTA Button */}
                        <Link 
                            href="/comparador?mode=upload" 
                            className="bg-[#137fec] text-white text-[10px] sm:text-xs font-900 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#137fec]/20 hover:shadow-[#137fec]/35 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-[#137fec]/50 whitespace-nowrap"
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

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-2">
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
                                            href={`/companias/${
                                                company === "TotalEnergies" ? "total-energies" :
                                                company === "Octopus" ? "octopus-energy" :
                                                company === "Imagina" ? "imagina-energia" :
                                                company === "Nufri" ? "energia-nufri" :
                                                company === "Energya VM" ? "energia-vm" :
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
