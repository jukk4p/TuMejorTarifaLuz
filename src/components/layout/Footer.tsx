"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Mail, MessageSquare, ExternalLink, ShieldCheck, MapPin } from "lucide-react";

const COMPANIES = [
    "Endesa", "Iberdrola", "Naturgy", "Repsol", "TotalEnergies", "Octopus", 
    "Niba", "Imagina", "Visalia", "Nufri", "Energya VM", 
    "CHC Energía", "Esluz"
];

const GUIDES = [
    { name: "Cómo entender tu factura", href: "/blog/como-leer-entender-factura-luz-2026" },
    { name: "Mercado libre vs PVPC", href: "/blog/mercado-libre-pvpc" },
    { name: "Cómo ajustar tu potencia", href: "/blog/como-reducir-potencia-contratada-luz-ahorrar" },
    { name: "Horas punta y valle", href: "/blog/horas-baratas-luz-horarios-valle-llano-punta" },
    { name: "Preguntas frecuentes", href: "/#faq" },
];

const ABOUT = [
    { name: "¿Cómo funciona?", href: "/#como-funciona" },
    { name: "Aviso legal", href: "/legal/aviso-legal" },
    { name: "Política de privacidad", href: "/legal/privacidad" },
    { name: "Política de cookies", href: "/legal/cookies" },
    { name: "Contacto", href: "/contacto" },
];

interface FooterSectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function FooterSection({ title, isOpen, onToggle, children }: FooterSectionProps) {
    return (
        <div className="border-b lg:border-none border-slate-800/50 last:border-none">
            <button 
                onClick={onToggle}
                className="w-full flex items-center justify-between py-6 lg:py-0 lg:mb-8 transition-colors lg:pointer-events-none"
                aria-expanded={isOpen}
            >
                <h4 className="text-white font-900 text-xs sm:text-sm uppercase tracking-[0.2em] relative lg:inline-block">
                    {title}
                    <span className="hidden lg:block absolute -bottom-3 left-0 w-10 h-1 bg-[#137fec] rounded-full"></span>
                </h4>
                <ChevronDown 
                    size={20} 
                    className={`text-[#137fec] transition-transform duration-300 lg:hidden ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            <div className={`${isOpen ? 'max-h-[1000px] opacity-100 pb-8' : 'max-h-0 opacity-0'} lg:max-h-none lg:opacity-100 lg:block overflow-hidden transition-all duration-500 lg:transition-none`}>
                {children}
            </div>
        </div>
    );
}

export default function Footer() {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-[#0B1219] text-slate-400 pt-20 pb-10 transition-colors duration-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-16 mb-20">
                    
                    {/* Col 1: Compañías */}
                    <FooterSection 
                        title="Compañías eléctricas" 
                        isOpen={openSection === 'compañías'} 
                        onToggle={() => toggleSection('compañías')}
                    >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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
                                    className="text-sm hover:text-[#137fec] transition-colors flex items-center gap-2 group"
                                >
                                    <div className="w-1.5 h-1.5 bg-slate-700 group-hover:bg-[#137fec] rounded-full transition-colors"></div>
                                    {company}
                                </Link>
                            ))}
                        </div>
                    </FooterSection>

                    {/* Col 2: Guías */}
                    <FooterSection 
                        title="Guías y recursos" 
                        isOpen={openSection === 'guías'} 
                        onToggle={() => toggleSection('guías')}
                    >
                        <ul className="space-y-4">
                            {GUIDES.map((guide) => (
                                <li key={guide.name}>
                                    <Link 
                                        href={guide.href}
                                        className="text-sm hover:text-[#137fec] transition-colors flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[#1a2632] flex items-center justify-center text-[#137fec] group-hover:scale-110 transition-transform">
                                            <ExternalLink size={14} />
                                        </div>
                                        {guide.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </FooterSection>

                    {/* Col 3: Sobre nosotros */}
                    <FooterSection 
                        title="Sobre nosotros" 
                        isOpen={openSection === 'sobre'} 
                        onToggle={() => toggleSection('sobre')}
                    >
                        <div className="space-y-6">
                            <ul className="space-y-4">
                                {ABOUT.map((item) => (
                                    <li key={item.name}>
                                        <Link 
                                            href={item.href}
                                            className="text-sm hover:text-[#137fec] transition-colors flex items-center gap-3 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#1a2632] flex items-center justify-center text-slate-500 group-hover:text-[#137fec] transition-colors">
                                                <ShieldCheck size={14} />
                                            </div>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Contact Mini-cards */}
                            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                <a href="mailto:hola@tumejortarifaluz.es" className="flex items-center gap-4 p-4 rounded-2xl bg-[#1a2632] hover:bg-[#137fec]/10 border border-transparent hover:border-[#137fec]/30 transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-[#137fec] flex items-center justify-center text-white shadow-lg shadow-[#137fec]/20">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#137fec]/60">Email</span>
                                        <span className="text-xs font-bold text-white">hola@tumejortarifaluz.es</span>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1a2632] border border-slate-800">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">España</span>
                                        <span className="text-xs font-bold text-white">Servicio Nacional</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FooterSection>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-800 flex flex-col items-center text-center gap-6">
                    <div className="flex flex-col items-center gap-3 group">
                        <div className="w-12 h-12 active:scale-95 transition-transform flex items-center justify-center overflow-hidden bg-white/5 rounded-2xl p-2 shadow-sm border border-slate-800">
                            <Image src="/Logo.png" alt="TuMejorTarifaLuz" width={40} height={40} className="object-contain" />
                        </div>
                        <span className="text-xl font-800 tracking-tight text-white">
                            TuMejorTarifa<span className="text-primary">Luz</span>
                        </span>
                    </div>
                    
                    <p className="text-xs font-bold text-slate-500 max-w-2xl px-4">
                        © 2025 Tu Mejor Tarifa Luz – Comparador independiente de tarifas de luz en España. 
                        Analizamos el mercado diariamente para ofrecerte las mejores opciones de ahorro.
                    </p>

                    {/* Simple badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full">
                        <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-900 text-[#10b981] uppercase tracking-widest">Actualizado hoy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
