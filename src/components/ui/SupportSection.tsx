"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SupportSection() {
    const platforms = [
        {
            name: "Buy Me a Coffee",
            description: "La opción más rápida",
            href: "https://buymeacoffee.com/tumejortarifaluz",
            bgColor: "bg-[#FFDD00]/10",
            iconColor: "text-[#D97706]",
            recommend: true,
            icon: (
                <div className="w-12 h-12 bg-[#FFDD00] rounded-xl flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/80">
                        <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                        <line x1="6" y1="2" x2="6" y2="4"></line>
                        <line x1="10" y1="2" x2="10" y2="4"></line>
                        <line x1="14" y1="2" x2="14" y2="4"></line>
                    </svg>
                </div>
            )
        },
        {
            name: "PayPal",
            description: "Donación segura",
            href: "https://paypal.me/jukk4p",
            bgColor: "bg-[#003087]/10",
            iconColor: "text-[#003087]",
            icon: (
                <div className="w-12 h-12 bg-[#003087] rounded-xl flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106a.641.641 0 0 1-.633.541z" />
                    </svg>
                </div>
            )
        },
        {
            name: "Ko-fi",
            description: "0% comisiones",
            href: "https://ko-fi.com/tumejortarifaluz",
            bgColor: "bg-[#FF5E5B]/10",
            iconColor: "text-[#FF5E5B]",
            icon: (
                <div className="w-12 h-12 bg-[#FF5E5B] rounded-xl flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.061-4.3-.037-.046-.054-.09-.054-.15-.054-.2-.032-.4-.01-.6.043-.2.12-.4.226-.6.1-.2.247-.4.408-.5.161-.1.35-.2.559-.2s.4.032.559.108c.161.077.301.2.42.342.118.143.215.3.279.462.064.162.097.332.097.514v.054a.795.795 0 0 0 1.257 0c.269-.323.59-.611.956-.848.366-.237.765-.411 1.182-.505.417-.095.845-.111 1.258-.046.413.064.81.203 1.15.422.34.218.636.5.87.828.235.328.406.7.505 1.096.099.395.12.8.064 1.196-.056.396-.184.773-.397 1.109zm8.483-1.632c-.512 1.637-2.316 2.67-4.524 2.768V6.152c2.146.126 3.653 1.063 4.293 2.617.202.484.341 1.01.341 1.54 0 .332-.05.666-.11 1.007z"/>
                    </svg>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-3">
            {platforms.map((platform) => (
                <Link
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all group/item w-full border-2 ${platform.recommend ? 'bg-[#F3F9FF] dark:bg-primary/10 border-primary/20 shadow-sm' : 'bg-surface border-border hover:border-primary/20 shadow-sm'}`}
                >
                    <div className="shrink-0 group-hover/item:scale-105 transition-transform duration-300">
                        {platform.icon}
                    </div>
                    <div className="flex flex-col text-left min-w-0 flex-1">
                        <span className="text-[15px] font-900 text-text-primary tracking-tight">{platform.name}</span>
                        <span className="text-[11px] text-text-muted font-bold uppercase tracking-widest">{platform.description}</span>
                    </div>
                    {platform.recommend && (
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full hidden sm:block shrink-0">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Recomendado</span>
                        </div>
                    )}
                    <div className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-border/20 group-hover/item:bg-primary/10 transition-colors">
                        <ChevronRight size={14} className="text-text-muted group-hover/item:text-primary" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
