"use client";

import { getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ProveedoresPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const { tariffs: TARIFF_DATABASE } = useTariffs();

    const companies = Array.from(new Set(TARIFF_DATABASE.map(t => t.company).filter(Boolean)));

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-800 dark:text-white uppercase tracking-tight">Proveedores de Energía</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestión de comercializadoras activas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company, i) => (
                    <div key={i} className="premium-card p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="w-40 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl font-800 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-border p-4 overflow-hidden">
                            {getLogoPath(company, mounted && resolvedTheme === 'dark') ? (
                                <img
                                    src={getLogoPath(company, mounted && resolvedTheme === 'dark')!}
                                    alt={company}
                                    className="h-full object-contain transition-all"
                                />
                            ) : (
                                (company || "?").charAt(0)
                            )}
                        </div>
                        <h3 className="font-800 dark:text-white">{company}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {TARIFF_DATABASE.filter(t => t.company === company).length} Tarifas Activas
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
