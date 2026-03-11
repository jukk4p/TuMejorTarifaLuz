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
import { getDb, getAuthInstance } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { User as UserIcon, LogOut, FileText, Layout, Star, ChevronRight, Settings, Trash2, X, User, Link as LinkIcon, Zap, Plus, BarChart3, ZoomIn, Clock } from "lucide-react";

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
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("facturas");
    const { tariffs, loading: tariffsLoading } = useTariffs();
    const { favorites, toggleFavorite, loading: favLoading } = useFavorites();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [savedBills, setSavedBills] = useState<SavedBill[]>([]);
    const [loadingBills, setLoadingBills] = useState(true);

    // Profile Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPhoto, setEditPhoto] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedBill, setSelectedBill] = useState<SavedBill | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Consumption state
    const [consumptionSettings, setConsumptionSettings] = useState({
        power_p1: "4.6",
        power_p2: "4.6",
        energy_p1: "120",
        energy_p2: "85",
        energy_p3: "150",
        days: "30",
        current_bill_total: "0"
    });

    useEffect(() => {
        if (user) {
            setEditName(user.displayName || "");
            setEditPhoto(user.photoURL || "");
    
            // Fetch consumption settings
            const fetchSettings = async () => {
                try {
                    const db = await getDb();
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
                            current_bill_total: (data.current_bill_total || "0").toString().replace(".", ",")
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
            current_bill_total: Number(consumptionSettings.current_bill_total.toString().replace(",", "."))
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
            const db = await getDb();
            const settingsRef = doc(db, "users", user.uid, "settings", "consumption");
            await setDoc(settingsRef, numericSettings, { merge: true });

            setIsEditModalOpen(false);
            alert("✅ Perfil y consumos actualizados con éxito");
            window.location.reload();
        } catch (error: any) {
            console.error("Error detallado:", error);
            alert("⚠️ " + (error.message || "Error al actualizar el perfil"));
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
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
            const db = await getDb();
            await deleteDoc(doc(db, "users", user.uid, "billInputs", billId));

            if (isDetailsModalOpen) setIsDetailsModalOpen(false);
            alert("✅ Borrado completado con éxito.");
        } catch (error) {
            console.error("Error general en el proceso de borrado:", error);
            alert("❌ Hubo un fallo al eliminar el registro.");
        }
    };

    useEffect(() => {
        if (!user) return;

        let unsubscribe: (() => void) | undefined;

        const setupBillsSubscription = async () => {
            try {
                const db = await getDb();
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
            <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Perfil */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-primary/10 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden shrink-0">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <User className="text-primary w-10 h-10" />
                                </div>
                            )}
                        </div>

                        <div className="text-center md:text-left space-y-2 grow">
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">Usuario Premium</span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Miembro desde 2026</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-900 tracking-tight dark:text-white">Hola, {user.displayName || user.email?.split('@')[0]}!</h1>
                            <p className="text-slate-500 font-medium">{user.email}</p>
                        </div>

                        <div className="shrink-0 flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="h-12 px-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-primary transition-all active:scale-95"
                            >
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs de Navegación */}
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 lg:w-fit">
                    {(["facturas", "comparativas", "favoritos"] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-slate-500 hover:text-primary"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
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
                                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-7 shadow-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden cursor-pointer flex flex-col h-full"
                                        >
                                            {/* Decorative background element */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>
                                            
                                            <div className="flex items-start justify-between mb-8 relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/5 shrink-0 group-hover:scale-110 transition-transform">
                                                        <FileText className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-900 text-[15px] dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{bill.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"></div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                {bill.createdAt?.toDate().toLocaleDateString() || '--'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-10 relative z-10">
                                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                                            <Zap size={14} className="text-primary" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Detectado</span>
                                                    </div>
                                                    <span className="text-lg font-mono font-black text-primary drop-shadow-sm">{bill.current_bill_total?.toFixed(2)} €</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-3 px-1">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Suministro</span>
                                                        <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 truncate">Vivienda</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 items-end text-right">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Consumo</span>
                                                        <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300">
                                                            {((bill.energy_p1 || 0) + (bill.energy_p2 || 0) + (bill.energy_p3 || 0)).toFixed(0)} kWh
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto relative z-10">
                                                <button
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
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center border border-slate-100 dark:border-slate-800 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Zap className="text-slate-300 w-8 h-8" />
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
                                            onClick={() => router.push(`/comparador?historyId=${bill.id}`)}
                                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden cursor-pointer"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full"></div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
                                                    <Layout className="text-success w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-800 text-sm">{bill.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {bill.createdAt?.toDate().toLocaleDateString() || '--'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Gasto Original:</span>
                                                    <span className="font-mono font-bold">{bill.current_bill_total?.toFixed(2)} €</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Ahorro Mensual:</span>
                                                    <span className="text-success font-bold">{bill.potentialSavings?.toFixed(2)} €</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8 border border-slate-100 dark:border-slate-700/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ganador Sugerido</p>
                                                <p className="text-xs font-800 text-primary truncate">{bill.bestTariff}</p>
                                                <p className="text-[10px] text-slate-500">{bill.bestCompany}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/comparador?historyId=${bill.id}`)}
                                                    className="flex-1 h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    Ver Comparativa
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    deleteBill(bill.id, bill.invoiceFilePath);
                                                }}
                                                className="w-11 h-11 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center border border-slate-100 dark:border-slate-800 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                    <div key={tariff.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:border-primary transition-all group overflow-hidden relative flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                if (tariff.id) toggleFavorite(tariff.id);
                                            }}
                                            className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm hover:scale-110 active:scale-90 transition-all shrink-0"
                                        >
                                            <Star className="w-5 h-5 fill-current" />
                                        </button>
                                            <span className="text-[9px] font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] shrink-0">{tariff.type}</span>
                                        </div>
                                        <div className="mb-6">
                                            <h4 className="font-800 dark:text-white text-lg mb-1 group-hover:text-primary transition-colors leading-tight line-clamp-1">{tariff.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{tariff.company}</p>
                                        </div>

                                        {/* Precios Detallados con altura fija para alineación */}
                                        <div className="grid grid-cols-2 gap-6 mb-8 min-h-[110px]">
                                            <div className="space-y-3">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Energía (€/kWh)</p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-[11px] font-mono">
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400">P1</span>
                                                        <span className="font-bold text-slate-900 dark:text-white">{(tariff.e1_kwh || 0).toFixed(4)}</span>
                                                    </div>
                                                    {tariff.type === '3 Periodos' ? (
                                                        <>
                                                            <div className="flex justify-between items-center text-[11px] font-mono">
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">P2</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{(tariff.e2_kwh || 0).toFixed(4)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-[11px] font-mono">
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">P3</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{(tariff.e3_kwh || 0).toFixed(4)}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="pt-2">
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase italic">Precio único 24h</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Potencia (€/kW día)</p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-[11px] font-mono">
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400">P1</span>
                                                        <span className="font-bold text-slate-900 dark:text-white">{(tariff.p1_kw_day || 0).toFixed(5)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px] font-mono">
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">P2</span>
                                                        <span className="font-bold text-slate-900 dark:text-white">{(tariff.p2_kw_day || 0).toFixed(5)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => router.push(`/comparador?tariff=${tariff.id}`)}
                                            className="w-fit px-10 h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all mt-auto mx-auto shadow-lg shadow-slate-200/50 dark:shadow-none"
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center border border-slate-100 dark:border-slate-800 border-dashed md:col-span-2 lg:col-span-3">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Star className="text-primary/20 w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-800 dark:text-white mb-2">Tu lista de guardados está vacía</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                                        Guarda las tarifas que más te interesen para vigilarlas de cerca y decidir con calma.
                                    </p>
                                    <button
                                        onClick={() => router.push("/tarifas")}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-900 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
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

            {/* Modal Editar Perfil y Configuración */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-500 overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-900 tracking-tight dark:text-white mb-1">Configuración de Usuario</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personaliza tu perfil y datos de consumo base</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* COLUMNA 1: IDENTIDAD */}
                                    <div className="space-y-6">
                                        <h4 className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-[0.2em]">
                                            <UserIcon size={14} /> Identidad Visual
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre Público</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <UserIcon className="text-slate-300 group-focus-within:text-primary transition-colors w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all dark:text-white"
                                                        placeholder="Tu nombre..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">URL Foto de Perfil</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <LinkIcon className="text-slate-300 group-focus-within:text-primary transition-colors w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        value={editPhoto}
                                                        onChange={(e) => setEditPhoto(e.target.value)}
                                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all dark:text-white"
                                                        placeholder="https://ejemplo.com/foto.jpg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COLUMNA 2: CONSUMOS */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="flex items-center gap-2 text-[11px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.2em]">
                                                <Zap size={14} /> Plantilla de Consumo
                                            </h4>
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-md border border-emerald-500/20">Auto-fill listo</span>
                                        </div>

                                        <div className="space-y-6 bg-slate-50/50 dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                            {/* Potencia */}
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Término de Potencia
                                                </p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-2">P1 (kW)</label>
                                                        <input
                                                            type="text"
                                                            name="power_p1"
                                                            value={consumptionSettings.power_p1}
                                                            onChange={handleConsumptionChange}
                                                            className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 text-xs font-mono font-bold focus:border-emerald-500 focus:ring-0 outline-none transition-all dark:text-white"
                                                            placeholder="4,6"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-2">P2 (kW)</label>
                                                        <input
                                                            type="text"
                                                            name="power_p2"
                                                            value={consumptionSettings.power_p2}
                                                            onChange={handleConsumptionChange}
                                                            className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 text-xs font-mono font-bold focus:border-emerald-500 focus:ring-0 outline-none transition-all dark:text-white"
                                                            placeholder="4,6"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Energía por periodos */}
                                            <div className="space-y-4 pt-2">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Energía Mensual
                                                </p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center block">kWh P1</label>
                                                        <input
                                                            type="text"
                                                            name="energy_p1"
                                                            value={consumptionSettings.energy_p1}
                                                            onChange={handleConsumptionChange}
                                                            className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-2 text-center text-xs font-mono font-bold focus:border-emerald-500 focus:ring-0 outline-none transition-all dark:text-white"
                                                            placeholder="120"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center block">kWh P2</label>
                                                        <input
                                                            type="text"
                                                            name="energy_p2"
                                                            value={consumptionSettings.energy_p2}
                                                            onChange={handleConsumptionChange}
                                                            className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-2 text-center text-xs font-mono font-bold focus:border-emerald-500 focus:ring-0 outline-none transition-all dark:text-white"
                                                            placeholder="85"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center block">kWh P3</label>
                                                        <input
                                                            type="text"
                                                            name="energy_p3"
                                                            value={consumptionSettings.energy_p3}
                                                            onChange={handleConsumptionChange}
                                                            className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-2 text-center text-xs font-mono font-bold focus:border-emerald-500 focus:ring-0 outline-none transition-all dark:text-white"
                                                            placeholder="150"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Otros datos */}
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-2">Días Factura</label>
                                                    <input
                                                        type="text"
                                                        name="days"
                                                        value={consumptionSettings.days}
                                                        onChange={handleConsumptionChange}
                                                        className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 text-xs font-mono font-bold focus:border-emerald-500 focus:ring-0 outline-none transition-all dark:text-white"
                                                        placeholder="30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-2">Gasto Actual (€)</label>
                                                    <input
                                                        type="text"
                                                        name="current_bill_total"
                                                        value={consumptionSettings.current_bill_total}
                                                        onChange={handleConsumptionChange}
                                                        className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 text-xs font-mono font-bold focus:border-emerald-500 focus:ring-0 outline-none transition-all dark:text-white"
                                                        placeholder="Ej: 85,50"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="w-full h-16 bg-primary text-white rounded-[1.5rem] text-[11px] font-900 uppercase tracking-[0.25em] shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isUpdating ? "Sincronizando con la nube..." : "Guardar Perfil de Usuario"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalles de Factura Digitalizada */}
            {isDetailsModalOpen && selectedBill && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div
                        className="bg-white dark:bg-slate-900 w-full max-w-5xl lg:max-w-6xl h-[95vh] lg:h-[80vh] min-h-[600px] rounded-[2.5rem] p-6 sm:p-8 md:p-8 lg:p-10 shadow-3xl border border-slate-100 dark:border-slate-800 relative animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row gap-8 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

                        {/* LEFT VIEW (DESKTOP): DOCUMENT PREVIEW */}
                        {selectedBill.invoiceFileUrl && (
                            <div className="hidden lg:flex w-1/2 h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 flex-col">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
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
                        <div className={`relative z-10 flex flex-col h-full w-full ${selectedBill.invoiceFileUrl ? 'lg:w-1/2' : 'lg:w-full'} overflow-y-auto overflow-x-hidden pr-2 lg:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full pb-6 lg:pb-0`}>
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl lg:text-2xl font-900 tracking-tight dark:text-white mb-1">Datos Extraídos por IA</h3>
                                        <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-wider">{selectedBill.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsZoomed(false);
                                        setIsDetailsModalOpen(false);
                                    }}
                                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-primary rounded-full"></span> Término de Potencia
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">P1 (Punta)</p>
                                                <p className="text-lg font-mono font-bold dark:text-white">{selectedBill.power_p1?.toFixed(2) || "0.00"} <span className="text-[10px] text-slate-400">kW</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">P2 (Valle)</p>
                                                <p className="text-lg font-mono font-bold dark:text-white">{selectedBill.power_p2?.toFixed(2) || "0.00"} <span className="text-[10px] text-slate-400">kW</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-primary rounded-full"></span> Información General
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">Días de Factura</p>
                                                <p className="text-lg font-mono font-bold dark:text-white">{selectedBill.days || "--"} <span className="text-[10px] text-slate-400">días</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 mb-1">Total Factura</p>
                                                <p className="text-lg font-mono font-bold text-primary">{selectedBill.current_bill_total?.toFixed(2)} €</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 h-full">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1 h-1 bg-primary rounded-full"></span> Energía Consumida (kWh)
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700/50">
                                            <span className="text-xs font-bold text-orange-500">P1 (Punta)</span>
                                            <span className="font-mono font-bold dark:text-white">{selectedBill.energy_p1?.toFixed(1) || "0.0"} kWh</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700/50">
                                            <span className="text-xs font-bold text-blue-500">P2 (Llano)</span>
                                            <span className="font-mono font-bold dark:text-white">{selectedBill.energy_p2?.toFixed(1) || "0.0"} kWh</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700/50">
                                            <span className="text-xs font-bold text-green-500">P3 (Valle)</span>
                                            <span className="font-mono font-bold dark:text-white">{selectedBill.energy_p3?.toFixed(1) || "0.0"} kWh</span>
                                        </div>
                                        <div className="pt-2 flex justify-between items-center mt-2">
                                            <span className="text-xs font-black uppercase text-slate-400">Total</span>
                                            <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                                                {((selectedBill.energy_p1 || 0) + (selectedBill.energy_p2 || 0) + (selectedBill.energy_p3 || 0)).toFixed(1)} kWh
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* CIRCULAR VISUAL BREAKDOWN WIDGET */}
                            <div className="flex-grow flex flex-col p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 min-h-[260px] lg:mt-2 mb-4 lg:mb-4 lg:pb-8">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 lg:mb-4 flex items-center gap-2">
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
                                                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 shrink-0 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform hover:scale-105" 
                                                         style={{ background: `conic-gradient(${gradientStops})` }}>
                                                        {/* Inner hollow circle to make it a donut */}
                                                        <div className="w-[70%] h-[70%] bg-slate-50 dark:bg-slate-900 rounded-full shadow-inner flex flex-col items-center justify-center z-10 border border-white/50 dark:border-slate-800/50 backdrop-blur-sm">
                                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-400 dark:text-slate-500 mb-0.5 lg:mb-1" />
                                                            <span className="text-sm sm:text-base lg:text-lg font-black text-slate-800 dark:text-white leading-none">{total.toFixed(0)}</span>
                                                            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">kWh Total</span>
                                                        </div>
                                                        {/* Decorative outer glow based on colors could go here, but conic-gradient is enough */}
                                                        <div className="absolute inset-0 rounded-full ring-2 ring-white/20 dark:ring-white/5 pointer-events-none"></div>
                                                    </div>

                                                    {/* LIST OF PERIODS */}
                                                    <div className="flex flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                                        <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-3 sm:px-4 sm:py-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:border-orange-500/30 transition-colors">
                                                            <div className="w-3.5 h-3.5 rounded-full bg-orange-500 shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.6)]"></div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Periodo Punta</span>
                                                                <span className="text-[9px] text-slate-400 mt-0.5 max-w-[140px] leading-tight font-medium">10-14h y 18-22h</span>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <div className="text-sm sm:text-base font-black text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg">{p1Percent.toFixed(1)}%</div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-3 sm:px-4 sm:py-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-colors">
                                                            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Periodo Llano</span>
                                                                <span className="text-[9px] text-slate-400 mt-0.5 max-w-[140px] leading-tight font-medium">08-10h, 14-18h y 22-00h</span>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <div className="text-sm sm:text-base font-black text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg">{p2Percent.toFixed(1)}%</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-3 sm:px-4 sm:py-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:border-green-500/30 transition-colors">
                                                            <div className="w-3.5 h-3.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Periodo Valle</span>
                                                                <span className="text-[9px] text-slate-400 mt-0.5 max-w-[140px] leading-tight font-medium">00-08h FinSemana</span>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <div className="text-sm sm:text-base font-black text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-lg">{p3Percent.toFixed(1)}%</div>
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
                            


                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                {selectedBill.invoiceFileUrl && (
                                    <a
                                        href={selectedBill.invoiceFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="lg:hidden w-full sm:flex-1 h-12 sm:h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Ver Documento Original
                                    </a>
                                )}
                                <div className="flex gap-3 w-full sm:w-auto sm:flex-1">
                                    <button
                                        onClick={() => deleteBill(selectedBill.id, selectedBill.invoiceFilePath)}
                                        className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                        title="Borrar Análisis"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/comparador?historyId=${selectedBill.id}`)}
                                        className="flex-1 h-12 sm:h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        <span className="hidden sm:inline">Ir a la Comparativa</span>
                                        <span className="sm:hidden">Comparar</span>
                                        <BarChart3 className="w-4 h-4" />
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
