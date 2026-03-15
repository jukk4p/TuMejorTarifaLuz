"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, Users, ChevronRight, Settings, Mail, MessageSquare } from "lucide-react";
import SupportSection from "@/components/ui/SupportSection";

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-charcoal text-slate-600 dark:text-slate-400 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 active:scale-95 transition-transform flex items-center justify-center overflow-hidden">
                                <Image src="/Logo.png" alt="TuMejorTarifaLuz" width={48} height={48} className="object-contain" />
                            </div>
                            <span className="text-xl font-800 tracking-tight text-slate-900 dark:text-white">
                                TuMejorTarifa<span className="text-primary">Luz</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Lideramos la revolución energética mediante inteligencia artificial. Ayudamos a miles de familias en España a optimizar sus facturas analizando datos reales para encontrar el máximo ahorro garantizado.
                        </p>
                        <div className="flex items-center gap-4 pt-2 justify-center md:justify-start">
                            <a aria-label="Social" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-transparent flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-500 dark:text-slate-300" href="#">
                                <Share2 size={20} />
                            </a>
                            <a aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-transparent flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-500 dark:text-slate-300" href="#">
                                <Users size={20} />
                            </a>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 relative inline-block">
                            Enlaces Útiles
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-0.5 bg-primary"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/comparador"><ChevronRight size={14} className="text-xs" /> Comparador</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/tarifas"><ChevronRight size={14} className="text-xs" /> Tarifas</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/blog"><ChevronRight size={14} className="text-xs" /> Guías</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/sobre-nosotros"><ChevronRight size={14} className="text-xs" /> Sobre nosotros</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/#faq"><ChevronRight size={14} className="text-xs" /> Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 relative inline-block">
                            Legal
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-0.5 bg-primary"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/legal/aviso-legal"><ChevronRight size={14} className="text-xs" /> Aviso Legal</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/legal/privacidad"><ChevronRight size={14} className="text-xs" /> Política de Privacidad</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/legal/cookies"><ChevronRight size={14} className="text-xs" /> Política de Cookies</Link></li>
                            <li>
                                <button
                                    onClick={() => (window as any).openCookieSettings()}
                                    className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 w-full md:w-auto"
                                >
                                    <Settings size={12} />
                                    Gestionar Cookies
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 relative inline-block">
                            Contacto
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-0.5 bg-primary"></span>
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                <Mail className="text-primary" size={24} />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
                                    <a className="text-sm hover:text-primary transition-colors" href="mailto:hola@tumejortarifaluz.es">hola@tumejortarifaluz.es</a>
                                </div>
                            </li>
                            <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                <MessageSquare className="text-primary" size={24} />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">WhatsApp</p>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Contactar por WhatsApp</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <SupportSection />
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-xs font-medium text-slate-500">
                        Impulsando un consumo más consciente y eficiente.
                    </p>
                    <div className="flex items-center gap-8 justify-center">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide">© {new Date().getFullYear()} TuMejorTarifaLuz. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
