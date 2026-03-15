"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function SupportSection() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const platforms = [
        {
            name: "Buy Me a Coffee",
            description: "La opción más rápida",
            href: "https://buymeacoffee.com/tumejortarifaluz",
            bgColor: "bg-[#FFF8E7] dark:bg-amber-900/20",
            iconColor: "text-[#D97706]",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                    <line x1="6" y1="2" x2="6" y2="4"></line>
                    <line x1="10" y1="2" x2="10" y2="4"></line>
                    <line x1="14" y1="2" x2="14" y2="4"></line>
                </svg>
            )
        },
        {
            name: "PayPal",
            description: "Donación segura",
            href: "https://paypal.me/jukk4p",
            bgColor: "bg-[#EBF3FF] dark:bg-blue-900/20",
            iconColor: "text-[#1E40AF]",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106a.641.641 0 0 1-.633.541z" fill="#003087"/>
                    <path d="M21.162 6.537A5.998 5.998 0 0 0 16.58 4.2h-3.324l-2.094 13.29c-.062.392.247.749.646.749h3.35c.524 0 .968-.382 1.05-.9l.643-4.085c.082-.518.526-.9 1.05-.9H19.5c3.218 0 5.093-1.638 5.827-4.996.11-.532.18-1.077.195-1.597.009-.447-.117-.893-.36-1.224z" fill="#0079C1"/>
                </svg>
            )
        },
        {
            name: "Ko-fi",
            description: "0% comisiones",
            href: "https://ko-fi.com/tumejortarifaluz",
            bgColor: "bg-[#FFF0F2] dark:bg-rose-900/20",
            iconColor: "text-[#E11D48]",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.061-4.3-.037-.046-.054-.09-.054-.15-.054-.2-.032-.4-.01-.6.043-.2.12-.4.226-.6.1-.2.247-.4.408-.5.161-.1.35-.2.559-.2s.4.032.559.108c.161.077.301.2.42.342.118.143.215.3.279.462.064.162.097.332.097.514v.054a.795.795 0 0 0 1.257 0c.269-.323.59-.611.956-.848.366-.237.765-.411 1.182-.505.417-.095.845-.111 1.258-.046.413.064.81.203 1.15.422.34.218.636.5.87.828.235.328.406.7.505 1.096.099.395.12.8.064 1.196-.056.396-.184.773-.397 1.109zm8.483-1.632c-.512 1.637-2.316 2.67-4.524 2.768V6.152c2.146.126 3.653 1.063 4.293 2.617.202.484.341 1.01.341 1.54 0 .332-.05.666-.11 1.007z"/>
                </svg>
            )
        }
    ];

    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 relative inline-block">
                APOYA EL PROYECTO
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            
            <p className="text-sm leading-relaxed max-w-sm mb-6 text-slate-600 dark:text-slate-400">
                Somos 100% independientes y gratuitos. Si te hemos ayudado a ahorrar, considera apoyarnos para mantener el servicio activo.
            </p>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#F4F7FA] dark:bg-slate-800/80 border border-blue-200 shadow-sm hover:shadow dark:border-slate-700 hover:bg-[#ebf1f6] dark:hover:bg-slate-700 transition-all font-semibold text-slate-800 dark:text-slate-200"
                >
                    <Heart className="w-5 h-5 text-blue-500" strokeWidth={2} />
                    <span>Apoyar Proyecto</span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
                </button>

                {isOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mb-3 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-3 pb-2 pt-1 border-b border-slate-100 dark:border-slate-800/50 mb-2">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Elige una plataforma</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            {platforms.map((platform) => (
                                <Link
                                    key={platform.name}
                                    href={platform.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${platform.bgColor} ${platform.iconColor} transition-transform group-hover:scale-105`}>
                                        {platform.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{platform.name}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{platform.description}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
