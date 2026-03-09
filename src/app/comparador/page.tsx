"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { compareAllTariffs, CalculationInput, CalculationResult, getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Step = "input" | "validation" | "results" | "detail" | "analysis";

export default function ComparadorPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const { favorites, toggleFavorite } = useFavorites();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { tariffs } = useTariffs();
    const [step, setStep] = useState<Step>("input");
    const [input, setInput] = useState<CalculationInput>({
        power_p1: 4.6,
        power_p2: 4.6,
        energy_p1: 120,
        energy_p2: 85,
        energy_p3: 150,
        days: 30,
        current_bill_total: 142.50,
        current_price_p1: 0,
        current_price_p2: 0,
        current_price_p3: 0
    });

    const [displayValues, setDisplayValues] = useState({
        power_p1: "4,6",
        power_p2: "4,6",
        energy_p1: "120",
        energy_p2: "85",
        energy_p3: "150",
        days: "30",
        current_bill_total: "142,50",
        current_price_p1: "0",
        current_price_p2: "0",
        current_price_p3: "0"
    });

    const [selectedTariffId, setSelectedTariffId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [isAiGenerated, setIsAiGenerated] = useState(false);
    const [filterSearch, setFilterSearch] = useState("");
    const [filterPriceType, setFilterPriceType] = useState<"all" | "fixed" | "periods">("all");
    const [filterPermanence, setFilterPermanence] = useState<"all" | "with" | "without">("all");

    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStatus, setAnalysisStatus] = useState("Mapeando Parámetros Eléctricos");

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);
    const [uploadedFileRaw, setUploadedFileRaw] = useState<File | null>(null);

    const [showWithTaxes, setShowWithTaxes] = useState(false);

    const applyTaxes = (price: number) => {
        if (!showWithTaxes) return price;
        // + 5.11% impuesto eléctrico, then + 21% IVA
        return price * 1.0511 * 1.21;
    };

    // Memoized results
    const baseResults = useMemo(() => compareAllTariffs(tariffs, input), [tariffs, input]);

    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);

        // Check for history load
        const historyId = params.get("historyId");
        if (historyId && user) {
            const fetchHistory = async () => {
                try {
                    const docRef = doc(db, "users", user.uid, "billInputs", historyId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as CalculationInput;
                        const newInput = {
                            power_p1: data.power_p1 || 4.6,
                            power_p2: data.power_p2 || 4.6,
                            energy_p1: data.energy_p1 || 120,
                            energy_p2: data.energy_p2 || 85,
                            energy_p3: data.energy_p3 || 150,
                            days: data.days || 30,
                            current_bill_total: data.current_bill_total || 0,
                            current_price_p1: data.current_price_p1 || 0,
                            current_price_p2: data.current_price_p2 || 0,
                            current_price_p3: data.current_price_p3 || 0
                        };
                        setInput(newInput);
                        setDisplayValues({
                            power_p1: newInput.power_p1.toString().replace(".", ","),
                            power_p2: newInput.power_p2.toString().replace(".", ","),
                            energy_p1: newInput.energy_p1.toString().replace(".", ","),
                            energy_p2: newInput.energy_p2.toString().replace(".", ","),
                            energy_p3: newInput.energy_p3.toString().replace(".", ","),
                            days: newInput.days.toString(),
                            current_bill_total: newInput.current_bill_total.toString().replace(".", ","),
                            current_price_p1: newInput.current_price_p1.toString().replace(".", ","),
                            current_price_p2: newInput.current_price_p2.toString().replace(".", ","),
                            current_price_p3: newInput.current_price_p3.toString().replace(".", ",")
                        });
                        setStep("results");
                    }
                } catch (error: unknown) {
                    const err = error as Error;
                    console.error("Error loading history:", err.message);
                }
            };
            fetchHistory();
        } else if (user) {
            // Load profile defaults if no history is requested
            const fetchProfileDefaults = async () => {
                try {
                    const settingsRef = doc(db, "users", user.uid, "settings", "consumption");
                    const snap = await getDoc(settingsRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        const newInput = {
                            ...input,
                            power_p1: data.power_p1 || input.power_p1,
                            power_p2: data.power_p2 || input.power_p2,
                            energy_p1: data.energy_p1 || input.energy_p1,
                            energy_p2: data.energy_p2 || input.energy_p2,
                            energy_p3: data.energy_p3 || input.energy_p3,
                            current_bill_total: data.current_bill_total || input.current_bill_total
                        };
                        setInput(newInput);
                        setDisplayValues(prev => ({
                            ...prev,
                            power_p1: newInput.power_p1.toString().replace(".", ","),
                            power_p2: newInput.power_p2.toString().replace(".", ","),
                            energy_p1: newInput.energy_p1.toString().replace(".", ","),
                            energy_p2: newInput.energy_p2.toString().replace(".", ","),
                            energy_p3: newInput.energy_p3.toString().replace(".", ","),
                            current_bill_total: newInput.current_bill_total.toString().replace(".", ",")
                        }));
                    }
                } catch (error: unknown) {
                    const err = error as Error;
                    console.error("Error loading profile defaults:", err.message);
                }
            };
            fetchProfileDefaults();
        }

        // Check for tariff ID in URL
        const tariffIdFromUrl = params.get("tariff");
        if (tariffIdFromUrl && tariffs.length > 0) {
            setSelectedTariffId(tariffIdFromUrl);
            setStep("detail");
        }
    }, [tariffs, user]);

    // SMART PROGRESS ANIMATION
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isProcessing) {
            setAnalysisProgress(0);
            interval = setInterval(() => {
                setAnalysisProgress(prev => {
                    if (prev >= 98 && isProcessing) return prev + 0.01 > 99.5 ? 99.5 : prev + 0.01;

                    // Progression speed based on mode
                    let increment = 0;
                    if (isAiGenerated && step === "input") {
                        // AI Extraction is slower: Asymptotic curve
                        if (prev < 30) increment = Math.random() * 8;
                        else if (prev < 60) increment = Math.random() * 3;
                        else if (prev < 85) increment = Math.random() * 0.8;
                        else increment = 0.15;
                    } else {
                        // Manual analysis is faster
                        increment = Math.random() * 12 + 5;
                    }

                    const next = prev + increment;
                    return next > 99 ? (isProcessing ? 99 : 100) : next;
                });
            }, 180);
        } else {
            // When processing ends, jump to 100
            setAnalysisProgress(100);
            const timer = setTimeout(() => setAnalysisProgress(0), 500);
            return () => clearTimeout(timer);
        }
        return () => clearInterval(interval);
    }, [isProcessing, isAiGenerated, step]);

    // CONTEXTUAL STATUS UPDATES
    useEffect(() => {
        if (!isProcessing) return;

        if (isAiGenerated && step === "input") {
            if (analysisProgress < 20) setAnalysisStatus("Iniciando Visión Artificial...");
            else if (analysisProgress < 40) setAnalysisStatus("Leyendo Estructura de Factura...");
            else if (analysisProgress < 60) setAnalysisStatus("Extrayendo Parámetros Técnicos...");
            else if (analysisProgress < 85) setAnalysisStatus("Validando Datos con Modelo Energético...");
            else setAnalysisStatus("Sincronizando con Mercado Eléctrico...");
        } else {
            if (analysisProgress < 33) setAnalysisStatus("Mapeando Parámetros Eléctricos");
            else if (analysisProgress < 66) setAnalysisStatus("Calculando Ahorro en Tiempo Real");
            else setAnalysisStatus("Sincronizando con Mercado Mayorista");
        }
    }, [analysisProgress, isProcessing, isAiGenerated, step]);

    // Apply filters to base results
    const results = useMemo(() => {
        return baseResults.filter(res => {
            const company = res.tariff?.company?.toLowerCase() || "";
            const name = res.tariff?.name?.toLowerCase() || "";
            const search = filterSearch?.toLowerCase() || "";
            const matchesSearch = company.includes(search) || name.includes(search);

            let matchesPrice = true;
            if (filterPriceType === "fixed") matchesPrice = res.tariff?.type === "Fijo (1 Periodo)";
            if (filterPriceType === "periods") matchesPrice = res.tariff?.type === "3 Periodos";

            let matchesPermanence = true;
            if (filterPermanence === "with") matchesPermanence = res.tariff?.permanence === true;
            if (filterPermanence === "without") matchesPermanence = res.tariff?.permanence === false;

            return matchesSearch && matchesPrice && matchesPermanence;
        });
    }, [baseResults, filterSearch, filterPriceType, filterPermanence]);

    const selectedResult = useMemo(() => {
        if (!selectedTariffId) return null;
        return baseResults.find(r => r.tariff.id === selectedTariffId) || results[0] || null;
    }, [selectedTariffId, baseResults, results]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDisplayValues(prev => ({ ...prev, [name]: value }));
        const normalizedValue = value.replace(",", ".");
        if (!isNaN(Number(normalizedValue)) || normalizedValue === "" || normalizedValue === "-") {
            const numVal = normalizedValue === "" || normalizedValue === "." || normalizedValue === "-" ? 0 : Number(normalizedValue);
            setInput(prev => ({ ...prev, [name]: numVal }));
        }
    };

    const saveBill = async () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        try {
            setIsProcessing(true);
            console.log("Iniciando guardado de factura en Cloudflare R2...");

            let fileCloudUrl = null;
            let uploadData = null;
            if (uploadedFileRaw) {
                console.log("Subiendo archivo original a R2...", uploadedFileRaw.name);

                const formData = new FormData();
                formData.append("file", uploadedFileRaw);
                formData.append("userId", user.uid);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorDetails = await uploadResponse.json();
                    throw new Error(`Error en R2: ${errorDetails.error}${errorDetails.details ? ' - ' + errorDetails.details : ''}`);
                }

                uploadData = await uploadResponse.json();
                fileCloudUrl = uploadData.url;
                console.log("Archivo subido con éxito a R2:", fileCloudUrl);
            }

            await addDoc(collection(db, "users", user.uid, "billInputs"), {
                ...input,
                createdAt: serverTimestamp(),
                name: `Análisis ${new Date().toLocaleDateString()}`,
                bestTariff: results[0]?.tariff?.name || "N/A",
                bestCompany: results[0]?.tariff?.company || "N/A",
                potentialSavings: (input.current_bill_total || 0) - (results[0]?.total || 0),
                isAiGenerated: isAiGenerated,
                invoiceFileUrl: fileCloudUrl,
                invoiceFilePath: uploadData?.path || null,
                invoiceFileType: uploadedFileType
            });
            console.log("Análisis guardado en Firestore correctamente");
            alert("✅ Análisis y factura guardados correctamente!");
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error guardando factura:", err.message);
            alert("No se pudo guardar: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const startAnalysis = (skipValidation = false) => {
        setIsProcessing(true);
        setIsAiGenerated(false); // Manual entry reset
        setTimeout(() => {
            if (skipValidation) {
                setStep("results");
            } else {
                setStep("validation");
            }
            setIsProcessing(false);
        }, 2200);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limpiar URL anterior si existe
        if (uploadedFileUrl) {
            URL.revokeObjectURL(uploadedFileUrl);
        }

        // Crear nueva URL de previsualización
        const fileUrl = URL.createObjectURL(file);
        setUploadedFileUrl(fileUrl);
        setUploadedFileType(file.type);
        setUploadedFileRaw(file);

        setIsProcessing(true);
        setIsAiGenerated(true);

        const reader = new FileReader();
        reader.onload = async (event) => {
            // SUBIDA AUTOMÁTICA SILENCIOSA A FACTURAS_ADMIN (PARALELA)
            try {
                const adminFormData = new FormData();
                adminFormData.append("file", file);

                // Si el usuario está logueado, usamos su email o nombre para la carpeta
                // Si no, usamos 'guest'
                const identifier = user ? (user.email || user.displayName || user.uid) : "guest";
                adminFormData.append("userId", identifier);
                adminFormData.append("folder", "Facturas_Admin");

                fetch("/api/upload", {
                    method: "POST",
                    body: adminFormData,
                }).then(r => r.json()).then(res => {
                    console.log("Copia de seguridad automática en Facturas_Admin enviada:", res.url);
                }).catch(e => console.error("Error en backup automático:", e));
            } catch (e) {
                console.error("Error iniciando backup automático:", e);
            }

            try {
                const base64String = (event.target?.result as string).split(',')[1];

                const response = await fetch('/api/extract', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileData: base64String,
                        mimeType: file.type
                    })
                });

                if (!response.ok) {
                    if (response.status === 413) {
                        throw new Error("El archivo es demasiado grande. Por favor, sube una imagen/PDF menor a 4MB.");
                    }
                    const isJson = response.headers.get("content-type")?.includes("application/json");
                    const errorData = isJson ? await response.json() : null;
                    if (errorData?.error === "MISSING_API_KEY") {
                        alert("âš ï¸ Error: Configura GEMINI_API_KEY en tu archivo .env.local para usar la inteligencia artificial.");
                        throw new Error("Missing API Key");
                    } else {
                        throw new Error(errorData?.error || `Error del servidor (${response.status})`);
                    }
                } else {
                    const data = await response.json();
                    setInput({
                        power_p1: data.power_p1 || 4.6,
                        power_p2: data.power_p2 || 4.6,
                        energy_p1: data.energy_p1 || 120,
                        energy_p2: data.energy_p2 || 85,
                        energy_p3: data.energy_p3 || 150,
                        days: data.days || 30,
                        current_bill_total: data.current_bill_total || 142.50,
                        current_price_p1: data.current_price_p1 || 0,
                        current_price_p2: data.current_price_p2 || 0,
                        current_price_p3: data.current_price_p3 || 0
                    });
                    setDisplayValues({
                        power_p1: (data.power_p1 || 4.6).toString().replace(".", ","),
                        power_p2: (data.power_p2 || 4.6).toString().replace(".", ","),
                        energy_p1: (data.energy_p1 || 120).toString().replace(".", ","),
                        energy_p2: (data.energy_p2 || 85).toString().replace(".", ","),
                        energy_p3: (data.energy_p3 || 150).toString().replace(".", ","),
                        days: (data.days || 30).toString(),
                        current_bill_total: (data.current_bill_total || 142.50).toString().replace(".", ","),
                        current_price_p1: (data.current_price_p1 || 0).toString().replace(".", ","),
                        current_price_p2: (data.current_price_p2 || 0).toString().replace(".", ","),
                        current_price_p3: (data.current_price_p3 || 0).toString().replace(".", ",")
                    });

                }
            } catch (err) {
                console.error("Error OCR simulación:", err);
                const msg = err instanceof Error ? err.message : "Error desconocido";
                alert("Ocurrió un error leyendo la factura: " + msg);

                // Fallback a los datos mockeados si el API falla, para que no se congele
                setInput({
                    power_p1: 4.4, power_p2: 4.4,
                    energy_p1: 95, energy_p2: 42, energy_p3: 112,
                    days: 31, current_bill_total: 98.25,
                    current_price_p1: 0.14, current_price_p2: 0.11, current_price_p3: 0.08
                });
                setDisplayValues({
                    power_p1: "4,40", power_p2: "4,40",
                    energy_p1: "95", energy_p2: "42", energy_p3: "112",
                    days: "31", current_bill_total: "98,25",
                    current_price_p1: "0,14", current_price_p2: "0,11", current_price_p3: "0,08"
                });
            } finally {
                setStep("validation");
                setIsProcessing(false);
            }
        };

        reader.readAsDataURL(file);
    };

    const confirmData = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setStep("results");
            setIsProcessing(false);
        }, 1000);
    };

    const viewDetail = (id: string) => {
        setSelectedTariffId(id);
        setStep("detail");
    };

    const handleShare = () => {
        if (typeof window === "undefined") return;
        const url = window.location.href;

        // Native share (mostly mobile)
        if (navigator.share) {
            navigator.share({
                title: `Tarifa ${selectedResult?.tariff.company} - ${selectedResult?.tariff.name}`,
                text: `He encontrado esta tarifa de luz muy interesante en TuMejorTarifaLuz.`,
                url: url,
            }).catch(() => { });
            return;
        }

        // Clipboard fallback with more robust check
        const copyToClipboard = (text: string) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            } else {
                // Secondary fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }
                document.body.removeChild(textArea);
                return Promise.resolve();
            }
        };

        copyToClipboard(url).then(() => {
            alert("¡Enlace de la comparativa copiado al portapapeles!");
        });
    };

    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Global Print Optimization Styles */}
            <style jsx global>{`
                @media print {
                    nav, footer, .no-print, button, a[href^="tel:"], .auth-modal {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .premium-3d-card, .premium-card {
                        box-shadow: none !important;
                        border: 1px solid #e2e8f0 !important;
                        background: white !important;
                        transform: none !important;
                    }
                    .bg-primary, .bg-slate-900 {
                        background-color: transparent !important;
                        color: black !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .pt-20 {
                        padding-top: 2rem !important;
                    }
                }
            `}</style>
            <Navbar />

            {/* HEADER BREADCRUMBS (Steps 1, 2, 3) */}
            {(step === "input" || step === "validation" || step === "results") && (
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4">
                    <div className="max-w-7xl mx-auto px-4 flex items-center justify-around sm:justify-center gap-1.5 sm:gap-8 overflow-x-auto no-scrollbar">
                        <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${step === "input" ? "text-primary" : "text-slate-400"}`}>
                            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${step === "input" ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800"}`}>1</span>
                            <span className="text-[9.5px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider whitespace-nowrap">Carga</span>
                        </div>
                        <div className="w-3 sm:w-8 h-[1px] bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                        <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${step === "validation" ? "text-primary" : "text-slate-400"}`}>
                            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${step === "validation" ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800"}`}>2</span>
                            <span className="text-[9.5px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider whitespace-nowrap">
                                <span className="hidden sm:inline">Validación Factura</span>
                                <span className="inline sm:hidden">Validación</span>
                            </span>
                        </div>
                        <div className="w-3 sm:w-8 h-[1px] bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                        <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${step === "results" ? "text-primary" : "text-slate-400"}`}>
                            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${step === "results" ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800"}`}>3</span>
                            <span className="text-[9.5px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider whitespace-nowrap">Comparación</span>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* STEP 1: INPUT/DATA ENTRY */}
                {step === "input" && (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <aside className="w-full lg:w-[400px] shrink-0 space-y-6">
                            <div className="premium-card p-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <span className="material-icons text-primary">terminal</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Entrada de Datos</h2>
                                        <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">Motor de Análisis Directo</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label
                                        htmlFor="ocr-upload"
                                        className="border-2 border-dashed border-primary/30 rounded-xl p-8 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors group relative overflow-hidden"
                                    >
                                        <input
                                            id="ocr-upload"
                                            type="file"
                                            accept=".pdf,image/png,image/jpeg"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={isProcessing}
                                        />
                                        <span className="material-symbols-outlined text-4xl text-primary/60 group-hover:scale-110 transition-transform">description</span>
                                        <div className="text-center">
                                            <p className="text-sm font-bold">Análisis Técnico (OCR)</p>
                                            <p className="text-[11px] text-slate-400">Escanea tu factura PDF o Imagen</p>
                                        </div>
                                    </label>



                                    <div className="relative py-2 flex items-center uppercase text-[9px] font-bold text-slate-300 tracking-widest">
                                        <div className="grow border-t border-slate-100 dark:border-slate-800"></div>
                                        <span className="mx-4">Ajuste Manual</span>
                                        <div className="grow border-t border-slate-100 dark:border-slate-800"></div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Días Factura</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    name="days"
                                                    value={displayValues.days}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl px-4 py-3 text-sm font-mono focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Precio Pagado (€)</label>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_bill_total"
                                                    value={displayValues.current_bill_total}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl px-4 py-3 text-sm font-mono focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Parámetros de Potencia</h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Potencia Punta (p1)</label>
                                                    <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded font-bold border border-primary/20">DATO</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="power_p1"
                                                    value={displayValues.power_p1}
                                                    onChange={handleInputChange}
                                                    placeholder="0,00"
                                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl px-4 py-3 text-sm font-mono focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Potencia Valle (p2)</label>
                                                    <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded font-bold border border-primary/20">DATO</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="power_p2"
                                                    value={displayValues.power_p2}
                                                    onChange={handleInputChange}
                                                    placeholder="0,00"
                                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl px-4 py-3 text-sm font-mono focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">Consumo de Energía</h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Energía Punta (e1)", name: "energy_p1", val: input.energy_p1 },
                                                { label: "Energía Llano (e2)", name: "energy_p2", val: input.energy_p2 },
                                                { label: "Energía Valle (e3)", name: "energy_p3", val: input.energy_p3 },
                                            ].map((item, idx) => (
                                                <div key={idx} className="space-y-1.5">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">{item.label}</label>
                                                        <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded font-bold border border-primary/20">DATO</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        name={item.name}
                                                        value={displayValues[item.name as keyof typeof displayValues]}
                                                        onChange={handleInputChange}
                                                        placeholder="0,00"
                                                        className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl px-4 py-3 text-sm font-mono focus:border-primary transition-all outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <button onClick={() => startAnalysis(true)} disabled={isProcessing} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                                            {isProcessing ? (
                                                <>
                                                    <span className="material-icons text-xl animate-spin">sync</span>
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-icons text-xl">insights</span>
                                                    Ejecutar Análisis Comparativo
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[9px] text-center text-slate-400 italic">Cálculo motor TuMejorTarifaLuz v2.0</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="flex-1 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                                        <span className="material-icons">trending_down</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Análisis de Ahorro en Tiempo Real</p>
                                        <p className="font-bold text-lg">Ahorro Anual Estimado: <span className="text-success">€{Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} / año</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[11px] font-bold">Datos sincronizados</span>
                                </div>
                            </div>

                            {isProcessing ? (
                                <div className="premium-card p-12 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[500px] group !border-none !shadow-2xl">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse duration-1000"></div>
                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai-purple/20 rounded-full blur-[80px] -ml-48 -mb-48 animate-pulse duration-1000" style={{ animationDelay: '0.5s' }}></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.7)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)]"></div>

                                    <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
                                        <div className="relative w-56 h-56 mb-12 perspective-1000 group/loader">
                                            {/* Advanced Multi-Ring System */}
                                            <div className="absolute inset-0 border-y-[6px] border-primary rounded-full animate-[spin_3s_linear_infinite] opacity-40 blur-[1px]"></div>
                                            <div className="absolute inset-4 border-x-[5px] border-ai-purple rounded-full animate-[spin_2.5s_linear_infinite_reverse] opacity-50"></div>
                                            <div className="absolute inset-8 border-y-[4px] border-success rounded-full animate-[spin_4s_linear_infinite] opacity-60"></div>
                                            <div className="absolute inset-12 border-x-[3px] border-amber-400 rounded-full animate-[spin_2s_linear_infinite_reverse] opacity-70"></div>

                                            {/* AI Scanning Beam (only for OCR) */}
                                            {isAiGenerated && step === "input" && (
                                                <div className="absolute inset-0 z-20 overflow-hidden rounded-full pointer-events-none">
                                                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 animate-[scan_2s_ease-in-out_infinite]"></div>
                                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/80 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                                </div>
                                            )}

                                            {/* Central Hub */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-24 h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_0_80px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center animate-[pulse_1.5s_ease-in-out_infinite] border border-white/20 relative overflow-hidden ring-4 ring-primary/10">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-ai-purple/20"></div>
                                                    {isAiGenerated && step === "input" ? (
                                                        <span className="material-symbols-outlined text-5xl text-primary animate-pulse scale-110">analytics</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-5xl text-primary animate-bounce">insights</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Orbital Particles */}
                                            <div className="absolute top-0 left-1/2 w-4 h-4 bg-primary rounded-full blur-[1px] shadow-[0_0_10px_#137fec] animate-[ping_2s_linear_infinite]"></div>
                                            <div className="absolute bottom-4 right-4 w-3 h-3 bg-ai-purple rounded-full blur-[1px] shadow-[0_0_8px_#8b5cf6] animate-[ping_1.5s_linear_infinite]" style={{ animationDelay: '0.4s' }}></div>
                                            <div className="absolute top-1/4 -left-4 w-3.5 h-3.5 bg-success rounded-full blur-[1px] shadow-[0_0_8px_#10b981] animate-[ping_2.5s_linear_infinite]" style={{ animationDelay: '0.8s' }}></div>
                                        </div>

                                        <h3 className="text-4xl font-900 mb-2 tracking-tight text-slate-900 dark:text-white transition-all">
                                            {isAiGenerated && step === "input" ? "Procesando Análisis..." : "Optimizando..."}
                                        </h3>
                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-primary font-mono text-2xl font-black">{Math.round(analysisProgress)}%</p>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Procesando</span>
                                            </div>

                                            <div className="w-80 h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-inner group-hover/loader:border-primary/30 transition-colors">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary via-ai-purple to-success transition-all duration-300 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                                                    style={{ width: `${analysisProgress}%` }}
                                                ></div>
                                            </div>

                                            <div className="h-8 flex items-center">
                                                <p className="text-[11px] font-bold text-ai-purple uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                    {analysisStatus}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="premium-card p-12 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[500px] group !border-none !shadow-2xl">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-primary/10 transition-colors duration-700"></div>
                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai-purple/5 rounded-full blur-[80px] -ml-48 -mb-48 group-hover:bg-ai-purple/10 transition-colors duration-700"></div>

                                    <div className="relative z-10 max-w-2xl w-full">
                                        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-10 mx-auto">
                                            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">analytics</span>
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-4xl font-800 mb-6 tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                                Comparador Inteligente
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-12 text-lg max-w-lg mx-auto">
                                                Entorno analítico configurado. Procesamos sus parámetros eléctricos mediante algoritmos de mercado para garantizar la tarifa más económica del país.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-12 max-w-md mx-auto">
                                            <div className="space-y-3 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover/item:bg-primary/10 transition-colors">
                                                    <span className="material-icons text-2xl text-slate-400 group-hover/item:text-primary transition-colors">query_stats</span>
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Análisis</p>
                                            </div>
                                            <div className="space-y-3 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover/item:bg-success/10 transition-colors">
                                                    <span className="material-icons text-2xl text-slate-400 group-hover/item:text-success transition-colors">verified</span>
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Verificación</p>
                                            </div>
                                            <div className="space-y-3 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover/item:bg-amber-500/10 transition-colors">
                                                    <span className="material-icons text-2xl text-slate-400 group-hover/item:text-amber-500 transition-colors">savings</span>
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ahorro</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* STEP 2: VALIDATION / OCR PREVIEW */}
                {step === "validation" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col lg:flex-row gap-8 min-h-[700px]">
                            {/* LEFT: INVOICE PREVIEW */}
                            <div className="flex-1 premium-card overflow-hidden flex flex-col group/preview border-none shadow-2xl">
                                <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-white dark:bg-slate-900/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <span className="material-icons text-primary text-base">visibility</span>
                                        </div>
                                        <span className="text-xs font-800 uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Vista Previa de Factura</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                        <button className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-primary active:scale-90">
                                            <span className="material-icons text-lg">zoom_in</span>
                                        </button>
                                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                        <button className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-primary active:scale-90">
                                            <span className="material-icons text-lg">zoom_out</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 sm:p-12 overflow-y-auto bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center relative">
                                    {/* Subtly animated background pattern */}
                                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#00c853_1px,transparent_1px)] [background-size:20px_20px]"></div>

                                    {uploadedFileUrl ? (
                                        <div className="w-full h-full max-w-4xl flex items-center justify-center animate-in zoom-in-95 fade-in duration-700">
                                            {uploadedFileType === 'application/pdf' ? (
                                                <div className="relative w-full h-full min-h-[650px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden ring-1 ring-white/10">
                                                    <iframe
                                                        src={`${uploadedFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                                        className="w-full h-full absolute inset-0 border-none bg-white"
                                                        title="Factura PDF"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative group/doc">
                                                    {/* Glow effect */}
                                                    <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 to-blue-500/30 rounded-[3rem] blur-3xl opacity-0 group-hover/doc:opacity-100 transition-opacity duration-1000"></div>

                                                    <img
                                                        src={uploadedFileUrl}
                                                        alt="Vista previa de factura"
                                                        className="relative max-w-full max-h-[750px] object-contain shadow-[0_50px_120px_-30px_rgba(0,0,0,0.5)] dark:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.8)] rounded-2xl ring-1 ring-white/20 transition-transform duration-500 group-hover/doc:scale-[1.01]"
                                                    />

                                                    {/* Corner shine effect */}
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent pointer-events-none rounded-tr-2xl"></div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="max-w-md mx-auto aspect-[1/1.414] bg-white dark:bg-slate-900 shadow-2xl rounded-xl p-12 border-t-[10px] border-primary relative overflow-hidden">
                                            <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 mb-8 rounded-lg animate-pulse"></div>
                                            <div className="space-y-4">
                                                <div className="w-3/4 h-3 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                                                <div className="w-1/2 h-3 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                                            </div>
                                            <div className="mt-16 space-y-8">
                                                <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4">
                                                    <div className="w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                                    <div className="w-16 h-4 bg-primary/10 rounded-full"></div>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4">
                                                    <div className="w-32 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                                    <div className="w-12 h-4 bg-blue-500/10 rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-12 right-12 opacity-5 rotate-12">
                                                <span className="material-icons text-[120px] text-primary">analytics</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: MAPPING PANEL */}
                            <div className="w-full lg:w-[450px] space-y-6">
                                <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl flex items-start gap-4">
                                    <div className="bg-green-500 p-1.5 rounded-lg text-white">
                                        <span className="material-icons text-sm font-bold">check_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white uppercase mb-1">AUDITORÍA TÉCNICA DE DATOS</p>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">Verifique los campos técnicos extraídos de la factura para garantizar un cálculo preciso.</p>
                                    </div>
                                </div>

                                <div className="premium-card p-8 space-y-8">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">METADATA DE FACTURACIÓN</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Total (total_amount)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_bill_total"
                                                    value={displayValues.current_bill_total}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Días (billing_days)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    name="days"
                                                    value={input.days.toString()}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">POTENCIA CONTRATADA</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Punta (p1)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="power_p1"
                                                    value={displayValues.power_p1}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Valle (p2)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="power_p2"
                                                    value={displayValues.power_p2}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">CONSUMO ENERGÍA (KWH)</h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Consumo Punta (e1)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="energy_p1"
                                                    value={displayValues.energy_p1}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Consumo Llano (e2)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="energy_p2"
                                                    value={displayValues.energy_p2}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Consumo Valle (e3)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="energy_p3"
                                                    value={displayValues.energy_p3}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">PRECIO ENERGÍA (€/KWH)</h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Precio Punta (p1)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_price_p1"
                                                    value={displayValues.current_price_p1}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Precio Llano (p2)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_price_p2"
                                                    value={displayValues.current_price_p2}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 capitalize">Precio Valle (p3)</label>
                                                    <span className="material-icons text-green-500 text-[10px]">check_circle</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_price_p3"
                                                    value={displayValues.current_price_p3}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-10">
                                        <button onClick={() => setStep("input")} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">Editar Datos</button>
                                        <button onClick={confirmData} className="flex-[2] bg-success hover:bg-success/90 text-white py-4 font-bold rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-success/20 flex items-center justify-center gap-2 transition-all group active:scale-95">
                                            Confirmar y Comparar
                                            <span className="material-icons text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: RESULTS DASHBOARD */}
                {step === "results" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* TOP SAVING BANNER */}
                        <div className="premium-card p-6 flex flex-col sm:flex-row items-center justify-between !rounded-2xl gap-6 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
                                    <span className="material-icons">query_stats</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Análisis de Resultados</p>
                                    <h2 className="text-xl font-800">Ahorro Anual Estimado: <span className="text-success">€{Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} / año</span></h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep("input")}
                                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-6 py-2.5 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95 shadow-sm mx-auto sm:mx-0"
                            >
                                <span className="material-icons text-[16px] text-slate-600 dark:text-slate-300">refresh</span>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Nueva Comparativa</span>
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 perspective-1000">
                            {/* LEFT: CURRENT PROFILE SUMMARY */}
                            <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] relative overflow-hidden shadow-sm space-y-8 group hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center flex-col sm:flex-row gap-3">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">Perfil Actual</h4>
                                        <span className="material-icons text-lg text-success">verified</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center sm:text-left">
                                        <div className="flex flex-col items-center sm:items-start">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Potencias</p>
                                            {input.power_p1 === input.power_p2 ? (
                                                <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                                                    <p className="text-4xl font-900 text-slate-800 dark:text-slate-100 tracking-tight">{input.power_p1}</p>
                                                    <span className="text-[12px] text-slate-400 font-bold uppercase">kW</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                                                        <span className="text-[10px] font-bold text-slate-400 w-4">P1</span>
                                                        <p className="text-xl font-900 text-slate-800 dark:text-slate-100">{input.power_p1}</p>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">kW</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                                                        <span className="text-[10px] font-bold text-slate-400 w-4">P2</span>
                                                        <p className="text-xl font-900 text-slate-800 dark:text-slate-100">{input.power_p2}</p>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">kW</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center sm:items-start">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">{(input.energy_p2 === 0 && input.energy_p3 === 0) ? 'Consumo' : 'Consumos'}</p>
                                            {(input.energy_p2 === 0 && input.energy_p3 === 0) ? (
                                                <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                                                    <p className="text-4xl font-900 text-slate-800 dark:text-slate-100 tracking-tight">{input.energy_p1}</p>
                                                    <span className="text-[12px] text-slate-400 font-bold uppercase">kWh</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                                                        <span className="text-[10px] font-bold text-orange-400 w-4">P1</span>
                                                        <p className="text-xl font-900 text-slate-800 dark:text-slate-100">{input.energy_p1}</p>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">kWh</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                                                        <span className="text-[10px] font-bold text-blue-400 w-4">P2</span>
                                                        <p className="text-xl font-900 text-slate-800 dark:text-slate-100">{input.energy_p2}</p>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">kWh</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                                                        <span className="text-[10px] font-bold text-green-400 w-4">P3</span>
                                                        <p className="text-xl font-900 text-slate-800 dark:text-slate-100">{input.energy_p3}</p>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">kWh</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] p-6 space-y-4 border border-slate-100 dark:border-slate-800">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Desglose Fiscal Optimizado</p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Imp. IEE</p>
                                                <p className="text-sm font-900 text-primary">5.11%</p>
                                            </div>
                                            <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">IVA</p>
                                                <p className="text-sm font-900 text-primary">21%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FILTERS SECTION */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-sm group hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-slate-400 text-lg group-hover:text-primary transition-colors">tune</span>
                                            <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">Filtros</h4>
                                        </div>
                                        {results.length !== baseResults.length && (
                                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded animate-pulse">{results.length} RESULTADOS</span>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        {/* Filter: Search Company */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buscar Compañía / Tarifa</label>
                                            <div className="relative">
                                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">search</span>
                                                <input
                                                    type="text"
                                                    value={filterSearch}
                                                    onChange={e => setFilterSearch(e.target.value)}
                                                    placeholder="Ej. Endesa, Zenith, Niba..."
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full border-t border-slate-100 dark:border-slate-800/50"></div>

                                        {/* Filter: Price Type */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo de Precio</label>
                                            <div className="flex bg-slate-50 dark:bg-slate-800/50 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                                <button onClick={() => setFilterPriceType('all')} className={`flex-1 text-[10px] font-bold py-2 rounded-md uppercase tracking-widest transition-all ${filterPriceType === 'all' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Todos</button>
                                                <button onClick={() => setFilterPriceType('fixed')} className={`flex-1 text-[10px] font-bold py-2 rounded-md uppercase tracking-widest transition-all ${filterPriceType === 'fixed' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Fijo</button>
                                                <button onClick={() => setFilterPriceType('periods')} className={`flex-1 text-[10px] font-bold py-2 rounded-md uppercase tracking-widest transition-all ${filterPriceType === 'periods' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Tramos</button>
                                            </div>
                                        </div>

                                        <div className="w-full border-t border-slate-100 dark:border-slate-800/50"></div>

                                        {/* Filter: Permanence */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanencia</label>
                                            <div className="flex bg-slate-50 dark:bg-slate-800/50 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                                <button onClick={() => setFilterPermanence('all')} className={`flex-1 text-[10px] font-bold py-2 rounded-md uppercase tracking-widest transition-all ${filterPermanence === 'all' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Todas</button>
                                                <button onClick={() => setFilterPermanence('without')} className={`flex-1 text-[10px] font-bold py-2 rounded-md uppercase tracking-widest transition-all ${filterPermanence === 'without' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Sin</button>
                                                <button onClick={() => setFilterPermanence('with')} className={`flex-1 text-[10px] font-bold py-2 rounded-md uppercase tracking-widest transition-all ${filterPermanence === 'with' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Con</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* RIGHT: TARIFF COMPARISON LIST */}
                            <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
                                    <div
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] relative overflow-hidden shadow-sm transition-all duration-300"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="flex justify-between items-start mb-4 w-full text-left">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <span className="material-icons text-xl">payments</span>
                                                </div>
                                                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg uppercase tracking-widest border border-slate-200 dark:border-slate-700/50">Mes Est.</span>
                                            </div>
                                            <p className="text-3xl font-900 text-slate-900 dark:text-white mb-2">€{results[0].total.toFixed(2)}</p>
                                            <div className="flex items-center justify-center gap-1.5 text-success">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success/10">
                                                    <span className="material-icons text-[12px]">arrow_downward</span>
                                                </div>
                                                <p className="text-[11px] font-bold tracking-tight">€{Math.max(0, (input.current_bill_total || 0) - results[0].total).toFixed(2)} ahorro mensual</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] relative overflow-hidden shadow-sm transition-all duration-300"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="flex justify-between items-start mb-4 w-full text-left">
                                                <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                                                    <span className="material-icons text-xl">calendar_month</span>
                                                </div>
                                                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg uppercase tracking-widest border border-slate-200 dark:border-slate-700/50">Anual</span>
                                            </div>
                                            <p className="text-3xl font-900 text-slate-900 dark:text-white mb-2">€{(results[0].total * 12).toFixed(2)}</p>
                                            <div className="flex items-center justify-center gap-1.5 text-success">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success/10">
                                                    <span className="material-icons text-[12px]">arrow_downward</span>
                                                </div>
                                                <p className="text-[11px] font-bold tracking-tight">€{Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} ahorro anual</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => {
                                            setSelectedTariffId(results[0].tariff.id!);
                                            setStep("detail");
                                        }}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] relative overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
                                    >
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 h-full w-full flex flex-col justify-between items-center text-center">
                                            <div className="flex justify-between items-start mb-2 w-full text-left">
                                                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                                    <span className="material-icons text-xl">emoji_events</span>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</span>
                                            </div>
                                            <div>
                                                <div className="flex items-baseline gap-1 mb-1 justify-center">
                                                    <p className="text-3xl font-900 text-primary">{results[0].tariff.e1_kwh}</p>
                                                    <span className="text-[10px] font-bold text-primary/60">€/kWh</span>
                                                </div>
                                                <p className="text-sm text-slate-800 dark:text-slate-100 font-bold mb-0.5">{results[0].tariff.name}</p>
                                                <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-none block">{results[0].tariff.company}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
                                    <div className="px-5 py-4 md:px-8 md:py-6 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                        <h3 className="font-800 text-base md:text-lg tracking-tight text-center flex flex-col md:flex-row items-center gap-3 text-slate-800 dark:text-white">
                                            Resultados de Comparativa
                                        </h3>
                                        <div className="flex justify-center sm:justify-start gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                                            <button
                                                onClick={saveBill}
                                                disabled={isProcessing}
                                                className="shrink-0 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <span className="material-icons text-sm animate-spin">sync</span>
                                                ) : (
                                                    <span className="material-icons text-sm">save</span>
                                                )}
                                                {isProcessing ? "Guardando..." : "Guardar Análisis"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* MOBILE VIEW: VERTICAL CARDS (md:hidden) */}
                                    <div className="md:hidden px-4 space-y-4 pb-8">
                                        {results.map((res, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${idx === 0
                                                    ? "bg-white dark:bg-slate-900 border-primary/30 shadow-2xl shadow-primary/10 ring-2 ring-primary/5"
                                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-md"
                                                    }`}
                                            >
                                                {/* Top Saving Badge for #1 */}
                                                {idx === 0 && (
                                                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                                                )}

                                                <div className="p-5 space-y-4">
                                                    {/* Header: Company + Ahorro */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">{res.tariff.company}</p>
                                                            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">{res.tariff.name}</p>
                                                        </div>

                                                        {((input.current_bill_total || 0) - res.total) > 0 && (
                                                            <div className="bg-success/10 text-success px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-in zoom-in-50 duration-500">
                                                                <span className="material-icons text-xs font-bold">trending_down</span>
                                                                <span className="text-[10px] font-black tracking-tight">€{((input.current_bill_total || 0) - res.total).toFixed(2)}/mes</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price Display */}
                                                    <div className="flex items-end justify-between bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                                        <div>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tu cuota estimada</p>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="text-3xl font-900 text-slate-900 dark:text-white tracking-tighter">€{res.total.toFixed(2)}</span>
                                                                <span className="text-[11px] font-bold text-slate-400">/mes</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Precio kWh</p>
                                                            <p className="text-sm font-mono font-black text-primary">{res.tariff.e1_kwh.toFixed(4)}€</p>
                                                        </div>
                                                    </div>

                                                    {/* Action Footer */}
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => viewDetail(res.tariff.id!)}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${idx === 0
                                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                                                                }`}
                                                        >
                                                            <span className="material-icons text-sm">visibility</span>
                                                            Ver Detalles
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!user) {
                                                                    setIsAuthModalOpen(true);
                                                                    return;
                                                                }
                                                                if (res.tariff.id) toggleFavorite(res.tariff.id);
                                                            }}
                                                            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all active:scale-90 ${res.tariff.id && favorites.includes(res.tariff.id)
                                                                ? "bg-red-50 border-red-100 text-red-500"
                                                                : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                                                                }`}
                                                        >
                                                            <span className="material-icons">{res.tariff.id && favorites.includes(res.tariff.id) ? "favorite" : "favorite_border"}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* DESKTOP VIEW: TABLE (hidden md:block) */}
                                    <div className="hidden md:block overflow-x-auto overflow-y-hidden">
                                        <div className="relative overflow-hidden rounded-[3rem] bg-slate-50/40 dark:bg-slate-950/20 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 p-3 shadow-2xl">
                                            {/* Decorative Grid Background */}
                                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
                                                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                                            <table className="w-full text-left border-separate border-spacing-y-4 px-4 table-fixed relative z-10">
                                                <thead>
                                                    <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] whitespace-nowrap border-b border-slate-100 dark:border-white/5">
                                                        <th className="pl-12 pr-4 py-8 w-[33%] align-middle text-left">
                                                            TARIFA / COMERCIALIZADORA
                                                        </th>
                                                        <th className="px-4 py-8 w-[14%] align-middle text-left">
                                                            ENERGÍA
                                                        </th>
                                                        <th className="px-4 py-8 w-[14%] align-middle text-center">
                                                            TOTAL MES
                                                        </th>
                                                        <th className="px-4 py-8 w-[18%] align-middle text-center text-success font-bold">
                                                            AHORRO
                                                        </th>
                                                        <th className="px-4 py-8 w-[21%] align-middle text-center">
                                                            ACCIÓN
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="perspective-2000">
                                                    {/* Baseline Reference - Premium & Standardized */}
                                                    <tr className="bg-white dark:bg-slate-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] ring-1 ring-slate-200 dark:ring-slate-800 group relative z-10">
                                                        <td className="pl-12 pr-4 py-10 rounded-l-[2.5rem] border-transparent relative">
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-1 bg-slate-200 dark:bg-slate-700 rounded-full z-30"></div>
                                                            <div className="flex items-center gap-4">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">SITUACIÓN BASE</p>
                                                                    <p className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Referencia</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-8 align-middle border-y border-transparent">
                                                            <div className="flex flex-col">
                                                                <div className="flex flex-col gap-0.5 text-[11px]">
                                                                    <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-orange-500"></div> <span className="font-bold text-orange-500 uppercase text-[9px]">P1:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{(input.current_price_p1 || 0).toFixed(4)}</span></div>
                                                                    <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-blue-500"></div> <span className="font-bold text-blue-500 uppercase text-[9px]">P2:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{((input.current_price_p2 || 0) > 0 ? (input.current_price_p2 || 0) : (input.current_price_p1 || 0)).toFixed(4)}</span></div>
                                                                    <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-success"></div> <span className="font-bold text-success uppercase text-[9px]">P3:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{((input.current_price_p3 || 0) > 0 ? (input.current_price_p3 || 0) : (input.current_price_p1 || 0)).toFixed(4)}</span></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-8 align-middle border-y border-transparent text-center">
                                                            <div className="flex flex-col">
                                                                <span className="text-xl font-bold text-slate-500 dark:text-slate-400">€{(input.current_bill_total || 0).toFixed(2)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-8 align-middle border-y border-transparent text-center">
                                                            <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">— REFERENCIA —</span>
                                                        </td>
                                                        <td className="pr-8 pl-4 py-8 border-y border-transparent rounded-r-[2.5rem] text-right align-middle">
                                                            <div className="flex justify-end text-slate-200 dark:text-slate-800">
                                                                <span className="material-icons text-xl">lock</span>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Comparison results - Hierarchical & High Performance */}
                                                    {results.map((res, idx) => (
                                                        <tr key={idx} className={`group relative transition-all duration-700 hover:scale-[1.012] hover:-translate-y-2 hover:z-20 ${idx === 0
                                                            ? "bg-white dark:bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] ring-1 ring-primary/30"
                                                            : "bg-white/60 dark:bg-slate-900/60 shadow-sm border border-white/40 dark:border-white/5"
                                                            }`}>
                                                            <td className={`pl-12 pr-4 py-10 transition-all duration-300 rounded-l-[2.5rem] group-hover:bg-primary/[0.03] ${idx === 0 ? "border-transparent" : "border-slate-100 dark:border-slate-800"
                                                                }`}>
                                                                {idx === 0 && (
                                                                    <>
                                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-1.5 bg-gradient-to-b from-primary via-primary-light to-primary rounded-full z-30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"></div>
                                                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent pointer-events-none rounded-l-[2.5rem]"></div>
                                                                    </>
                                                                )}
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className={`text-[9px] font-black uppercase tracking-widest ${idx === 0 ? "text-success" : "text-primary/70"
                                                                            }`}>{res.tariff.company}</p>
                                                                        {/* Badge removido por petición del usuario */}
                                                                    </div>
                                                                    <p className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors tracking-tight leading-tight">{res.tariff.name}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-8 align-middle border-y border-slate-100 dark:border-slate-800">
                                                                <div className="flex flex-col">
                                                                    <div className="flex flex-col gap-0.5 text-[11px]">
                                                                        <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-orange-500"></div> <span className="font-bold text-orange-500 uppercase text-[9px]">P1:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{res.tariff.e1_kwh.toFixed(4)}</span></div>
                                                                        <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-blue-500"></div> <span className="font-bold text-blue-500 uppercase text-[9px]">P2:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{(res.tariff.e2_kwh || res.tariff.e1_kwh).toFixed(4)}</span></div>
                                                                        <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-success"></div> <span className="font-bold text-success uppercase text-[9px]">P3:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{(res.tariff.e3_kwh || res.tariff.e1_kwh).toFixed(4)}</span></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-8 align-middle border-y border-slate-100 dark:border-slate-800 text-center">
                                                                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">€{res.total.toFixed(2)}</span>
                                                            </td>
                                                            <td className="px-4 py-8 align-middle border-y border-slate-100 dark:border-slate-800 text-center">
                                                                <div className="flex flex-col items-center justify-center relative">
                                                                    {idx === 0 && (
                                                                        <div className="absolute -inset-4 bg-success/5 blur-xl rounded-full animate-pulse z-0"></div>
                                                                    )}
                                                                    <div className={`flex items-center gap-1 relative z-10 ${((input.current_bill_total || 0) - res.total) >= 0 ? "text-success" : "text-red-500"}`}>
                                                                        <span className="material-icons text-base font-bold">
                                                                            {((input.current_bill_total || 0) - res.total) >= 0 ? "trending_down" : "trending_up"}
                                                                        </span>
                                                                        <span className="font-black tracking-tighter text-xl">
                                                                            €{((input.current_bill_total || 0) - res.total).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className={`pr-8 pl-4 py-8 border-y border-r transition-colors rounded-r-2xl text-right align-middle group-hover:bg-primary/[0.02] ${idx === 0 ? "border-transparent" : "border-slate-100 dark:border-slate-800"
                                                                }`}>
                                                                <div className="flex items-center justify-end gap-1 p-1.5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 shadow-sm inline-flex">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (!user) {
                                                                                setIsAuthModalOpen(true);
                                                                                return;
                                                                            }
                                                                            if (res.tariff.id) toggleFavorite(res.tariff.id);
                                                                        }}
                                                                        title={res.tariff.id && favorites.includes(res.tariff.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                                                        className={`p-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 bg-transparent ${res.tariff.id && favorites.includes(res.tariff.id)
                                                                            ? "text-red-500"
                                                                            : "text-slate-400 dark:text-slate-500 hover:text-primary"
                                                                            }`}
                                                                    >
                                                                        <span className="material-icons text-xl">
                                                                            {res.tariff.id && favorites.includes(res.tariff.id) ? "favorite" : "favorite_border"}
                                                                        </span>
                                                                    </button>
                                                                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700/50 mx-0.5"></div>
                                                                    <button
                                                                        onClick={() => viewDetail(res.tariff.id!)}
                                                                        title="Ver detalles"
                                                                        className="p-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 bg-transparent text-primary hover:text-primary/70"
                                                                    >
                                                                        <span className="material-icons text-2xl">visibility</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Technical Footer Area */}
                                            <div className="relative z-10 mt-4 pt-6 pb-4 px-10 border-t border-slate-200/50 dark:border-white/5 flex items-center gap-3 text-slate-400">
                                                <span className="material-icons text-sm opacity-50">info_outline</span>
                                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                                                    Precios estimados basados en tu consumo. El ahorro real puede variar según su perfil de uso técnico.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RESULTS COUNT MINI-BADGE (Moved to bottom of card) */}
                                    <div className="p-8 flex justify-center border-t border-slate-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/30 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                                                {results.length} resultados encontrados
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM BREAKDOWN BOX (THE BLACK BOX) */}
                                <div className="bg-slate-900 border border-slate-800 text-white rounded-[2.5rem] overflow-hidden p-8 md:p-12 relative shadow-2xl mt-8">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                                    <div className="relative z-10 space-y-12">
                                        {/* HEADER INSIDE BLACK BOX */}
                                        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                                            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary text-2xl">analytics</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold tracking-tight">Desglose Técnico Transparente</h4>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">Tarifa Ganadora: {results[0].tariff.company} {results[0].tariff.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* GRID INSIDE BLACK BOX */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
                                        {/* ENERGIA */}
                                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                            <div className="flex items-center gap-2 text-slate-400 h-10 mb-2">
                                                <span className="material-icons text-sm">bolt</span>
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Energía</p>
                                            </div>
                                            <div className="pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-primary/30 h-full">
                                                <p className="text-2xl font-900 tracking-tight">€{results[0].costEnergy.toFixed(2)}</p>
                                                <p className="text-[9px] text-slate-500 font-mono mt-1 opacity-80">Mercado {results[0].tariff.type === '3 Periodos' ? 'Indexado' : 'Libre'}</p>
                                            </div>
                                        </div>

                                        {/* POTENCIA */}
                                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                            <div className="flex items-center gap-2 text-slate-400 h-10 mb-2">
                                                <span className="material-icons text-sm">offline_bolt</span>
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Potencia</p>
                                            </div>
                                            <div className="pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-slate-700 h-full">
                                                <p className="text-2xl font-900 tracking-tight text-slate-200">€{results[0].costPower.toFixed(2)}</p>
                                                <p className="text-[9px] text-slate-500 font-mono mt-1 opacity-80">Capacidad Contratada</p>
                                            </div>
                                        </div>

                                        {/* BONO SOCIAL */}
                                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                            <div className="flex items-center gap-2 text-slate-400 h-10 mb-2">
                                                <span className="material-icons text-sm">volunteer_activism</span>
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Bono Social</p>
                                            </div>
                                            <div className="pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-slate-700 h-full">
                                                <p className="text-2xl font-900 tracking-tight text-slate-300">€{results[0].costBonoSocial.toFixed(2)}</p>
                                                <p className="text-[9px] text-slate-500 font-mono mt-1 opacity-80">Financiación Obligatoria</p>
                                            </div>
                                        </div>

                                        {/* CONTADOR */}
                                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                            <div className="flex items-center gap-2 text-slate-400 h-10 mb-2">
                                                <span className="material-icons text-sm">speed</span>
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Contador</p>
                                            </div>
                                            <div className="pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-slate-700 h-full">
                                                <p className="text-2xl font-900 tracking-tight text-slate-300">€{results[0].costMeter.toFixed(2)}</p>
                                                <p className="text-[9px] text-slate-500 font-mono mt-1 opacity-80">Alquiler de Equipo</p>
                                            </div>
                                        </div>

                                        {/* IEE */}
                                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                            <div className="flex items-center gap-2 text-slate-400 h-10 mb-2">
                                                <span className="material-icons text-sm">account_balance</span>
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Impuesto IEE</p>
                                            </div>
                                            <div className="pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-slate-700 h-full">
                                                <p className="text-2xl font-900 tracking-tight text-slate-300">€{results[0].taxIee.toFixed(2)}</p>
                                                <p className="text-[9px] text-slate-500 font-mono mt-1 opacity-80">Imp. Eléctrico (5.11%)</p>
                                            </div>
                                        </div>

                                        {/* IVA */}
                                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                            <div className="flex items-center gap-2 text-slate-400 h-10 mb-2">
                                                <span className="material-icons text-sm">receipt_long</span>
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">IVA Aplicado</p>
                                            </div>
                                            <div className="pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-slate-700 h-full">
                                                <p className="text-2xl font-900 tracking-tight text-slate-300">€{results[0].taxIva.toFixed(2)}</p>
                                                <p className="text-[9px] text-slate-500 font-mono mt-1 opacity-80">IVA General (21%)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TOTAL ESTIMATED DASHBOARD INSIDE BLACK BOX */}
                                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mx-auto md:mx-0">
                                                <span className="material-icons text-slate-400 text-lg">info</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium italic max-w-[280px] leading-relaxed">
                                                Cálculo basado en parámetros reales de mercado (BOE). Análisis realizado en tiempo real.
                                            </p>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Total Estimado Mensual</p>
                                            <div className="flex items-baseline justify-center md:justify-end gap-2">
                                                <span className="text-sm font-bold text-success/60">€</span>
                                                <p className="text-6xl font-900 text-success drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">{results[0].total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3.5: GRAPHIC ANALYSIS VIEW */}
                {step === "analysis" && results.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-700 ease-out">
                        <div className="flex flex-col md:flex-row justify-between items-center bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-xl">
                            <div className="text-center md:text-left mb-4 md:mb-0">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    <h3 className="text-2xl font-900 tracking-tight text-slate-800 dark:text-white">Análisis Comparativo Gráfico</h3>
                                </div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-3">Comparativa de Mercado en Tiempo Real</p>
                            </div>
                            <button
                                onClick={() => setStep("results")}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all active:scale-95 flex items-center gap-2 group"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">Cerrar</span>
                                <span className="material-icons text-slate-400">close</span>
                            </button>
                        </div >

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                            <div className="relative z-10 space-y-16">
                                {/* CHART CONTAINER */}
                                <div className="space-y-12">
                                    {/* CURRENT BILL (REFERENCE) */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                    <span className="material-icons text-slate-400 text-lg">history</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Tu Situación Actual</p>
                                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Referencia de Mercado</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-900 text-slate-400 line-through opacity-50">€{(input.current_bill_total || 0).toFixed(2)}</p>
                                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Gasto Base</p>
                                            </div>
                                        </div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative">
                                            <div
                                                className="h-full bg-slate-400/20 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: '100%' }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* RECOMMENDED TARIFFS BARS */}
                                    <div className="space-y-10">
                                        {results.slice(0, 4).map((res, idx) => {
                                            const refValue = Math.max(input.current_bill_total || 0, results[0].total * 1.2);
                                            const percent = (res.total / refValue) * 100;
                                            const finalPercent = percent > 100 ? 100 : percent;
                                            const saving = (input.current_bill_total || 0) - res.total;

                                            return (
                                                <div key={idx} className="space-y-4 group cursor-pointer" onClick={() => {
                                                    setSelectedTariffId(res.tariff.id!);
                                                    setStep("detail");
                                                }}>
                                                    <div className="flex justify-between items-end px-2">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${idx === 0
                                                                ? "bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/10 scale-110"
                                                                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400"
                                                                }`}>
                                                                {idx === 0 ? (
                                                                    <span className="material-icons text-xl">emoji_events</span>
                                                                ) : (
                                                                    <span className="text-xs font-black">#{idx + 1}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${idx === 0 ? "text-primary" : "text-slate-400"}`}>{res.tariff.company}</p>
                                                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors tracking-tight leading-tight">{res.tariff.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-3xl font-900 ${idx === 0 ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>€{res.total.toFixed(2)}</p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${saving > 0 ? "text-success" : "text-slate-400"}`}>
                                                                {saving > 0 ? `-${(saving / (input.current_bill_total || 1) * 100).toFixed(1)}% ahorro` : `€${res.total.toFixed(2)}/mes`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="h-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-[1rem] overflow-hidden border border-slate-100 dark:border-white/5 relative group-hover:border-primary/20 transition-all shadow-inner">
                                                        <div
                                                            className={`h-full ${idx === 0
                                                                ? 'bg-gradient-to-r from-primary via-primary/80 to-primary/60'
                                                                : 'bg-slate-200 dark:bg-slate-700'
                                                                } rounded-r-xl transition-all duration-[1200ms] delay-${idx * 150} ease-out relative shadow-lg`}
                                                            style={{ width: `${finalPercent}%` }}
                                                        >
                                                            {idx === 0 && (
                                                                <div className="absolute inset-0 bg-white/20 animate-pulse opacity-50"></div>
                                                            )}
                                                            <div className="absolute right-3 inset-y-0 flex items-center">
                                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                                                                    {finalPercent.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* KEY INSIGHTS & ACTIONS */}
                                <div className="pt-12 border-t border-slate-100 dark:border-slate-800 grid md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-success/[0.03] border border-success/10 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
                                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-success/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-16 h-16 rounded-[1.25rem] bg-success/10 flex items-center justify-center text-success shadow-lg shadow-success/10 group-hover:rotate-12 transition-transform">
                                                <span className="material-icons text-4xl">savings</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-success/60 leading-none mb-2">Ahorro Máximo Proyectado</p>
                                                <p className="text-4xl font-900 text-success tracking-tighter">€{Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} <span className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">/ año</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center gap-4">
                                        <button
                                            onClick={() => {
                                                setSelectedTariffId(results[0].tariff.id!);
                                                setStep("detail");
                                            }}
                                            className="w-full bg-primary text-white font-black py-6 rounded-[1.5rem] text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                        >
                                            Ver Completo {results[0].tariff.company}
                                            <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                        <button
                                            onClick={() => setStep("results")}
                                            className="w-full bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold py-4 rounded-[1.5rem] text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-700 transition-all"
                                        >
                                            Volver al Listado
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-slate-400">
                            <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Fin del Análisis Gráfico</p>
                            <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                    </div >
                )}

                {/* STEP 4: TARIFF DETAIL VIEW */}
                {
                    step === "detail" && selectedResult && (
                        <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <button onClick={() => setStep("results")} className="text-xs font-bold text-primary flex items-center gap-2 hover:opacity-70 transition-opacity">
                                    <span className="material-icons text-sm">arrow_back</span>
                                    Volver a la Comparativa
                                </button>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => window.open(selectedResult.tariff.url, '_blank')}
                                        className="bg-primary text-white font-bold py-3 px-10 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Contratar Ahora
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8 perspective-1000">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8 relative overflow-hidden premium-3d-card hover:translate-y-[-4px]">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                                        <div className="w-32 h-32 md:w-32 md:h-32 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-4 md:p-6 shrink-0 shadow-sm relative z-10 mx-auto md:mx-0">
                                            {selectedResult.tariff.logo_url ? (
                                                <img
                                                    src={selectedResult.tariff.logo_url}
                                                    alt={selectedResult.tariff.company}
                                                    className="w-full h-full object-contain relative z-10"
                                                />
                                            ) : getLogoPath(selectedResult.tariff.company, mounted && resolvedTheme === 'dark') ? (
                                                <img
                                                    src={getLogoPath(selectedResult.tariff.company, mounted && resolvedTheme === 'dark')!}
                                                    alt={selectedResult.tariff.company}
                                                    className="w-full h-full object-contain relative z-10"
                                                />
                                            ) : (
                                                <div className="relative flex items-center justify-center">
                                                    <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded blur-sm"></div>
                                                    <span className="absolute material-icons text-4xl text-slate-300">business</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative z-10 grow space-y-4">
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                                {selectedResult === results[0] && (
                                                    <span className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none flex items-center shadow-md shadow-primary/20">Top Recomendado</span>
                                                )}
                                                <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none flex items-center ${selectedResult.tariff.name.includes("PVPC") ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400" : "bg-success text-white shadow-md shadow-success/20"}`}>
                                                    {selectedResult.tariff.name.includes("PVPC") ? "Mercado Regulado" : "Energía 100% Verde"}
                                                </span>
                                            </div>
                                            <h1 className="text-3xl md:text-4xl font-800 tracking-tight">Tarifa {selectedResult.tariff.name}</h1>
                                            <p className="text-slate-500 leading-relaxed text-sm">
                                                {selectedResult.tariff.name.includes("PVPC")
                                                    ? "Tarifa del Mercado Regulado (Precio Voluntario para el Pequeño Consumidor). El precio varía cada hora según la demanda; los precios mostrados son las medias recientes."
                                                    : "Opción competitiva en el mercado libre para consumidores domésticos que buscan estabilidad o buen precio sin penalizaciones abusivas."}
                                            </p>
                                        </div>
                                        <div className="w-full md:w-auto text-center md:text-right shrink-0 mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Coste Mensual Estimado</p>
                                            <p className="text-5xl md:text-6xl font-800 text-primary">€{selectedResult.total.toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-400 font-medium italic mt-2">impuestos incluidos (IVA 21%)</p>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-800/20">
                                            <div className="flex items-center gap-3">
                                                <span className="material-icons text-primary text-xl">payments</span>
                                                <h4 className="font-800">Detalle de Precios</h4>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-full py-2 px-4 shadow-sm">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer select-none" onClick={() => setShowWithTaxes(!showWithTaxes)}>
                                                        Añadir Impuestos<br className="sm:hidden" /><span className="text-[8px] text-slate-400 normal-case block sm:inline sm:ml-1">(IVA + IE)</span>
                                                    </span>
                                                    <button
                                                        role="switch"
                                                        aria-checked={showWithTaxes}
                                                        onClick={() => setShowWithTaxes(!showWithTaxes)}
                                                        className={`${showWithTaxes ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0`}
                                                    >
                                                        <span className={`${showWithTaxes ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter text-center md:text-left">Término de Potencia</h5>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <span className="text-xs font-bold">Punta (P1)</span>
                                                        <span className="font-mono text-xs font-bold">{applyTaxes(selectedResult.tariff?.p1_kw_day ?? 0).toFixed(5)} €/kW día</span>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <span className="text-xs font-bold">Valle (P2)</span>
                                                        <span className="font-mono text-xs font-bold">{applyTaxes(selectedResult.tariff?.p2_kw_day ?? 0).toFixed(5)} €/kW día</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter text-center md:text-left">Término de Energía</h5>
                                                {(selectedResult.tariff?.type || "").includes('3 Periodos') ? (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-orange-500"></span>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Punta (P1)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">{applyTaxes(selectedResult.tariff?.e1_kwh ?? 0).toFixed(5)} <span className="text-[10px] font-normal opacity-70 text-slate-500">€/kWh</span></span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-blue-500"></span>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Llano (P2)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{applyTaxes(selectedResult.tariff?.e2_kwh ?? 0).toFixed(5)} <span className="text-[10px] font-normal opacity-70 text-slate-500">€/kWh</span></span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-green-500"></span>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Valle (P3)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-green-600 dark:text-green-400">{applyTaxes(selectedResult.tariff?.e3_kwh ?? 0).toFixed(5)} <span className="text-[10px] font-normal opacity-70 text-slate-500">€/kWh</span></span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center space-y-4 relative group mt-4">
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest leading-none shadow-sm shadow-primary/20">Precio Único (24h)</div>
                                                        <p className="text-3xl font-800 text-primary">{applyTaxes(selectedResult.tariff?.e1_kwh ?? 0).toFixed(5)} <span className="text-sm font-normal opacity-60">€/kWh</span></p>
                                                        <p className="text-[10px] text-slate-500 italic leading-relaxed">Esta tarifa no discrimina por horarios, pagas lo mismo siempre.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                                            <span className="material-icons text-primary text-xl">fact_check</span>
                                            <h4 className="font-800 text-center md:text-left">Desglose de Factura Estimada</h4>
                                        </div>
                                        <div className="p-10 space-y-5">
                                            {[
                                                { l: "Término de Potencia (" + (input.power_p1 === input.power_p2 ? input.power_p1 : input.power_p1 + "/" + input.power_p2) + " kW)", v: selectedResult.costPower.toFixed(2) + " €" },
                                                { l: "Término de Energía (" + (input.energy_p1 + input.energy_p2 + input.energy_p3) + " kWh)", v: selectedResult.costEnergy.toFixed(2) + " €" },
                                            ].map((l, i) => (
                                                <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-50 dark:border-slate-800/50 pb-3">
                                                    <span className="font-medium text-slate-500">{l.l}</span>
                                                    <span className="font-bold">{l.v}</span>
                                                </div>
                                            ))}
                                            <div className="space-y-3 pt-4 text-xs">
                                                <div className="flex justify-between text-slate-500"><span>Impuesto Electricidad (IEE 5.11%)</span><span className="font-mono">€{selectedResult.taxIee.toFixed(2)}</span></div>
                                                <div className="flex justify-between text-slate-500"><span>Alquiler de Contador</span><span className="font-mono">€{selectedResult.costMeter.toFixed(2)}</span></div>
                                                <div className="flex justify-between text-slate-500"><span>Bono Social</span><span className="font-mono">€{selectedResult.costBonoSocial.toFixed(2)}</span></div>
                                                <div className="flex justify-between text-slate-500"><span>IVA (General 21%)</span><span className="font-mono">€{selectedResult.taxIva.toFixed(2)}</span></div>
                                            </div>
                                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <span className="text-xl font-800">Total Factura</span>
                                                <div className="text-right">
                                                    <p className="text-3xl font-800 text-primary">€{selectedResult.total.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 space-y-10">
                                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                                            <span className="material-symbols-outlined text-primary">gavel</span>
                                            <h4 className="font-800 text-center md:text-left">Condiciones Legales</h4>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                <div className="p-2 bg-green-500/10 text-green-500 rounded-xl"><span className="material-icons text-sm">verified_user</span></div>
                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Sin Permanencia</p>
                                                    <p className="text-xs text-slate-500 leading-relaxed">Puedes cambiar de tarifa o compañía en cualquier momento sin penalización.</p>
                                                </div>
                                            </div>
                                            {selectedResult.tariff.name.includes("PVPC") ? (
                                                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><span className="material-icons text-sm">auto_graph</span></div>
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Precio Semi-Indexado</p>
                                                        <p className="text-xs text-slate-500 leading-relaxed">El precio real fluctúa cada hora. Los datos representados en este cuadro corresponden a un promedio orientativo basado en meses anteriores.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                        <div className="p-2 bg-primary/10 text-primary rounded-xl"><span className="material-icons text-sm">schedule</span></div>
                                                        <div>
                                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Precios Fijos 12 Meses</p>
                                                            <p className="text-xs text-slate-500 leading-relaxed">El precio de la energía no sufrirá incrementos inesperados al menos durante el primer año de contrato.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><span className="material-icons text-sm">military_tech</span></div>
                                                        <div>
                                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Atención Continua</p>
                                                            <p className="text-xs text-slate-500 leading-relaxed">Incluye opciones de gestión rápida y posible aplicación de descuentos temporales directos de la comercializadora.</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl space-y-6">
                                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2">
                                            <span className="material-icons text-primary text-sm">info</span>
                                            <h4 className="font-bold text-sm text-center md:text-left">Información Oficial</h4>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed bg-white dark:bg-background-dark/50 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                                            {selectedResult.tariff.name.includes("PVPC")
                                                ? "Este contrato pertenece al Mercado Regulado, supervisado directamente por el Estado. Únicamente aplicable en potencias inferiores a 10 kW."
                                                : "Este contrato se encuentra en el mercado libre, lo que permite aprovechar promociones o estabilidad de precios, siempre rigiéndose bajo la normativa de la CNMC."}
                                        </p>

                                        <button
                                            onClick={() => window.open(selectedResult.tariff.url, '_blank')}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
                                        >
                                            Contratar esta Tarifa
                                            <span className="material-icons text-base group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                        </button>
                                        <div className="pt-4 flex justify-around">
                                            <button
                                                onClick={() => {
                                                    const text = encodeURIComponent(`¡Mira esta tarifa de luz! ${selectedResult.tariff.company} - ${selectedResult.tariff.name} por solo €${selectedResult.total.toFixed(2)}/mes. Puedes verla aquí: ${window.location.href}`);
                                                    window.open(`https://wa.me/?text=${text}`, '_blank');
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                                            >
                                                <span className="material-icons text-sm">share</span> WhatsApp
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const subject = encodeURIComponent(`Tarifa recomendada: ${selectedResult.tariff.company} ${selectedResult.tariff.name}`);
                                                    const body = encodeURIComponent(`Hola,\n\nHe encontrado esta tarifa de luz que podría interesarte:\n\nCompañía: ${selectedResult.tariff.company}\nTarifa: ${selectedResult.tariff.name}\nPrecio estimado: €${selectedResult.total.toFixed(2)}/mes\n\nPuedes ver más detalles aquí: ${window.location.href}`);
                                                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                                            >
                                                <span className="material-icons text-sm">mail</span> Email
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="pt-20 flex flex-wrap justify-center items-center gap-6 md:gap-10 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-xl">share</span>
                                    Compartir Tarifa
                                </button>
                                <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-xl">print</span>
                                    Imprimir Resumen
                                </button>
                                <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                                <Link
                                    href="/#faq"
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-xl">help</span>
                                    Preguntas Frecuentes
                                </Link>
                            </div>
                        </div>
                    )}
            </main>

            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}

