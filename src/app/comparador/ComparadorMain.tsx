"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { compareAllTariffs, CalculationInput, CalculationResult, getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { 
    Activity,
    PiggyBank,
    Gavel,
    ShieldCheck as ShieldCheckIcon,
    LineChart,
    Clock as ClockIcon,
    Medal,
    Info as InfoIcon,
    Share2 as Share2Icon,
    Mail as MailIcon,
    Printer as PrinterIcon,
    HelpCircle as HelpCircleIcon,
    ChevronRight,
    ArrowLeft as ArrowLeftIcon,
    Terminal, 
    Zap, 
    FileText, 
    TrendingDown, 
    Search, 
    Filter, 
    Lock, 
    Unlock, 
    CheckCircle2, 
    Brain, 
    ArrowRight, 
    History, 
    Database, 
    ArrowLeftRight,
    Clock,
    Plus,
    X,
    Printer,
    Share2,
    Check,
    Calendar,
    Trophy,
    Save,
    Eye,
    ZoomIn,
    ZoomOut,
    BarChart3,
    Heart,
    Sliders,
    CreditCard,
    TrendingUp,
    LayoutDashboard,
    Info,
    Gauge,
    Building2,
    ArrowLeft,
    CheckSquare,
    Scale,
    ShieldCheck,
    Award,
    Mail,
    HelpCircle,
    ZapOff,
    FileUp,
    ChevronDown
} from "lucide-react";

import { useToast } from "@/components/providers/ToastProvider";

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

type Step = "input" | "validation" | "results" | "detail" | "analysis" | "study";

