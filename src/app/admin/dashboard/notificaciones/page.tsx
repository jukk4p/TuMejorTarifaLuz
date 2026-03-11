"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Notification, deleteNotification, notifySystemUpdate } from "@/lib/notifications";
import { 
    Trash2, 
    Bell, 
    Zap, 
    ShieldAlert, 
    Info, 
    Megaphone, 
    ChevronLeft,
    Search,
    RefreshCw,
    Plus
} from "lucide-react";
import { useRouter } from "next/navigation";

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date);
};

const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date) + 'h';
};

export default function NotificationsManagementPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            setNotifications(notifs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta notificación?")) {
            try {
                await deleteNotification(id);
            } catch (error) {
                alert("Error al eliminar la notificación");
            }
        }
    };

    const handleCreateGlobal = async () => {
        const title = prompt("Título de la notificación:");
        const message = prompt("Mensaje de la notificación:");
        if (title && message) {
            setIsCreating(true);
            try {
                await notifySystemUpdate(title, message);
                alert("¡Notificación global enviada!");
            } catch (error) {
                alert("Error al enviar notificación");
            } finally {
                setIsCreating(false);
            }
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'tariff_update': return <Zap className="text-amber-500" size={18} />;
            case 'system_update': return <ShieldAlert className="text-primary" size={18} />;
            case 'price_drop': return <Zap className="text-emerald-500" size={18} />;
            case 'new_tariff': return <Megaphone className="text-blue-500" size={18} />;
            default: return <Bell className="text-slate-400" size={18} />;
        }
    };

    const filteredNotifications = notifications.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white uppercase">Gestión de Notificaciones</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Administra los avisos y comunicaciones directas con los usuarios.</p>
                    </div>
                </div>
                <button
                    onClick={handleCreateGlobal}
                    disabled={isCreating}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-900 uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Plus size={16} />
                    Nueva Notificación Global
                </button>
            </div>

            {/* Stats & Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 premium-card p-6 space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Enviadas</p>
                        <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{notifications.length}</p>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filtros Rápidos</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">SISTEMA</span>
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-full uppercase">TARIFAS</span>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase">OFERTAS</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 premium-card p-6 flex flex-col justify-center">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar en el historial de notificaciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-14 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="premium-card overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Historial Cronológico</h3>
                </div>
                
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <RefreshCw className="text-primary animate-spin" size={32} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando base de datos...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
                        <Bell className="text-slate-200 dark:text-slate-800" size={64} />
                        <div className="space-y-1">
                            <h4 className="font-extrabold dark:text-white">Sin notificaciones activas</h4>
                            <p className="text-xs text-slate-500 max-w-xs">No se encontraron avisos que coincidan con tu búsqueda o aún no has enviado ninguno.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-4">Aviso</th>
                                    <th className="px-8 py-4">Mensaje</th>
                                    <th className="px-8 py-4">Fecha</th>
                                    <th className="px-8 py-4">Alcance</th>
                                    <th className="px-8 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredNotifications.map((notif) => (
                                    <tr key={notif.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                                                    {getIcon(notif.type)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black dark:text-white truncate max-w-[150px]">{notif.title}</p>
                                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase">{notif.type.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-sm font-medium">
                                                {notif.message}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold dark:text-slate-200">
                                                    {notif.createdAt?.seconds ? formatDate(new Date(notif.createdAt.seconds * 1000)) : "Pendiente"}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-medium">
                                                    {notif.createdAt?.seconds ? formatTime(new Date(notif.createdAt.seconds * 1000)) : ""}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black px-2 py-1 rounded-lg border ${
                                                notif.isGlobal 
                                                ? "bg-primary/5 text-primary border-primary/20" 
                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                            }`}>
                                                {notif.isGlobal ? "🌐 GLOBAL" : "👤 PERSONAL"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => notif.id && handleDelete(notif.id)}
                                                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all opacity-0 group-hover:opacity-100"
                                                title="Eliminar Notificación"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">
                Tip: Las notificaciones eliminadas desaparecen instantáneamente de las campanas de los usuarios.
            </p>
        </div>
    );
}
