"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useFavorites } from "@/hooks/useFavorites";
import { useTheme } from "next-themes";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { User as UserIcon, LogOut, FileText, Layout, Star, ChevronRight, ChevronDown, Settings, Trash2, X, User, Link as LinkIcon, Zap, Plus, BarChart3, ZoomIn, Clock, Calendar, Info, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

type Tab = "facturas" | "comparativas" | "favoritos";

interface SavedBill {
    id: string;
    name: string;
    createdAt: Timestamp;
    potentialSavings: number;
    bestTariff: string;
    bestCompany: string;
    current_bill_total: number;
    isAiGenerated?: boolean;
    // Datos digitalizados
    power_p1?: number;
    power_p2?: number;
    energy_p1?: number;
    energy_p2?: number;
    energy_p3?: number;
    days?: number;
    invoiceFileUrl?: string;
    invoiceFilePath?: string;
}

export default function ProfilePage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("facturas");
    const { tariffs, loading: tariffsLoading } = useTariffs();
    const { favorites, toggleFavorite, loading: favLoading } = useFavorites();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [avatarFailed, setAvatarFailed] = useState(false);
    const [savedBills, setSavedBills] = useState<SavedBill[]>([]);
    const [loadingBills, setLoadingBills] = useState(true);
    const { showToast } = useToast();

    // Profile Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPhoto, setEditPhoto] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedBill, setSelectedBill] = useState<SavedBill | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Consumption state
    const [consumptionSettings, setConsumptionSettings] = useState({
        power_p1: "4.6",
        power_p2: "4.6",
        energy_p1: "120",
        energy_p2: "85",
        energy_p3: "150",
        days: "30",
        current_bill_total: "0",
        current_price_p1: "0",
        current_price_p2: "0",
        current_price_p3: "0"
    });

    useEffect(() => {
        if (user) {
            setEditName(user.displayName || "");
            setEditPhoto(user.photoURL || "");
    
            // Fetch consumption settings
            const fetchSettings = async () => {
                try {
                    const settingsRef = doc(db, "users", user.uid, "settings", "consumption");
                    const snap = await getDoc(settingsRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        setConsumptionSettings({
                            power_p1: (data.power_p1 || "4.6").toString().replace(".", ","),
                            power_p2: (data.power_p2 || "4.6").toString().replace(".", ","),
                            energy_p1: (data.energy_p1 || "120").toString().replace(".", ","),
                            energy_p2: (data.energy_p2 || "85").toString().replace(".", ","),
                            energy_p3: (data.energy_p3 || "150").toString().replace(".", ","),
                            days: (data.days || "30").toString(),
                            current_bill_total: (data.current_bill_total || "0").toString().replace(".", ","),
                            current_price_p1: (data.current_price_p1 || "0").toString().replace(".", ","),
                            current_price_p2: (data.current_price_p2 || "0").toString().replace(".", ","),
                            current_price_p3: (data.current_price_p3 || "0").toString().replace(".", ",")
                        });
                    }
                } catch (err) {
                    console.error("Error fetching settings:", err);
                }
            };
            fetchSettings();
        }
    }, [user]);

    const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConsumptionSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Convertir a números para guardar en Firestore
        const numericSettings = {
            power_p1: Number(consumptionSettings.power_p1.toString().replace(",", ".")),
            power_p2: Number(consumptionSettings.power_p2.toString().replace(",", ".")),
            energy_p1: Number(consumptionSettings.energy_p1.toString().replace(",", ".")),
            energy_p2: Number(consumptionSettings.energy_p2.toString().replace(",", ".")),
            energy_p3: Number(consumptionSettings.energy_p3.toString().replace(",", ".")),
            days: Number(consumptionSettings.days),
            current_bill_total: Number(consumptionSettings.current_bill_total.toString().replace(",", ".")),
            current_price_p1: Number(consumptionSettings.current_price_p1.toString().replace(",", ".")),
            current_price_p2: Number(consumptionSettings.current_price_p2.toString().replace(",", ".")),
            current_price_p3: Number(consumptionSettings.current_price_p3.toString().replace(",", "."))
        };

        // Validar que no haya NaNs en consumos
        const hasNaN = Object.values(numericSettings).some(val => isNaN(val));
        if (hasNaN) {
            alert("⚠️ Por favor, introduce solo números válidos en los consumos (usa coma o punto para decimales).");
            return;
        }

        setIsUpdating(true);
        try {
            // 1. Actualizar Perfil en Firebase Auth
            await updateProfile(user, {
                displayName: editName,
                photoURL: editPhoto
            });

            // 2. Actualizar Consumos en Firestore
            const settingsRef = doc(db, "users", user.uid, "settings", "consumption");
            await setDoc(settingsRef, numericSettings, { merge: true });

            setIsEditModalOpen(false);
            showToast("Perfil actualizado", "success", "Tus cambios se han guardado correctamente");
            
            // Recargar datos suavemente o reload si es necesario para Auth
            setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
            console.error("Error detallado:", error);
            showToast("Error de actualización", "error", error.message || "No se pudieron guardar los cambios");
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-generate PRO avatar when name changes
    useEffect(() => {
        if (editName.trim()) {
            // Usamos DiceBear Shapes para una identidad visual 100% neutra, robusta y premium
            const proAvatarUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(editName.trim())}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
            setEditPhoto(proAvatarUrl);
        }
    }, [editName]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const deleteBill = async (billId: string, filePath?: string) => {
        if (!user) return;
        if (!confirm("⚠️ ¿Estás seguro? Se eliminará el estudio y su factura de tu cuenta de forma permanente. Esta acción no se puede deshacer.")) return;

        try {
            // 1. Borrar de Cloudflare R2 PRIMERO (si existe ruta)
            if (filePath && !filePath.startsWith("Facturas_Admin")) {
                try {
                    console.log("Iniciando borrado físico en R2:", filePath);
                    const response = await fetch("/api/delete-file", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: filePath }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.warn("R2 API respondió con error (posiblemente ya no existe):", errorData);
                    } else {
                        console.log("Archivo borrado de R2 correctamente");
                    }
                } catch (r2Err: any) {
                    console.error("Error crítico conectando con R2 API:", r2Err);
                }
            }

            // 2. Borrar de Firestore DESPUÉS
            await deleteDoc(doc(db, "users", user.uid, "billInputs", billId));

            if (isDetailsModalOpen) setIsDetailsModalOpen(false);
            showToast("Estudio eliminado", "success", "El registro ha sido borrado de forma permanente");
        } catch (error) {
            console.error("Error general en el proceso de borrado:", error);
            showToast("Error al borrar", "error", "No se pudo eliminar el registro del servidor");
        }
    };

    useEffect(() => {
        if (!user) return;

        let unsubscribe: (() => void) | undefined;

        const setupBillsSubscription = async () => {
            try {
                const q = query(
                    collection(db, "users", user.uid, "billInputs"),
                    orderBy("createdAt", "desc")
                );

                unsubscribe = onSnapshot(q, (snapshot) => {
                    setSavedBills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedBill)));
                    setLoadingBills(false);
                }, (error) => {
                    console.error("Error fetching bills:", error);
                    setLoadingBills(false);
                });
            } catch (error) {
                console.error("Error setting up bills subscription:", error);
                setLoadingBills(false);
            }
        };

        setupBillsSubscription();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const favoriteTariffs = tariffs.filter(t => t.id && favorites.includes(t.id));

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Header Perfil Premium - Compacto */}
                <div className="relative mb-6 sm:mb-8 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-orange-500/10 rounded-[2rem] sm:rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity pointer-events-none"></div>
                    
                    <div className="relative bg-surface backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl shadow-primary/5 border border-white dark:border-slate-800 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 overflow-hidden">
                        {/* Decorative background shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -ml-24 -mb-24"></div>

                        {/* Avatar con Efecto Glow - Reducido */}
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-[1.75rem] sm:rounded-[2rem] blur-xl animate-pulse"></div>
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[1.75rem] sm:rounded-[2rem] bg-surface-2 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden z-10 transition-transform hover:scale-105 duration-500">
                                {user.photoURL && !avatarFailed ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" onError={() => setAvatarFailed(true)} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                                        <UserIcon size={40} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-xl flex items-center justify-center shadow-lg z-20">
                                <Zap size={14} className="text-white fill-current" />
                            </div>
                        </div>

                        {/* Info de Usuario - Compacta */}
                        <div className="grow text-center lg:text-left space-y-3 relative z-10">
                            <div className="space-y-0.5">
                                <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 mb-2">
                                    <span className="px-2.5 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">Usuario Premium</span>
                                    <span className="px-2.5 py-0.5 bg-surface-2 text-text-secondary text-[8px] font-black uppercase tracking-widest rounded-full border border-border">Miembro 2026</span>
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-900 tracking-tight dark:text-white leading-tight">
                                    Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">{user.displayName || user.email?.split('@')[0]}</span>!
                                </h1>
                                <p className="text-xs sm:text-sm text-text-secondary font-medium">{user.email}</p>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4 pt-1">
                                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-border">
                                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText size={14} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[12px] font-black text-text-primary leading-none">{savedBills.filter(b => b.isAiGenerated).length}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Facturas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-border">
                                    <div className="w-7 h-7 rounded-lg bg-accent-bg flex items-center justify-center text-accent">
                                        <Layout size={14} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[12px] font-black text-text-primary leading-none">{savedBills.length}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Estudios</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-border">
                                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                        <Star size={14} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[12px] font-black text-text-primary leading-none">{favoriteTariffs.length}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Favoritos</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones Acción Lateral - Compacto */}
                        <div className="shrink-0 relative z-10 w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                            {isAdmin && (
                                <button
                                    onClick={() => router.push("/admin/dashboard")}
                                    className="w-full lg:w-auto overflow-hidden relative group/admin h-12 px-7 rounded-[1.25rem] bg-primary text-white text-[10px] font-900 uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2.5">
                                        <ShieldAlert size={16} />
                                        Panel Admin
                                    </span>
                                    <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover/admin:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            )}
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full lg:w-auto h-12 px-7 rounded-[1.25rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-white/5 text-slate-900 dark:text-white text-[10px] font-900 uppercase tracking-[0.2em] transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 active:scale-95 group/btn"
                            >
                                <span className="flex items-center justify-center gap-2.5">
                                    <Settings size={16} className="text-primary group-hover/btn:rotate-90 transition-transform duration-500" />
                                    Mi Configuración
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs de Navegación Responsive - Compactas */}
                <div className="mb-8 lg:mb-10">
                    {/* Vista Desktop: Tabs Horizontales - Subtle Pro Edition */}
                    <div className="hidden lg:block relative">
                        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none"></div>
                        <div className="relative flex bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/5 w-fit mx-auto lg:mx-0">
                            {(["facturas", "comparativas", "favoritos"] as Tab[]).map((tab) => {
                                const Icon = tab === "facturas" ? FileText : tab === "comparativas" ? Layout : Star;
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`group relative flex items-center gap-2.5 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden ${isActive
                                            ? "text-white scale-[1.02]"
                                            : "text-slate-400 hover:text-primary"
                                            }`}
                                    >
                                        {/* Background hover/active logic */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-emerald-500 shadow-[0_4px_15px_rgba(var(--primary),0.3)] animate-in fade-in zoom-in-95 duration-500"></div>
                                        )}
                                        
                                        <div className="relative z-10 flex items-center gap-2.5 mt-0.5">
                                            <Icon size={16} className={`transition-all duration-500 ${isActive ? "opacity-100 scale-110" : "opacity-40 group-hover:opacity-100"}`} />
                                            {tab}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Vista Móvil: Menú Desplegable Premium - Reducido */}
                    <div className="lg:hidden relative">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-full bg-surface p-3.5 rounded-2xl flex items-center justify-between border border-border shadow-xl shadow-slate-200/40 dark:shadow-none animate-in fade-in zoom-in-95 duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    {activeTab === "facturas" ? <FileText size={18} /> : activeTab === "comparativas" ? <Layout size={18} /> : <Star size={18} />}
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">Sección Actual</p>
                                    <h4 className="text-xs font-900 dark:text-white uppercase tracking-widest">{activeTab}</h4>
                                </div>
                            </div>
                            <div className={`w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center transition-transform duration-500 ${isMobileMenuOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown size={14} className="text-slate-400" />
                            </div>
                        </button>

                        {isMobileMenuOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-[1.5rem] border border-border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="p-1.5 space-y-1">
                                    {(["facturas", "comparativas", "favoritos"] as Tab[]).map((tab) => {
                                        const Icon = tab === "facturas" ? FileText : tab === "comparativas" ? Layout : Star;
                                        const isActive = activeTab === tab;
                                        return (
                                            <button
                                                key={tab}
                                                onClick={() => {
                                                    setActiveTab(tab);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isActive
                                                    ? "bg-primary/5 text-primary"
                                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon size={16} className={isActive ? "opacity-100" : "opacity-40"} />
                                                    <span className="text-[10px] font-900 uppercase tracking-widest">{tab}</span>
                                                </div>
                                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {/* Overlay para cerrar al hacer click fuera */}
                        {isMobileMenuOpen && (
                            <div 
                                className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]" 
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                        )}
                    </div>
                </div>

                {/* Contenido de Tabs */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === "facturas" && (
                        <div>
                            {loadingBills ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            ) : savedBills.filter(b => b.isAiGenerated).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedBills.filter(b => b.isAiGenerated).map((bill) => (
                                        <div
                                            key={bill.id}
                                            onClick={() => {
                                                setSelectedBill(bill);
                                                setIsDetailsModalOpen(true);
                                            }}
                                            className="group relative bg-surface rounded-[2.5rem] p-7 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 overflow-hidden flex flex-col h-full cursor-pointer"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                                            
                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-14 h-14 bg-surface-2 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[22px] font-black text-text-primary leading-none mb-1">
                                                            {bill.current_bill_total?.toFixed(2)}<span className="text-sm ml-1">€</span>
                                                        </p>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Factura</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-8">
                                                    <div>
                                                        <h3 className="text-sm font-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">{bill.name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                {bill.createdAt ? new Date(bill.createdAt.seconds * 1000).toLocaleDateString() : 'Recién añadida'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center shadow-sm">
                                                            <span className="text-sm">⚡</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total Detectado</span>
                                                    </div>
                                                    <span className="text-lg font-mono font-black text-primary drop-shadow-sm">{bill.current_bill_total?.toFixed(2)} €</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-3 px-1">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Suministro</span>
                                                        <span className="text-[11px] font-extrabold text-text-body truncate">Vivienda</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 items-end text-right">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Consumo</span>
                                                        <span className="text-[11px] font-extrabold text-text-body">
                                                            {((bill.energy_p1 || 0) + (bill.energy_p2 || 0) + (bill.energy_p3 || 0)).toFixed(0)} kWh
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto relative z-10 pt-6">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBill(bill);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                    className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white"
                                                >
                                                    Explorar Análisis
                                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-surface rounded-[2rem] p-12 text-center border border-border border-dashed">
                                    <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl text-slate-300">⚡</span>
                                    </div>
                                    <h3 className="text-lg font-800 dark:text-white mb-2">Sin facturas digitalizadas</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                                        Sube una foto o PDF de tu factura en el comparador para procesarla automáticamente.
                                    </p>
                                    <button
                                        onClick={() => router.push("/comparador")}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-900 uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Escanear Factura
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "comparativas" && (
                        <div>
                            {loadingBills ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            ) : savedBills.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedBills.map((bill) => (
                                        <div
                                            key={bill.id}
                                            className="group bg-surface rounded-[2.5rem] border border-border p-8 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden flex flex-col h-full cursor-pointer"
                                            onClick={() => router.push(`/comparador?historyId=${bill.id}`)}
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full pointer-events-none"></div>
                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 bg-accent-bg rounded-2xl flex items-center justify-center">
                                                        <Layout className="text-accent w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-800 text-sm group-hover:text-primary transition-colors">{bill.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {bill.createdAt?.toDate().toLocaleDateString() || '--'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-8">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Gasto Original:</span>
                                                        <span className="font-mono font-bold dark:text-white">{bill.current_bill_total?.toFixed(2)} €</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Ahorro Mensual:</span>
                                                        <span className="text-accent font-bold">{bill.potentialSavings?.toFixed(2)} €</span>
                                                    </div>
                                                </div>

                                                <div className="bg-surface-2 rounded-2xl p-4 mb-8 border border-border">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ganador Sugerido</p>
                                                    <p className="text-xs font-800 text-primary truncate">{bill.bestTariff}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{bill.bestCompany}</p>
                                                </div>

                                                <div className="mt-auto pt-6 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => router.push(`/comparador?historyId=${bill.id}`)}
                                                        className="flex-1 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg active:scale-95"
                                                    >
                                                        Ver Comparativa
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteBill(bill.id, bill.invoiceFilePath);
                                                        }}
                                                        className="w-12 h-12 bg-red-500/10 text-red-500 rounded-[1.25rem] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/10 active:scale-95"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-surface rounded-[2rem] p-12 text-center border border-border border-dashed">
                                    <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Layout className="text-slate-300 w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-800 dark:text-white mb-2">No tienes comparativas</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                                        Realiza estudios de ahorro y guárdalos para ver cómo evolucionan tus opciones.
                                    </p>
                                    <button
                                        onClick={() => router.push("/comparador")}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-900 uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Nueva Comparativa
                                        <Plus size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "favoritos" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteTariffs.length > 0 ? (
                                favoriteTariffs.map((tariff) => (
                                        <div key={tariff.id} className="group relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.25rem] p-7 shadow-xl shadow-primary/5 border border-slate-200/60 dark:border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 overflow-hidden flex flex-col h-full">
                                            {/* Glow decorativo */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                                            
                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                                                        <img
                                                            src={getLogoPath(tariff.company || '') || ''}
                                                            alt={tariff.company || 'Tarifa'}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (tariff.id) toggleFavorite(tariff.id);
                                                        }}
                                                        className="w-11 h-11 rounded-xl bg-primary/[0.03] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 border border-primary/5"
                                                    >
                                                        <Star size={18} className="fill-current" />
                                                    </button>
                                                </div>
 
                                                <div className="mb-6">
                                                    <div className="flex items-center gap-2 mb-2.5">
                                                        <span className="px-2.5 py-0.5 bg-slate-100/50 dark:bg-slate-800/60 text-slate-400 text-[8px] font-black uppercase tracking-[0.15em] rounded-full border border-slate-200/40 dark:border-white/5">{tariff.type}</span>
                                                        {tariff.id?.includes('recomendado') && (
                                                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-[0.15em] rounded-full border border-emerald-100 flex items-center gap-1">
                                                                <Zap size={8} className="fill-current" /> Recomendado
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-lg font-900 dark:text-white leading-tight group-hover:text-primary transition-colors mb-0.5 line-clamp-1">{tariff.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{tariff.company}</p>
                                                </div>
 
                                                {/* Precios Express - Refinado */}
                                                <div className="grid grid-cols-1 gap-2 mb-8">
                                                    <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center text-xs">⚡</div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energía P1</span>
                                                        </div>
                                                        <span className="text-sm font-mono font-black dark:text-white">{(tariff.e1_kwh || 0).toFixed(4)} <span className="text-[9px] text-slate-400 font-bold italic ml-0.5">€/kWh</span></span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center text-xs">🔌</div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Potencia P1</span>
                                                        </div>
                                                        <span className="text-sm font-mono font-black dark:text-white">{(tariff.p1_kw_day || 0).toFixed(4)} <span className="text-[9px] text-slate-400 font-bold italic ml-0.5">€/kW</span></span>
                                                    </div>
                                                </div>
 
                                                <div className="mt-auto pt-4">
                                                    <button
                                                        onClick={() => router.push(`/comparador?tariff=${tariff.id}`)}
                                                        className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        Ver Detalles
                                                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="bg-surface rounded-[2rem] p-12 text-center border border-border border-dashed md:col-span-2 lg:col-span-3">
                                    <div className="w-16 h-16 bg-surface-2/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Star className="text-primary/20 w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-800 dark:text-white mb-2">Tu lista de guardados está vacía</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                                        Guarda las tarifas que más te interesen para vigilarlas de cerca y decidir con calma.
                                    </p>
                                    <button
                                        onClick={() => router.push("/tarifas")}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-surface-2/40 text-text-body rounded-2xl text-xs font-900 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Explorar Tarifas
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Modal Editar Perfil - Luxury Minimalist Edition */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500 p-0 sm:p-6 lg:p-12"
                     onClick={() => setIsEditModalOpen(false)}>
                    <div
                        className="bg-white dark:bg-[#080b0f] w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-t sm:border border-border relative overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-700 flex flex-col max-h-[92vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sublime Ambient Glows - Enhanced Saturation */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none opacity-30"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none opacity-20"></div>

                        {/* Minimalist Header with Subtle Color */}
                        <div className="relative z-10 px-6 py-5 sm:px-10 sm:py-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-[#0a0e15]/60 backdrop-blur-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5 pointer-events-none"></div>
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group transition-all hover:bg-primary hover:text-white">
                                    <Settings size={22} className="group-hover:rotate-90 transition-transform duration-700 ease-in-out" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xl font-bold text-text-primary tracking-tight">Preferencias</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-text-primary transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleUpdateProfile} className="p-4 sm:p-8">
                                <div className="space-y-6">
                                    {/* IDENTITY HEADER: CENTERED STACK */}
                                    <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-100 dark:border-white/5 pb-10 text-center">
                                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-surface-2 border-2 border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex items-center justify-center p-0.5 ring-4 ring-slate-50 dark:ring-white/5">
                                            {editPhoto ? (
                                                <img src={editPhoto} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                    <UserIcon size={28} />
                                                </div>
                                            )}
                                        </div>
                                        <label htmlFor="userNameInput" className="w-full max-w-xs space-y-0 cursor-text p-2.5 px-6 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl transition-all focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-white/10 text-center">
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-0.5">Nombre o Usuario</span>
                                            <input
                                                id="userNameInput"
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full h-10 bg-transparent border-0 px-0 text-xl font-black text-slate-800 dark:text-white focus:outline-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-white/20 text-center"
                                                placeholder="Tu nombre o alias..."
                                            />
                                        </label>
                                    </div>

                                    <div className="max-w-xl mx-auto">
                                        <div className="space-y-6">
                                                
                                                {/* METADATA PREVIA (DÍASS Y GASTO) */}
                                                <div className="flex flex-col items-center space-y-4">
                                                    <div className="flex flex-wrap justify-center gap-6">
                                                        <div className="flex flex-col items-center space-y-1.5">
                                                            <label className="text-[9px] font-bold text-text-secondary uppercase">Días</label>
                                                            <input
                                                                type="text"
                                                                name="days"
                                                                value={consumptionSettings.days}
                                                                onChange={handleConsumptionChange}
                                                                className="w-20 text-center bg-surface-2 border-border rounded-xl px-2 py-1.5 text-[13px] font-mono focus:border-primary transition-all outline-none"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-center space-y-1.5">
                                                            <label className="text-[9px] font-bold text-text-secondary uppercase">Gasto (€)</label>
                                                            <input
                                                                type="text"
                                                                name="current_bill_total"
                                                                value={consumptionSettings.current_bill_total}
                                                                onChange={handleConsumptionChange}
                                                                className="w-24 text-center bg-surface-2 border-border rounded-xl px-2 py-1.5 text-[13px] font-mono focus:border-primary transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* POTENCIAS CONTRATADAS */}
                                                <div className="flex flex-col items-center space-y-3">
                                                    <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-widest text-center">Potencias (kW)</h4>
                                                    <div className="flex flex-wrap justify-center gap-6">
                                                        <div className="flex flex-col items-center space-y-1.5">
                                                            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-tight">Punta (P1)</label>
                                                            <input
                                                                type="text"
                                                                name="power_p1"
                                                                value={consumptionSettings.power_p1}
                                                                onChange={handleConsumptionChange}
                                                                className="w-20 text-center bg-surface-2 border-border rounded-xl px-2 py-1.5 text-[13px] font-mono focus:border-primary transition-all outline-none"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-center space-y-1.5">
                                                            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-tight">Valle (P2)</label>
                                                            <input
                                                                type="text"
                                                                name="power_p2"
                                                                value={consumptionSettings.power_p2}
                                                                onChange={handleConsumptionChange}
                                                                className="w-20 text-center bg-surface-2 border-border rounded-xl px-2 py-1.5 text-[13px] font-mono focus:border-primary transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CONSUMO DE ENERGÍA */}
                                                <div className="flex flex-col items-center space-y-3">
                                                    <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-widest text-center">Consumo (kWh)</h4>
                                                    <div className="flex flex-wrap justify-center gap-4">
                                                        {[
                                                            { label: "Punta (E1)", name: "energy_p1" },
                                                            { label: "Llano (E2)", name: "energy_p2" },
                                                            { label: "Valle (E3)", name: "energy_p3" },
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="flex flex-col items-center space-y-1.5">
                                                                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-tight">{item.label}</label>
                                                                <input
                                                                    type="text"
                                                                    name={item.name}
                                                                    value={consumptionSettings[item.name as keyof typeof consumptionSettings]}
                                                                    onChange={handleConsumptionChange}
                                                                    className="w-24 text-center bg-surface-2 border-border rounded-xl px-2 py-1.5 text-[13px] font-mono focus:border-primary transition-all outline-none"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* PRECIOS DE ENERGÍA (OPCIONAL) */}
                                                <div className="flex flex-col items-center space-y-3">
                                                    <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-widest text-center">Precios Opcionales (€/kWh)</h4>
                                                    <div className="flex flex-wrap justify-center gap-4">
                                                        {[
                                                            { label: "Punta (P1)", name: "current_price_p1" },
                                                            { label: "Llano (P2)", name: "current_price_p2" },
                                                            { label: "Valle (P3)", name: "current_price_p3" },
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="flex flex-col items-center space-y-1.5">
                                                                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-tight">{item.label}</label>
                                                                <input
                                                                    type="text"
                                                                    name={item.name}
                                                                    value={consumptionSettings[item.name as keyof typeof consumptionSettings]}
                                                                    onChange={handleConsumptionChange}
                                                                    placeholder="0,0000"
                                                                    className="w-24 text-center bg-surface-2 border-border rounded-xl px-2 py-1.5 text-[13px] font-mono focus:border-primary transition-all outline-none"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Contextual Note */}
                                                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium text-center pt-4 sm:pt-6 px-4 leading-relaxed max-w-[320px] mx-auto">
                                                    Estos valores calibran tus comparativas cuando no subes una factura, garantizando que los cálculos de ahorro sean mucho más precisos y reales.
                                                </p>
                                            </div>
                                        </div>

                                    {/* Footer Actions */}
                                    <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-6">
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full sm:w-64 h-12 bg-primary text-white rounded-2xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 hover:shadow-primary/35 disabled:opacity-50 disabled:scale-100"
                                        >
                                            {isUpdating ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span className="text-[11px] font-black uppercase tracking-[0.15em]">Guardar Preferencias</span>
                                                    <ChevronRight size={18} className="text-white/80" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal Detalles de Factura Digitalizada Premium */}
            {isDetailsModalOpen && selectedBill && (
                <div 
                    className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500"
                    onClick={() => setIsDetailsModalOpen(false)}
                >
                    <div
                        className="bg-surface w-full max-w-5xl h-[90vh] lg:h-[80vh] rounded-[2rem] lg:rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden flex flex-col lg:flex-row animate-in slide-in-from-bottom-12 zoom-in-95 duration-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

                        {/* LEFT VIEW (DESKTOP): DOCUMENT PREVIEW */}
                        {selectedBill.invoiceFileUrl && (
                            <div className="hidden lg:flex w-1/2 h-full rounded-2xl overflow-hidden border border-border bg-surface-2 flex-col">
                                <div className="p-4 bg-surface-2 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Documento Original</span>
                                    </div>
                                    <a
                                        href={selectedBill.invoiceFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-500 hover:text-primary px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200 dark:border-slate-600 transition-colors"
                                    >
                                        Abrir en Pestaña
                                    </a>
                                </div>
                                <div className="flex-1 w-full h-full relative p-2 overflow-hidden">
                                    {selectedBill.invoiceFileUrl.toLowerCase().includes('.pdf') ? (
                                        <iframe src={selectedBill.invoiceFileUrl} className="w-full h-full rounded-xl" title="Factura_Original" />
                                    ) : (
                                        <div 
                                            className={`w-full h-full rounded-xl overflow-auto relative flex items-start justify-center cursor-zoom-in group ${isZoomed ? "cursor-zoom-out" : ""}`}
                                            onClick={() => setIsZoomed(!isZoomed)}
                                        >
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest border border-white/20">
                                                    <ZoomIn className="w-4 h-4" /> {isZoomed ? "Click para alejar" : "Click para acercar"}
                                                </div>
                                            </div>
                                            <img 
                                                src={selectedBill.invoiceFileUrl} 
                                                alt="Factura Original" 
                                                className={`transition-all duration-300 origin-top ${isZoomed ? "w-[200%] max-w-none" : "w-full object-contain"}`} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* RIGHT VIEW: ALIGNED DATA AND METRICS */}
                        <div className={`relative z-10 flex flex-col h-full w-full ${selectedBill.invoiceFileUrl ? 'lg:w-1/2' : 'lg:w-full'} p-4 sm:p-6 lg:p-8`}>
                            <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:justify-between mb-6 lg:mb-8 relative">
                                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                        <FileText className="w-6 h-6 lg:w-7 lg:h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-base lg:text-xl font-900 tracking-tight dark:text-white mb-0.5 lg:mb-1">Análisis IA</h3>
                                        <p className="text-[7px] lg:text-[9px] font-black text-slate-400 uppercase tracking-wider">{selectedBill.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsZoomed(false);
                                        setIsDetailsModalOpen(false);
                                    }}
                                    className="absolute -top-1 -right-1 lg:relative lg:top-0 lg:right-0 w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-surface-2 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 mb-4">
                                <div className="space-y-4 lg:space-y-6">
                                    <div className="p-3.5 sm:p-5 bg-surface-2 rounded-2xl border border-border flex flex-col items-center text-center lg:items-start lg:text-left">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span>🔌</span> Término de Potencia
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">P1 (Punta)</p>
                                                <p className="text-base font-mono font-bold dark:text-white">{selectedBill.power_p1?.toFixed(2) || "0.00"} <span className="text-[10px] text-slate-400">kW</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">P2 (Valle)</p>
                                                <p className="text-base font-mono font-bold dark:text-white">{selectedBill.power_p2?.toFixed(2) || "0.00"} <span className="text-[10px] text-slate-400">kW</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 sm:p-5 bg-surface-2 rounded-2xl border border-border flex flex-col items-center text-center lg:items-start lg:text-left">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span>📄</span> Información General
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">Días de Factura</p>
                                                <p className="text-base font-mono font-bold dark:text-white">{selectedBill.days || "--"} <span className="text-[10px] text-slate-400">días</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">Total Factura</p>
                                                <p className="text-base font-mono font-bold text-primary">{selectedBill.current_bill_total?.toFixed(2)} €</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3.5 sm:p-5 bg-surface-2 rounded-2xl border border-border h-full flex flex-col items-center text-center lg:items-start lg:text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span>⚡</span> Energía Consumida (kWh)
                                    </p>
                                    <div className="space-y-4 w-full">
                                        <div className="flex justify-between items-center pb-2 border-b border-border">
                                            <span className="text-xs font-bold text-orange-500">P1 (Punta)</span>
                                            <span className="font-mono font-bold dark:text-white">{selectedBill.energy_p1?.toFixed(1) || "0.0"} kWh</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-border">
                                            <span className="text-xs font-bold text-blue-500">P2 (Llano)</span>
                                            <span className="font-mono font-bold dark:text-white">{selectedBill.energy_p2?.toFixed(1) || "0.0"} kWh</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-border">
                                            <span className="text-xs font-bold text-green-500">P3 (Valle)</span>
                                            <span className="font-mono font-bold dark:text-white">{selectedBill.energy_p3?.toFixed(1) || "0.0"} kWh</span>
                                        </div>
                                        <div className="pt-2 flex justify-between items-center mt-2">
                                            <span className="text-xs font-black uppercase text-slate-400">Total</span>
                                            <span className="text-xl font-mono font-black text-text-primary">
                                                {((selectedBill.energy_p1 || 0) + (selectedBill.energy_p2 || 0) + (selectedBill.energy_p3 || 0)).toFixed(1)} kWh
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* CIRCULAR VISUAL BREAKDOWN WIDGET */}
                            <div className="flex-grow flex flex-col p-4 sm:p-5 lg:p-6 bg-surface-2 rounded-2xl border border-border min-h-[260px] lg:mt-2 mb-8 lg:mb-10 lg:pb-8">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 lg:mb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-primary rounded-full"></span> Gráfico de Consumo por Tramos
                                </p>
                                
                                {((selectedBill.energy_p1 || 0) + (selectedBill.energy_p2 || 0) + (selectedBill.energy_p3 || 0)) > 0 ? (
                                    <div className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-8 h-full py-2">
                                        {(() => {
                                            const total = (selectedBill.energy_p1 || 0) + (selectedBill.energy_p2 || 0) + (selectedBill.energy_p3 || 0);
                                            const p1Percent = total > 0 ? ((selectedBill.energy_p1 || 0) / total) * 100 : 0;
                                            const p2Percent = total > 0 ? ((selectedBill.energy_p2 || 0) / total) * 100 : 0;
                                            const p3Percent = total > 0 ? ((selectedBill.energy_p3 || 0) / total) * 100 : 0;
                                            
                                            // The pie chart colors based on screenshot: Green (Valle), Yellow/Blue (Llano), Red/Orange (Punta)
                                            // We'll use our established colors: Orange (Punta), Blue (Llano), Green (Valle)
                                            const gradientStops = `#f97316 0% ${p1Percent}%, #3b82f6 ${p1Percent}% ${p1Percent + p2Percent}%, #22c55e ${p1Percent + p2Percent}% 100%`;
                                            
                                            return (
                                                <>
                                                    {/* THE DONUT CHART */}
                                                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 shrink-0 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform hover:scale-105" 
                                                         style={{ background: `conic-gradient(${gradientStops})` }}>
                                                        {/* Inner hollow circle to make it a donut */}
                                                        <div className="w-[70%] h-[70%] bg-surface rounded-full shadow-inner flex flex-col items-center justify-center z-10 border border-white/50 dark:border-slate-800/50 backdrop-blur-sm">
                                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-text-muted mb-0.5" />
                                                            <span className="text-[10px] sm:text-xs lg:text-sm font-black text-text-primary leading-none">{total.toFixed(0)}</span>
                                                            <span className="text-[6px] sm:text-[7px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">kWh Total</span>
                                                        </div>
                                                        {/* Decorative outer glow based on colors could go here, but conic-gradient is enough */}
                                                        <div className="absolute inset-0 rounded-full ring-2 ring-white/20 dark:ring-white/5 pointer-events-none"></div>
                                                    </div>

                                                    {/* LIST OF PERIODS */}
                                                    <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                                        <div className="flex items-center gap-3 lg:gap-4 bg-surface p-2.5 lg:p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:border-orange-500/30 transition-colors">
                                                            <div className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 rounded-full bg-orange-500 shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.6)]"></div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-[9px] lg:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Punta</span>
                                                                <span className="text-[8px] lg:text-[9px] text-slate-400 mt-0.5 leading-tight font-medium">10-14h y 18-22h</span>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <div className="text-xs lg:text-base font-black text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg">{p1Percent.toFixed(1)}%</div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-3 lg:gap-4 bg-surface p-2.5 lg:p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-colors">
                                                            <div className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-[9px] lg:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Llano</span>
                                                                <span className="text-[8px] lg:text-[9px] text-slate-400 mt-0.5 leading-tight font-medium">08-10, 14-18, 22-00</span>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <div className="text-xs lg:text-base font-black text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg">{p2Percent.toFixed(1)}%</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 lg:gap-4 bg-surface p-2.5 lg:p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:border-green-500/30 transition-colors">
                                                            <div className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-[9px] lg:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Valle</span>
                                                                <span className="text-[8px] lg:text-[9px] text-slate-400 mt-0.5 leading-tight font-medium">Noches y FinSemana</span>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <div className="text-xs lg:text-base font-black text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-lg">{p3Percent.toFixed(1)}%</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="flex-grow flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <Clock className="w-8 h-8 text-slate-400" />
                                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Distribución no disponible</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                            


                            <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-border mt-4">
                                {selectedBill.invoiceFileUrl && (
                                    <a
                                        href={selectedBill.invoiceFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="lg:hidden w-full sm:flex-1 h-10 sm:h-12 bg-surface-2 text-text-primary rounded-2xl flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold hover:bg-slate-200 transition-all border border-border"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        Ver Documento Original
                                    </a>
                                )}
                                <div className="flex gap-2.5 w-full sm:w-auto sm:flex-1 justify-center">
                                    <button
                                        onClick={() => deleteBill(selectedBill.id, selectedBill.invoiceFilePath)}
                                        className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                        title="Borrar Análisis"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/comparador?historyId=${selectedBill.id}`)}
                                        className="flex-1 h-10 sm:h-12 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        <span>Ir a la Comparativa</span>
                                        <BarChart3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
