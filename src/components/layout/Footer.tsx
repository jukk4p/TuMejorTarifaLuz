"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Mail, ExternalLink, ShieldCheck, MapPin, Heart } from "lucide-react";
import SupportSection from "@/components/ui/SupportSection";

const COMPANIES = [
    "Endesa", "Iberdrola", "Naturgy", "Repsol", "TotalEnergies", "Octopus", 
    "Niba", "Imagina", "Visalia", "Energía Nufri", "Energya VM", 
    "CHC Energía", "Esluz"
];

const TOOLS = [
    { name: "Comparador de tarifas", href: "/comparador" },
    { name: "Precio de la luz hoy", href: "/precio-luz-hoy" },
    { name: "Todas las tarifas", href: "/tarifas" },
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
                <h4 className="text-text-primary uppercase font-900 text-xs sm:text-sm tracking-[0.2em] relative lg:inline-block">
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

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-surface text-text-secondary pt-12 md:pt-20 pb-10 transition-colors duration-300 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header: Independence & Support */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 pb-10 border-b border-border">
                    <div className="flex flex-col gap-3 max-w-xl">
                        <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                            <Heart size={12} className="text-accent fill-current" />
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Proyecto Independiente</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-text-primary leading-tight">
                            TuMejorTarifaLuz es un proyecto <span className="text-primary">100% gratuito</span> financiado por su comunidad.
                        </h3>
                        <p className="text-sm text-text-secondary font-medium">
                            No pertenecemos a ninguna eléctrica. Analizamos el mercado de forma transparente para ayudarte a ahorrar de verdad.
                        </p>
                    </div>
                    
                    <div className="w-full lg:w-[320px] shrink-0">
                        <SupportSection dropDownDirection="down" />
                    </div>
                </div>

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
                                        href={tool.href}
                                        className="text-[13px] text-text-secondary font-600 hover:text-primary transition-colors flex items-center gap-3 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-800 group-hover:bg-primary rounded-full transition-colors"></div>
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
                                    className="text-[13px] text-text-secondary font-600 hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 group-hover:bg-primary rounded-full transition-colors shrink-0"></div>
                                    <span className="truncate">{company}</span>
                                </Link>
                            ))}
                            {/* Adding the regulated market as one more in the group */}
                            <Link 
                                href="/companias/comercializadoras-referencia"
                                className="text-[13px] text-text-secondary font-600 hover:text-primary transition-colors flex items-center gap-2 group transition-all"
                            >
                                <div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 group-hover:bg-primary rounded-full transition-colors shrink-0"></div>
                                <span className="truncate">COR</span>
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
                                    className="text-[13px] text-text-secondary font-600 hover:text-primary transition-colors flex items-center gap-2.5 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0 border border-border">
                                        <ExternalLink size={14} />
                                    </div>
                                    <span className="truncate">{guide.name}</span>
                                </Link>
                            ))}

                                {/* Support card removed from here as it is now at the top */}
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
                                    className="text-[13px] text-text-secondary font-600 hover:text-primary transition-colors flex items-center gap-2.5 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0 border border-border">
                                        <ShieldCheck size={14} />
                                    </div>
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            ))}

                            {/* Contact Mini-cards - perfectly aligned with Col 3 support card on desktop */}
                            <div className="mt-4 pt-6 border-t border-border flex flex-col gap-2 lg:gap-3">
                                <a href="mailto:hola@tumejortarifaluz.es" className="flex items-center gap-3 p-2.5 h-[56px] rounded-2xl bg-background hover:bg-primary/5 hover:border-primary/30 transition-all border border-border min-w-0 group shadow-sm">
                                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                        <Mail size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0 overflow-hidden text-left">
                                        <span className="text-[9px] font-bold tracking-widest text-text-muted mb-0.5 uppercase">Email</span>
                                        <span className="text-[12px] font-bold text-text-primary tracking-tight leading-tight whitespace-nowrap">hola@tumejortarifaluz.es</span>
                                    </div>
                                </a>
                                <div className="flex items-center gap-3 p-2.5 h-[56px] rounded-2xl bg-background border border-border min-w-0 group hover:bg-primary/5 transition-all shadow-sm">
                                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0 text-left">
                                        <span className="text-[9px] font-bold tracking-widest text-text-muted mb-0.5 uppercase">España</span>
                                        <span className="text-[12px] font-bold text-text-primary tracking-tight truncate">Servicio Nacional</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FooterSection>

                    {/* Bottom support removed as it is now at the top */}
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border flex flex-col items-center text-center gap-6">
                    <div className="flex flex-col items-center gap-3 group">
                        <div className="w-16 h-16 active:scale-95 transition-all flex items-center justify-center p-1">
                            <div className="relative w-full h-full">
                                <Image 
                                    src="/Logo.png" 
                                    alt="TuMejorTarifaLuz" 
                                    fill
                                    className="object-contain dark:brightness-110" 
                                />
                            </div>
                        </div>
                        <span className="text-3xl font-800 tracking-tight text-text-primary group-hover:text-primary transition-colors">
                            TuMejorTarifa<span className="text-primary group-hover:text-primary">Luz</span>
                        </span>
                    </div>
                    
                    <p className="text-[11px] md:text-xs font-bold text-text-muted max-w-2xl px-4">
                        © 2026 TuMejorTarifaLuz – Comparador independiente de tarifas de luz en España. 
                        Analizamos el mercado diariamente para ofrecerte las mejores opciones de ahorro.
                    </p>

                    {/* Simple badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-900 text-accent tracking-widest">Actualizado hoy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
