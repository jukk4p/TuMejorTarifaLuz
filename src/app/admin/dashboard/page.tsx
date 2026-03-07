"use client";

import { getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const { tariffs: TARIFF_DATABASE } = useTariffs();

    const totalTariffs = TARIFF_DATABASE.length;
    const activeTariffs = totalTariffs; // For now all are active

    const stats = [
        { label: "Total Tarifas", value: totalTariffs, color: "text-primary", bg: "bg-primary/10", icon: "inventory_2" },
        { label: "Activas Ahora", value: activeTariffs, color: "text-success", bg: "bg-success/10", icon: "verified" },
        { label: "Empresas", value: new Set(TARIFF_DATABASE.map(t => t.company)).size, color: "text-ai-purple", bg: "bg-ai-purple/10", icon: "business" },
        { label: "Actualizaciones", value: "24h", color: "text-amber-500", bg: "bg-amber-500/10", icon: "update" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-800 tracking-tight dark:text-white uppercase">Gestión de Tarifas <span className="text-primary">(Admin)</span></h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">Manejo detallado de los parámetros de comparación y mapeo técnico para el motor de recomendación.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex items-center justify-between group overflow-hidden">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-4xl font-800 ${stat.color}`}>{stat.value}</p>
                        </div>
                        <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className="material-icons text-2xl">{stat.icon}</span>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full blur-xl"></div>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card overflow-hidden !border-none !shadow-md">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                            <div>
                                <h3 className="font-800 text-lg dark:text-white">Tarifas Activas Recientes</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Últimas entradas en la base de datos</p>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">Ver todas</button>
                        </div>
                        <div className="overflow-x-auto bg-white dark:bg-slate-900">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                                    <tr>
                                        <th className="px-8 py-4 px-8 py-4">Empresa</th>
                                        <th className="px-8 py-4">Tarifa</th>
                                        <th className="px-8 py-4">P1 (€/kWh)</th>
                                        <th className="px-8 py-4">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {TARIFF_DATABASE.slice(0, 5).map((tariff, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400 border border-slate-100 dark:border-slate-700 overflow-hidden p-1 shadow-sm">
                                                        {getLogoPath(tariff.company, mounted && resolvedTheme === 'dark') ? (
                                                            <img
                                                                src={getLogoPath(tariff.company, mounted && resolvedTheme === 'dark')!}
                                                                alt={tariff.company}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            (tariff.company || "?").charAt(0)
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-bold dark:text-white">{tariff.company}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{tariff.name}</p>
                                            </td>
                                            <td className="px-8 py-5 font-mono text-xs font-bold text-primary">
                                                {(tariff.e1_kwh ?? 0).toFixed(4)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-tighter">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                                                    Activa
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="premium-card p-8 space-y-6">
                        <h3 className="font-800 text-lg dark:text-white">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/admin/dashboard/tarifas")}
                                className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group"
                            >
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-icons text-lg">add_circle</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Nueva Tarifa</span>
                            </button>
                            <button
                                onClick={() => alert("Función de Importación CSV en desarrollo. Contacte con soporte técnico.")}
                                className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-success/10 hover:text-success transition-all group"
                            >
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl group-hover:bg-success group-hover:text-white transition-colors">
                                    <span className="material-icons text-lg">upload_file</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Importar CSV</span>
                            </button>
                            <button
                                onClick={() => {
                                    const btn = document.activeElement as HTMLButtonElement;
                                    const originalText = btn.innerText;
                                    btn.innerText = "Sincronizando...";
                                    btn.disabled = true;
                                    setTimeout(() => {
                                        btn.innerText = originalText;
                                        btn.disabled = false;
                                        alert("API Sincronizada con éxito (Simulado)");
                                    }, 2000);
                                }}
                                className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-ai-purple/10 hover:text-ai-purple transition-all group"
                            >
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl group-hover:bg-ai-purple group-hover:text-white transition-colors">
                                    <span className="material-icons text-lg">sync</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Sincronizar API</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-[#101922] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="text-lg font-800 mb-2 relative z-10">Consistencia Engine</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4 relative z-10">Última revisión: backend_schema_v2</p>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-[120px] h-[40px] flex items-center justify-center full bg-success"></div>
                            </div>
                            <span className="text-[10px] font-bold text-success">94% OK</span>
                        </div>
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Revisar Errores</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
