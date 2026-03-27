
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Bell, Zap, Megaphone, Info, Check, Trash2, ChevronRight, Clock, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Building2, Activity } from "lucide-react";
import { getLogoPath } from "@/lib/tariffs";
import { db } from "@/lib/firebase";
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc, 
    arrayUnion,
    arrayRemove,
    deleteDoc,
    getDoc,
    where
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Notification } from "@/lib/notifications";
import Link from "next/link";

// Subcomponent for modern tariff update view
function TariffUpdateDetail({ data, isDark }: { data: any[], isDark: boolean }) {
    if (!data || !Array.isArray(data)) return null;

    // Calculate Global Stats
    const totalCompanies = new Set(data.map(d => d.tariff.company)).size;
    const totalConcepts = data.reduce((acc, d) => acc + d.changes.length, 0);
    
    let ups = 0;
    let downs = 0;
    data.forEach(d => {
        d.changes.forEach((c: any) => {
            if (c.newValue > c.oldValue) ups++;
            else if (c.newValue < c.oldValue) downs++;
        });
    });

    const mainTrend = ups > downs ? 'Subida' : downs > ups ? 'Bajada' : 'Estable';
    const trendIcon = mainTrend === 'Bajada' ? <TrendingDown className="w-5 h-5 text-emerald-500" /> : <TrendingUp className="w-5 h-5 text-rose-500" />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Executive Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-900 dark:bg-black p-6 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compañías afectadas</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-900 text-white">{totalCompanies}</span>
                        <Building2 className="w-4 h-4 text-primary/60" />
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conceptos modificados</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-900 text-white">{totalConcepts}</span>
                        <Activity className="w-4 h-4 text-primary/60" />
                    </div>
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tendencia mayoritaria</p>
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-900 ${mainTrend === 'Bajada' ? 'text-emerald-500' : 'text-rose-500'}`}>{mainTrend}</span>
                        {trendIcon}
                    </div>
                </div>
            </div>

            {/* Detailed Cards */}
            <div className="space-y-6">
                {data.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-border rounded-[2.5rem] overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500">
                        <div className="px-8 py-5 border-b border-border flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center p-2 border border-border shadow-inner">
                                   {getLogoPath(item.tariff.company, isDark) ? (
                                       <img src={getLogoPath(item.tariff.company, isDark)!} alt={item.tariff.company} className="w-full h-full object-contain" />
                                   ) : (
                                       <div className="text-[10px] font-black text-primary uppercase">{(item.tariff?.company || "C").substring(0, 3)}</div>
                                   )}
                                </div>
                                <div>
                                    <h4 className="font-900 text-text-primary uppercase tracking-tight leading-none mb-1">{item.tariff.company}</h4>
                                    <p className="text-[11px] text-text-secondary font-medium tracking-tight">Tarifa "{item.tariff.name}"</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema Auto</span>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Energy Section */}
                            {item.changes.some((c: any) => c.label.includes('Energía')) && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                        <Zap className="w-3.5 h-3.5" /> ENERGÍA
                                    </div>
                                    <div className="space-y-3">
                                        {item.changes.filter((c: any) => c.label.includes('Energía')).map((change: any, cIdx: number) => {
                                            const isDown = change.newValue < change.oldValue;
                                            const diffPercent = ((change.newValue - change.oldValue) / change.oldValue) * 100;
                                            const periodLabel = change.label.match(/\(([^)]+)\)/)?.[1] || change.label;
                                            
                                            return (
                                                <div key={cIdx} className="flex items-center justify-between group/row p-2 -mx-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-border">
                                                            {periodLabel}
                                                        </div>
                                                        <span className="text-xs font-bold text-text-secondary">{change.label.split(' (')[0]}</span>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-[11px] text-slate-400 line-through opacity-60 font-mono italic">{change.oldValue.toFixed(4)}€</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex items-center gap-1 font-mono font-900 text-sm ${isDown ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                                {isDown ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                                {change.newValue.toFixed(4)}€
                                                            </div>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isDown ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                                {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Power Section */}
                            {item.changes.some((c: any) => c.label.includes('Potencia')) && (
                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                        <TrendingDown className="w-3.5 h-3.5" /> POTENCIA
                                    </div>
                                    <div className="space-y-3">
                                        {item.changes.filter((c: any) => c.label.includes('Potencia')).map((change: any, cIdx: number) => {
                                            const isDown = change.newValue < change.oldValue;
                                            const diffPercent = ((change.newValue - change.oldValue) / change.oldValue) * 100;
                                            const periodLabel = change.label.match(/\(([^)]+)\)/)?.[1] || change.label;

                                            return (
                                                <div key={cIdx} className="flex items-center justify-between group/row p-2 -mx-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-6 bg-amber-500/10 text-warning rounded-lg flex items-center justify-center text-[10px] font-black border border-warning/20">
                                                            {periodLabel}
                                                        </div>
                                                        <span className="text-xs font-bold text-text-secondary">{change.label.split(' (')[0]}</span>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-[11px] text-slate-400 line-through opacity-60 font-mono italic">{change.oldValue.toFixed(4)}€</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex items-center gap-1 font-mono font-900 text-sm ${isDown ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                                {isDown ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                                {change.newValue.toFixed(4)}€
                                                            </div>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isDown ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                                {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            where("isGlobal", "==", true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            
            // Re-order manually since we disabled it in the query for safety
            const sortedNotifs = notifs.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || 0;
                const dateB = b.createdAt?.toDate?.() || 0;
                return dateB - dateA;
            });

            setNotifications(sortedNotifs);
            setLoading(false);
        }, (error) => {
            console.error("Error loading notifications:", error);
            setLoading(false); // Critical: Stop loading skeleton even on error
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (id: string) => {
        if (!user || !id) return;
        try {
            const docRef = doc(db, "notifications", id);
            await updateDoc(docRef, {
                readBy: arrayUnion(user.uid)
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const hideNotification = async (id: string) => {
        if (!user || !id) return;
        try {
            const docRef = doc(db, "notifications", id);
            await updateDoc(docRef, {
                hiddenBy: arrayUnion(user.uid)
            });
        } catch (error) {
            console.error("Error hiding notification:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            const unread = notifications.filter(n => !n.readBy?.includes(user.uid));
            for (const n of unread) {
                await markAsRead(n.id!);
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'tariff_update': 
                return (
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-warning/10 flex items-center justify-center text-warning shadow-sm border border-amber-100 dark:border-amber-500/20 text-xl">
                        ⚡
                    </div>
                );
            case 'price_drop': 
                return (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                        <Megaphone className="w-6 h-6" />
                    </div>
                );
            default: 
                return (
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 dark:border-blue-500/20">
                        <Info className="w-6 h-6" />
                    </div>
                );
        }
    };

    const visibleNotifications = notifications.filter(n => !n.hiddenBy?.includes(user?.uid || ''));

    const filteredNotifications = filter === 'all' 
        ? visibleNotifications 
        : visibleNotifications.filter(n => !n.readBy?.includes(user?.uid || ''));

    if (!user && !loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center text-slate-400">
                    <Bell size={40} />
                </div>
                <h1 className="text-xl font-bold dark:text-white">Inicia sesión para ver tus avisos</h1>
                <p className="text-slate-500 text-sm">Necesitas una cuenta para recibir actualizaciones personalizadas.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Actualizaciones</span>
                        </div>
                        <h1 className="text-4xl font-black text-text-primary tracking-tight uppercase">Centro de Alertas</h1>
                        <p className="text-text-secondary font-medium">Historial completo de cambios en tarifas y actualizaciones del sistema.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-surface p-1 rounded-xl border border-border flex shadow-sm">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary'}`}
                            >
                                Todas
                            </button>
                            <button 
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all ${filter === 'unread' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary'}`}
                            >
                                No leídas
                            </button>
                        </div>
                        <button 
                            onClick={markAllAsRead}
                            className="p-3 bg-surface border border-border rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm group"
                            title="Marcar todo como leído"
                        >
                            <Check size={18} />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-surface p-8 rounded-3xl border border-border animate-pulse flex gap-6">
                                    <div className="w-12 h-12 bg-surface-2 rounded-2xl"></div>
                                    <div className="flex-1 space-y-4">
                                        <div className="h-4 bg-surface-2 rounded w-1/4"></div>
                                        <div className="h-3 bg-surface-2 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n) => (
                            <div 
                                key={n.id} 
                                className={`group bg-surface p-6 md:p-8 rounded-[2rem] border transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 ${!n.readBy?.includes(user?.uid || '') ? 'border-primary/20 bg-primary/[0.01]' : 'border-border'}`}
                            >
                                {!n.readBy?.includes(user?.uid || '') && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                                )}

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="shrink-0">
                                        {getIcon(n.type)}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className={`text-lg font-extrabold ${!n.readBy?.includes(user?.uid || '') ? 'text-text-primary' : 'text-slate-500'}`}>
                                                    {n.title}
                                                </h3>
                                                {!n.readBy?.includes(user?.uid || '') && (
                                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Clock size={12} />
                                                {n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Reciente'}
                                                <button 
                                                    onClick={() => hideNotification(n.id!)}
                                                    className="ml-2 p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Eliminar aviso"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {n.data ? (
                                            <TariffUpdateDetail data={n.data} isDark={theme === 'dark'} />
                                        ) : (
                                            <div className={`p-5 md:p-6 rounded-2xl border ${!n.readBy?.includes(user?.uid || '') ? 'bg-white dark:bg-slate-900 border-primary/10' : 'bg-slate-50 dark:bg-slate-800/40 border-border'} shadow-inner overflow-x-auto`}>
                                                <p className="text-[10px] md:text-xs font-mono font-medium leading-relaxed whitespace-pre text-text-primary max-w-none">
                                                    {n.message}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 pt-2">
                                            {n.link && (
                                                <Link 
                                                    href={n.link} 
                                                    onClick={() => markAsRead(n.id!)}
                                                    className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/link"
                                                >
                                                    Ver detalles
                                                    <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            )}
                                            {!n.readBy?.includes(user?.uid || '') && (
                                                <button 
                                                    onClick={() => markAsRead(n.id!)}
                                                    className="text-[10px] font-black text-slate-400 hover:text-text-primary uppercase tracking-widest transition-colors"
                                                >
                                                    Marcar como leído
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-surface rounded-[3rem] border border-dashed border-border space-y-6">
                            <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                <Bell size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-extrabold dark:text-white uppercase tracking-tight">Todo al día</h3>
                                <p className="text-slate-400 font-medium">No tienes notificaciones {filter === 'unread' ? 'no leídas' : ''} en este momento.</p>
                            </div>
                            <Link href="/comparador" className="inline-block px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                                Explorar Tarifas
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h4 className="text-lg font-extrabold uppercase tracking-tight">Recibe alertas en tiempo real</h4>
                            <p className="text-slate-400 text-xs font-medium max-w-md">Nuestro sistema monitoriza el mercado 24/7. Te avisaremos de cualquier cambio significativo en tus tarifas favoritas.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest">Push: Activado</div>
                            <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest">Email: Pendiente</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

