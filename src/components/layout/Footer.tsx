"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Mail, ShieldCheck, MapPin, Heart, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const COMPANIES = [
    "Endesa", "Iberdrola", "Naturgy", "Repsol", "TotalEnergies", "Octopus", 
    "Niba", "Imagina", "Visalia", "Energía Nufri", "Energya VM", 
    "CHC Energía", "Esluz"
];

const TOOLS = [
    { name: "Comparador de tarifas", href: "/comparador" },
    { name: "Precio de la luz hoy", href: "/precio-luz-hoy" },
    { name: "Todas las tarifas", href: "/tarifas" },
    { name: "Compañías", href: "/companias" },
    { name: "Mi cuenta", href: "/mi-cuenta" },
];

const GUIDES = [
    { name: "Cómo entender tu factura", href: "/blog/como-leer-entender-factura-luz-2026" },
    { name: "Mercado libre vs PVPC", href: "/blog/mercado-libre-pvpc" },
    { name: "Cómo ajustar tu potencia", href: "/blog/como-reducir-potencia-contratada-luz-ahorrar" },
    { name: "Horas punta y valle", href: "/blog/horas-baratas-luz-horarios-valle-llano-punta" },
    { name: "Preguntas frecuentes", href: "/#faq" },
    { name: "Ver todo el blog", href: "/blog" },
];

