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
import { collection, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

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

    const deleteBill = async (billId: string) => {
        if (!user) return;
        if (!confirm("¿Estás seguro de que quieres borrar este análisis?")) return;

        try {
            await deleteDoc(doc(db, "users", user.uid, "billInputs", billId));
        } catch (error) {
            console.error("Error deleting bill:", error);
            alert("No se pudo borrar el análisis");
        }
    };

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "users", user.uid, "billInputs"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSavedBills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedBill)));
            setLoadingBills(false);
        }, (error) => {
            console.error("Error fetching bills:", error);
            setLoadingBills(false);
        });

        return () => unsubscribe();
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
                                    <span className="material-icons text-primary text-4xl">person</span>
                                </div>
                            )}
                        </div>

                        <div className="text-center md:text-left space-y-2 grow">
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">Usuario Premium</span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Miembro desde 2024</span>
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
                                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden cursor-pointer"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                    <span className="material-icons text-primary text-2xl">description</span>
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
                                                    <span className="text-slate-500">Total Detectado:</span>
                                                    <span className="font-mono font-bold">€{bill.current_bill_total?.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button
                                                className="w-full h-11 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-slate-200 dark:border-slate-700"
                                            >
                                                Ver Datos Digitalizados
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center border border-slate-100 dark:border-slate-800 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <span className="material-icons text-slate-300 text-3xl">auto_fix_high</span>
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
                                                    <span className="material-icons text-success text-2xl">insights</span>
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
                                                    <span className="font-mono font-bold">€{bill.current_bill_total?.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Ahorro Mensual:</span>
                                                    <span className="text-success font-bold">€{bill.potentialSavings?.toFixed(2)}</span>
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
                                                        deleteBill(bill.id);
                                                    }}
                                                    className="w-11 h-11 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-icons text-sm">delete_outline</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center border border-slate-100 dark:border-slate-800 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <span className="material-icons text-slate-300 text-3xl">compare_arrows</span>
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
                                        <span className="material-icons text-sm">add</span>
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
                                                <span className="material-icons text-xl">turned_in</span>
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
                                        <span className="material-icons text-primary/20 text-3xl">turned_in</span>
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
                                    <span className="material-icons text-xl">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* COLUMNA 1: IDENTIDAD */}
                                    <div className="space-y-6">
                                        <h4 className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-[0.2em]">
                                            <span className="material-icons text-sm">person_outline</span> Identidad Visual
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre Público</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="material-icons text-slate-300 group-focus-within:text-primary transition-colors text-lg">person</span>
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
                                                        <span className="material-icons text-slate-300 group-focus-within:text-primary transition-colors text-lg">link</span>
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
                                                <span className="material-icons text-sm">electric_bolt</span> Plantilla de Consumo
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
                        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 shadow-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <span className="material-icons text-3xl">fact_check</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-900 tracking-tight dark:text-white mb-1">Datos Extraídos por IA</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{selectedBill.name} • {selectedBill.createdAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-icons text-xl">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
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
                                                <p className="text-lg font-mono font-bold text-primary">€{selectedBill.current_bill_total?.toFixed(2)}</p>
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
                                        <div className="pt-2 flex justify-between items-center">
                                            <span className="text-xs font-black uppercase text-slate-400">Total</span>
                                            <span className="text-lg font-mono font-black text-slate-900 dark:text-white">
                                                {((selectedBill.energy_p1 || 0) + (selectedBill.energy_p2 || 0) + (selectedBill.energy_p3 || 0)).toFixed(1)} kWh
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                                {selectedBill.invoiceFileUrl && (
                                    <a
                                        href={selectedBill.invoiceFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700"
                                    >
                                        <span className="material-icons text-sm">picture_as_pdf</span>
                                        Ver Documento Original
                                    </a>
                                )}
                                <button
                                    onClick={() => router.push(`/comparador?historyId=${selectedBill.id}`)}
                                    className="flex-1 h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Ir a la Comparativa
                                    <span className="material-icons text-sm">analytics</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