export default function ComparadorMain() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const { favorites, toggleFavorite } = useFavorites();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { showToast } = useToast();

    const { tariffs } = useTariffs();
    const [step, setStep] = useState<Step>("input");
    const [inputMethod, setInputMethod] = useState<"upload" | "manual" | null>(null);
    const [input, setInput] = useState<CalculationInput>({
        power_p1: 3.5,
        power_p2: 3.5,
        energy_p1: 50,
        energy_p2: 50,
        energy_p3: 100,
        days: 30,
        current_bill_total: 70,
        current_price_p1: 0,
        current_price_p2: 0,
        current_price_p3: 0
    });

    const [displayValues, setDisplayValues] = useState({
        power_p1: "3,5",
        power_p2: "3,5",
        energy_p1: "50",
        energy_p2: "50",
        energy_p3: "100",
        days: "30",
        current_bill_total: "70",
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
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [studyMode, setStudyMode] = useState<"monthly" | "annual" | null>(null);
    const [isStudySelectorOpen, setIsStudySelectorOpen] = useState(false);
    const [pendingStudyMode, setPendingStudyMode] = useState<"monthly" | "annual" | null>(null);

    // Auto-open Study view after login if user had a pending mode
    useEffect(() => {
        if (user && pendingStudyMode && results.length > 0) {
            setSelectedTariffId(results[0].tariff.id!);
            setStudyMode(pendingStudyMode);
            setStep("study");
            setPendingStudyMode(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, pendingStudyMode]);

    const applyTaxes = (price: number) => {
        if (!showWithTaxes) return price;
        // + 5.11% impuesto eléctrico, then + 21% IVA
        return price * 1.0511 * 1.21;
    };

    const baseResults = useMemo(() => compareAllTariffs(tariffs, input), [tariffs, input]);
    const selectedResult = useMemo(() => baseResults.find(r => r.tariff.id === selectedTariffId) || baseResults[0], [baseResults, selectedTariffId]);

    const currentBreakdown = useMemo(() => {
        const total = (input.current_bill_total || 0);
        let energyCost = (input.energy_p1 * (input.current_price_p1 || 0)) +
                           (input.energy_p2 * (input.current_price_p2 || input.current_price_p1 || 0)) +
                           (input.energy_p3 * (input.current_price_p3 || input.current_price_p1 || 0));
        
        let isEstimated = false;
        // If prices are missing (e.g. manual mode), estimate a 65% energy / 35% power split of the total bill
        if (total > 0 && energyCost === 0) {
            energyCost = total * 0.65;
            isEstimated = true;
        }

        const powerAndOthers = Math.max(0, total - energyCost);
        
        return {
            energy: energyCost,
            powerPlusOthers: powerAndOthers,
            total,
            isEstimated
        };
    }, [input]);

    // ── AI Insight Generator ──────────────────────────────────────────────────
    const generateAIInsight = useMemo(() => {
        if (!selectedResult) return '';
        const tariff = selectedResult.tariff;
        const saving = Math.max(0, (input.current_bill_total || 0) - selectedResult.total);
        const savingPct = Math.round((saving / (input.current_bill_total || 1)) * 100);
        const energySaving = Math.max(0, currentBreakdown.energy - selectedResult.costEnergy);
        const powerSaving = Math.max(0, currentBreakdown.powerPlusOthers - (selectedResult.total - selectedResult.costEnergy));
        const isFixedRate = tariff.type === 'Fijo (1 Periodo)';
        const isThreePeriod = tariff.type === '3 Periodos';
        const hasPermanence = tariff.permanence;
        const energyDominates = energySaving > powerSaving;
        const powerDominates = powerSaving > energySaving * 1.5;
        const isHighSaving = savingPct >= 25;
        const isModerateSaving = savingPct >= 10 && savingPct < 25;
        const isPVPC = tariff.name.toLowerCase().includes('pvpc') || tariff.company.toLowerCase().includes('referencia');

        if (isPVPC) {
            return <>La tarifa <span className="text-primary font-bold not-italic">{tariff.name}</span> de <span className="text-primary font-bold not-italic">{tariff.company}</span> indexa tu consumo al precio horario del mercado mayorista. Es ideal si consumes principalmente en periodos valle (noche y fin de semana), donde el precio suele ser significativamente más bajo.</>;
        }

        if (isFixedRate && isHighSaving && energyDominates) {
            return <>Con la tarifa <span className="text-primary font-bold not-italic">{tariff.name}</span> de <span className="text-primary font-bold not-italic">{tariff.company}</span>, fijarás un precio de energía notablemente inferior al actual. El ahorro estimado de <strong className="text-success">{savingPct}%</strong> proviene principalmente del término de energía, lo que significa que cuanto más consumas, más ahorrarás cada mes.{hasPermanence ? ' Ten en cuenta que esta tarifa incluye permanencia.' : ''}</>;
        }

        if (isFixedRate && isModerateSaving && powerDominates) {
            return <>La tarifa fija <span className="text-primary font-bold not-italic">{tariff.name}</span> de <span className="text-primary font-bold not-italic">{tariff.company}</span> destaca por tener cargos de potencia más competitivos. El ahorro estimado del <strong className="text-success">{savingPct}%</strong> se concentra en el término fijo, lo que la hace especialmente ventajosa si tu potencia contratada es alta.{hasPermanence ? ' Considera que lleva permanencia asociada.' : ''}</>;
        }

        if (isThreePeriod && energyDominates) {
            return <>La tarifa discriminatoria <span className="text-primary font-bold not-italic">{tariff.name}</span> de <span className="text-primary font-bold not-italic">{tariff.company}</span> ofrece tres tramos horarios de precio. Tu perfil de consumo aprovecha especialmente los periodos valle y llano, generando un ahorro estimado del <strong className="text-success">{savingPct}%</strong>. Desplazar electrodomésticos de alta potencia a las horas más baratas maximizaría aún más el beneficio.{hasPermanence ? ' Incluye permanencia.' : ''}</>;
        }

        if (isThreePeriod && !energyDominates) {
            return <>Con <span className="text-primary font-bold not-italic">{tariff.name}</span> de <span className="text-primary font-bold not-italic">{tariff.company}</span>, la estructura de tres periodos encaja con tu perfil. El ahorro del <strong className="text-success">{savingPct}%</strong> se distribuye entre energía y potencia. Recuerda que en tarifas discriminatorias, la punta (P1) es cara, por lo que reducir el consumo entre las 10h y 14h en días laborables optimizará tu factura.{hasPermanence ? ' Esta tarifa renueva con permanencia.' : ''}</>;
        }

        if (isHighSaving) {
            return <>El cambio a <span className="text-primary font-bold not-italic">{tariff.name}</span> de <span className="text-primary font-bold not-italic">{tariff.company}</span> supone uno de los mejores resultados para tu perfil, con un ahorro estimado del <strong className="text-success">{savingPct}%</strong>. Esta tarifa tiene condiciones de precio muy competitivas frente a tu contrato actual.{hasPermanence ? ' Incluye compromiso de permanencia.' : ' Sin permanencia, puedes cambiar cuando quieras.'}</>;
        }

        // default
        return <>Cambiando a <span className="text-primary font-bold not-italic">{tariff.name}</span> de <span className="text-primary font-bold not-italic">{tariff.company}</span>, obtendrás un ahorro estimado del <strong className="text-success">{savingPct}%</strong> mensual. La estructura de precios de esta tarifa se adapta bien a tu consumo actual.{hasPermanence ? ' Nota: incluye permanencia.' : ' Sin permanencia.'}</>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedResult, input, currentBreakdown]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // RESET SCROLL ON STEP CHANGE (FIXES MOBILE UX)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [step]);
    
    useEffect(() => {
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
                        setHasAnalyzed(true);
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

        // Check for direct upload or manual mode start
        const mode = params.get("mode");
        const hasSubir = params.has("subir") || params.get("subir") === "true";
        
        if (mode === "upload" || hasSubir) {
            setInputMethod("upload");
        } else if (mode === "manual") {
            setInputMethod("manual");
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
            if (analysisProgress < 20) setAnalysisStatus("Iniciando visión avanzada...");
            else if (analysisProgress < 40) setAnalysisStatus("Leyendo estructura de factura...");
            else if (analysisProgress < 60) setAnalysisStatus("Extrayendo parámetros técnicos...");
            else if (analysisProgress < 85) setAnalysisStatus("Validando datos con modelo energético...");
            else setAnalysisStatus("Sincronizando con mercado eléctrico...");
        } else {
            if (analysisProgress < 20) setAnalysisStatus("Mapeando parámetros eléctricos");
            else if (analysisProgress < 40) setAnalysisStatus("Procesando potencia contratada");
            else if (analysisProgress < 60) setAnalysisStatus("Calculando ahorro en tiempo real");
            else if (analysisProgress < 80) setAnalysisStatus("Comparando con 25+ tarifas");
            else setAnalysisStatus("Sincronizando con mercado mayorista");
        }
    }, [analysisProgress, isProcessing, isAiGenerated, step]);

    // Derived loader stage (0-4) from progress
    const loaderStage = analysisProgress < 20 ? 0 : analysisProgress < 40 ? 1 : analysisProgress < 60 ? 2 : analysisProgress < 80 ? 3 : 4;

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

                // Usamos el email si existe como identificador de carpeta, si no el UID
                const identifier = user.email || user.uid;
                formData.append("userId", identifier);
                formData.append("folder", "Facturas_Usuarios"); // Nueva carpeta base para usuarios registrados

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
            showToast("¡Estudio guardado!", "success", "Podrás consultar esta comparativa siempre que quieras desde tu perfil.");
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error guardando factura:", err.message);
            showToast("No se pudo guardar", "error", err.message || "Hubo un problema al conectar con el servidor.");
        } finally {
            setIsProcessing(false);
        }
    };

    const startAnalysis = (skipValidation = false) => {
        setIsProcessing(true);
        setIsAiGenerated(false); // Manual entry reset
        setTimeout(() => {
            if (skipValidation) {
                setHasAnalyzed(true);
                setStep("results");
            } else {
                setHasAnalyzed(true);
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
                    const roundValue = (val: number, decimals: number = 2) => {
                        return Math.round((val + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
                    };

                    const rawData = {
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
                    };

                    setInput({
                        power_p1: roundValue(rawData.power_p1, 3),
                        power_p2: roundValue(rawData.power_p2, 3),
                        energy_p1: roundValue(rawData.energy_p1, 2),
                        energy_p2: roundValue(rawData.energy_p2, 2),
                        energy_p3: roundValue(rawData.energy_p3, 2),
                        days: Math.round(rawData.days),
                        current_bill_total: roundValue(rawData.current_bill_total, 2),
                        current_price_p1: roundValue(rawData.current_price_p1, 4),
                        current_price_p2: roundValue(rawData.current_price_p2, 4),
                        current_price_p3: roundValue(rawData.current_price_p3, 4)
                    });

                    setDisplayValues({
                        power_p1: roundValue(rawData.power_p1, 3).toString().replace(".", ","),
                        power_p2: roundValue(rawData.power_p2, 3).toString().replace(".", ","),
                        energy_p1: roundValue(rawData.energy_p1, 2).toString().replace(".", ","),
                        energy_p2: roundValue(rawData.energy_p2, 2).toString().replace(".", ","),
                        energy_p3: roundValue(rawData.energy_p3, 2).toString().replace(".", ","),
                        days: Math.round(rawData.days).toString(),
                        current_bill_total: roundValue(rawData.current_bill_total, 2).toString().replace(".", ","),
                        current_price_p1: roundValue(rawData.current_price_p1, 4).toString().replace(".", ","),
                        current_price_p2: roundValue(rawData.current_price_p2, 4).toString().replace(".", ","),
                        current_price_p3: roundValue(rawData.current_price_p3, 4).toString().replace(".", ",")
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
                setHasAnalyzed(true);
                setStep("validation");
                setIsProcessing(false);
            }
        };

        reader.readAsDataURL(file);
    };

    const confirmData = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setHasAnalyzed(true);
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
                            <span className="text-[9.5px] sm:text-xs font-bold tracking-tight sm:tracking-wider whitespace-nowrap">Carga</span>
                        </div>
                        <div className="w-3 sm:w-8 h-[1px] bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                        <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${step === "validation" ? "text-primary" : "text-slate-400"}`}>
                            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${step === "validation" ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800"}`}>2</span>
                            <span className="text-[9.5px] sm:text-xs font-bold tracking-tight sm:tracking-wider whitespace-nowrap">
                                <span className="hidden sm:inline">Validación factura</span>
                                <span className="inline sm:hidden">Validación</span>
                            </span>
                        </div>
                        <div className="w-3 sm:w-8 h-[1px] bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                        <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${step === "results" ? "text-primary" : "text-slate-400"}`}>
                            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${step === "results" ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800"}`}>3</span>
                            <span className="text-[9.5px] sm:text-xs font-bold tracking-tight sm:tracking-wider whitespace-nowrap">Comparación</span>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* STEP 1: INPUT/DATA ENTRY */}
                {/* STEP 1: INPUT/DATA ENTRY */}
                {step === "input" && !inputMethod && (
                    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-900 text-slate-900 dark:text-white mb-6 tracking-tight">
                                ¿Cómo quieres <span className="text-primary italic">empezar</span>?
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                                Para darte el ahorro más exacto, necesitamos conocer tu consumo actual. Elige el método que prefieras para continuar.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Option 1: AI Analysis */}
                            <button 
                                onClick={() => setInputMethod("upload")}
                                className="premium-card group p-10 md:p-14 text-center hover:border-primary/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <FileUp className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-2xl font-800 text-slate-900 dark:text-white mb-4">Análisis por Factura</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-base mb-10 leading-relaxed flex-grow">
                                    Sube tu factura en PDF o foto. Nuestra <span className="text-primary font-bold">tecnología experta</span> extraerá automáticamente tu potencia y consumos reales de cada tramo en segundos.
                                </p>
                                <div className="space-y-4 flex flex-col items-center">
                                    <span className="w-fit px-10 bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group-hover:bg-primary/90 transition-all mx-auto">
                                        Subir mi factura
                                        <ArrowRight size={18} />
                                    </span>
                                    <p className="text-[10px] font-bold text-primary tracking-widest bg-primary/5 py-2 px-4 rounded-full inline-block">Recomendado • Máxima precisión</p>
                                </div>
                            </button>

                            {/* Option 2: Manual Input */}
                            <button 
                                onClick={() => setInputMethod("manual")}
                                className="premium-card group p-10 md:p-14 text-center hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 dark:bg-slate-800/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-slate-200 dark:group-hover:bg-slate-800/20 transition-colors"></div>
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500">
                                    <Sliders className="w-12 h-12 text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-800 text-slate-900 dark:text-white mb-4">Entrada Manual</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-base mb-10 leading-relaxed flex-grow">
                                    Si ya tienes tus datos a mano o quieres simular un consumo específico, utiliza nuestro formulario técnico simplificado.
                                </p>
                                <div className="space-y-4 flex flex-col items-center">
                                    <span className="w-fit px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 group-hover:bg-slate-800 dark:group-hover:bg-slate-100 transition-all flex items-center justify-center mx-auto">
                                        Introducir datos a mano
                                    </span>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest bg-slate-100 dark:bg-slate-800 py-2 px-4 rounded-full inline-block">Control total • Sin archivos</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {step === "input" && inputMethod && (
                    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
                        <aside className="w-full lg:w-[400px] shrink-0 space-y-6">
                            <div className="premium-card p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <Terminal className="text-primary w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Entrada de Datos</h2>
                                            <p className="text-[10px] text-slate-500 font-mono tracking-tighter">Parámetros de análisis</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setInputMethod(null)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-primary"
                                        title="Cambiar método"
                                    >
                                        <History size={18} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {inputMethod === "upload" && (
                                        <label
                                            htmlFor="ocr-upload-sidebar"
                                            className="border-2 border-dashed border-primary/30 rounded-xl p-8 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors group relative overflow-hidden"
                                        >
                                            <input
                                                id="ocr-upload-sidebar"
                                                type="file"
                                                accept=".pdf,image/png,image/jpeg"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                disabled={isProcessing}
                                            />
                                            <FileUp className="w-[36px] h-[36px] text-primary/60 group-hover:scale-110 transition-transform" />
                                            <div className="text-center">
                                                <p className="text-sm font-bold">Cambiar factura</p>
                                                <p className="text-[11px] text-slate-400">PDF o Imagen</p>
                                            </div>
                                        </label>
                                    )}

                                    {(inputMethod === "manual" || hasAnalyzed) && (
                                        <div className="space-y-6">
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

                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Potencias (kW)</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Punta (p1)</label>
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
                                                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Valle (p2)</label>
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

                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">Consumo Energía (kWh)</h4>
                                                <div className="space-y-4">
                                                    {[
                                                        { label: "Punta (e1)", name: "energy_p1" },
                                                        { label: "Llano (e2)", name: "energy_p2" },
                                                        { label: "Valle (e3)", name: "energy_p3" },
                                                    ].map((item, idx) => (
                                                        <div key={idx} className="space-y-1.5">
                                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">{item.label}</label>
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

                                                <button 
                                                    onClick={() => startAnalysis(true)} 
                                                    disabled={isProcessing} 
                                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <Clock className="w-5 h-5 animate-spin" />
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TrendingDown className="w-5 h-5" />
                                                            Calcular ahorro
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>

                        <section className="flex-1 space-y-6">
                            {(inputMethod === "upload" && !hasAnalyzed && !isProcessing) ? (
                                <div className="premium-card p-12 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[550px] group !border-none !shadow-2xl">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-primary/10 transition-colors duration-700"></div>
                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai-purple/10 rounded-full blur-[80px] -ml-48 -mb-48 group-hover:bg-ai-purple/15 transition-colors duration-700"></div>

                                    <div className="relative z-10 max-w-2xl w-full">
                                        <label
                                            htmlFor="ocr-upload-main"
                                            className="block w-full border-2 border-dashed border-primary/20 rounded-[3rem] p-16 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group/upload"
                                        >
                                            <input
                                                id="ocr-upload-main"
                                                type="file"
                                                accept=".pdf,image/png,image/jpeg"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                disabled={isProcessing}
                                            />
                                            <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary/5 group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-transform duration-500">
                                                <FileUp className="w-16 h-16 text-primary" />
                                            </div>
                                            <h3 className="text-3xl font-800 text-slate-900 dark:text-white mb-4">Selecciona tu factura</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                                                Arrastra tu archivo aquí o haz clic para buscarlo.<br/>
                                                Soportamos <span className="font-bold">PDF, JPG y PNG</span> hasta 4MB.
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold tracking-[0.2em] text-slate-400">
                                                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-success" /> Privacidad cifrada</span>
                                                <span className="flex items-center gap-2"><Brain size={16} className="text-primary" /> Análisis inteligente</span>
                                                <span className="flex items-center gap-2"><Clock size={16} className="text-amber-500" /> Resultados en segundos</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            ) : isProcessing ? (
                                <div className="premium-card p-12 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[500px] group !border-none !shadow-2xl">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse duration-1000"></div>
                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai-purple/20 rounded-full blur-[80px] -ml-48 -mb-48 animate-pulse duration-1000" style={{ animationDelay: '0.5s' }}></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.7)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)]"></div>

                                    <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
                                        <div className="relative w-56 h-56 mb-12 perspective-1000 group/loader">
                                            {/* Rings - colors change per stage */}
                                            <div className={`absolute inset-0 border-y-[6px] rounded-full animate-[spin_3s_linear_infinite] opacity-40 blur-[1px] transition-all duration-700 ${loaderStage === 0 ? 'border-primary' :
                                                loaderStage === 1 ? 'border-amber-400' :
                                                    loaderStage === 2 ? 'border-success' :
                                                        loaderStage === 3 ? 'border-ai-purple' :
                                                            'border-primary'
                                                }`}></div>
                                            <div className={`absolute inset-4 border-x-[5px] rounded-full animate-[spin_2.5s_linear_infinite_reverse] opacity-50 transition-all duration-700 ${loaderStage === 0 ? 'border-ai-purple' :
                                                loaderStage === 1 ? 'border-primary' :
                                                    loaderStage === 2 ? 'border-amber-400' :
                                                        loaderStage === 3 ? 'border-success' :
                                                            'border-amber-400'
                                                }`}></div>
                                            <div className={`absolute inset-8 border-y-[4px] rounded-full animate-[spin_4s_linear_infinite] opacity-60 transition-all duration-700 ${loaderStage === 0 ? 'border-success' :
                                                loaderStage === 1 ? 'border-ai-purple' :
                                                    loaderStage === 2 ? 'border-primary' :
                                                        loaderStage === 3 ? 'border-amber-400' :
                                                            'border-success'
                                                }`}></div>
                                            <div className={`absolute inset-12 border-x-[3px] rounded-full animate-[spin_2s_linear_infinite_reverse] opacity-70 transition-all duration-700 ${loaderStage === 0 ? 'border-amber-400' :
                                                loaderStage === 1 ? 'border-success' :
                                                    loaderStage === 2 ? 'border-ai-purple' :
                                                        loaderStage === 3 ? 'border-primary' :
                                                            'border-ai-purple'
                                                }`}></div>

                                            {/* AI Scanning Beam (only for OCR) */}
                                            {isAiGenerated && step === "input" && (
                                                <div className="absolute inset-0 z-20 overflow-hidden rounded-full pointer-events-none">
                                                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 animate-[scan_2s_ease-in-out_infinite]"></div>
                                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/80 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                                </div>
                                            )}

                                            {/* Central Hub - Dynamic Icons per stage */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`w-36 h-36 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_0_100px_rgba(var(--primary-rgb),0.3)] flex flex-col items-center justify-center transition-all duration-700 border-2 relative overflow-hidden group/hub ${loaderStage === 0 ? 'border-primary/30 shadow-primary/20' :
                                                    loaderStage === 1 ? 'border-amber-400/30 shadow-amber-400/20' :
                                                        loaderStage === 2 ? 'border-success/30 shadow-success/20' :
                                                            loaderStage === 3 ? 'border-ai-purple/30 shadow-ai-purple/20' :
                                                                'border-primary/30 shadow-primary/20'
                                                    }`}>
                                                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br transition-all duration-700 ${loaderStage === 0 ? 'from-primary to-ai-purple' :
                                                        loaderStage === 1 ? 'from-amber-400 to-primary' :
                                                            loaderStage === 2 ? 'from-success to-amber-400' :
                                                                loaderStage === 3 ? 'from-ai-purple to-success' :
                                                                    'from-primary to-ai-purple'
                                                        }`}></div>

                                                    <div className={`animate-in zoom-in-50 duration-700 transition-all ${loaderStage === 0 ? 'text-primary' :
                                                        loaderStage === 1 ? 'text-amber-400' :
                                                            loaderStage === 2 ? 'text-success' :
                                                                loaderStage === 3 ? 'text-ai-purple' :
                                                                    'text-primary'
                                                        }`}>
                                                        {isAiGenerated && step === "input" ? (
                                                            loaderStage === 0 ? <Search className="w-16 h-16" /> :
                                                            loaderStage === 1 ? <FileText className="w-16 h-16" /> :
                                                            loaderStage === 2 ? <Brain className="w-16 h-16" /> :
                                                            loaderStage === 3 ? <CheckCircle2 className="w-16 h-16" /> : <Clock className="w-16 h-16" />
                                                        ) : (
                                                            loaderStage === 0 ? <Terminal className="w-16 h-16" /> :
                                                            loaderStage === 1 ? <Zap className="w-16 h-16" /> :
                                                            loaderStage === 2 ? <TrendingDown className="w-16 h-16" /> :
                                                            loaderStage === 3 ? <ArrowLeftRight className="w-16 h-16" /> : <Clock className="w-16 h-16" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Orbital Particles - position shifts per stage */}
                                            <div className={`absolute w-4 h-4 rounded-full blur-[1px] animate-[ping_2s_linear_infinite] transition-all duration-700 ${loaderStage % 2 === 0 ? 'top-0 left-1/2 bg-primary shadow-[0_0_10px_#137fec]' : 'top-1/4 right-0 bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                                                }`}></div>
                                            <div className={`absolute w-3 h-3 rounded-full blur-[1px] animate-[ping_1.5s_linear_infinite] transition-all duration-700 ${loaderStage % 2 === 0 ? 'bottom-4 right-4 bg-ai-purple shadow-[0_0_8px_#8b5cf6]' : 'bottom-0 left-1/2 bg-success shadow-[0_0_8px_#10b981]'
                                                }`} style={{ animationDelay: '0.4s' }}></div>
                                            <div className={`absolute w-3.5 h-3.5 rounded-full blur-[1px] animate-[ping_2.5s_linear_infinite] transition-all duration-700 ${loaderStage % 2 === 0 ? 'top-1/4 -left-4 bg-success shadow-[0_0_8px_#10b981]' : 'top-0 right-1/4 bg-ai-purple shadow-[0_0_8px_#8b5cf6]'
                                                }`} style={{ animationDelay: '0.8s' }}></div>
                                        </div>

                                        <h3 key={`title-${loaderStage}`} className="text-4xl font-900 mb-2 tracking-tight text-slate-900 dark:text-white animate-in fade-in duration-500">
                                            {isAiGenerated && step === "input" ? "Procesando análisis..." :
                                                loaderStage === 0 ? "Iniciando análisis..." :
                                                    loaderStage === 1 ? "Calculando..." :
                                                        loaderStage === 2 ? "Optimizando..." :
                                                            loaderStage === 3 ? "Comparando tarifas..." :
                                                                "Finalizando..."}
                                        </h3>
                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-primary font-mono text-2xl font-black">{Math.round(analysisProgress)}%</p>
                                                <span className="text-[10px] font-bold text-slate-400 tracking-widest animate-pulse">Procesando</span>
                                            </div>

                                            <div className="w-80 h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-inner group-hover/loader:border-primary/30 transition-colors">
                                                <div
                                                    className={`h-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] ${loaderStage === 0 ? 'bg-gradient-to-r from-primary to-primary/70' :
                                                        loaderStage === 1 ? 'bg-gradient-to-r from-primary via-amber-400 to-amber-300' :
                                                            loaderStage === 2 ? 'bg-gradient-to-r from-primary via-success to-success/80' :
                                                                loaderStage === 3 ? 'bg-gradient-to-r from-primary via-ai-purple to-ai-purple/80' :
                                                                    'bg-gradient-to-r from-primary via-ai-purple to-success'
                                                        }`}
                                                    style={{ width: `${analysisProgress}%` }}
                                                ></div>
                                            </div>

                                            <div className="h-8 flex items-center">
                                                <p key={analysisStatus} className="text-[11px] font-bold text-ai-purple tracking-[0.4em] animate-in fade-in slide-in-from-bottom-2 duration-700">
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
                                            <BarChart3 className="w-12 h-12 text-primary animate-pulse" />
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-4xl font-800 mb-6 tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                                Comparador Inteligente
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-12 text-lg max-w-lg mx-auto leading-relaxed">
                                                Entorno analítico configurado. Procesamos sus parámetros eléctricos mediante algoritmos de mercado para garantizar la tarifa más económica del país.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-12 max-w-md mx-auto">
                                            <div className="space-y-3 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover/item:bg-primary/10 transition-colors">
                                                    <Activity className="w-6 h-6 text-slate-400 group-hover/item:text-primary transition-colors" />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Análisis</p>
                                            </div>
                                            <div className="space-y-3 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover/item:bg-success/10 transition-colors">
                                                    <CheckCircle2 className="w-6 h-6 text-slate-400 group-hover/item:text-success transition-colors" />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Verificación</p>
                                            </div>
                                            <div className="space-y-3 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover/item:bg-amber-500/10 transition-colors">
                                                    <PiggyBank className="w-6 h-6 text-slate-400 group-hover/item:text-amber-500 transition-colors" />
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
                                            <Eye className="text-primary w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-800 uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Vista Previa de Factura</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                        <button className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-primary active:scale-90">
                                            <ZoomIn className="w-5 h-5" />
                                        </button>
                                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                        <button className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-primary active:scale-90">
                                            <ZoomOut className="w-5 h-5" />
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
                                                <BarChart3 className="w-[120px] h-[120px] text-primary" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: MAPPING PANEL */}
                            <div className="w-full lg:w-[450px] space-y-6">
                                <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl flex items-start gap-4">
                                    <div className="bg-green-500 p-1.5 rounded-lg text-white">
                                        <CheckCircle2 className="w-4 h-4 font-bold" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
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
                                        <button onClick={() => setStep("input")} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 font-bold rounded-2xl text-xs tracking-widest hover:bg-slate-50 transition-colors">Editar Datos</button>
                                        <button onClick={confirmData} className="flex-[2] bg-success hover:bg-success/90 text-white py-4 font-bold rounded-2xl text-xs tracking-widest shadow-xl shadow-success/20 flex items-center justify-center gap-2 transition-all group active:scale-95">
                                            Confirmar y Comparar
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === "study" && selectedResult && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button 
                                onClick={() => setStep("results")}
                                className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full shadow-lg shadow-slate-200/20 dark:shadow-none hover:-translate-x-1 transition-all active:scale-95 shrink-0"
                            >
                                <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors">Volver al comparador</span>
                            </button>

                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 relative">
                                <button 
                                    onClick={() => setStudyMode("monthly")}
                                    className={`relative z-10 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${studyMode === 'monthly' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Mensual
                                </button>
                                <button 
                                    onClick={() => setStudyMode("annual")}
                                    className={`relative z-10 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${studyMode === 'annual' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Anual
                                </button>
                                {/* Animated Background Pill */}
                                <div 
                                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-full shadow-lg shadow-primary/30 transition-all duration-500 ease-spring ${studyMode === 'annual' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'}`}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-12 py-10 relative">
                            {/* Fondo decorativo ESPECTACULAR (Mesh Gradient) */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl rounded-full opacity-60 pointer-events-none -z-10"></div>
                            
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-1.5 rounded-full text-primary border border-primary/20 animate-fade-in">
                                    <Zap className="w-4 h-4 fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cálculo en tiempo real</span>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Estudio de ahorro {studyMode === 'monthly' ? 'mensual' : 'anual'}</h2>
                                    <p className="text-lg text-slate-500 font-medium">Análisis inteligente para <span className="text-primary font-bold">{selectedResult.tariff.name}</span></p>
                                </div>
                            </div>

                            {/* Selector de tarifas ESPECTACULAR */}
                            <div className="relative w-full max-w-[480px] mx-auto px-1 z-50">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block text-center opacity-80">Selección de inteligencia</label>
                                
                                <div className="relative block group/selector h-[72px]">

                                    <button
                                        onClick={() => setIsStudySelectorOpen(!isStudySelectorOpen)}
                                        className={`absolute inset-0 w-full bg-white dark:bg-slate-900 border-2 rounded-[2rem] transition-all duration-300 shadow-xl flex items-center justify-center overflow-hidden group ${
                                            isStudySelectorOpen 
                                            ? "border-primary ring-[6px] ring-primary/10 -translate-y-1" 
                                            : "border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                                        }`}
                                    >
                                        <div className="absolute left-6 text-primary shrink-0 transition-all duration-300 group-hover:scale-125">
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                        
                                        <div className="flex flex-col px-14 text-center truncate w-full">
                                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-0.5 truncate group-hover:text-primary/70 transition-colors uppercase">{selectedResult.tariff.company}</span>
                                            <span className="text-slate-900 dark:text-white text-lg font-black leading-tight truncate tracking-tight">{selectedResult.tariff.name}</span>
                                        </div>

                                        <div className="absolute right-6 text-slate-400 transition-all duration-300 group-hover:text-primary">
                                            <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isStudySelectorOpen ? "rotate-180" : ""}`} />
                                        </div>

                                        {/* Efecto de brillo premium en hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
                                    </button>

                                    {isStudySelectorOpen && (
                                        <>
                                            <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-700/80 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[60]">
                                                {/* Header centrado */}
                                                <div className="px-6 pt-5 pb-3 text-center border-b border-slate-100 dark:border-slate-800">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Tarifas recomendadas</span>
                                                </div>
                                                <div className="max-h-[380px] overflow-y-auto custom-scrollbar p-3">
                                                    {results.slice(0, 12).map((res) => {
                                                        const isSelected = selectedTariffId === res.tariff.id;
                                                        const itemDiff = (input.current_bill_total || 0) - res.total;
                                                        return (
                                                            <button
                                                                key={res.tariff.id}
                                                                onClick={() => {
                                                                    setSelectedTariffId(res.tariff.id!);
                                                                    setIsStudySelectorOpen(false);
                                                                }}
                                                                className={`w-full px-5 py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between gap-4 mb-1 group/item ${
                                                                    isSelected
                                                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                                                    : "hover:bg-primary/5 text-slate-700 dark:text-slate-300 hover:text-primary"
                                                                }`}
                                                            >
                                                                <div className="flex flex-col items-start text-left min-w-0">
                                                                    <span className={`text-[8px] uppercase tracking-[0.2em] font-black mb-0.5 truncate ${isSelected ? "text-white/80" : "text-slate-400 group-hover/item:text-primary/70"}`}>{res.tariff.company}</span>
                                                                    <span className="font-bold text-sm tracking-tight truncate">{res.tariff.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    {Math.abs(itemDiff) >= 0.01 && (
                                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                                                            isSelected 
                                                                                ? "bg-white/20 text-white" 
                                                                                : itemDiff > 0 
                                                                                    ? "bg-success/10 text-success" 
                                                                                    : "bg-rose-500/10 text-rose-500"
                                                                        }`}>
                                                                            {itemDiff > 0 ? '-' : '+'}{Math.abs(itemDiff).toFixed(2)}€
                                                                        </span>
                                                                    )}
                                                                    {isSelected && (
                                                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Fondo de enfoque al abrir (Overlay con Blur) */}
                                {isStudySelectorOpen && (
                                    <div className="fixed inset-0 z-[45] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={() => setIsStudySelectorOpen(false)}></div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                            {/* Panel Izquierdo: Gráfico de Impacto Visual */}
                            <div className="lg:col-span-5 premium-card overflow-hidden group relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-success to-primary"></div>
                                <div className="p-8 flex flex-col items-center h-full">
                                    <div className="w-full flex justify-between items-start mb-10">
                                        <div className="space-y-1">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Distribución de costes</h3>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Comparativa Estructural</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-success/10 rounded-lg">
                                                <TrendingDown className="w-4 h-4 text-success" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 w-full space-y-8 pt-2 pb-4">
                                        {(() => {
                                            const m = studyMode === 'annual' ? 12 : 1;
                                            const isAnnual = studyMode === 'annual';
                                            
                                            // Pre-calculated values to avoid repetition
                                            const energyDiff = (currentBreakdown.energy - selectedResult.costEnergy) * m;
                                            const powerDiff = (currentBreakdown.powerPlusOthers - (selectedResult.total - selectedResult.costEnergy)) * m;
                                            const totalActual = currentBreakdown.total * m;
                                            const totalOptimized = selectedResult.total * m;
                                            const totalSaving = (currentBreakdown.total - selectedResult.total) * m;

                                            return (
                                                <>
                                                    {/* ── ENERGÍA ── */}
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                                    <Zap className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none">Término de Energía</h4>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Consumo {isAnnual ? 'Anual Estimado' : 'Variable Mensual'}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`text-sm font-black ${energyDiff >= 0 ? 'text-success' : 'text-rose-500'}`}>
                                                                {energyDiff >= 0 ? '-' : '+'}{Math.abs(energyDiff).toFixed(2)}€
                                                            </div>
                                                        </div>

                                                        {/* Barras principales */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 px-0.5">
                                                                    <span>{isAnnual ? 'Actual Anual' : 'Actual'}</span><span className="font-mono text-slate-600 dark:text-slate-300">{(currentBreakdown.energy * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full"><div className="h-full bg-slate-300 dark:bg-slate-600 rounded-full w-full opacity-60"></div></div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-black uppercase text-primary px-0.5">
                                                                    <span>{isAnnual ? 'Nueva Anual' : 'Nueva'}</span><span className="font-mono">{(selectedResult.costEnergy * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100,(selectedResult.costEnergy / (currentBreakdown.energy || 1)) * 100)}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Sub-desglose por periodos */}
                                                        <div className="ml-10 space-y-1.5 border-l-2 border-primary/10 pl-3">
                                                            {(() => {
                                                                const totalKwhManual = input.energy_p1 + input.energy_p2 + input.energy_p3;
                                                                return [
                                                                    { label: 'P1 · Punta', kwh: input.energy_p1, price: selectedResult.tariff.e1_kwh, currentPrice: (input.current_price_p1 || 0) },
                                                                    { label: 'P2 · Llano', kwh: input.energy_p2, price: selectedResult.tariff.e2_kwh, currentPrice: (input.current_price_p2 || input.current_price_p1 || 0) },
                                                                    { label: 'P3 · Valle', kwh: input.energy_p3, price: selectedResult.tariff.e3_kwh, currentPrice: (input.current_price_p3 || input.current_price_p1 || 0) },
                                                                ].filter(r => r.kwh > 0).map((row, i) => {
                                                                    const rowNewCost = row.kwh * row.price * m;
                                                                    const rowOldCost = currentBreakdown.isEstimated
                                                                        ? (currentBreakdown.energy * (row.kwh / (totalKwhManual || 1))) * m
                                                                        : row.kwh * row.currentPrice * m;
                                                                    
                                                                    const rowDiff = rowOldCost - rowNewCost;
                                                                    return (
                                                                        <div key={i} className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                                                                            <span className="uppercase tracking-wide">{row.label}</span>
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="font-mono text-slate-400">
                                                                                    {(row.kwh * m).toLocaleString('es-ES', { maximumFractionDigits: 2 })} kWh
                                                                                    {!currentBreakdown.isEstimated && ` × ${row.price.toFixed(4)}€`}
                                                                                </span>
                                                                                <span className={`font-mono font-black ${rowDiff >= 0 ? 'text-success' : 'text-rose-500'}`}>{rowDiff >= 0 ? '-' : '+'}{Math.abs(rowDiff).toFixed(2)}€</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                });
                                                            })()}
                                                        </div>
                                                    </div>

                                                    {/* ── POTENCIA ── */}
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                                                    <CreditCard className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none">Término de Potencia</h4>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{isAnnual ? 'Capacidad (12 meses)' : 'Capacidad Contratada'}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`text-sm font-black ${powerDiff >= 0 ? 'text-success' : 'text-rose-500'}`}>
                                                                {powerDiff >= 0 ? '-' : '+'}{Math.abs(powerDiff).toFixed(2)}€
                                                            </div>
                                                        </div>

                                                        {/* Barras principales */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 px-0.5">
                                                                    <span>{isAnnual ? 'Actual Anual' : 'Actual'}</span><span className="font-mono text-slate-600 dark:text-slate-300">{(currentBreakdown.powerPlusOthers * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full"><div className="h-full bg-slate-300 dark:bg-slate-600 rounded-full w-full opacity-60"></div></div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-black uppercase text-amber-500 px-0.5">
                                                                    <span>{isAnnual ? 'Nueva Anual' : 'Nueva'}</span><span className="font-mono">{((selectedResult.total - selectedResult.costEnergy) * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="h-2 bg-amber-500/10 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100,((selectedResult.total - selectedResult.costEnergy) / (currentBreakdown.powerPlusOthers || 1)) * 100)}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Sub-desglose P1/P2 potencia */}
                                                        <div className="ml-10 space-y-1.5 border-l-2 border-amber-500/10 pl-3">
                                                            {[
                                                                { label: 'P1 · Punta', kw: input.power_p1, price: selectedResult.tariff.p1_kw_day, days: input.days },
                                                                { label: 'P2 · Valle', kw: input.power_p2, price: selectedResult.tariff.p2_kw_day, days: input.days },
                                                            ].filter(r => r.kw > 0).map((row, i) => {
                                                                const rowCost = row.kw * row.price * row.days * m;
                                                                return (
                                                                    <div key={i} className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                                                                        <span className="uppercase tracking-wide">{row.label}</span>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="font-mono text-slate-400">{row.kw.toLocaleString('es-ES', { maximumFractionDigits: 2 })} kW × {row.price.toFixed(6)}€/día</span>
                                                                            <span className="font-mono font-black text-amber-500">{rowCost.toFixed(2)}€</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-1 space-y-1">
                                                                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                                                    <span className="uppercase tracking-wide">IEE (5.11%)</span>
                                                                    <span className="font-mono">{(selectedResult.taxIee * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                                                    <span className="uppercase tracking-wide">Bono Social</span>
                                                                    <span className="font-mono">{(selectedResult.costBonoSocial * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                                                    <span className="uppercase tracking-wide">Contador</span>
                                                                    <span className="font-mono">{(selectedResult.costMeter * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                                                    <span className="uppercase tracking-wide">IVA (21%)</span>
                                                                    <span className="font-mono">{(selectedResult.taxIva * m).toFixed(2)}€</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* ── DIVIDER ── */}
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                                                        <div className="relative flex justify-center">
                                                            <div className="bg-white dark:bg-slate-900 px-4 text-slate-300"><TrendingDown className="w-4 h-4" /></div>
                                                        </div>
                                                    </div>

                                                    {/* ── TOTAL ── */}
                                                    <div className="p-5 bg-gradient-to-br from-success/5 to-primary/5 rounded-3xl border border-success/20 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 blur-3xl rounded-full -mr-12 -mt-12"></div>
                                                        <div className="flex items-center justify-between relative z-10">
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Impacto Global</p>
                                                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ahorro {isAnnual ? 'Anual' : 'Mensual'}</h4>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-3xl font-black text-success tracking-tighter">
                                                                    {Math.abs(totalSaving).toFixed(2)}€
                                                                </div>
                                                                <div className="text-[9px] font-black bg-success/10 text-success px-2 py-0.5 rounded-full inline-block mt-1">
                                                                    {totalSaving >= 0 ? '-' : '+'}{Math.round((Math.abs(totalSaving) / (totalActual || 1)) * 100)}% {isAnnual ? 'año' : 'factura'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Panel Derecho: Comparativa y Análisis */}
                            <div className="col-span-1 lg:col-span-7 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Card Actual */}
                                    <div className="premium-card p-6 border-l-4 border-slate-300 dark:border-slate-700 overflow-hidden relative group">
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tu gasto actual</p>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <CreditCard className="w-16 h-16" />
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-slate-700 dark:text-slate-300">{(studyMode === 'monthly' ? (input.current_bill_total || 0) : (input.current_bill_total || 0) * 12).toFixed(2)}</span>
                                            <span className="text-lg font-bold text-slate-400">€/{studyMode === 'monthly' ? 'mes' : 'año'}</span>
                                        </div>
                                        <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-300 dark:bg-slate-600 w-full opacity-50"></div>
                                        </div>
                                    </div>

                                    {/* Card Nueva */}
                                    <div className="premium-card p-6 border-l-4 border-primary overflow-hidden relative group bg-gradient-to-br from-primary/5 to-transparent">
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Nueva optimización</p>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Zap className="w-16 h-16" />
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-primary">{(studyMode === 'monthly' ? selectedResult.total : selectedResult.total * 12).toFixed(2)}</span>
                                            <span className="text-lg font-bold text-primary/60">€/{studyMode === 'monthly' ? 'mes' : 'año'}</span>
                                        </div>
                                        <div className="mt-4 w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary animate-pulse-slow w-full shadow-[0_0_10px_rgba(26,188,156,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gran Banner de Ahorro */}
                                <div className="premium-card p-0 overflow-hidden bg-success/5 border-2 border-success/20 hover:border-success/40 transition-all relative">
                                    <div className="flex flex-col sm:flex-row items-center">
                                        <div className="bg-success px-10 py-10 sm:py-12 flex flex-col items-center justify-center text-white shrink-0 w-full sm:w-auto">
                                            <Trophy className="w-12 h-12 mb-3 animate-bounce" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Logro</span>
                                        </div>
                                        <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between w-full gap-6">
                                            <div>
                                                <h4 className="text-sm font-black text-success uppercase tracking-widest mb-1">Ahorro total calculado</h4>
                                                <p className="text-slate-500 text-xs font-bold leading-relaxed px-1">Se han aplicado todos los impuestos y cánones vigentes.</p>
                                            </div>
                                            <div className="text-center sm:text-right">
                                                <div className={`text-5xl font-black tracking-tighter ${((input.current_bill_total || 0) - selectedResult.total) >= 0 ? "text-success" : "text-rose-500"}`}>
                                                    {Math.abs(studyMode === 'monthly' 
                                                        ? (input.current_bill_total || 0) - selectedResult.total 
                                                        : ((input.current_bill_total || 0) - selectedResult.total) * 12
                                                    ).toFixed(2)}
                                                    <span className="text-2xl ml-1 italic">€</span>
                                                </div>
                                                {studyMode === 'annual' && (
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Estimación x12 meses</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Análisis Experto Refinado */}
                                <div className="premium-card p-8 bg-slate-900 border-none shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                                            <Brain className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Análisis estratégico IA</h4>
                                            <p className="text-slate-300 text-[15px] italic leading-relaxed font-medium">
                                                "{generateAIInsight}"
                                            </p>
                                        </div>
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
                                    <TrendingDown className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Análisis de Resultados</p>
                                    <h2 className="text-xl font-800">Ahorro Estimado: <span className="text-success">{results[0] ? Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2) : "0.00"} € / año</span></h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep("input")}
                                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-6 py-2.5 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95 shadow-sm mx-auto sm:mx-0"
                            >
                                <History className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Nueva Comparativa</span>
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 perspective-1000">
                            {/* LEFT: CURRENT PROFILE SUMMARY */}
                            <aside className="w-full lg:w-[325px] shrink-0 space-y-6">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm space-y-8 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                                    
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="space-y-1">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Tu suministro</h4>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Perfil de Carga</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center text-success border border-success/20">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 relative z-10">
                                        <div className="flex flex-col bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-3xl border border-slate-100/50 dark:border-white/5 group-hover:bg-white dark:group-hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-1.5 h-3 bg-amber-500 rounded-full"></div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Potencia Contratada</p>
                                            </div>
                                            {input.power_p2 > 0 && input.power_p1 !== input.power_p2 ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-xs font-black">
                                                        <span className="text-slate-400 uppercase tracking-tighter">P1 · Punta</span>
                                                        <span className="text-amber-600">{input.power_p1.toLocaleString('es-ES', { maximumFractionDigits: 2 })} kW</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs font-black pt-2 border-t border-slate-100 dark:border-white/5">
                                                        <span className="text-slate-400 uppercase tracking-tighter">P2 · Valle</span>
                                                        <span className="text-amber-600">{input.power_p2.toLocaleString('es-ES', { maximumFractionDigits: 2 })} kW</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-baseline gap-1.5">
                                                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{input.power_p1.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</p>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">kW</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-3xl border border-slate-100/50 dark:border-white/5 group-hover:bg-white dark:group-hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-1.5 h-3 bg-primary rounded-full"></div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consumo Energético</p>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'P1 · Punta', val: input.energy_p1, color: 'text-orange-500' },
                                                    { label: 'P2 · Valle', val: input.energy_p2, color: 'text-primary' },
                                                    { label: 'P3 · Valle', val: input.energy_p3, color: 'text-indigo-500' }
                                                ].filter(p => p.val > 0).map((p, i) => (
                                                    <div key={i} className="flex justify-between items-center text-xs font-black">
                                                        <span className="text-slate-400 uppercase tracking-tighter">{p.label}</span>
                                                        <span className={p.color}>{p.val.toLocaleString('es-ES', { maximumFractionDigits: 1 })} kWh</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative pt-8 mt-2 border-t border-slate-100 dark:border-white/5 z-10">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-5">Impuestos Aplicados</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="group/tax relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-4 rounded-2xl text-center border border-slate-200/50 dark:border-white/5 shadow-sm transition-all hover:border-primary/30">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-70">IEE</p>
                                                    <p className="text-sm font-black text-primary">5.11%</p>
                                                </div>
                                                <div className="group/tax relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-4 rounded-2xl text-center border border-slate-200/50 dark:border-white/5 shadow-sm transition-all hover:border-primary/30">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-70">IVA</p>
                                                    <p className="text-sm font-black text-primary">21%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FILTERS SECTION */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                                    {/* Deco Background Grid */}
                                    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                                    
                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-200/50 dark:border-white/5">
                                                <Filter className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Filtros</h4>
                                        </div>
                                        {results.length !== baseResults.length && (
                                            <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 animate-in zoom-in duration-500">
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{results.length} tarifas</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8 relative z-10">
                                        {/* Filter: Search Company */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Buscar Compañía / Tarifa</label>
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within/input:text-primary" />
                                                <input
                                                    type="text"
                                                    value={filterSearch}
                                                    onChange={e => setFilterSearch(e.target.value)}
                                                    placeholder="Ej. Endesa, Iberdrola..."
                                                    className="relative w-full bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400/70"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipo de Precio</label>
                                            <div className="flex bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800/50">
                                                {['all', 'fixed', 'periods'].map((t) => (
                                                    <button 
                                                        key={t}
                                                        onClick={() => setFilterPriceType(t as any)} 
                                                        className={`flex-1 text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest transition-all duration-300 ${
                                                            filterPriceType === t 
                                                            ? (t === 'fixed' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : t === 'periods' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md')
                                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                                        }`}
                                                    >
                                                        {t === 'all' ? 'Todos' : t === 'fixed' ? 'Fijo' : 'Tramos'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Permanencia</label>
                                            <div className="flex bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800/50">
                                                {['all', 'without', 'with'].map((p) => (
                                                    <button 
                                                        key={p}
                                                        onClick={() => setFilterPermanence(p as any)} 
                                                        className={`flex-1 text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest transition-all duration-300 ${
                                                            filterPermanence === p 
                                                            ? 'bg-white dark:bg-slate-700 text-primary shadow-md' 
                                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                                        }`}
                                                    >
                                                        {p === 'all' ? 'Todas' : p === 'without' ? 'Sin' : 'Con'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* RIGHT: TARIFF COMPARISON LIST */}
                            <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
                                    <div
                                        onClick={() => {
                                            if (!user) {
                                                setPendingStudyMode("monthly");
                                                setIsAuthModalOpen(true);
                                                return;
                                            }
                                            if (results[0]) {
                                                setSelectedTariffId(results[0].tariff.id!);
                                                setStudyMode("monthly");
                                                setStep("study");
                                            }
                                        }}
                                        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] relative overflow-hidden shadow-sm transition-all duration-300 group ${results[0] ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : 'opacity-50'}`}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="flex justify-between items-start mb-4 w-full text-left">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {user ? (
                                                        <>
                                                            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg tracking-widest border border-slate-200 dark:border-slate-700/50 group-hover:hidden animate-in fade-in duration-300">Mensual</span>
                                                            <span className="text-[10px] font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest hidden group-hover:block animate-in slide-in-from-right-2 fade-in duration-300">Ver Detalles</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg tracking-widest border border-slate-200 dark:border-slate-700/50 flex items-center gap-1 group-hover:hidden"><Lock className="w-3 h-3" />Mensual</span>
                                                            <span className="text-[10px] font-bold px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full uppercase tracking-widest hidden group-hover:flex items-center gap-1 animate-in slide-in-from-right-2 fade-in duration-300"><Lock className="w-3 h-3" />Regístrate gratis</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-3xl font-900 text-slate-900 dark:text-white mb-2">{results[0] ? `${results[0].total.toFixed(2)} €` : "---"}</p>
                                            <div className="flex items-center justify-center gap-1.5 text-success">
                                                <div className={`flex items-center justify-center w-5 h-5 rounded-full ${((input.current_bill_total || 0) - results[0].total) >= 0 ? "bg-success/10 text-success" : "bg-rose-500/10 text-rose-500"}`}>
                                                    {((input.current_bill_total || 0) - results[0].total) >= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                                </div>
                                                <p className={`text-[11px] font-bold tracking-tight ${((input.current_bill_total || 0) - results[0].total) >= 0 ? "text-success" : "text-rose-500"}`}>
                                                    {results[0] ? `${Math.abs((input.current_bill_total || 0) - results[0].total).toFixed(2)} € ${((input.current_bill_total || 0) - results[0].total) >= 0 ? 'ahorro mensual' : 'coste adicional'}` : "Sin datos"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => {
                                            if (!user) {
                                                setPendingStudyMode("annual");
                                                setIsAuthModalOpen(true);
                                                return;
                                            }
                                            if (results[0]) {
                                                setSelectedTariffId(results[0].tariff.id!);
                                                setStudyMode("annual");
                                                setStep("study");
                                            }
                                        }}
                                        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] relative overflow-hidden shadow-sm transition-all duration-300 group ${results[0] ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : 'opacity-50'}`}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="flex justify-between items-start mb-4 w-full text-left">
                                                <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {user ? (
                                                        <>
                                                            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg tracking-widest border border-slate-200 dark:border-slate-700/50 group-hover:hidden animate-in fade-in duration-300">Anual</span>
                                                            <span className="text-[10px] font-bold px-3 py-1 bg-success/10 text-success rounded-full uppercase tracking-widest hidden group-hover:block animate-in slide-in-from-right-2 fade-in duration-300">Ver Detalles</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg tracking-widest border border-slate-200 dark:border-slate-700/50 flex items-center gap-1 group-hover:hidden"><Lock className="w-3 h-3" />Anual</span>
                                                            <span className="text-[10px] font-bold px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full uppercase tracking-widest hidden group-hover:flex items-center gap-1 animate-in slide-in-from-right-2 fade-in duration-300"><Lock className="w-3 h-3" />Regístrate gratis</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-3xl font-900 text-slate-900 dark:text-white mb-2">{results[0] ? `${(results[0].total * 12).toFixed(2)} €` : "---"}</p>
                                            <div className="flex items-center justify-center gap-1.5">
                                                <div className={`flex items-center justify-center w-5 h-5 rounded-full ${((input.current_bill_total || 0) - results[0].total) >= 0 ? "bg-success/10 text-success" : "bg-rose-500/10 text-rose-500"}`}>
                                                    {((input.current_bill_total || 0) - results[0].total) >= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                                </div>
                                                <p className={`text-[11px] font-bold tracking-tight ${((input.current_bill_total || 0) - results[0].total) >= 0 ? "text-success" : "text-rose-500"}`}>
                                                    {results[0] ? `${Math.abs(((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} € ${((input.current_bill_total || 0) - results[0].total) >= 0 ? 'ahorro anual' : 'diferencial anual'} (x12 meses)` : "Sin datos"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => {
                                            if (results[0]) {
                                                setSelectedTariffId(results[0].tariff.id!);
                                                setStep("detail");
                                            }
                                        }}
                                        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] relative overflow-hidden shadow-sm transition-all duration-300 group ${results[0] ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : 'opacity-50'}`}
                                    >
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 h-full w-full flex flex-col justify-between items-center text-center">
                                            <div className="flex justify-between items-start mb-2 w-full text-left">
                                                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</span>
                                            </div>
                                            {results[0] ? (
                                                <div>
                                                    <div className="flex items-baseline gap-1 mb-1 justify-center">
                                                        <p className="text-3xl font-900 text-primary">{results[0].tariff.e1_kwh}</p>
                                                        <span className="text-[10px] font-bold text-primary/60">€/kWh</span>
                                                    </div>
                                                    <p className="text-sm text-slate-800 dark:text-slate-100 font-bold mb-0.5">{results[0].tariff.name}</p>
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-none block">{results[0].tariff.company}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm font-bold text-slate-400">Sin recomendaciones</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
                                    <div className="px-5 py-6 md:px-8 md:py-8 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group/header">
                                        {/* Advanced Glow Decorations Moved Here */}
                                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover/header:bg-primary/20 transition-all duration-1000 pointer-events-none"></div>
                                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-success/5 rounded-full blur-[80px] group-hover/header:bg-success/10 transition-all duration-1000 pointer-events-none"></div>

                                        <h3 className="font-900 text-lg md:text-xl tracking-tight text-center flex flex-col md:flex-row items-center gap-3 text-slate-900 dark:text-white relative z-10">
                                            Resultados de Comparativa
                                        </h3>
                                        <div className="flex justify-center sm:justify-start gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar relative z-10">
                                            <button
                                                onClick={saveBill}
                                                disabled={isProcessing || results.length === 0}
                                                className="shrink-0 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest border border-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <Clock className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Database className="w-4 h-4" />
                                                )}
                                                {isProcessing ? "Guardando..." : "Guardar análisis"}
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
                                                {/* Type Indicator Line Mobile - More subtle and pill-shaped */}
                                                <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full z-10 ${res.tariff.type === '3 Periodos' ? 'bg-primary/60' : 'bg-amber-500/60'}`}></div>
                                                {/* Top Saving Badge for #1 */}
                                                {idx === 0 && (
                                                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                                                )}

                                                <div className="p-5 space-y-4">
                                                    {/* Header: Company + Ahorro */}
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none truncate">{res.tariff.company}</p>
                                                            </div>
                                                            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">{res.tariff.name}</p>
                                                        </div>

                                                            <div className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 whitespace-nowrap animate-in zoom-in-50 duration-500 ${((input.current_bill_total || 0) - res.total) > 0 ? "bg-success/10 text-success" : "bg-rose-500/10 text-rose-500"}`}>
                                                                {((input.current_bill_total || 0) - res.total) > 0 ? <TrendingDown className="w-3 h-3 font-bold" /> : <TrendingUp className="w-3 h-3 font-bold" />}
                                                                <span className="text-[10px] font-black tracking-tight">{((input.current_bill_total || 0) - res.total) > 0 ? '-' : '+'}{Math.abs((input.current_bill_total || 0) - res.total).toFixed(2)} €/mes</span>
                                                            </div>
                                                        </div>

                                                    {/* Price Display */}
                                                    <div className="flex items-end justify-between bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                                        <div>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tu cuota estimada</p>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="text-3xl font-900 text-slate-900 dark:text-white tracking-tighter">{res.total.toFixed(2)} €</span>
                                                                <span className="text-[11px] font-bold text-slate-400">/mes</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Precio kWh</p>
                                                            <p className="text-sm font-mono font-black text-primary">{res.tariff.e1_kwh.toFixed(4)} €</p>
                                                        </div>
                                                    </div>

                                                    {/* Action Footer */}
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTariffId(res.tariff.id!);
                                                                setStep("detail");
                                                            }}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[10px] tracking-widest transition-all active:scale-95 ${idx === 0
                                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                                                                }`}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Ver detalles
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
                                                            {res.tariff.id && favorites.includes(res.tariff.id) ? (
                                                                <Heart className="w-5 h-5 fill-current" />
                                                            ) : (
                                                                <Heart className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* DESKTOP VIEW: TABLE (hidden md:block) */}
                                    <div className="hidden md:block overflow-x-auto overflow-y-hidden">
                                        <div className="relative overflow-hidden rounded-b-[3.5rem] bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl border-x border-b border-slate-200/50 dark:border-white/10 p-4 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_32px_120px_-15px_rgba(0,0,0,0.5)] group/table">


                                            {/* Decorative Grid Background */}
                                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none z-0"
                                                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>

                                            <table className="w-full text-left border-separate border-spacing-y-4 px-4 table-fixed relative z-10">
                                                <thead>
                                                    <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.3em] whitespace-nowrap">
                                                        <th className="pl-8 pr-4 py-10 w-[30%] align-middle text-left bg-slate-50/50 dark:bg-slate-900/40 rounded-l-3xl border-y border-l border-slate-100 dark:border-white/5">
                                                            Compañía / Tarifa
                                                        </th>
                                                        <th className="px-4 py-10 w-[14%] align-middle text-left bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-white/5">
                                                            Energía
                                                        </th>
                                                        <th className="px-4 py-10 w-[14%] align-middle text-center bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-white/5">
                                                            Total mes
                                                        </th>
                                                        <th className="px-4 py-10 w-[21%] align-middle text-center text-success font-black bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-white/5">
                                                            Ahorro
                                                        </th>
                                                        <th className="px-4 py-10 w-[21%] align-middle text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-r-3xl border-y border-r border-slate-100 dark:border-white/5">
                                                            Acción
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="perspective-2000">
                                                    {/* Empty State */}
                                                    {results.length === 0 && (
                                                        <tr>
                                                            <td colSpan={5} className="py-20 text-center">
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <ZapOff className="w-12 h-12 text-slate-300" />
                                                                    <p className="text-slate-500 font-bold">No se han encontrado tarifas con estos filtros</p>
                                                                    <button onClick={() => {setFilterSearch(""); setFilterPriceType("all"); setFilterPermanence("all");}} className="text-primary text-xs font-bold uppercase tracking-widest">Restablecer Filtros</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {/* Baseline Reference - Premium & Standardized */}
                                                    <tr className="bg-slate-100/30 dark:bg-slate-800/20 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm group relative z-10">
                                                        <td className="pl-8 pr-4 py-8 rounded-l-[1.5rem] relative">
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                                                            <div className="flex flex-col">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap mb-1">Tu Situación Actual</p>
                                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Referencia Base</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-8 align-middle">
                                                            <div className="flex flex-col">
                                                                <div className="flex flex-col gap-0.5 text-[10px]">
                                                                    <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-orange-500/50"></div> <span className="font-bold text-orange-500/70 uppercase text-[8px]">P1:</span> <span className="font-mono text-slate-500 dark:text-slate-400">{(input.current_price_p1 || 0).toFixed(4)}</span></div>
                                                                    <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-blue-500/50"></div> <span className="font-bold text-blue-500/70 uppercase text-[8px]">P2:</span> <span className="font-mono text-slate-500 dark:text-slate-400">{((input.current_price_p2 || 0) > 0 ? (input.current_price_p2 || 0) : (input.current_price_p1 || 0)).toFixed(4)}</span></div>
                                                                    <div className="flex items-center gap-2"><div className="w-[3px] h-3 rounded-full bg-success/50"></div> <span className="font-bold text-success/70 uppercase text-[8px]">P3:</span> <span className="font-mono text-slate-500 dark:text-slate-400">{((input.current_price_p3 || 0) > 0 ? (input.current_price_p3 || 0) : (input.current_price_p1 || 0)).toFixed(4)}</span></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-8 align-middle text-center">
                                                            <span className="text-lg font-bold text-slate-400 dark:text-slate-500">{(input.current_bill_total || 0).toFixed(2)} €</span>
                                                        </td>
                                                        <td className="px-4 py-8 align-middle text-center text-slate-300 dark:text-slate-700 font-black">—</td>
                                                        <td className="pr-6 pl-4 py-8 rounded-r-[1.5rem] align-middle text-right">
                                                            {/* Empty for baseline */}
                                                        </td>
                                                    </tr>

                                                    {/* Comparison results - Hierarchical & High Performance */}
                                                    {results.map((res, idx) => (
                                                        <tr key={idx} className={`group relative transition-all duration-500 hover:z-20 ${idx === 0
                                                            ? "bg-white dark:bg-slate-900 shadow-[0_25px_80px_-15px_rgba(var(--primary-rgb),0.2)] dark:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] ring-2 ring-primary/20 scale-[1.02] -translate-y-1"
                                                            : "bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-white/40 dark:border-white/5 hover:shadow-xl hover:scale-[1.01] hover:-translate-y-1"
                                                            }`}>
                                                            <td className="pl-8 pr-4 py-8 transition-all duration-300 rounded-l-3xl relative">
                                                                {/* Type Indicator Line */}
                                                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 rounded-r-full z-10 transition-all duration-500 group-hover:h-16 ${res.tariff.type === '3 Periodos' ? 'bg-primary' : 'bg-amber-500'}`}></div>
                                                                {idx === 0 && (
                                                                    <>
                                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-20 w-1.5 bg-gradient-to-b from-primary via-primary-light to-primary rounded-full z-30 shadow-[0_0_25px_rgba(var(--primary-rgb),0.6)]"></div>
                                                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.06] to-transparent pointer-events-none rounded-l-3xl"></div>
                                                                    </>
                                                                )}
                                                                <div className="flex flex-col gap-1.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${idx === 0 ? "text-primary" : "text-slate-400 group-hover:text-primary/70"}`}>{res.tariff.company}</p>
                                                                    </div>
                                                                    <p className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight leading-tight">{res.tariff.name}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-8 align-middle border-y border-slate-100 dark:border-white/5">
                                                                <div className="flex flex-col">
                                                                    <div className="flex flex-col gap-1 text-[10px]">
                                                                        <div className="flex items-center gap-2.5"><div className="w-1 h-3 rounded-full bg-orange-500"></div> <span className="font-bold text-orange-500 uppercase text-[8px] w-4">P1:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-primary">{res.tariff.e1_kwh.toFixed(4)}</span></div>
                                                                        <div className="flex items-center gap-2.5"><div className="w-1 h-3 rounded-full bg-blue-500"></div> <span className="font-bold text-blue-500 uppercase text-[8px] w-4">P2:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-primary">{(res.tariff.e2_kwh || res.tariff.e1_kwh).toFixed(4)}</span></div>
                                                                        <div className="flex items-center gap-2.5"><div className="w-1 h-3 rounded-full bg-success"></div> <span className="font-bold text-success uppercase text-[8px] w-4">P3:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-primary">{(res.tariff.e3_kwh || res.tariff.e1_kwh).toFixed(4)}</span></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-8 align-middle border-y border-slate-100 dark:border-white/5 text-center">
                                                                <div className="flex flex-col items-center">
                                                                    <span className={`text-xl font-black tracking-tighter ${idx === 0 ? "text-primary scale-110" : "text-slate-900 dark:text-white"}`}>{res.total.toFixed(2)} €</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-8 align-middle border-y border-slate-100 dark:border-white/5 text-center">
                                                                <div className="flex flex-col items-center justify-center relative">
                                                                    {idx === 0 && (
                                                                        <div className="absolute -inset-6 bg-success/10 blur-2xl rounded-full animate-pulse z-0"></div>
                                                                    )}
                                                                    <div className={`flex items-center justify-center gap-1.5 relative z-10 whitespace-nowrap flex-nowrap ${((input.current_bill_total || 0) - res.total) >= 0 ? "text-success" : "text-rose-500"}`}>
                                                                        <div className="opacity-70 shrink-0">
                                                                            {((input.current_bill_total || 0) - res.total) >= 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                                                                        </div>
                                                                        <span className="font-black tracking-tighter text-2xl">
                                                                            {((input.current_bill_total || 0) - res.total) >= 0 ? '-' : '+'}
                                                                            {Math.abs((input.current_bill_total || 0) - res.total).toFixed(2)} €
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="pr-6 pl-4 py-8 border-y border-slate-100 dark:border-white/5 rounded-r-3xl text-right align-middle">
                                                                <div className="inline-flex items-center gap-1 px-1.5 py-1.5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 shadow-sm">
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
                                                                        className={`p-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center bg-transparent ${res.tariff.id && favorites.includes(res.tariff.id)
                                                                            ? "text-red-500"
                                                                            : "text-slate-400 dark:text-slate-500 hover:text-primary"
                                                                            }`}
                                                                    >
                                                                        <div className="text-xl">
                                                                            {res.tariff.id && favorites.includes(res.tariff.id) ? <Heart className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
                                                                        </div>
                                                                    </button>
                                                                    <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700/50 mx-0.5"></div>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedTariffId(res.tariff.id!);
                                                                            setStep("detail");
                                                                        }}
                                                                        title="Ver detalles"
                                                                        className="p-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center bg-transparent text-primary hover:text-primary/70"
                                                                    >
                                                                        <Eye className="w-6 h-6" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Technical Footer Area */}
                                            <div className="relative z-10 mt-4 pt-6 pb-4 px-10 border-t border-slate-200/50 dark:border-white/5 flex items-center gap-3 text-slate-400">
                                                <Info className="w-4 h-4 opacity-50" />
                                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                                                    Precios estimados basados en tu consumo. El ahorro real puede variar según su perfil de uso técnico.
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                {/* BOTTOM BREAKDOWN BOX (THE BLACK BOX) */}
                                    {results.length > 0 && (
                                        <div className="bg-slate-900 border border-slate-800 text-white rounded-[2.5rem] overflow-hidden p-8 md:p-12 relative shadow-2xl mt-8">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                                            <div className="relative z-10 space-y-12">
                                                {/* HEADER INSIDE BLACK BOX */}
                                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
                                                    <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                                                            <BarChart3 className="text-primary w-8 h-8" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="text-lg font-bold tracking-tight text-white/90">Desglose Técnico Transparente</h4>
                                                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-black">
                                                                Tarifa Ganadora: <span className="text-slate-400">{results[0].tariff.company} {results[0].tariff.name}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-10 gap-y-12">
                                                {[
                                                    { label: "Energía", val: results[0].costEnergy, sub: "Mercado " + (results[0].tariff.type === '3 Periodos' ? 'Indexado' : 'Libre'), icon: <Zap className="w-4 h-4" />, border: "border-primary/40" },
                                                    { label: "Potencia", val: results[0].costPower, sub: "Capacidad Contratada", icon: <Zap className="w-4 h-4" />, border: "border-white/10" },
                                                    { label: "Bono Social", val: results[0].costBonoSocial, sub: "Financiación Obligatoria", icon: <Heart className="w-4 h-4" />, border: "border-white/10" },
                                                    { label: "Contador", val: results[0].costMeter, sub: "Alquiler de Equipo", icon: <Gauge className="w-4 h-4" />, border: "border-white/10" },
                                                    { label: "Impuesto IEE", val: results[0].taxIee, sub: "Imp. Eléctrico (5.11%)", icon: <Building2 className="w-4 h-4" />, border: "border-white/10" },
                                                    { label: "IVA Aplicado", val: results[0].taxIva, sub: "IVA General (21%)", icon: <FileText className="w-4 h-4" />, border: "border-white/10" },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex flex-col h-full">
                                                        <div className="flex items-center gap-2 text-slate-400 min-h-[40px] mb-4">
                                                            <div className="text-slate-500">{item.icon}</div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{item.label}</p>
                                                        </div>
                                                        <div className={`pl-4 border-l-2 ${item.border} flex flex-col justify-center grow`}>
                                                            <p className={`text-2xl font-900 tracking-tight ${idx === 0 ? 'text-white' : 'text-slate-200'}`}>{item.val.toFixed(2)} €</p>
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1 opacity-70">{item.sub}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* TOTAL ESTIMATED DASHBOARD INSIDE BLACK BOX */}
                                            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/5 shadow-inner">
                                                        <Info className="text-slate-400 w-6 h-6" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Metodología de Cálculo</p>
                                                        <p className="text-[11px] text-slate-400 font-medium italic max-w-[320px] leading-relaxed">
                                                            Cálculo basado en parámetros reales de mercado (BOE). Análisis realizado en tiempo real.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-center md:text-right">
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mb-3">Total Estimado Mensual</p>
                                                    <div className="flex items-baseline justify-center md:justify-end gap-3">
                                                        <p className="text-7xl font-900 text-success drop-shadow-[0_0_30px_rgba(34,197,94,0.2)] tracking-tighter">
                                                            {results[0].total.toFixed(2)}
                                                            <span className="text-4xl ml-2 opacity-80">€</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

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
                                                    <History className="text-slate-400 w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Tu Situación Actual</p>
                                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Referencia de Mercado</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-900 text-slate-400 line-through opacity-50">{(input.current_bill_total || 0).toFixed(2)} €</p>
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
                                                                    <Trophy className="w-5 h-5" />
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
                                                            <p className={`text-3xl font-900 ${idx === 0 ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>{res.total.toFixed(2)} €</p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${saving > 0 ? "text-success" : "text-slate-400"}`}>
                                                                {saving > 0 ? `-${(saving / (input.current_bill_total || 1) * 100).toFixed(1)}% ahorro` : `${res.total.toFixed(2)} €/mes`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="h-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-[1rem] overflow-hidden border border-slate-100 dark:border-white/5 relative group-hover:border-primary/20 transition-all shadow-inner">
                                                        <div
                                                            className={`h-full ${idx === 0
                                                                ? 'bg-gradient-to-r from-primary via-primary/80 to-primary/60'
                                                                : 'bg-slate-200 dark:bg-slate-700'
                                                                } rounded-r-xl transition-all duration-[1200ms] delay-${idx * 150} ease-out relative shadow-lg`}
                                                            style={{ width: `${percent > 100 ? 100 : percent}%` }}
                                                        >
                                                            {idx === 0 && (
                                                                <div className="absolute inset-0 bg-white/20 animate-pulse opacity-50"></div>
                                                            )}
                                                            <div className="absolute right-3 inset-y-0 flex items-center">
                                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                                                                    {percent.toFixed(0)}%
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
                                                <PiggyBank className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-success/60 leading-none mb-2">Ahorro Máximo Proyectado</p>
                                                <p className="text-4xl font-900 text-success tracking-tighter">{Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} € <span className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">/ año</span></p>
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
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                    </div>
                )}

                {/* STEP 4: TARIFF DETAIL VIEW */}
                {
                    step === "detail" && selectedResult && (
                        <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <button onClick={() => setStep("results")} className="text-xs font-bold text-primary flex items-center gap-2 hover:opacity-70 transition-opacity">
                                    <ArrowLeftIcon className="w-4 h-4" />
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
                                                    <Building2 className="absolute text-4xl text-slate-300 w-10 h-10" />
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
                                            <p className="text-5xl md:text-6xl font-800 text-primary">{selectedResult.total.toFixed(2)} €</p>
                                            <p className="text-[10px] text-slate-400 font-medium italic mt-2">impuestos incluidos (IVA 21%)</p>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <div className="px-5 md:px-10 py-5 md:py-6 border-b border-slate-100 dark:border-slate-800 flex flex-row justify-between items-center bg-slate-50/50 dark:bg-slate-800/20 gap-2 overflow-hidden">
                                            <div className="flex items-center gap-2 md:gap-3 shrink-1 min-w-0">
                                                <CreditCard className="text-primary w-5 h-5 md:w-6 md:h-6 shrink-0" />
                                                <h4 className="font-800 text-xs sm:text-base truncate">Detalle de Precios</h4>
                                            </div>
                                            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full py-1.5 px-2 md:px-3 shadow-sm shrink-0">
                                                <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer select-none whitespace-nowrap transition-colors" onClick={() => setShowWithTaxes(!showWithTaxes)}>
                                                    {showWithTaxes ? 'Con impuestos' : 'Sin impuestos'}
                                                </span>
                                                <button
                                                    role="switch"
                                                    aria-checked={showWithTaxes}
                                                    onClick={() => setShowWithTaxes(!showWithTaxes)}
                                                    className={`${showWithTaxes ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none shrink-0`}
                                                >
                                                    <span className={`${showWithTaxes ? 'translate-x-4' : 'translate-x-0.5'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter text-center md:text-left">Término de Potencia</h5>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <span className="text-xs font-bold">Punta (P1)</span>
                                                        <span className="font-mono text-xs font-bold">{applyTaxes(selectedResult.tariff?.p1_kw_day ?? 0).toFixed(5)} € €/kW día</span>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <span className="text-xs font-bold">Valle (P2)</span>
                                                        <span className="font-mono text-xs font-bold">{applyTaxes(selectedResult.tariff?.p2_kw_day ?? 0).toFixed(5)} € €/kW día</span>
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
                                                            <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">{applyTaxes(selectedResult.tariff?.e1_kwh ?? 0).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-slate-500">€/kWh</span></span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-blue-500"></span>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Llano (P2)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{applyTaxes(selectedResult.tariff?.e2_kwh ?? 0).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-slate-500">€/kWh</span></span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-green-500"></span>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Valle (P3)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-green-600 dark:text-green-400">{applyTaxes(selectedResult.tariff?.e3_kwh ?? 0).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-slate-500">€/kWh</span></span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center space-y-4 relative group mt-4">
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest leading-none shadow-sm shadow-primary/20">Precio Único (24h)</div>
                                                        <p className="text-3xl font-800 text-primary">{applyTaxes(selectedResult.tariff?.e1_kwh ?? 0).toFixed(5)} € <span className="text-sm font-normal opacity-60">€/kWh</span></p>
                                                        <p className="text-[10px] text-slate-500 italic leading-relaxed">Esta tarifa no discrimina por horarios, pagas lo mismo siempre.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                                            <FileText className="text-primary w-6 h-6" />
                                            <h4 className="font-800 text-center md:text-left">Desglose de Factura Estimada</h4>
                                        </div>
                                        <div className="p-10 space-y-5">
                                            {[
                                                { l: "Término de Potencia (" + (input.power_p1 === input.power_p2 ? input.power_p1.toFixed(2).replace(/\.00$/, '') : input.power_p1.toFixed(2).replace(/\.00$/, '') + "/" + input.power_p2.toFixed(2).replace(/\.00$/, '')) + " kW)", v: selectedResult.costPower.toFixed(2) + " €" },
                                                { l: "Término de Energía (" + (input.energy_p1 + input.energy_p2 + input.energy_p3).toFixed(2).replace(/\.00$/, '') + " kWh)", v: selectedResult.costEnergy.toFixed(2) + " €" },
                                            ].map((l, i) => (
                                                <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-50 dark:border-slate-800/50 pb-3">
                                                    <span className="font-medium text-slate-500">{l.l}</span>
                                                    <span className="font-bold">{l.v}</span>
                                                </div>
                                            ))}
                                            <div className="space-y-3 pt-4 text-xs">
                                                <div className="flex justify-between text-slate-500"><span>Impuesto Electricidad (IEE 5.11%)</span><span className="font-mono">{selectedResult.taxIee.toFixed(2)} €</span></div>
                                                <div className="flex justify-between text-slate-500"><span>Alquiler de Contador</span><span className="font-mono">{selectedResult.costMeter.toFixed(2)} €</span></div>
                                                <div className="flex justify-between text-slate-500"><span>Bono Social</span><span className="font-mono">{selectedResult.costBonoSocial.toFixed(2)} €</span></div>
                                                <div className="flex justify-between text-slate-500"><span>IVA (General 21%)</span><span className="font-mono">{selectedResult.taxIva.toFixed(2)} €</span></div>
                                            </div>
                                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <span className="text-xl font-800">Total Factura</span>
                                                <div className="text-right">
                                                    <p className="text-3xl font-800 text-primary">{selectedResult.total.toFixed(2)} €</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 space-y-10">
                                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                                            <Gavel className="text-primary w-6 h-6" />
                                            <h4 className="font-800 text-center md:text-left">Condiciones Legales</h4>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                <div className="p-2 bg-green-500/10 text-green-500 rounded-xl"><ShieldCheckIcon className="w-4 h-4" /></div>
                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Sin Permanencia</p>
                                                    <p className="text-xs text-slate-500 leading-relaxed">Puedes cambiar de tarifa o compañía en cualquier momento sin penalización.</p>
                                                </div>
                                            </div>
                                            {selectedResult.tariff.name.includes("PVPC") ? (
                                                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><LineChart className="w-4 h-4" /></div>
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Precio Semi-Indexado</p>
                                                        <p className="text-xs text-slate-500 leading-relaxed">El precio real fluctúa cada hora. Los datos representados en este cuadro corresponden a un promedio orientativo basado en meses anteriores.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                        <div className="p-2 bg-primary/10 text-primary rounded-xl"><ClockIcon className="w-4 h-4" /></div>
                                                        <div>
                                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Precios Fijos 12 Meses</p>
                                                            <p className="text-xs text-slate-500 leading-relaxed">El precio de la energía no sufrirá incrementos inesperados al menos durante el primer año de contrato.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Medal className="w-4 h-4" /></div>
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
                                            <InfoIcon className="text-primary w-4 h-4" />
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
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                        <div className="pt-4 flex justify-around">
                                            <button
                                                onClick={() => {
                                                    const text = encodeURIComponent(`¡Mira esta tarifa de luz! ${selectedResult.tariff.company} - ${selectedResult.tariff.name} por solo €${selectedResult.total.toFixed(2)} €/mes. Puedes verla aquí: ${window.location.href}`);
                                                    window.open(`https://wa.me/?text=${text}`, '_blank');
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                                            >
                                                <Share2Icon className="w-4 h-4" /> WhatsApp
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const subject = encodeURIComponent(`Tarifa recomendada: ${selectedResult.tariff.company} ${selectedResult.tariff.name}`);
                                                    const body = encodeURIComponent(`Hola,\n\nHe encontrado esta tarifa de luz que podría interesarte:\n\nCompañía: ${selectedResult.tariff.company}\nTarifa: ${selectedResult.tariff.name}\nPrecio estimado: €${selectedResult.total.toFixed(2)} €/mes\n\nPuedes ver más detalles aquí: ${window.location.href}`);
                                                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                                            >
                                                <MailIcon className="w-4 h-4" /> Email
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
                                    <Share2Icon className="w-6 h-6" />
                                    Compartir Tarifa
                                </button>
                                <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <PrinterIcon className="w-6 h-6" />
                                    Imprimir Resumen
                                </button>
                                <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                                <Link
                                    href="/#faq"
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <HelpCircleIcon className="w-6 h-6" />
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