const ABOUT = [
    { name: "Sobre nosotros", href: "/sobre-nosotros" },
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
        <div className="border-b lg:border-none border-border/50 last:border-none">
            <button 
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 sm:py-5 lg:py-0 lg:mb-8 transition-colors lg:pointer-events-none"
                aria-expanded={isOpen}
            >
                <h4 className="text-[#E2E8F0] uppercase font-600 text-[11px] tracking-[0.08em] relative lg:inline-block">
                    {title}
                    <span className="hidden lg:block absolute -bottom-3 left-0 w-10 h-1 bg-primary rounded-full"></span>
                </h4>
                <ChevronDown 
                    size={20} 
                    className={`text-primary transition-transform duration-300 lg:hidden ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            <div className={`${isOpen ? 'max-h-[1000px] opacity-100 pb-6 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'} lg:max-h-none lg:opacity-100 lg:block lg:overflow-visible transition-all duration-500 lg:transition-none`}>
                {children}
            </div>
        </div>
    );
}

export default function Footer() {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const { user } = useAuth();

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-[#070E18] text-[#CBD5E1] pt-12 md:pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                {/* 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-20 items-start">
                    
                    {/* Col 1: Herramientas */}
                    <FooterSection 
                        title="HERRAMIENTAS" 
                        isOpen={openSection === 'herramientas'} 
                        onToggle={() => toggleSection('herramientas')}
                    >
                        <ul className="flex flex-col gap-2 lg:gap-4">
                            {TOOLS.map((tool) => (
                                <li key={tool.name}>
                                    <Link 
                                        href={tool.name === "Mi cuenta" && !user ? "/login" : tool.href}
                                        className="text-[13px] text-[#CBD5E1] font-400 hover:text-white transition-colors flex items-center gap-3 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-white/10 group-hover:bg-primary rounded-full transition-colors"></div>
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </FooterSection>

                    {/* Col 2: Compañías */}
                    <FooterSection 
                        title="COMPAÑÍAS" 
                        isOpen={openSection === 'compañías'} 
                        onToggle={() => toggleSection('compañías')}
                    >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:gap-y-3">
                            {COMPANIES.map((company) => (
                                <Link 
                                    key={company} 
                                    href={`/companias/${
                                        company === "TotalEnergies" ? "total-energies" :
                                        company === "Octopus" ? "octopus-energy" :
                                        company === "Imagina" ? "imagina-energia" :
                                        company === "Energía Nufri" ? "energia-nufri" :
                                        company === "Energya VM" ? "energia-vm" :
                                        company === "CHC Energía" ? "chc-energia" :
                                        company.toLowerCase().replace(" ", "-")
                                    }`}
                                    className="text-[13px] text-[#CBD5E1] font-400 hover:text-white transition-colors block truncate"
                                >
                                    {company}
                                </Link>
                            ))}
                            <Link 
                                href="/companias/comercializadoras-referencia"
                                className="text-[13px] text-[#CBD5E1] font-400 hover:text-white transition-colors block truncate"
                            >
                                COR
                            </Link>
                        </div>
                    </FooterSection>

                    {/* Col 3: Guías */}
                    <FooterSection 
                        title="GUÍAS Y RECURSOS" 
                        isOpen={openSection === 'guías'} 
                        onToggle={() => toggleSection('guías')}
                    >
                        <div className="flex flex-col gap-2 lg:gap-3">
                            {GUIDES.map((guide) => (
                                <Link 
                                    key={guide.name} 
                                    href={guide.href} 
                                    className="text-[13px] text-[#CBD5E1] font-400 hover:text-white transition-colors flex items-center gap-2 group"
                                >
                                    <ArrowRight size={14} className="text-white/20 group-hover:text-primary transition-colors pr-1 shrink-0" />
                                    <span className="truncate">{guide.name}</span>
                                </Link>
                            ))}
                        </div>
                    </FooterSection>

                    {/* Col 4: Sobre nosotros */}
                    <FooterSection 
                        title="SOBRE NOSOTROS" 
                        isOpen={openSection === 'sobre'} 
                        onToggle={() => toggleSection('sobre')}
                    >
                        <div className="flex flex-col gap-2 lg:gap-3">
                            {ABOUT.map((item) => (
                                <Link 
                                    key={item.name} 
                                    href={item.href} 
                                    className="text-[13px] text-[#CBD5E1] font-400 hover:text-white transition-colors flex items-center gap-3 group"
                                >
                                    <div className="w-1.5 h-1.5 bg-white/10 group-hover:bg-primary rounded-full transition-colors"></div>
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            ))}

                            {/* Contact Mini-cards */}
                            <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-2 lg:gap-3">
                                <a href="mailto:hola@tumejortarifaluz.es" className="flex items-center gap-3 p-2.5 h-[56px] rounded-2xl bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all border border-white/10 min-w-0 group shadow-sm">
                                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                        <Mail size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0 overflow-hidden text-left">
                                        <span className="text-[10px] font-500 tracking-[0.06em] text-[#94A3B8] mb-0.5 uppercase">Email</span>
                                        <span className="text-[13px] font-500 text-[#F1F5F9] tracking-tight leading-tight whitespace-nowrap">hola@tumejortarifaluz.es</span>
                                    </div>
                                </a>
                                <div className="flex items-center gap-3 p-2.5 h-[56px] rounded-2xl bg-white/5 border border-white/10 min-w-0 group hover:bg-primary/10 transition-all shadow-sm">
                                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0 text-left">
                                        <span className="text-[10px] font-500 tracking-[0.06em] text-[#94A3B8] mb-0.5 uppercase">España</span>
                                        <span className="text-[13px] font-500 text-[#F1F5F9] tracking-tight truncate">Servicio Nacional</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FooterSection>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 w-full">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 group shrink-0">
                        <div className="w-10 h-10 transition-all flex items-center justify-center p-1">
                            <div className="relative w-full h-full">
                                <Image 
                                    src="/Logo.png" 
                                    alt="TuMejorTarifaLuz" 
                                    fill
                                    className="object-contain brightness-110" 
                                />
                            </div>
                        </div>
                        <span className="text-xl font-800 tracking-tight text-[#F1F5F9] group-hover:text-primary transition-colors">
                            TuMejorTarifa<span className="text-primary">Luz</span>
                        </span>
                    </div>

                    <p className="text-[12px] font-400 text-[#94A3B8] text-center px-4">
                        © 2026 TuMejorTarifaLuz — Comparador independiente de tarifas de luz en España.
                    </p>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full shrink-0">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[11px] font-500 text-accent tracking-widest">Actualizado hoy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
