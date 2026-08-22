"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const COMPANIES = [
    "Endesa", "Iberdrola", "Naturgy", "Repsol", "TotalEnergies", "Octopus",
    "Niba", "Imagina", "Visalia", "Energía Nufri", "Energya VM",
    "Atulado", "Esluz"
];

const TOOLS_PRIMARY = [
    { name: "Comparador de tarifas", href: "/comparador" },
    { name: "Precio de la luz hoy", href: "/precio-luz-hoy" },
];

const TOOLS_SECONDARY = [
    { name: "Todas las tarifas", href: "/tarifas" },
    { name: "Compañías", href: "/companias" },
    { name: "Mi cuenta", href: "/mi-cuenta" },
];

const GUIDES = [
    { name: "Cómo entender tu factura", href: "/blog/como-leer-entender-factura-luz-2026" },
    { name: "Mercado libre vs PVPC", href: "/blog/mercado-libre-pvpc" },
    { name: "Guía Carga Coche Eléctrico", href: "/blog/cuanto-cuesta-cargar-coche-electrico-en-casa-2026-rentabilidad-ahorro" },
    { name: "Aerotermia vs Gas Natural", href: "/blog/aerotermia-o-gas-natural-cual-es-mas-barato-2026" },
    { name: "Aislamiento y Ahorro Pasivo", href: "/blog/mejorar-aislamiento-termico-vivienda-ahorro-energia-2026-rentabilidad" },
];

const LEGAL = [
    { name: "Sobre nosotros", href: "/sobre-nosotros" },
    { name: "¿Cómo funciona?", href: "/#como-funciona" },
    { name: "Aviso legal", href: "/legal/aviso-legal" },
    { name: "Privacidad", href: "/legal/privacidad" },
    { name: "Cookies", href: "/legal/cookies" },
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
                className="w-full flex items-center justify-center lg:justify-between py-5 lg:py-0 lg:mb-6 transition-colors lg:pointer-events-none relative"
                aria-expanded={isOpen}
                aria-label={`Alternar sección ${title}`}
            >
                <span className="text-[#E2E8F0] uppercase font-600 text-[11px] tracking-[0.08em] relative lg:inline-block font-heading block">
                    {title}
                    <span className="hidden lg:block absolute -bottom-3 left-0 w-10 h-1 bg-primary rounded-full"></span>
                </span>
                <ChevronDown
                    size={18}
                    className={`text-primary absolute right-0 transition-transform duration-300 lg:hidden ${isOpen ? 'rotate-180' : ''}`}
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

    const companyCount = COMPANIES.length + 1; // +1 for COR

    return (
        <footer className="bg-[#04060B] text-[#CBD5E1] pt-10 md:pt-14 pb-8 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Brand + 3-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-8 md:gap-8 mb-10 md:mb-12 items-start">

                    {/* Brand Block */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <div className="relative w-7 h-7">
                                    <Image
                                        src="/Logo.png"
                                        alt=""
                                        fill
                                        className="object-contain"
                                        priority
                                        sizes="28px"
                                    />
                                </div>
                            </div>
                            <span className="text-xl font-900 tracking-tight text-[#F1F5F9] group-hover:text-primary transition-colors">
                                TuMejorTarifa<span className="text-primary">Luz</span>
                            </span>
                        </Link>
                        <p className="text-[13px] text-[#94A3B8] leading-relaxed max-w-[280px]">
                            Comparador independiente de tarifas de luz en España. Sin publicidad, sin comisiones ocultas.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shrink-0"></div>
                            <span className="text-[11px] font-500 text-accent tracking-widest">Actualizado hoy · {companyCount} comercializadoras</span>
                        </div>
                    </div>

                    {/* Col 1: Herramientas */}
                    <FooterSection
                        title="HERRAMIENTAS"
                        isOpen={openSection === 'herramientas'}
                        onToggle={() => toggleSection('herramientas')}
                    >
                        <ul className="flex flex-col gap-3 items-center lg:items-start text-center lg:text-left">
                            {TOOLS_PRIMARY.map((tool) => (
                                <li key={tool.name}>
                                    <Link
                                        href={tool.href}
                                        className="text-[13px] font-600 text-[#F1F5F9] hover:text-primary transition-colors flex items-center justify-center lg:justify-start gap-2 group"
                                    >
                                        {tool.name}
                                        <ArrowRight size={13} className="text-primary group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="my-4 border-t border-white/10 w-10 mx-auto lg:mx-0"></div>
                        <ul className="flex flex-col gap-3 items-center lg:items-start text-center lg:text-left">
                            {TOOLS_SECONDARY.map((tool) => (
                                <li key={tool.name}>
                                    <Link
                                        href={tool.name === "Mi cuenta" && !user ? "/login" : tool.href}
                                        className="text-[13px] text-[#CBD5E1] font-400 hover:text-white transition-colors"
                                    >
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
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-3 items-start justify-items-center lg:justify-items-start text-center lg:text-left">
                            {COMPANIES.map((company) => (
                                <Link
                                    key={company}
                                    href={`/companias/${
                                        company === "TotalEnergies" ? "total-energies" :
                                        company === "Octopus" ? "octopus-energy" :
                                        company === "Imagina" ? "imagina-energia" :
                                        company === "Energía Nufri" ? "energia-nufri" :
                                        company === "Energya VM" ? "energia-vm" :
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
                        title="GUÍAS"
                        isOpen={openSection === 'guías'}
                        onToggle={() => toggleSection('guías')}
                    >
                        <div className="flex flex-col gap-3 items-center lg:items-start text-center lg:text-left">
                            {GUIDES.map((guide) => (
                                <Link
                                    key={guide.name}
                                    href={guide.href}
                                    className="text-[13px] text-[#CBD5E1] font-400 hover:text-white transition-colors"
                                >
                                    {guide.name}
                                </Link>
                            ))}
                        </div>
                        <div className="my-4 border-t border-white/10 w-10 mx-auto lg:mx-0"></div>
                        <Link
                            href="/blog"
                            className="text-[13px] font-600 text-[#F1F5F9] hover:text-primary transition-colors flex items-center justify-center lg:justify-start gap-2 group"
                        >
                            Ver todo el blog
                            <ArrowRight size={13} className="text-primary group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </FooterSection>
                </div>

                {/* Final Row: Copyright + Legal Links | Email + Social */}
                <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 text-center md:text-left">
                        <p className="text-[12px] font-400 text-[#94A3B8] whitespace-nowrap">
                            © 2026 TuMejorTarifaLuz
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                            {LEGAL.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-[12px] text-[#94A3B8] hover:text-white transition-colors whitespace-nowrap"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-5 shrink-0">
                        <a
                            href="mailto:contacto@tumejortarifaluz.es"
                            className="flex items-center gap-2 text-[13px] text-[#CBD5E1] hover:text-white transition-colors group"
                        >
                            <Mail size={15} className="text-primary group-hover:scale-110 transition-transform shrink-0" />
                            contacto@tumejortarifaluz.es
                        </a>
                        <div className="flex items-center gap-2.5">
                            <a
                                href="https://x.com/TMejorTarifaLuz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F1F5F9] hover:bg-primary hover:border-primary transition-all duration-300 group shadow-sm"
                                aria-label="Seguir en X (Twitter)"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=61575378954923"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F1F5F9] hover:bg-primary hover:border-primary transition-all duration-300 group shadow-sm"
                                aria-label="Seguir en Facebook"
                            >
                                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current group-hover:scale-110 transition-transform" aria-hidden="true">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
