
"use client";

import { useState, useEffect } from "react";
import { Bell, X, Info, Zap, Megaphone, Trash2, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { 
    collection, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    limit,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Notification } from "@/lib/notifications";
import Link from "next/link";

export default function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        // Query global notifications and those targeting the user
        const q = query(
            collection(db, "notifications"),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            
            // Filter out hidden notifications
            const visibleNotifs = notifs.filter(n => !n.hiddenBy?.includes(user.uid)).slice(0, 10);
            
            setNotifications(visibleNotifs);
            
            // Count unread
            const unread = visibleNotifs.filter(n => !n.readBy?.includes(user.uid)).length;
            setUnreadCount(unread);
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
            for (const n of notifications) {
                if (!n.readBy?.includes(user.uid)) {
                    await markAsRead(n.id!);
                }
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'tariff_update': return <Zap className="w-4 h-4 text-warning" />;
            case 'price_drop': return <Megaphone className="w-4 h-4 text-accent" />;
            default: return <Info className="w-4 h-4 text-primary" />;
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            >
                <Bell size={18} className="text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-[100]" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-2xl z-[101] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 hidden sm:block">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-[#fcfdfe] dark:bg-slate-900/50">
                            <h3 className="text-xs font-black tracking-widest text-text-primary flex items-center gap-2">
                                Notificaciones
                                {unreadCount > 0 && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[9px]">{unreadCount} nuevas</span>}
                            </h3>
                            <button 
                                onClick={markAllAsRead}
                                className="text-[9px] font-bold text-slate-400 hover:text-primary tracking-tighter"
                            >
                                Marcar todo como leído
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors relative group ${!n.readBy?.includes(user?.uid || '') ? 'bg-primary/[0.02]' : ''}`}
                                    >
                                        {!n.readBy?.includes(user?.uid || '') && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
                                        )}
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-[11px] font-bold ${!n.readBy?.includes(user?.uid || '') ? 'text-text-primary' : 'text-slate-500'}`}>{n.title}</p>
                                                    <span className="text-[9px] text-slate-400">
                                                        {n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleDateString() : 'Reciente'}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-text-secondary leading-relaxed">
                                                    {n.message}
                                                </p>
                                                {n.link && (
                                                    <Link 
                                                        href={n.link} 
                                                        onClick={() => { setIsOpen(false); markAsRead(n.id!); }}
                                                        className="inline-block text-[10px] font-bold text-primary hover:underline mt-1"
                                                    >
                                                        Ver detalle →
                                                    </Link>
                                                )}
                                            </div>
                                            {!n.readBy?.includes(user?.uid || '') && (
                                                <button 
                                                    onClick={() => markAsRead(n.id!)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded transition-all"
                                                    title="Marcar como leído"
                                                >
                                                    <Check size={12} className="text-primary" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => hideNotification(n.id!)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={12} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-3">
                                    <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                        <Bell size={24} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No hay notificaciones</p>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-border text-center">
                                <Link 
                                    href="/notificaciones" 
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] font-black text-slate-400 hover:text-primary tracking-[0.2em]"
                                >
                                    Ver todas las alertas
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Versión Móvil: Centrada y con overlay diferente */}
                    <div className="fixed inset-x-4 top-[72px] bg-surface border border-border rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 sm:hidden flex flex-col max-h-[70vh]">
                        <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary"> Notificaciones </h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div key={n.id} className={`p-5 flex gap-4 relative ${!n.readBy?.includes(user?.uid || '') ? 'bg-primary/[0.03]' : ''}`}>
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-xs font-black truncate ${!n.readBy?.includes(user?.uid || '') ? 'text-text-primary' : 'text-slate-500'}`}>{n.title}</p>
                                                <span className="shrink-0 text-[10px] font-bold text-slate-400">{n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleDateString() : 'Reciente'}</span>
                                            </div>
                                            <p className="text-xs text-text-secondary leading-tight">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-4 pt-2">
                                                {n.link && <Link href={n.link} onClick={() => {setIsOpen(false); markAsRead(n.id!)}} className="text-[10px] font-black text-primary">Ver detalles</Link>}
                                                <button onClick={() => hideNotification(n.id!)} className="text-[10px] font-black text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                        {!n.readBy?.includes(user?.uid || '') && (
                                            <button onClick={() => markAsRead(n.id!)} className="shrink-0 self-center w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                        <Bell size={32} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin notificaciones</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-border">
                            <Link href="/notificaciones" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-primary text-white text-[10px] font-black text-center tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20">
                                Ver todas las alertas
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
