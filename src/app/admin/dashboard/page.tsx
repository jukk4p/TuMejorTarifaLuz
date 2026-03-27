"use client";

import { getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, BadgeCheck, Building2, Clock, PlusCircle, RefreshCcw, Megaphone, AlertCircle, TrendingDown, TrendingUp, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Tariff } from "@/lib/tariffs";
import { notifySystemUpdate } from "@/lib/notifications";

interface PriceChange {
    label: string;
    oldValue: number;
    newValue: number;
}

interface TariffChange {
    tariff: Tariff;
    changes: PriceChange[];
}

export default function DashboardPage() {
    const router = useRouter();
    const { tariffs: TARIFF_DATABASE } = useTariffs();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [snapshot, setSnapshot] = useState<Tariff[] | null>(null);
    const [changes, setChanges] = useState<TariffChange[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchSnapshot();
    }, []);

    const fetchSnapshot = async () => {
        try {
            const docRef = doc(db, "system_state", "tariffs_snapshot");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data().tariffs as Tariff[];
                setSnapshot(data);
                compareTariffs(data);
            } else {
                // First time, create snapshot
                await setDoc(docRef, { tariffs: TARIFF_DATABASE });
                setSnapshot(TARIFF_DATABASE);
            }
        } catch (error) {
            console.error("Error fetching snapshot:", error);
        }
    };

    const compareTariffs = (snap: Tariff[]) => {
        const detectedChanges: TariffChange[] = [];
        TARIFF_DATABASE.forEach(current => {
            const prev = snap.find(s => s.name === current.name && s.company === current.company);
            if (prev) {
                const diffs: PriceChange[] = [];
                const fields: { key: keyof Tariff, label: string }[] = [
                    { key: 'e1_kwh', label: 'Energía Punta (E1)' },
                    { key: 'e2_kwh', label: 'Energía Llano (E2)' },
                    { key: 'e3_kwh', label: 'Energía Valle (E3)' },
                    { key: 'p1_kw_day', label: 'Potencia Punta (P1)' },
                    { key: 'p2_kw_day', label: 'Potencia Valle (P2)' },
                    { key: 'surplus_kwh', label: 'Excedentes (€/kWh)' }
                ];

                fields.forEach(f => {
                    const oldVal = prev[f.key] !== undefined ? Number(prev[f.key]) : undefined;
                    const newVal = current[f.key] !== undefined ? Number(current[f.key]) : undefined;
                    
                    if (oldVal !== undefined && newVal !== undefined && oldVal !== newVal) {
                        diffs.push({
                            label: f.label,
                            oldValue: oldVal,
                            newValue: newVal
                        });
                    }
                });

                if (diffs.length > 0) {
                    detectedChanges.push({
                        tariff: current,
                        changes: diffs
                    });
                }
            }
        });
        setChanges(detectedChanges);
    };

    const handleSyncAndNotify = async () => {
        if (changes.length === 0) return;
        setIsSyncing(true);
        try {
            // 1. Send Notification
            const changeMessages = changes.map(c => {
                const header = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${c.tariff.company.toUpperCase()} · ${c.tariff.name.toUpperCase()}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
                const details = c.changes.map(d => {
                    const icon = d.label.includes('Energía') ? '⚡' : d.label.includes('Potencia') ? '🔌' : '☀️';
                    return `${icon} ${d.label.padEnd(20)}: ${d.oldValue.toFixed(4)}€  →  ${d.newValue.toFixed(4)}€`;
                }).join('\n');
                return `${header}\n${details}`;
            }).join('\n\n');
            
            const title = changes.length === 1 
                ? `Cambio de precios en ${changes[0].tariff.company}` 
                : "Actualización múltiple de precios";
            
            await notifySystemUpdate(title, changeMessages, changes);

            // 2. Update Snapshot
            const docRef = doc(db, "system_state", "tariffs_snapshot");
            await setDoc(docRef, { tariffs: TARIFF_DATABASE });
            
            setSnapshot(TARIFF_DATABASE);
            setChanges([]);
            alert("¡Sincronización completada y notificaciones enviadas!");
        } catch (error) {
            alert("Error al sincronizar: " + (error as any).message);
        } finally {
            setIsSyncing(false);
        }
    };


    const totalTariffs = TARIFF_DATABASE.length;
    const totalCompanies = new Set(TARIFF_DATABASE.map(t => t.company)).size;

    const stats = [
        { label: "Total Tarifas", value: totalTariffs, color: "text-primary", bg: "bg-primary/10", icon: Archive },
        { label: "Compañías", value: totalCompanies, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: Building2 },
        { label: "Servicio Cloud", value: "Online", color: "text-accent", bg: "bg-accent-bg", icon: BadgeCheck },
        { label: "Sincronización", value: "Auto", color: "text-warning", bg: "bg-warning/10", icon: Clock },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight dark:text-white uppercase">Panel de Control <span className="text-primary">(Admin)</span></h1>
                <p className="text-text-secondary font-medium max-w-2xl">Gestión global de la plataforma, actualización de tarifas y comunicaciones directas con usuarios.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex items-center justify-between group overflow-hidden">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                        </div>
                        <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card overflow-hidden !border-none !shadow-md">
                        <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-surface">
                            <div>
                                <h3 className="font-extrabold text-lg dark:text-white">Últimas Tarifas Añadidas</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sincronización en tiempo real con la nube</p>
                            </div>
                            <button 
                                onClick={() => router.push("/admin/dashboard/tarifas")}
                                className="text-xs font-bold text-primary hover:underline hover:translate-x-1 transition-transform cursor-pointer"
                            >
                                Ver base completa →
                            </button>
                        </div>
                        <div className="overflow-x-auto bg-surface">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-border">
                                    <tr>
                                        <th className="px-8 py-4">Empresa</th>
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
                                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-border overflow-hidden p-1 shadow-sm">
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
                                                <p className="text-xs text-text-secondary font-medium">{tariff.name}</p>
                                            </td>
                                            <td className="px-8 py-5 font-mono text-xs font-bold text-text-primary">
                                                {(tariff.e1_kwh ?? 0).toFixed(4)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                                    PUBLICADA
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
                    {/* Intelligent Sync Card */}
                    {changes.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-[2rem] p-8 space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-warning rounded-2xl text-white shadow-lg shadow-amber-500/20">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-lg text-amber-900 dark:text-warning uppercase leading-none">Diferencias Detectadas</h3>
                                    <p className="text-[10px] text-amber-700/60 dark:text-warning/60 font-black uppercase tracking-widest">data.json vs cloud snapshot</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {changes.map((change, i) => (
                                    <div key={i} className="flex flex-col bg-surface p-4 rounded-xl border border-amber-200/50 dark:border-amber-900/30 gap-2">
                                        <div className="flex items-center gap-3 border-b border-border dark:border-white/5 pb-2 mb-1">
                                            <TrendingUp size={14} className="text-warning" />
                                            <span className="text-[10px] font-black dark:text-white uppercase truncate">{change.tariff.company} - {change.tariff.name}</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {change.changes.map((diff, j) => (
                                                <div key={j} className="flex items-center justify-between text-[10px]">
                                                    <span className="text-slate-400 font-bold uppercase tracking-tight">{diff.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-400 line-through opacity-50">{diff.oldValue.toFixed(4)}</span>
                                                        <span className={`font-mono font-black ${diff.newValue < diff.oldValue ? 'text-emerald-500' : 'text-warning'}`}>
                                                            {diff.newValue.toFixed(4)}€
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSyncAndNotify}
                                disabled={isSyncing}
                                className="w-full bg-warning hover:bg-amber-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                {isSyncing ? <RefreshCcw className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                Sincronizar y Notificar {changes.length} Cambios
                            </button>
                        </div>
                    )}

                    <div className="premium-card p-8 space-y-8">
                        <div>
                            <h3 className="font-extrabold text-lg dark:text-white leading-none">Acciones de Control</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Herramientas operativas</p>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/admin/dashboard/tarifas")}
                                className="w-full flex items-center gap-4 p-4 bg-surface-2 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group border border-transparent hover:border-primary/20"
                            >
                                <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Nueva Tarifa</span>
                            </button>
                            
                            <button
                                onClick={async () => {
                                    const msg = prompt("Escribe el mensaje de la notificación global (Ej: Hemos añadido 10 nuevas tarifas):");
                                    if (msg) {
                                        const { notifySystemUpdate } = await import("@/lib/notifications");
                                        await notifySystemUpdate("Nuevas Tarifas Disponibles", msg);
                                        alert("¡Notificación global enviada!");
                                    }
                                }}
                                className="w-full flex items-center gap-4 p-4 bg-primary/5 rounded-2xl hover:bg-primary/10 text-primary transition-all group border border-dashed border-primary/20"
                            >
                                <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                    <Megaphone className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Enviar Aviso Global</span>
                            </button>

                            <button
                                onClick={() => router.push("/admin/dashboard/notificaciones")}
                                className="w-full flex items-center gap-4 p-4 bg-surface-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group border border-border"
                            >
                                <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors shadow-sm">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Historial Avisos</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-surface-2 rounded-[2rem] border border-border">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">CONSEJO DE SEGURIDAD</p>
                        <p className="text-xs text-text-secondary leading-relaxed font-medium">
                            Cualquier cambio en las tarifas o notificaciones globales es **irreversible** y afecta a todos los usuarios registrados en tiempo real.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
