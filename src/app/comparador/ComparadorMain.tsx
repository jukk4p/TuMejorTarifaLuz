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
    ChevronLeft,
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
    ChevronDown,
    ArrowDownRight,
    ArrowUpRight,
    Plug,
    Sun,
    SunDim
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
    const [filterSurplus, setFilterSurplus] = useState<"all" | "with" | "without">("all");
    const [sortBy, setSortBy] = useState<"savings-desc" | "savings-asc">("savings-desc");
    const [limitResults, setLimitResults] = useState<number>(Infinity);

    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStatus, setAnalysisStatus] = useState("Mapeando Parámetros Eléctricos");

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);
    const [uploadedFileRaw, setUploadedFileRaw] = useState<File | null>(null);

    const [showWithTaxes, setShowWithTaxes] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [studyMode, setStudyMode] = useState<"monthly" | "annual" | null>(null);
    const [isStudySelectorOpen, setIsStudySelectorOpen] = useState(false);
    const [detectedCompany, setDetectedCompany] = useState<string | null>(null);
    const [pendingStudyMode, setPendingStudyMode] = useState<"monthly" | "annual" | null>(null);

    const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
    const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

    const applyTaxes = (price: number, priceWithTaxes?: number) => {
        if (!showWithTaxes) return price;
        if (priceWithTaxes && priceWithTaxes > 0) return priceWithTaxes;
        return price * 1.0511 * 1.21;
    };

    const getDisplayTotal = (total: number, subtotal: number) => {
        return showWithTaxes ? total : subtotal;
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
            return <>La tarifa <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.name}</span> de <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.company}</span> indexa tu consumo al precio horario del mercado mayorista. Es ideal si consumes principalmente en periodos valle (noche y fin de semana), donde el precio suele ser significativamente más bajo.</>;
        }

        if (isFixedRate && isHighSaving && energyDominates) {
            return <>Con la tarifa <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.name}</span> de <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.company}</span>, fijarás un precio de energía notablemente inferior al actual. El ahorro estimado de <strong className="text-savings">{savingPct}%</strong> proviene principalmente del término de energía, lo que significa que cuanto más consumas, más ahorrarás cada mes.{hasPermanence ? ' Ten en cuenta que esta tarifa incluye permanencia.' : ''}</>;
        }

        if (isFixedRate && isModerateSaving && powerDominates) {
            return <>La tarifa fija <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.name}</span> de <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.company}</span> destaca por tener cargos de potencia más competitivos. El ahorro estimado del <strong className="text-savings">{savingPct}%</strong> se concentra en el término fijo, lo que la hace especialmente ventajosa si tu potencia contratada es alta.{hasPermanence ? ' Considera que lleva permanencia asociada.' : ''}</>;
        }

        if (isThreePeriod && energyDominates) {
            return <>La tarifa discriminatoria <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.name}</span> de <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.company}</span> ofrece tres tramos horarios de precio. Tu perfil de consumo aprovecha especialmente los periodos valle y llano, generando un ahorro estimado del <strong className="text-savings">{savingPct}%</strong>. Desplazar electrodomésticos de alta potencia a las horas más baratas maximizaría aún más el beneficio.{hasPermanence ? ' Incluye permanencia.' : ''}</>;
        }

        if (isThreePeriod && !energyDominates) {
            return <>Con <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.name}</span> de <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.company}</span>, la estructura de tres periodos encaja con tu perfil. El ahorro del <strong className="text-savings">{savingPct}%</strong> se distribuye entre energía y potencia. Recuerda que en tarifas discriminatorias, la punta (E1) es cara, por lo que reducir el consumo entre las 10h y 14h en días laborables optimizará tu factura.{hasPermanence ? ' Esta tarifa renueva con permanencia.' : ''}</>;
        }

        if (isHighSaving) {
            return <>El cambio a <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.name}</span> de <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.company}</span> supone uno de los mejores resultados para tu perfil, con un ahorro estimado del <strong className="text-savings">{savingPct}%</strong>. Esta tarifa tiene condiciones de precio muy competitivas frente a tu contrato actual.{hasPermanence ? ' Incluye compromiso de permanencia.' : ' Sin permanencia, puedes cambiar cuando quieras.'}</>;
        }

        // default
        return <>Cambiando a <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.name}</span> de <span className={tariff.type?.includes('3 Periodos') ? 'text-primary font-bold not-italic' : 'text-orange-400 font-bold not-italic'}>{tariff.company}</span>, obtendrás un ahorro estimado del <strong className="text-savings">{savingPct}%</strong> mensual. La estructura de precios de esta tarifa se adapta bien a tu consumo actual.{hasPermanence ? ' Nota: incluye permanencia.' : ' Sin permanencia.'}</>;
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
                            current_bill_total: data.current_bill_total || input.current_bill_total,
                            current_price_p1: data.current_price_p1 || input.current_price_p1,
                            current_price_p2: data.current_price_p2 || input.current_price_p2,
                            current_price_p3: data.current_price_p3 || input.current_price_p3,
                            days: data.days || input.days
                        };
                        setInput(newInput);
                        setDisplayValues(prev => ({
                            ...prev,
                            power_p1: newInput.power_p1.toString().replace(".", ","),
                            power_p2: newInput.power_p2.toString().replace(".", ","),
                            energy_p1: newInput.energy_p1.toString().replace(".", ","),
                            energy_p2: newInput.energy_p2.toString().replace(".", ","),
                            energy_p3: newInput.energy_p3.toString().replace(".", ","),
                            current_bill_total: newInput.current_bill_total.toString().replace(".", ","),
                            current_price_p1: (newInput.current_price_p1 || 0).toString().replace(".", ","),
                            current_price_p2: (newInput.current_price_p2 || 0).toString().replace(".", ","),
                            current_price_p3: (newInput.current_price_p3 || 0).toString().replace(".", ","),
                            days: newInput.days.toString()
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
            // Reset progress ONLY once at the start of processing
            setAnalysisProgress(prev => (prev >= 98 ? 0 : prev));

            interval = setInterval(() => {
                setAnalysisProgress(prev => {
                    if (prev >= 99.5) return 99.5;
                    
                    let increment = 0;
                    if (isAiGenerated && step === "input") {
                        // AI mode expects roughly 4-8s (backend fetch + 1s delay)
                        if (prev < 50) increment = 4.5; 
                        else if (prev < 85) increment = 2.2;
                        else if (prev < 98) increment = 0.8;
                        else increment = 0.1;
                    } else {
                        // Manual mode expects 1s - 2.8s
                        // To reach 100% in ~2s with 200ms intervals, we need ~10% per step
                        increment = 8.5;
                    }

                    const next = prev + increment;
                    return next > 99.5 ? 99.5 : next;
                });
            }, 200);
        } else if (analysisProgress > 0) {
            setAnalysisProgress(100);
            const timer = setTimeout(() => {
                setAnalysisProgress(0);
            }, 800);
            return () => clearTimeout(timer);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isProcessing, isAiGenerated, step]); // Removed analysisProgress from deps to avoid re-triggering logic unnecessarily



    // CONTEXTUAL STATUS UPDATES
    useEffect(() => {
        if (!isProcessing) return;

        if (isAiGenerated && step === "input") {
            if (analysisProgress < 20) setAnalysisStatus("Activando motor de visión artificial...");
            else if (analysisProgress < 40) setAnalysisStatus("Identificando estructura y conceptos...");
            else if (analysisProgress < 60) setAnalysisStatus("Extrayendo potencias y consumos con IA...");
            else if (analysisProgress < 85) setAnalysisStatus("Validando tramos con normativa vigente...");
            else setAnalysisStatus("Construyendo tu propuesta de ahorro definitiva...");
        } else {
            if (analysisProgress < 20) setAnalysisStatus("Iniciando análisis energético experto...");
            else if (analysisProgress < 40) setAnalysisStatus("Calculando costes fijos y variables...");
            else if (analysisProgress < 60) setAnalysisStatus("Maximizando potencial de ahorro...");
            else if (analysisProgress < 80) setAnalysisStatus("Escaneando mercado (25+ tarifas)...");
            else setAnalysisStatus("Generando tu comparativa personalizada...");
        }
    }, [analysisProgress, isProcessing, isAiGenerated, step]);

    // Derived loader stage (0-4) from progress
    const loaderStage = analysisProgress < 20 ? 0 : analysisProgress < 40 ? 1 : analysisProgress < 60 ? 2 : analysisProgress < 80 ? 3 : 4;

    // Apply filters to base results
    const results = useMemo(() => {
        let filtered = baseResults.filter(res => {
            const company = res.tariff?.company?.toLowerCase() || "";
            const name = res.tariff?.name?.toLowerCase() || "";
            const search = filterSearch?.toLowerCase() || "";
            const matchesSearch = company.includes(search) || name.includes(search);

            let matchesPrice = true;
            if (filterPriceType === "fixed") matchesPrice = res.tariff?.type === "Fijo (1 Periodo)";
            if (filterPriceType === "periods") matchesPrice = res.tariff?.type === "3 Periodos";

            let matchesSurplus = true;
            const hasSurplus = (res.tariff?.surplus_kwh ?? 0) > 0;
            if (filterSurplus === "with") matchesSurplus = hasSurplus;
            if (filterSurplus === "without") matchesSurplus = !hasSurplus;

            return matchesSearch && matchesPrice && matchesSurplus;
        });

        // Apply Sorting
        filtered.sort((a, b) => {
            if (sortBy === "savings-desc") return a.total - b.total; // Total low to high = savings high to low
            if (sortBy === "savings-asc") return b.total - a.total;
            return 0;
        });

        // Apply Limit
        if (limitResults !== Infinity) {
            filtered = filtered.slice(0, limitResults);
        }

        return filtered;
    }, [baseResults, filterSearch, filterPriceType, filterSurplus, sortBy, limitResults]);

    // PERSIST LAST COMPARISON FOR SEARCH / DYNAMIC HERO
    useEffect(() => {
        if (typeof window !== "undefined" && step === "results" && results.length > 0) {
            const lastComparison = {
                timestamp: Date.now(),
                current: {
                    company: detectedCompany || "Tu comercializadora",
                    price: input.current_price_p1 || 0,
                    logo: detectedCompany ? getLogoPath(detectedCompany) : null
                },
                recommended: {
                    company: results[0].tariff.company,
                    name: results[0].tariff.name,
                    price: results[0].tariff.e1_kwh,
                    savings: Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12),
                    savingsPct: Math.round((Math.max(0, (input.current_bill_total || 0) - results[0].total) / (input.current_bill_total || 1)) * 100),
                    logo: getLogoPath(results[0].tariff.company)
                }
            };
            localStorage.setItem("tmtl_last_comparison", JSON.stringify(lastComparison));
        }
    }, [step, results, detectedCompany, input.current_price_p1, input.current_bill_total]);




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
            // Wait for progress bar to reach near 100% logic in useEffect (L377)
            setTimeout(() => {
                if (skipValidation) {
                    setHasAnalyzed(true);
                    setStep("results");
                } else {
                    setHasAnalyzed(true);
                    setStep("validation");
                }
                setIsProcessing(false);
            }, 800); // Grace period to see the 100%
        }, 2000);
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
                        current_price_p3: data.current_price_p3 || 0,
                        company_name: data.company_name || null
                    };

                    setDetectedCompany(rawData.company_name);

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
                // Sutil delay for visual satisfaction (reach 100%)
                setTimeout(() => {
                    setHasAnalyzed(true);
                    setStep("validation");
                    setIsProcessing(false);
                }, 1000);
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
        <div className="min-h-screen relative overflow-hidden bg-mesh font-display selection:bg-primary/20">
            {/* Background Decorators */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full">
                {/* Global Print Optimization Styles */}
                <style jsx global>{`
                /* Final Boss Spinner Removal */
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none !important;
                    margin: 0 !important;
                }
                input[type=number] {
                    -moz-appearance: textfield !important;
                    appearance: none !important;
                }

                body {
                    overflow-x: hidden !important;
                }
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
                        border: 1px solid var(--color-border) !important;
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
                <div className="bg-surface/90 border-b border-border/50 py-4 sm:py-5 w-full">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-4 w-full">
                        
                        {/* Step 1: Carga */}
                        <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-full transition-all duration-500 ease-out ${step === "input" ? "bg-primary text-white shadow-md shadow-primary/20 scale-100" : "bg-transparent text-text-muted hover:bg-surface-2 scale-95 opacity-80"}`}>
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-colors duration-500 ${step === "input" ? "bg-white text-primary shadow-sm" : "bg-surface-2 border border-border"}`}>
                                1
                            </div>
                            <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${step === "input" ? "inline" : "hidden sm:inline"}`}>Carga</span>
                        </div>

                        {/* Separator 1 */}
                        {inputMethod !== "manual" && (
                            <div className="w-4 sm:w-16 h-1 rounded-full overflow-hidden bg-border/40 shrink-0">
                                <div className={`h-full bg-primary transition-all duration-1000 ease-in-out ${step === "validation" || step === "results" ? "w-full" : "w-0"}`}></div>
                            </div>
                        )}

                        {/* Middle Step: Only for Upload Method */}
                        {inputMethod !== "manual" && (
                            <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-full transition-all duration-500 ease-out ${step === "validation" ? "bg-primary text-white shadow-md shadow-primary/20 scale-100" : "bg-transparent text-text-muted hover:bg-surface-2 scale-95 opacity-80"}`}>
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-colors duration-500 ${step === "validation" ? "bg-white text-primary shadow-sm" : "bg-surface-2 border border-border"}`}>
                                    2
                                </div>
                                <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${step === "validation" ? "inline" : "hidden sm:inline"}`}>Validación</span>
                            </div>
                        )}

                        {/* Separator 2 */}
                        <div className="w-4 sm:w-16 h-1 rounded-full overflow-hidden bg-border/40 shrink-0">
                            <div className={`h-full bg-primary transition-all duration-1000 ease-in-out ${step === "results" ? "w-full" : "w-0"}`}></div>
                        </div>

                        {/* Final Step: Resultados */}
                        <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-full transition-all duration-500 ease-out ${step === "results" ? "bg-primary text-white shadow-md shadow-primary/20 scale-100" : "bg-transparent text-text-muted hover:bg-surface-2 scale-95 opacity-80"}`}>
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-colors duration-500 ${step === "results" ? "bg-white text-primary shadow-sm" : "bg-surface-2 border border-border"}`}>
                                {inputMethod === "manual" ? "2" : "3"}
                            </div>
                            <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${step === "results" ? "inline" : "hidden sm:inline"}`}>Comparación</span>
                        </div>

                    </div>
                </div>
            )}

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* STEP 1: INPUT/DATA ENTRY */}
                {/* STEP 1: INPUT/DATA ENTRY */}
                {step === "input" && !inputMethod && (
                    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-900 text-text-primary mb-6 tracking-tight">
                                ¿Cómo quieres <span className="text-primary italic">empezar</span>?
                            </h1>
                            <p className="text-lg text-text-secondary font-medium max-w-2xl mx-auto leading-relaxed">
                                Para darte el ahorro más exacto, necesitamos conocer tu consumo actual. Elige el método que prefieras para continuar.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Option 1: AI Analysis */}
                            <button 
                                onClick={() => setInputMethod("upload")}
                                className="premium-card premium-glow bg-dot-pattern group p-10 md:p-14 text-center hover:border-primary/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <FileUp className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-2xl font-800 text-text-primary mb-4">Análisis por Factura</h3>
                                <p className="text-text-secondary text-base mb-10 leading-relaxed flex-grow">
                                    Sube tu factura en PDF o foto. Nuestra <span className="text-primary font-bold">tecnología experta</span> extraerá automáticamente tu potencia y consumos reales de cada tramo en segundos.
                                </p>
                                <div className="space-y-4 flex flex-col items-center">
                                    <span className="w-fit px-10 bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group-hover:bg-primary-hover transition-all mx-auto">
                                        Subir mi factura
                                        <ArrowRight size={18} />
                                    </span>
                                    <p className="text-[10px] font-bold text-primary tracking-widest bg-primary/5 py-2 px-4 rounded-full inline-block">Recomendado • Máxima precisión</p>
                                </div>
                            </button>

                            {/* Option 2: Manual Input */}
                            <button 
                                onClick={() => setInputMethod("manual")}
                                className="premium-card bg-surface-2/30 group p-10 md:p-14 text-center hover:border-border hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-surface-2 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-slate-200 dark:group-hover:bg-slate-800/20 transition-colors"></div>
                                <div className="w-24 h-24 bg-surface-2 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500">
                                    <Sliders className="w-12 h-12 text-text-muted" />
                                </div>
                                <h3 className="text-2xl font-800 text-text-primary mb-4">Entrada Manual</h3>
                                <p className="text-text-secondary text-base mb-10 leading-relaxed flex-grow">
                                    Si ya tienes tus datos a mano o quieres simular un consumo específico, utiliza nuestro formulario técnico simplificado.
                                </p>
                                <div className="space-y-4 flex flex-col items-center">
                                    <span className="w-fit px-10 bg-surface dark:bg-surface-2 text-text-primary font-bold py-4 rounded-2xl shadow-xl border border-border dark:border-border/50 group-hover:bg-surface-2 dark:group-hover:bg-surface-3 transition-all flex items-center justify-center mx-auto">
                                        Introducir datos a mano
                                    </span>
                                    <p className="text-[10px] font-bold text-text-muted tracking-widest bg-surface-2 dark:bg-slate-800/40 py-2 px-4 rounded-full inline-block">Control total • Sin archivos</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {step === "input" && inputMethod && (
                    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
                        <aside className="w-full lg:w-[400px] shrink-0 flex flex-col">
                            <div className="premium-card bg-dot-pattern p-6 flex-1 h-full flex flex-col shadow-2xl shadow-primary/20 transition-all duration-500 hover:shadow-primary/30 relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent dark:from-surface/80 dark:to-transparent pointer-events-none rounded-[1.5rem]"></div>
                                
                                <div className="relative z-10 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <Terminal className="text-primary w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-text-primary">Entrada de Datos</h2>
                                                <p className="text-[10px] text-text-muted font-mono tracking-tighter">Parámetros de análisis</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setInputMethod(prev => prev === "manual" ? "upload" : "manual")}
                                            className="p-2 hover:bg-surface-2 rounded-xl transition-colors text-text-muted hover:text-primary"
                                            title="Cambiar método"
                                        >
                                            <History size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {inputMethod === "upload" && (
                                            <label
                                                htmlFor="ocr-upload-sidebar"
                                                className="border-2 border-dashed border-primary/30 rounded-xl p-8 bg-surface-2 flex flex-col items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors group relative overflow-hidden"
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
                                                    <p className="text-[11px] text-text-muted">PDF o Imagen</p>
                                                </div>
                                            </label>
                                        )}

                                        {(inputMethod === "manual" || hasAnalyzed) && (
                                            <div className="space-y-6">
                                                <div className="relative py-8 flex items-center">
                                                    <div className="grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                                    <span className="mx-4 px-3 py-1 bg-surface-2 border border-border rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Ajuste técnico manual</span>
                                                    <div className="grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                                </div>

                                                <div className="space-y-5">
                                                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest pt-2">Información Factura</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5 flex-1">
                                                            <label className="text-[11px] font-bold text-text-secondary uppercase">Días</label>
                                                            <input
                                                                type="number"
                                                                value={input.days || ''}
                                                                onChange={(e) => setInput({ ...input, days: parseInt(e.target.value) || 0 })}
                                                                className="w-full bg-surface-2/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                                placeholder="30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5 flex-1">
                                                            <label className="text-[11px] font-bold text-text-secondary uppercase">Total (€)</label>
                                                            <input
                                                                type="number"
                                                                value={input.current_bill_total || ''}
                                                                onChange={(e) => setInput({ ...input, current_bill_total: parseFloat(e.target.value) || 0 })}
                                                                className="w-full bg-surface-2/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>

                                                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest pt-4">Potencias (kW)</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[11px] font-bold text-text-secondary uppercase">Punta (P1)</label>
                                                            <input
                                                                type="text"
                                                                inputMode="decimal"
                                                                name="power_p1"
                                                                value={displayValues.power_p1}
                                                                onChange={handleInputChange}
                                                                placeholder="0,00"
                                                                className="w-full bg-surface-2/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[11px] font-bold text-text-secondary uppercase">Valle (P2)</label>
                                                            <input
                                                                type="text"
                                                                inputMode="decimal"
                                                                name="power_p2"
                                                                value={displayValues.power_p2}
                                                                onChange={handleInputChange}
                                                                placeholder="0,00"
                                                                className="w-full bg-surface-2/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest pt-4">Consumo Energía (kWh)</h4>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: "Punta (E1)", name: "energy_p1" },
                                                            { label: "Llano (E2)", name: "energy_p2" },
                                                            { label: "Valle (E3)", name: "energy_p3" },
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="space-y-1.5">
                                                                <label className="text-[11px] font-bold text-text-secondary uppercase">{item.label}</label>
                                                                <input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    name={item.name}
                                                                    value={displayValues[item.name as keyof typeof displayValues]}
                                                                    onChange={handleInputChange}
                                                                    placeholder="0,00"
                                                                    className="w-full bg-surface-2/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest pt-4">Precios Energía (€/kWh)</h4>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: "Punta (P1)", name: "current_price_p1" },
                                                            { label: "Llano (P2)", name: "current_price_p2" },
                                                            { label: "Valle (P3)", name: "current_price_p3" },
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="space-y-1.5">
                                                                <label className="text-[11px] font-bold text-text-secondary uppercase">{item.label}</label>
                                                                <input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    name={item.name}
                                                                    value={displayValues[item.name as keyof typeof displayValues]}
                                                                    onChange={handleInputChange}
                                                                    placeholder="0,0000"
                                                                    className="w-full bg-surface-2/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
  
                                                    <button 
                                                        onClick={() => startAnalysis(true)} 
                                                        disabled={isProcessing} 
                                                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
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
                            </div>
                        </aside>

                        <section className="flex-1 flex flex-col space-y-6">
                            {(inputMethod === "upload" && !hasAnalyzed && !isProcessing) ? (
                                <div className="premium-card p-6 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center flex-1 h-full min-h-[550px] group !border-none shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-primary/10 transition-colors duration-700"></div>
                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai-purple/10 rounded-full blur-[80px] -ml-48 -mb-48 group-hover:bg-ai-purple/15 transition-colors duration-700"></div>

                                    <div className="relative z-10 max-w-full sm:max-w-2xl w-full px-4 sm:px-0">
                                        <label
                                            htmlFor="ocr-upload-main"
                                            className="block w-full border-2 border-dashed border-primary/20 rounded-[2.5rem] p-8 sm:p-16 bg-surface-2 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group/upload"
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
                                            <h3 className="text-3xl font-800 text-text-primary mb-4">Selecciona tu factura</h3>
                                            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                                                Arrastra tu archivo aquí o haz clic para buscarlo.<br/>
                                                Soportamos <span className="font-bold">PDF, JPG y PNG</span> hasta 4MB.
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold tracking-[0.2em] text-slate-400">
                                                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Privacidad cifrada</span>
                                                <span className="flex items-center gap-2"><Brain size={16} className="text-primary" /> Análisis inteligente</span>
                                                <span className="flex items-center gap-2"><Clock size={16} className="text-warning" /> Resultados en segundos</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            ) : isProcessing ? (
                                <div className="premium-card p-8 md:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center flex-1 h-full min-h-[550px] !border-none !shadow-2xl bg-gradient-to-br from-surface/95 to-surface-2/95">
                                    {/* Animated Background Grid */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #137fec 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                                        {/* Scanning line */}
                                        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-[scan_3s_ease-in-out_infinite]"></div>
                                        {/* Gradient orbs */}
                                        <div className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] -top-48 -right-48 transition-all duration-1000 ${loaderStage === 0 ? 'bg-primary/10' : loaderStage === 1 ? 'bg-amber-400/10' : loaderStage === 2 ? 'bg-emerald-400/10' : 'bg-violet-500/10'}`}></div>
                                        <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] -bottom-32 -left-32 transition-all duration-1000 ${loaderStage === 0 ? 'bg-violet-500/8' : loaderStage === 1 ? 'bg-primary/8' : loaderStage === 2 ? 'bg-amber-400/8' : 'bg-emerald-400/8'}`}></div>
                                    </div>

                                    <div className="relative z-10 w-full flex flex-col items-center">

                                        {/* === MAIN ORB LOADER === */}
                                        <div className="relative w-44 h-44 md:w-52 md:h-52 mb-8">
                                            {/* Outer pulse rings */}
                                            <div className={`absolute inset-0 rounded-full transition-all duration-700 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-10 ${loaderStage < 2 ? 'bg-primary' : 'bg-accent'}`}></div>
                                            <div className={`absolute -inset-3 rounded-full transition-all duration-700 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-5 ${loaderStage < 2 ? 'bg-primary' : 'bg-accent'}`} style={{animationDelay: '0.5s'}}></div>
                                            
                                            {/* Spinning arc rings */}
                                            <svg className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]" viewBox="0 0 200 200">
                                                <circle cx="100" cy="100" r="95" fill="none" strokeWidth="1.5" strokeDasharray="60 200" strokeLinecap="round" className={`transition-all duration-700 ${loaderStage < 2 ? 'stroke-primary/40' : 'stroke-accent/40'}`} />
                                            </svg>
                                            <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite_reverse]" viewBox="0 0 200 200">
                                                <circle cx="100" cy="100" r="85" fill="none" strokeWidth="1" strokeDasharray="40 180" strokeLinecap="round" className={`transition-all duration-700 ${loaderStage === 0 ? 'stroke-violet-500/30' : loaderStage === 1 ? 'stroke-primary/30' : loaderStage === 2 ? 'stroke-amber-400/30' : 'stroke-emerald-500/30'}`} />
                                            </svg>
                                            <svg className="absolute inset-0 w-full h-full animate-[spin_6s_linear_infinite]" viewBox="0 0 200 200">
                                                <circle cx="100" cy="100" r="75" fill="none" strokeWidth="2" strokeDasharray="30 120" strokeLinecap="round" className={`transition-all duration-700 ${loaderStage === 0 ? 'stroke-emerald-500/25' : loaderStage === 1 ? 'stroke-violet-500/25' : loaderStage === 2 ? 'stroke-primary/25' : 'stroke-amber-400/25'}`} />
                                            </svg>

                                            {/* Progress arc (SVG) */}
                                            <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] -rotate-90" viewBox="0 0 200 200">
                                                <circle cx="100" cy="100" r="90" fill="none" strokeWidth="3" className="stroke-surface-2" />
                                                <circle cx="100" cy="100" r="90" fill="none" strokeWidth="3" strokeLinecap="round"
                                                    className={`transition-all duration-500 ease-out ${loaderStage < 2 ? 'stroke-primary' : 'stroke-accent'}`}
                                                    strokeDasharray={`${analysisProgress * 5.65} 565`}
                                                    style={{filter: `drop-shadow(0 0 6px ${loaderStage < 2 ? 'var(--color-primary)' : 'var(--color-accent)'})`}}
                                                />
                                            </svg>

                                            {/* Central icon hub */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`w-24 h-24 md:w-28 md:h-28 rounded-[2rem] backdrop-blur-xl flex items-center justify-center transition-all duration-700 border shadow-2xl ${loaderStage < 2 ? 'bg-primary/5 border-primary/20 shadow-primary/10' : 'bg-accent/5 border-accent/20 shadow-accent/10'}`}>
                                                    <div key={`icon-${loaderStage}`} className={`animate-in zoom-in-75 fade-in duration-500 ${loaderStage < 2 ? 'text-primary' : 'text-accent'}`}>
                                                        {isAiGenerated && step === "input" ? (
                                                            loaderStage === 0 ? <Search className="w-10 h-10 md:w-12 md:h-12" /> :
                                                            loaderStage === 1 ? <FileText className="w-10 h-10 md:w-12 md:h-12" /> :
                                                            loaderStage === 2 ? <Brain className="w-10 h-10 md:w-12 md:h-12" /> :
                                                            loaderStage === 3 ? <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" /> : <Clock className="w-10 h-10 md:w-12 md:h-12" />
                                                        ) : (
                                                            loaderStage === 0 ? <Terminal className="w-10 h-10 md:w-12 md:h-12" /> :
                                                            loaderStage === 1 ? <Zap className="w-10 h-10 md:w-12 md:h-12" /> :
                                                            loaderStage === 2 ? <TrendingDown className="w-10 h-10 md:w-12 md:h-12" /> :
                                                            loaderStage === 3 ? <ArrowLeftRight className="w-10 h-10 md:w-12 md:h-12" /> : <Clock className="w-10 h-10 md:w-12 md:h-12" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Floating orbital dots */}
                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-700 ${loaderStage < 2 ? 'bg-primary' : 'bg-accent'}`}
                                                    style={{
                                                        top: `${50 + 48 * Math.sin((i * 60 + Date.now() / 20) * Math.PI / 180)}%`,
                                                        left: `${50 + 48 * Math.cos((i * 60 + Date.now() / 20) * Math.PI / 180)}%`,
                                                        opacity: 0.3 + (i % 3) * 0.2,
                                                        animation: `ping ${1.5 + i * 0.3}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                                                        animationDelay: `${i * 0.2}s`
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* === Percentage + Title === */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-center gap-3 mb-2">
                                                <span className={`font-mono text-5xl font-black tracking-tighter transition-colors duration-500 ${loaderStage < 2 ? 'text-primary' : 'text-accent'}`}>
                                                    {Math.round(analysisProgress)}
                                                </span>
                                                <span className="text-xl font-black text-text-muted">%</span>
                                            </div>
                                            <h3 key={`title-${loaderStage}`} className="text-lg md:text-xl font-800 tracking-tight text-text-secondary animate-in fade-in duration-500">
                                                {isAiGenerated && step === "input" ? "Procesando análisis..." :
                                                    loaderStage === 0 ? "Iniciando análisis..." :
                                                        loaderStage === 1 ? "Calculando costes..." :
                                                            loaderStage === 2 ? "Optimizando tarifas..." :
                                                                loaderStage === 3 ? "Comparando mercado..." :
                                                                    "Finalizando..."}
                                            </h3>
                                        </div>

                                        {/* === Step Indicators === */}
                                        <div className="flex items-center gap-1.5 mb-6">
                                            {[
                                                { label: 'Análisis', icon: <Terminal size={11} /> },
                                                { label: 'Cálculo', icon: <Zap size={11} /> },
                                                { label: 'Optimiza', icon: <TrendingDown size={11} /> },
                                                { label: 'Mercado', icon: <ArrowLeftRight size={11} /> },
                                                { label: 'Resultado', icon: <CheckCircle2 size={11} /> },
                                            ].map((s, i) => (
                                                <div key={i} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-500 ${
                                                    i < loaderStage ? 'bg-accent-bg text-accent border border-accent/20' :
                                                    i === loaderStage ? `border shadow-sm ${loaderStage < 2 ? 'bg-primary/10 text-primary border-primary/30 shadow-primary/10' : 'bg-accent-bg text-accent-bg-text border-accent/30 shadow-accent/10'}` :
                                                    'bg-surface-2 text-text-muted border border-border'
                                                }`}>
                                                    {i < loaderStage ? <CheckCircle2 size={11} className="text-emerald-500" /> : s.icon}
                                                    <span className="hidden sm:inline">{s.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* === Progress Bar === */}
                                        <div className="w-full max-w-xs mb-4">
                                            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ease-out ${loaderStage < 2 ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gradient-to-r from-accent to-accent/80'}`}
                                                    style={{ width: `${analysisProgress}%`, boxShadow: `0 0 12px ${loaderStage < 2 ? 'var(--color-primary)' : 'var(--color-accent)'}` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* === Status Text === */}
                                        <div className="h-6 flex items-center">
                                            <p key={analysisStatus} className={`text-[10px] font-bold tracking-[0.3em] uppercase animate-in fade-in slide-in-from-bottom-1 duration-500 ${loaderStage === 0 ? 'text-primary/60' : loaderStage === 1 ? 'text-warning/60' : loaderStage === 2 ? 'text-accent/60' : 'text-violet-500/60'}`}>
                                                {analysisStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="premium-card bg-grid-pattern p-6 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center flex-1 h-full min-h-[550px] group !border-none shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/80 to-primary/10 dark:from-surface dark:via-surface/80 dark:to-primary/10 pointer-events-none"></div>
                                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-primary/20 transition-colors duration-700"></div>
                                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ai-purple/10 rounded-full blur-[100px] -ml-48 -mb-48 group-hover:bg-ai-purple/20 transition-colors duration-700"></div>

                                    <div className="relative z-10 max-w-2xl w-full">
                                        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-10 mx-auto">
                                            <BarChart3 className="w-12 h-12 text-primary animate-pulse" />
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-4xl font-800 mb-6 tracking-tight bg-gradient-to-br from-text-primary to-text-secondary bg-clip-text text-transparent">
                                                Comparador Inteligente
                                            </h3>
                                            <p className="text-text-secondary leading-relaxed mb-12 text-lg max-w-lg mx-auto leading-relaxed">
                                                Entorno analítico configurado. Procesamos sus parámetros eléctricos mediante algoritmos de mercado para garantizar la tarifa más económica del país.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-12 max-w-md mx-auto">
                                            <div className="space-y-4 group/item text-center">
                                                <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto group-hover/item:bg-primary/10 transition-all group-hover/item:scale-110 shadow-sm border border-border/20">
                                                    <Activity className="w-6 h-6 text-text-muted group-hover/item:text-primary transition-colors" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted transition-colors group-hover/item:text-text-primary px-2">Análisis</p>
                                            </div>
                                            <div className="space-y-4 group/item text-center">
                                                <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto group-hover/item:bg-accent/10 transition-all group-hover/item:scale-110 shadow-sm border border-border/20">
                                                    <CheckCircle2 className="w-6 h-6 text-text-muted group-hover/item:text-accent transition-colors" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted transition-colors group-hover/item:text-text-primary px-2">Verificación</p>
                                            </div>
                                            <div className="space-y-4 group/item text-center">
                                                <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto group-hover/item:bg-warning/10 transition-all group-hover/item:scale-110 shadow-sm border border-border/20">
                                                    <TrendingDown className="w-6 h-6 text-text-muted group-hover/item:text-warning transition-colors" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted transition-colors group-hover/item:text-text-primary px-2">Ahorro</p>
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
                            <div className="flex-1 premium-card bg-dot-pattern overflow-hidden flex flex-col group/preview border-none shadow-2xl relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/95 to-white/40 dark:from-surface/95 dark:to-surface/40 pointer-events-none"></div>
                                <div className="px-8 py-5 border-b border-border flex justify-between items-center bg-surface transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Eye className="text-primary w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-800 uppercase tracking-[0.2em] text-text-secondary">Vista Previa de Factura</span>
                                    </div>
                                    
                                </div>
                                <div className="flex-1 p-6 sm:p-12 overflow-y-auto bg-background flex items-center justify-center relative">
                                    {/* Subtly animated background pattern */}
                                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#00c853_1px,transparent_1px)] [background-size:20px_20px]"></div>

                                    {uploadedFileUrl ? (
                                        <div className="w-full h-full max-w-4xl flex items-center justify-center animate-in zoom-in-95 fade-in duration-700">
                                            {uploadedFileType === 'application/pdf' ? (
                                                <div className="relative w-full h-full min-h-[650px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden ring-1 ring-white/10">
                                                    {isProcessing ? (
                                                        <div className="w-full h-full absolute inset-0 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-4 animate-pulse">
                                                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Digitalizando contenido...</p>
                                                        </div>
                                                    ) : (
                                                        <iframe
                                                            src={`${uploadedFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                                            className="w-full h-full absolute inset-0 border-none bg-white transition-opacity duration-500"
                                                            title="Factura PDF"
                                                        />
                                                    )}
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
                                        <div className="max-w-md mx-auto aspect-[1/1.414] bg-surface shadow-2xl rounded-xl p-12 border-t-[10px] border-primary relative overflow-hidden">
                                            <div className="w-full h-24 bg-surface-2 mb-8 rounded-lg animate-pulse"></div>
                                            <div className="space-y-4">
                                                <div className="w-3/4 h-3 bg-surface-2 rounded-full"></div>
                                                <div className="w-1/2 h-3 bg-surface-2 rounded-full"></div>
                                            </div>
                                            <div className="mt-16 space-y-8">
                                                <div className="flex justify-between items-center border-b border-border pb-4">
                                                    <div className="w-24 h-4 bg-surface-2 rounded-full"></div>
                                                    <div className="w-16 h-4 bg-primary/10 rounded-full"></div>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-border pb-4">
                                                    <div className="w-32 h-4 bg-surface-2 rounded-full"></div>
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
                                        <p className="text-xs font-bold text-text-primary uppercase mb-1">VALIDACIÓN TÉCNICA DE DATOS</p>
                                        <p className="text-[11px] text-text-secondary leading-relaxed">Verifique los datos extraídos automáticamente de su factura para asegurar la máxima precisión en el cálculo.</p>
                                    </div>
                                </div>

                                <div className="premium-card p-8 space-y-8">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2">METADATA DE FACTURACIÓN</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary uppercase">Total (€)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_bill_total"
                                                    value={displayValues.current_bill_total}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary uppercase">Días</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    name="days"
                                                    value={input.days.toString()}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2">POTENCIA CONTRATADA</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Punta (P1)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="power_p1"
                                                    value={displayValues.power_p1}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Valle (P2)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="power_p2"
                                                    value={displayValues.power_p2}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2">CONSUMO ENERGÍA (KWH)</h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Consumo Punta (E1)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="energy_p1"
                                                    value={displayValues.energy_p1}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Consumo Llano (E2)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="energy_p2"
                                                    value={displayValues.energy_p2}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Consumo Valle (E3)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="energy_p3"
                                                    value={displayValues.energy_p3}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2">PRECIO ENERGÍA (€/KWH)</h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Precio Punta (E1)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_price_p1"
                                                    value={displayValues.current_price_p1}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Precio Llano (E2)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_price_p2"
                                                    value={displayValues.current_price_p2}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[11px] font-bold text-text-secondary capitalize">Precio Valle (E3)</label>
                                                    <CheckCircle2 className="text-green-500 w-3 h-3" />
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="current_price_p3"
                                                    value={displayValues.current_price_p3}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white dark:bg-slate-800 border-border rounded-xl px-4 py-3 text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-10">
                                        <button onClick={() => setStep("input")} className="flex-1 bg-surface border border-border py-4 font-bold rounded-2xl text-xs tracking-widest hover:bg-surface-2 transition-colors">Editar Datos</button>
                                        <button onClick={confirmData} className="flex-[2] bg-accent hover:bg-accent/90 text-accent-text py-4 font-bold rounded-2xl text-xs tracking-widest shadow-xl shadow-accent/20 flex items-center justify-center gap-2 transition-all group active:scale-95">
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
                                className="group flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-full shadow-lg shadow-slate-200/20 dark:shadow-none hover:-translate-x-1 transition-all active:scale-95 shrink-0"
                            >
                                <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors">Volver al comparador</span>
                            </button>

                            <div className="flex bg-surface-2 p-1.5 rounded-[2rem] border border-border relative">
                                <button 
                                    onClick={() => setStudyMode("monthly")}
                                    className={`relative z-10 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${studyMode === 'monthly' ? 'text-white' : 'text-text-muted hover:text-text-primary'}`}
                                >
                                    Mensual
                                </button>
                                <button 
                                    onClick={() => setStudyMode("annual")}
                                    className={`relative z-10 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${studyMode === 'annual' ? 'text-white' : 'text-text-muted hover:text-text-primary'}`}
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
                                    <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter leading-none">Estudio de ahorro {studyMode === 'monthly' ? 'mensual' : 'anual'}</h2>
                                    <p className="text-lg text-text-secondary font-medium">Análisis inteligente para <span className="text-primary font-bold">{selectedResult.tariff.name}</span></p>
                                </div>
                            </div>

                            {/* Selector de tarifas ESPECTACULAR */}
                            <div className="relative w-full max-w-[480px] mx-auto px-1 z-50">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block text-center opacity-80">Selección de inteligencia</label>
                                
                                <div className="relative block group/selector h-[72px]">

                                    <button
                                        onClick={() => setIsStudySelectorOpen(!isStudySelectorOpen)}
                                        className={`absolute inset-0 w-full bg-surface border-2 rounded-[2rem] transition-all duration-300 shadow-xl flex items-center justify-center overflow-hidden group ${
                                            isStudySelectorOpen 
                                            ? "border-primary ring-[6px] ring-primary/10 -translate-y-1" 
                                            : "border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                                        }`}
                                    >
                                        <div className="absolute left-6 text-primary shrink-0 transition-all duration-300 group-hover:scale-125">
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                        
                                        <div className="flex flex-col px-14 text-center truncate w-full">
                                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-0.5 truncate group-hover:text-primary/70 transition-colors uppercase">{selectedResult.tariff.company}</span>
                                            <span className="text-text-primary text-lg font-black leading-tight truncate tracking-tight">{selectedResult.tariff.name}</span>
                                        </div>

                                        <div className="absolute right-6 text-text-muted transition-all duration-300 group-hover:text-primary">
                                            <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isStudySelectorOpen ? "rotate-180" : ""}`} />
                                        </div>

                                        {/* Efecto de brillo premium en hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
                                    </button>

                                    {isStudySelectorOpen && (
                                        <>
                                            <div className="absolute top-full left-0 right-0 mt-4 bg-surface backdrop-blur-2xl border border-border rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[60]">
                                                {/* Header centrado */}
                                                <div className="px-6 pt-5 pb-3 text-center border-b border-border">
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
                                                                    : "hover:bg-primary/5 text-text-primary hover:text-primary"
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
                                                                                    ? "bg-accent-bg text-accent" 
                                                                                    : "bg-rose-500/10 text-warning"
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
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Distribución de costes</h3>
                                            <p className="text-[8px] font-bold text-text-secondary uppercase tracking-tighter">Comparativa Estructural</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-accent-bg rounded-lg">
                                                <TrendingDown className="w-4 h-4 text-accent" />
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
                                                                    <h4 className="text-xs font-black text-text-primary uppercase tracking-wider leading-none">Término de Energía</h4>
                                                                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-tighter mt-0.5">Consumo {isAnnual ? 'Anual Estimado' : 'Variable Mensual'}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`text-sm font-black ${energyDiff >= 0 ? 'text-accent' : 'text-warning'}`}>
                                                                {energyDiff >= 0 ? '-' : '+'}{Math.abs(energyDiff).toFixed(2)}€
                                                            </div>
                                                        </div>

                                                        {/* Barras principales */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-black uppercase text-text-muted px-0.5">
                                                                    <span>{isAnnual ? 'Actual Anual' : 'Actual'}</span><span className="font-mono text-text-secondary">{(currentBreakdown.energy * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="h-2 bg-surface-2 rounded-full"><div className="h-full bg-border rounded-full w-full opacity-60"></div></div>
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
                                                                        <div key={i} className="flex items-center justify-between text-[9px] font-bold text-text-secondary">
                                                                            <span className="uppercase tracking-wide">{row.label}</span>
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="font-mono text-text-muted">
                                                                                    {(row.kwh * m).toLocaleString('es-ES', { maximumFractionDigits: 1 })} kWh × {row.price.toFixed(4)}€/kWh
                                                                                </span>
                                                                                <span className={`font-mono font-black ${rowDiff >= 0 ? 'text-accent' : 'text-warning'}`}>{rowDiff >= 0 ? '-' : '+'}{Math.abs(rowDiff).toFixed(2)}€</span>
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
                                                                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0">
                                                                    <CreditCard className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-black text-text-primary uppercase tracking-wider leading-none">Término de Potencia</h4>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{isAnnual ? 'Capacidad (12 meses)' : 'Capacidad Contratada'}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`text-sm font-black ${powerDiff >= 0 ? 'text-accent' : 'text-warning'}`}>
                                                                {powerDiff >= 0 ? '-' : '+'}{Math.abs(powerDiff).toFixed(2)}€
                                                            </div>
                                                        </div>

                                                        {/* Barras principales */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 px-0.5">
                                                                    <span>{isAnnual ? 'Actual Anual' : 'Actual'}</span><span className="font-mono text-slate-600 dark:text-slate-300">{(currentBreakdown.powerPlusOthers * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="h-2 bg-surface-2 rounded-full"><div className="h-full bg-border rounded-full w-full opacity-60"></div></div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-black uppercase text-warning px-0.5">
                                                                    <span>{isAnnual ? 'Nueva Anual' : 'Nueva'}</span><span className="font-mono">{((selectedResult.total - selectedResult.costEnergy) * m).toFixed(2)}€</span>
                                                                </div>
                                                                <div className="h-2 bg-warning/10 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-warning rounded-full" style={{ width: `${Math.min(100,((selectedResult.total - selectedResult.costEnergy) / (currentBreakdown.powerPlusOthers || 1)) * 100)}%` }}></div>
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
                                                                            <span className="font-mono font-black text-warning">{rowCost.toFixed(2)}€</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            <div className="border-t border-border pt-2 mt-1 space-y-1">
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
                                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                                        <div className="relative flex justify-center">
                                                            <div className="bg-surface px-4 text-slate-300"><TrendingDown className="w-4 h-4" /></div>
                                                        </div>
                                                    </div>

                                                    {/* ── TOTAL ── */}
                                                    <div className="p-5 bg-gradient-to-br from-success/5 to-primary/5 rounded-3xl border border-accent/20 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-bg blur-3xl rounded-full -mr-12 -mt-12"></div>
                                                        <div className="flex items-center justify-between relative z-10">
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Impacto Global</p>
                                                                <h4 className="text-xl font-black text-text-primary uppercase tracking-tighter">Ahorro {isAnnual ? 'Anual' : 'Mensual'}</h4>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-3xl font-black text-accent tracking-tighter">
                                                                    {Math.abs(totalSaving).toFixed(2)}€
                                                                </div>
                                                                <div className="text-[9px] font-black bg-accent-bg text-accent px-2 py-0.5 rounded-full inline-block mt-1">
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
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tu gasto actual</p>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <CreditCard className="w-16 h-16" />
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-text-primary">{(studyMode === 'monthly' ? (input.current_bill_total || 0) : (input.current_bill_total || 0) * 12).toFixed(2)}</span>
                                            <span className="text-lg font-bold text-text-muted">€/{studyMode === 'monthly' ? 'mes' : 'año'}</span>
                                        </div>
                                        <div className="mt-4 w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-300 dark:bg-slate-600 w-full opacity-50"></div>
                                        </div>
                                    </div>

                                    {/* Card Nueva */}
                                    <div className="premium-card p-6 border-l-4 border-primary overflow-hidden relative group bg-gradient-to-br from-primary/5 to-transparent">
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Nueva optimización</p>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <span className="text-6xl">⚡</span>
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
                                <div className="premium-card p-0 overflow-hidden bg-accent/5 border-2 border-accent/20 hover:border-accent/40 transition-all relative">
                                    <div className="flex flex-col sm:flex-row items-center">
                                        <div className="bg-accent px-10 py-10 sm:py-12 flex flex-col items-center justify-center text-accent-text shrink-0 w-full sm:w-auto">
                                            <Trophy className="w-12 h-12 mb-3 animate-bounce" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Logro</span>
                                        </div>
                                        <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between w-full gap-6">
                                            <div>
                                                <h4 className="text-sm font-black text-accent uppercase tracking-widest mb-1">Ahorro total calculado</h4>
                                                <p className="text-text-secondary text-xs font-bold leading-relaxed px-1">Se han aplicado todos los impuestos y cánones vigentes.</p>
                                            </div>
                                            <div className="text-center sm:text-right">
                                                <div className={`text-5xl font-black tracking-tighter ${((input.current_bill_total || 0) - selectedResult.total) >= 0 ? "text-accent" : "text-warning"}`}>
                                                    {Math.abs(studyMode === 'monthly' 
                                                        ? (input.current_bill_total || 0) - selectedResult.total 
                                                        : ((input.current_bill_total || 0) - selectedResult.total) * 12
                                                    ).toFixed(2)}
                                                    <span className="text-2xl ml-1 italic">€</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Análisis Experto Refinado */}
                                <div className="premium-card p-8 bg-surface border border-border shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                                            <Brain className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Análisis estratégico IA</h4>
                                            <p className="text-text-primary text-[15px] italic leading-relaxed font-medium">
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

                        <div className="flex flex-col lg:flex-row gap-8 relative">
                            {/* LEFT: CURRENT PROFILE SUMMARY */}
                            {/* Lateral Collapse Trigger */}
                            <button 
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className={`fixed lg:absolute left-0 top-1/2 -translate-y-1/2 w-6 h-20 bg-surface border border-border rounded-r-xl shadow-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all z-[100] group active:scale-95 ${ (isSidebarCollapsed || (isProfileCollapsed && isFiltersCollapsed)) ? "translate-x-0" : "translate-x-[-100%] lg:translate-x-0 lg:left-[325px]"}`}
                            >
                                <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${ (isSidebarCollapsed || (isProfileCollapsed && isFiltersCollapsed)) ? "" : "rotate-180"}`} />
                            </button>
                            <aside className={`transition-all duration-500 ease-in-out shrink-0 overflow-hidden relative ${ (isSidebarCollapsed || (isProfileCollapsed && isFiltersCollapsed)) ? "w-0 lg:w-0 opacity-0 invisible" : "w-full lg:w-[325px] opacity-100 visible"}`}>
                                    {!isProfileCollapsed && (
                                        <div className="bg-surface border border-border p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm space-y-8 group transition-all duration-500">
                                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                                            
                                            <div className="flex justify-between items-center relative z-10 mb-8">
                                                <div className="space-y-1">
                                                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] leading-none">TU SUMINISTRO</h4>
                                                    <p className="text-xs font-black text-text-primary uppercase tracking-tight">Perfil de Carga</p>
                                                </div>
                                                <button 
                                                    onClick={() => setIsProfileCollapsed(true)}
                                                    className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all border border-border shadow-sm active:scale-95"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-8 relative z-10 pt-2 animate-in slide-in-from-top-2 duration-300">
                                                <div className="flex flex-col bg-surface-2 p-5 rounded-3xl border border-border">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-1.5 h-3 bg-warning rounded-full"></div>
                                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Potencia Contratada</p>
                                                    </div>
                                                    {input.power_p2 > 0 && input.power_p1 !== input.power_p2 ? (
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center text-xs font-black">
                                                                <span className="text-text-muted uppercase tracking-tighter">P1 · Punta</span>
                                                                <span className="text-warning">{input.power_p1.toLocaleString('es-ES', { maximumFractionDigits: 2 })} kW</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-xs font-black pt-2 border-t border-border">
                                                                <span className="text-text-muted uppercase tracking-tighter">P2 · Valle</span>
                                                                <span className="text-warning">{input.power_p2.toLocaleString('es-ES', { maximumFractionDigits: 2 })} kW</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-baseline gap-1.5">
                                                            <p className="text-4xl font-black text-text-primary tracking-tighter">{input.power_p1.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</p>
                                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">kW</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col bg-surface-2 p-5 rounded-3xl border border-border">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-1.5 h-3 bg-primary rounded-full"></div>
                                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">ENERGÍA CONSUMIDA</p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {[
                                                            { label: 'E1 · Punta', val: input.energy_p1, color: 'text-orange-500' },
                                                            { label: 'E2 · Llano', val: input.energy_p2, color: 'text-blue-500' },
                                                            { label: 'E3 · Valle', val: input.energy_p3, color: 'text-accent' }
                                                        ].filter(p => p.val > 0).map((p, i) => (
                                                            <div key={i} className="flex justify-between items-center text-xs font-black">
                                                                <span className="text-slate-400 uppercase tracking-tighter">{p.label}</span>
                                                                <span className={p.color}>{p.val.toLocaleString('es-ES', { maximumFractionDigits: 1 })} kWh</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="relative pt-8 mt-2 border-t border-border z-10">
                                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center mb-5">Impuestos Aplicados</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="group/tax relative bg-surface-2 p-4 rounded-2xl text-center border border-border shadow-sm transition-all">
                                                            <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1.5 opacity-70">IEE</p>
                                                            <p className="text-sm font-black text-primary">5.11%</p>
                                                        </div>
                                                        <div className="group/tax relative bg-surface-2 p-4 rounded-2xl text-center border border-border shadow-sm transition-all">
                                                            <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1.5 opacity-70">IVA</p>
                                                            <p className="text-sm font-black text-primary">21%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* FILTERS SECTION */}
                                    {!isFiltersCollapsed && (
                                        <div className="bg-surface border border-border p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                                            {/* Deco Background Grid */}
                                            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                                            
                                            <div className="flex justify-between items-center mb-8 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all border border-border shadow-sm">
                                                        <Filter className="w-4 h-4" />
                                                    </div>
                                                    <h4 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Filtros</h4>
                                                </div>
                                                <button 
                                                    onClick={() => setIsFiltersCollapsed(true)}
                                                    className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all border border-border shadow-sm active:scale-95"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="space-y-8 relative z-10 animate-in slide-in-from-top-2 duration-300">
                                                {/* Filter: Search Company */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Buscar Compañía / Tarifa</label>
                                                    <div className="relative group/input">
                                                        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 transition-colors group-focus-within/input:text-primary" />
                                                        <input
                                                            type="text"
                                                            value={filterSearch}
                                                            onChange={e => setFilterSearch(e.target.value)}
                                                            placeholder="Ej. Endesa, Iberdrola..."
                                                            className="relative w-full bg-surface-2 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary focus:bg-surface transition-all text-text-primary placeholder:text-text-muted/70"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-primary/50 uppercase tracking-widest pl-1">Tipo de Precio</label>
                                                    <div className="flex bg-primary/5 rounded-full p-1.5 border border-primary/10">
                                                        {['all', 'fixed', 'periods'].map((t) => (
                                                            <button 
                                                                key={t}
                                                                onClick={() => setFilterPriceType(t as any)} 
                                                                className={`flex-1 text-[10px] font-black py-2 rounded-full uppercase tracking-widest transition-all duration-300 ${
                                                                    filterPriceType === t 
                                                                    ? (t === 'fixed' 
                                                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                                                                        : t === 'periods' 
                                                                            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                                                                            : 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                                                      )
                                                                    : 'text-primary/40 hover:text-primary/70'
                                                                }`}
                                                            >
                                                                {t === 'all' ? 'Todas' : t === 'fixed' ? 'Fijo' : 'Tramos'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-primary/50 uppercase tracking-widest pl-1">Excedentes</label>
                                                    <div className="flex bg-primary/5 rounded-full p-1.5 border border-primary/10">
                                                        <button 
                                                            onClick={() => setFilterSurplus("all")} 
                                                            className={`flex-1 text-[10px] font-black py-2 rounded-full uppercase tracking-widest transition-all duration-300 ${filterSurplus === 'all' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-primary/40 hover:text-primary/70'}`}
                                                        >
                                                            Todas
                                                        </button>
                                                        <button 
                                                            onClick={() => setFilterSurplus("with")} 
                                                            className={`flex-1 text-[10px] font-black py-2 rounded-full uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 ${filterSurplus === 'with' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-emerald-500/50 hover:text-emerald-600'}`}
                                                        >
                                                            <Sun size={12} />
                                                            Con
                                                        </button>
                                                        <button 
                                                            onClick={() => setFilterSurplus("without")} 
                                                            className={`flex-1 text-[10px] font-black py-2 rounded-full uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 ${filterSurplus === 'without' ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/25' : 'text-slate-500/50 hover:text-slate-600'}`}
                                                        >
                                                            <SunDim size={12} />
                                                            Sin
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Ordenar por</label>
                                                    <div className="flex bg-surface-2 rounded-full p-1.5 border border-border">
                                                        <button 
                                                            onClick={() => setSortBy("savings-desc")} 
                                                            className={`flex-1 text-[10px] font-black py-2 rounded-full uppercase tracking-widest transition-all duration-300 ${
                                                                sortBy === "savings-desc" 
                                                                ? "bg-white dark:bg-slate-700 text-primary shadow-md" 
                                                                : "text-slate-400 hover:text-slate-600"
                                                            }`}
                                                        >
                                                            Mayor Ahorro
                                                        </button>
                                                        <button 
                                                            onClick={() => setSortBy("savings-asc")} 
                                                            className={`flex-1 text-[10px] font-black py-2 rounded-full uppercase tracking-widest transition-all duration-300 ${
                                                                sortBy === "savings-asc" 
                                                                ? "bg-white dark:bg-slate-700 text-primary shadow-md" 
                                                                : "text-slate-400 hover:text-slate-600"
                                                            }`}
                                                        >
                                                            Menor Ahorro
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Mostrar resultados</label>
                                                    <div className="flex bg-surface-2 rounded-full p-1.5 border border-border">
                                                        {[Infinity, 3, 5].map((val) => (
                                                            <button 
                                                                key={val.toString()}
                                                                onClick={() => setLimitResults(val)} 
                                                                className={`flex-1 text-[10px] font-black py-2 rounded-full uppercase tracking-widest transition-all duration-300 ${
                                                                    limitResults === val 
                                                                    ? "bg-white dark:bg-slate-700 text-primary shadow-md" 
                                                                    : "text-slate-400 hover:text-slate-600"
                                                                }`}
                                                            >
                                                                {val === Infinity ? 'Todas' : `Top ${val}`}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </aside>

                            {/* RIGHT: TARIFF COMPARISON LIST */}
                            <div className="flex-1 space-y-6">
                                {/* TOP RESULTS & ACTIONS AREA - UNIFIED BAR */}
                                <div className="bg-surface border border-border p-5 h-24 rounded-[2.5rem] shadow-sm relative overflow-hidden group flex items-center justify-between px-8">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-accent/10"></div>
                                    
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-12 h-12 bg-accent-bg text-accent rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-accent/10">
                                            <TrendingDown className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">ANÁLISIS DE RESULTADOS</p>
                                            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight leading-none whitespace-nowrap">
                                                Ahorro Estimado: <span className="text-accent tracking-tighter tabular-nums">{results[0] ? Math.max(0, ((input.current_bill_total || 0) - (results[0].total)) * 12).toFixed(2) : "0.00"}<span className="text-xs ml-2 opacity-80 uppercase tracking-widest font-black">€ / año</span></span>
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 relative z-10 translate-y-[8px]">
                                        <button
                                            onClick={saveBill}
                                            disabled={isProcessing || results.length === 0}
                                            className="group relative flex items-center justify-center gap-1.5 bg-primary/5 text-primary/60 px-2.5 h-6 rounded-md cursor-pointer hover:bg-primary/10 hover:text-primary transition-all active:scale-95 disabled:opacity-50 overflow-hidden border border-primary/10"
                                        >
                                            <Save className="w-2.5 h-2.5" />
                                            <span className="text-[8px] font-black uppercase tracking-wider">{isProcessing ? "Guardando..." : "Guardar análisis"}</span>
                                        </button>
                                        <button
                                            onClick={() => setStep("input")}
                                            className="flex items-center justify-center gap-1.5 bg-text-primary/5 text-text-muted px-2.5 h-6 rounded-md cursor-pointer hover:bg-text-primary/10 hover:text-text-primary transition-all active:scale-95 border border-border/10 text-[8px] font-black uppercase tracking-wider whitespace-nowrap"
                                        >
                                            <History className="w-2.5 h-2.5" />
                                            <span>Nueva comparativa</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* CARD: TOTAL MENSUAL */}
                                    <div
                                        onClick={() => {
                                            if (!user) { setPendingStudyMode("monthly"); setIsAuthModalOpen(true); return; }
                                            if (results[0]) { setSelectedTariffId(results[0].tariff.id!); setStudyMode("monthly"); setStep("study"); }
                                        }}
                                        className={`bg-surface border border-border p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm transition-all duration-300 group h-[260px] ${results[0] ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-50'}`}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full transition-all duration-300">
                                            <FileText className="w-8 h-8 text-primary mb-6 transition-transform group-hover:scale-110" />
                                            <p className="text-4xl font-900 text-text-primary mb-3 tracking-tighter">
                                                {results[0] ? `${results[0].total.toFixed(2)} €` : "---"}
                                            </p>
                                            <div className="flex items-center justify-center gap-2 text-accent bg-accent/5 px-4 py-2 rounded-full border border-accent/10 whitespace-nowrap">
                                                <TrendingDown className="w-4 h-4 shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {results[0] ? `${Math.abs((input.current_bill_total || 0) - results[0].total).toFixed(2)} € ahorro mensual` : "Sin datos"}
                                                </span>
                                            </div>
                                        </div>
                                        {results[0] && (
                                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 z-20">
                                                <div className="bg-primary/10 text-primary p-2 rounded-xl backdrop-blur-md border border-primary/20 shadow-sm" title="Haz clic para ampliar estudio">
                                                    <Eye className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* CARD: TOTAL ANUAL */}
                                    <div
                                        onClick={() => {
                                            if (!user) { setPendingStudyMode("annual"); setIsAuthModalOpen(true); return; }
                                            if (results[0]) { setSelectedTariffId(results[0].tariff.id!); setStudyMode("annual"); setStep("study"); }
                                        }}
                                        className={`bg-surface border border-border p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm transition-all duration-300 group h-[260px] ${results[0] ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-50'}`}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full transition-all duration-300">
                                            <Calendar className="w-8 h-8 text-accent mb-6 transition-transform group-hover:scale-110" />
                                            <p className="text-4xl font-900 text-text-primary mb-3 tracking-tighter">{results[0] ? `${(results[0].total * 12).toFixed(2)} €` : "---"}</p>
                                            <div className="flex items-center justify-center gap-2 text-accent bg-accent/5 px-4 py-2 rounded-full border border-accent/10 whitespace-nowrap">
                                                <TrendingDown className="w-4 h-4 shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {results[0] ? `${Math.abs(((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} € ahorro anual` : "Sin datos"}
                                                </span>
                                            </div>
                                        </div>
                                        {results[0] && (
                                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 z-20">
                                                <div className="bg-accent/10 text-accent p-2 rounded-xl backdrop-blur-md border border-accent/20 shadow-sm" title="Haz clic para ampliar estudio">
                                                    <Eye className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* CARD: PRECIO UNITARIO */}
                                    <div
                                        onClick={() => {
                                            if (results[0]) { setSelectedTariffId(results[0].tariff.id!); setStep("detail"); }
                                        }}
                                        className={`bg-surface border border-border p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm transition-all duration-300 group h-[260px] ${results[0] ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-50'}`}
                                    >
                                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] transition-transform group-hover:scale-110 ${results[0]?.tariff.type === '3 Periodos' ? 'bg-primary/5' : 'bg-orange-500/5'}`}></div>
                                        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full transition-all duration-300">
                                            <Trophy className={`w-8 h-8 mb-6 transition-transform group-hover:scale-110 ${results[0]?.tariff.type === '3 Periodos' ? 'text-primary' : 'text-orange-500'}`} />
                                            <p className={`text-4xl font-900 mb-3 tracking-tighter ${results[0]?.tariff.type === "3 Periodos" ? "text-primary" : "text-orange-500"}`}>{results[0] ? `${results[0].tariff.e1_kwh.toFixed(6)}` : "---"}</p>
                                            <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap overflow-hidden ${results[0]?.tariff.type === '3 Periodos' ? 'bg-primary/5 border-primary/10 text-primary' : 'bg-orange-500/5 border-orange-500/10 text-orange-500'}`}>
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {results[0] ? `${results[0].tariff.company} · ${results[0].tariff.name}` : "Sin datos"}
                                                </span>
                                            </div>
                                        </div>
                                        {results[0] && (
                                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 z-20">
                                                <div className={`${results[0]?.tariff.type === "3 Periodos" ? "bg-primary/10 text-primary border-primary/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"} p-2 rounded-xl backdrop-blur-md border shadow-sm`} title="Ver detalles de esta tarifa">
                                                    <Eye className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="relative p-[1px] md:p-[2px] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-primary/10 group/maincontainer mt-4">
                                    {/* Animated Gradient Border Layer */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-400 to-amber-500 opacity-20 sm:opacity-40 group-hover/maincontainer:opacity-100 transition-opacity duration-1000 z-0"></div>
                                    <div className="absolute inset-[-150%] bg-gradient-to-tr from-transparent via-primary/30 to-transparent animate-[spin_8s_linear_infinite] opacity-0 group-hover/maincontainer:opacity-50 z-0 pointer-events-none"></div>
                                    
                                    {/* Inner Main Container */}
                                    <div className="relative bg-surface rounded-[calc(2rem-2px)] overflow-hidden h-full z-10 flex flex-col">
                                        {(isProfileCollapsed || isFiltersCollapsed) && (
                                            <div className="px-5 py-4 md:px-8 md:py-5 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 border-b border-border bg-surface backdrop-blur-sm relative overflow-hidden group/header">
                                                {/* Advanced Glow Decorations */}
                                                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover/header:bg-primary/20 transition-all duration-1000 pointer-events-none"></div>
                                                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[80px] group-hover/header:bg-accent-bg transition-all duration-1000 pointer-events-none"></div>

                                                <div className="hidden md:block"></div>
                                                <div className="flex justify-center sm:justify-start gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar relative z-10 items-center">
                                                    {isProfileCollapsed && (
                                                        <button
                                                            onClick={() => setIsProfileCollapsed(false)}
                                                            className="shrink-0 flex items-center gap-2 bg-warning/10 text-warning text-[10px] font-bold px-4 py-1.5 rounded-full border border-warning/20 hover:bg-warning/20 transition-all active:scale-95 animate-in fade-in slide-in-from-left-2 duration-300"
                                                        >
                                                            <span className="w-4 h-4 flex items-center justify-center text-xs">⚡</span>
                                                            Perfil
                                                            <ChevronLeft className="w-4 h-4 opacity-50" />
                                                        </button>
                                                    )}
                                                    {isFiltersCollapsed && (
                                                        <button
                                                            onClick={() => setIsFiltersCollapsed(false)}
                                                            className="shrink-0 flex items-center gap-2 bg-surface-2 text-text-secondary text-[10px] font-bold px-4 py-1.5 rounded-full border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all active:scale-95 animate-in fade-in slide-in-from-left-2 duration-300"
                                                        >
                                                            <Filter className="w-4 h-4" />
                                                            Filtros
                                                            <ChevronLeft className="w-4 h-4 opacity-50" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* MOBILE VIEW: VERTICAL CARDS (md:hidden) */}
                                    <div className="md:hidden px-4 space-y-6 pb-10">
                                        {results.map((res, idx) => {
                                            const saving = (input.current_bill_total || 0) - res.total;
                                            const isWinner = idx === 0;
                                            const logoPath = getLogoPath(res.tariff.company);
                                            
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`relative overflow-hidden rounded-[2rem] border transition-all duration-300 ${isWinner
                                                        ? "bg-surface border-primary/40 shadow-2xl shadow-primary/5 ring-1 ring-primary/10"
                                                        : "bg-surface border-border shadow-sm"
                                                        }`}
                                                >
                                                    {isWinner && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary z-10"></div>
                                                    )}

                                                    <div className="p-6 space-y-5">
                                                        <div className="flex flex-col items-center text-center space-y-3">
                                                            {isWinner && (
                                                                <span className={`${res.tariff.type === '3 Periodos' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'} border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1 animate-in fade-in slide-in-from-top-2 duration-500`}>
                                                                    Mejor opción
                                                                </span>
                                                            )}
                                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border bg-white shadow-sm p-2 flex items-center justify-center">
                                                                {logoPath ? (
                                                                    <Image 
                                                                        src={logoPath} 
                                                                        alt={res.tariff.company} 
                                                                        width={56} 
                                                                        height={56} 
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                ) : (
                                                                    <Building2 className="w-7 h-7 text-text-muted" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-center max-w-[240px]">
                                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5">{res.tariff.company}</span>
                                                                <span className="text-base font-black text-text-primary tracking-tight leading-tight uppercase font-heading">{res.tariff.name}</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 border-y border-border/50 py-5">
                                                            <div className="flex flex-col relative pr-4">
                                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/50"></div>
                                                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Cuota estimada</span>
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-2xl font-black text-text-primary tracking-tighter font-heading">{res.total.toFixed(2)}€</span>
                                                                    <span className="text-[10px] text-text-muted font-bold uppercase">/mes</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Ahorro mensual</span>
                                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading font-black text-sm tracking-tight ${
                                                                    saving > 0.01 
                                                                        ? "bg-accent/10 text-accent shadow-sm shadow-accent/5" 
                                                                        : saving < -0.01 
                                                                            ? "bg-rose-500/10 text-rose-500 shadow-sm shadow-rose-500/5" 
                                                                            : "bg-surface-2 text-text-muted"
                                                                }`}>
                                                                    {saving > 0.01 ? (
                                                                        <>
                                                                            <ArrowDownRight className="w-3.5 h-3.5" />
                                                                            <span>{saving.toFixed(2)}€</span>
                                                                        </>
                                                                    ) : saving < -0.01 ? (
                                                                        <>
                                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                                            <span>{Math.abs(saving).toFixed(2)}€</span>
                                                                        </>
                                                                    ) : (
                                                                        <span>—</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 pt-1">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTariffId(res.tariff.id!);
                                                                    setStep("detail");
                                                                }}
                                                                className="flex-[1.4] flex items-center justify-center bg-primary text-white h-[52px] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
                                                            >
                                                                Ver detalles →
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
                                                                className={`flex-1 flex items-center justify-center gap-2 px-3 h-[52px] rounded-2xl border transition-all active:scale-95 ${res.tariff.id && favorites.includes(res.tariff.id)
                                                                    ? "bg-rose-50 border-rose-100 text-rose-500 shadow-md shadow-rose-500/10"
                                                                    : "bg-surface border-border text-text-muted shadow-sm shadow-black/[0.02]"
                                                                    }`}
                                                            >
                                                                <Heart className={`w-3.5 h-3.5 ${res.tariff.id && favorites.includes(res.tariff.id) ? "fill-current" : ""}`} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                                    {res.tariff.id && favorites.includes(res.tariff.id) ? "Guardado" : "Guardar"}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* DESKTOP VIEW: TABLE (hidden md:block) */}
                                    <div className="hidden md:block overflow-x-auto overflow-y-hidden">
                                        <div className="bg-surface rounded-b-[2.5rem] border-x border-b border-border shadow-sm overflow-hidden relative">
                                            {/* Decorative Grid Background */}
                                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none z-0"
                                                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>

                                            <table className="w-full border-collapse relative z-10">
                                                <thead>
                                                    <tr className="bg-surface-2 border-y border-border">
                                                        <th className="py-4 px-8 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em] w-[25%]">TARIFA / COMPAÑÍA</th>
                                                        <th className="py-4 px-8 text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] w-[25%]">PRECIOS ENERGÍA</th>
                                                        <th className="py-4 px-8 text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] w-[15%]">TOTAL MES</th>
                                                        <th className="py-4 px-8 text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] w-[20%]">AHORRO</th>
                                                        <th className="py-4 px-8 text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] w-[15%]">ACCIONES</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/60">
                                                    {/* Empty State */}
                                                    {results.length === 0 && (
                                                        <tr>
                                                            <td colSpan={5} className="py-20 text-center">
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <ZapOff className="w-12 h-12 text-text-muted" />
                                                                    <p className="text-text-secondary font-bold">No se han encontrado tarifas con estos filtros</p>
                                                                    <button onClick={() => {setFilterSearch(""); setFilterPriceType("all"); setSortBy("savings-desc"); setLimitResults(Infinity);}} className="text-primary text-xs font-bold uppercase tracking-widest hover:underline transition-all">Restablecer Filtros</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {/* Baseline Reference Row */}
                                                    <tr className="bg-surface border-b border-border/40">
                                                        <td className="py-5 px-8">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-black mb-1">TU SITUACIÓN ACTUAL</span>
                                                                <span className="font-black text-text-secondary text-xs uppercase tracking-tight">REFERENCIA BASE</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-8 text-center">
                                                            <div className="inline-flex flex-col gap-1 items-center opacity-70">
                                                                {[
                                                                    { label: 'E1', val: input.current_price_p1, color: 'bg-orange-500', shadow: 'rgba(249,115,22,0.3)' },
                                                                    { label: 'E2', val: input.current_price_p2 || input.current_price_p1, color: 'bg-blue-500', shadow: 'rgba(59,130,246,0.3)' },
                                                                    { label: 'E3', val: input.current_price_p3 || input.current_price_p1, color: 'bg-emerald-500', shadow: 'rgba(16,185,129,0.3)' }
                                                                ].filter(p => (p.val || 0) > 0).map((p, i) => (
                                                                    <div key={i} className="flex items-center gap-2">
                                                                        <div className={`w-1 h-1 rounded-full ${p.color}`}></div>
                                                                        <span className="text-text-muted text-[10px] tabular-nums font-bold">{(p.val || 0).toFixed(4)}<span className="text-[10px] ml-0.5 opacity-60">€</span></span>
                                                                    </div>
                                                                ))}
                                                                {!input.current_price_p1 && <span className="text-[9px] text-text-muted uppercase font-black tracking-widest">Precio variable</span>}
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-8 text-center">
                                                            <span className="font-black text-base text-text-secondary tabular-nums tracking-tight">{(input.current_bill_total || 0).toFixed(2)}€</span>
                                                        </td>
                                                        <td className="py-5 px-8 text-center">
                                                            <span className="text-text-muted font-black text-xs uppercase tracking-widest opacity-40">—</span>
                                                        </td>
                                                        <td className="py-5 px-8 text-center">
                                                            <span className="text-text-muted font-black text-xs uppercase tracking-widest opacity-40">—</span>
                                                        </td>
                                                    </tr>

                                                    {results.map((res, idx) => {
                                                        const saving = (input.current_bill_total || 0) - res.total;
                                                        const isWinner = idx === 0;
                                                        const logoPath = getLogoPath(res.tariff.company);
                                                        const isThreePeriod = res.tariff.type === "3 Periodos";

                                                        return (
                                                            <tr 
                                                                key={idx} 
                                                                className="transition-all duration-150 hover:bg-surface-2 group/row bg-surface"
                                                            >
                                                                <td className={`py-6 px-8 relative ${isWinner ? (isThreePeriod ? 'border-l-4 border-blue-500' : 'border-l-4 border-orange-500 shadow-[inset_4px_0_0_0_#f97316]') : ''}`}>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="font-heading font-black text-sm text-text-primary tracking-tight truncate uppercase leading-none mb-1 group-hover/row:text-primary transition-colors">{res.tariff.name}</span>
                                                                            <span className="font-body text-[10px] font-black text-text-muted uppercase tracking-[0.1em] truncate">{res.tariff.company}</span>
                                                                            {isWinner && (
                                                                                <div className="mt-1.5">
                                                                                    <span className={`${isThreePeriod ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-orange-500/10 border-orange-500/20 text-orange-600'} border text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm`}>Mejor opción</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 px-8 text-center">
                                                                    <div className="inline-flex flex-col gap-1 items-center">
                                                                        {isThreePeriod ? (
                                                                            <>
                                                                                <div className="flex items-center gap-2.5">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                                                                                    <span className="text-text-muted text-[10px] font-black uppercase tracking-tighter">E1</span>
                                                                                    <span className="tabular-nums font-bold text-text-secondary text-[13px]">{res.tariff.e1_kwh.toFixed(4)}<span className="text-[10px] ml-0.5 opacity-60">€</span></span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2.5">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                                                                                    <span className="text-text-muted text-[10px] font-black uppercase tracking-tighter">E2</span>
                                                                                    <span className="tabular-nums font-bold text-text-secondary text-[13px]">{res.tariff.e2_kwh.toFixed(4)}<span className="text-[10px] ml-0.5 opacity-60">€</span></span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2.5">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                                                                    <span className="text-text-muted text-[10px] font-black uppercase tracking-tighter">E3</span>
                                                                                    <span className="tabular-nums font-bold text-text-secondary text-[13px]">{res.tariff.e3_kwh.toFixed(4)}<span className="text-[10px] ml-0.5 opacity-60">€</span></span>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div className="flex items-center gap-2.5 py-4">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                                                                                <span className="text-text-muted text-[10px] font-black uppercase tracking-tighter">E1</span>
                                                                                <span className="tabular-nums font-bold text-text-secondary text-[13px]">{res.tariff.e1_kwh.toFixed(4)}<span className="text-[10px] ml-0.5 opacity-60">€</span></span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 px-8 text-center">
                                                                    <span className="font-heading font-black text-xl text-text-primary tabular-nums tracking-tighter">{res.total.toFixed(2)}<span className="text-base ml-0.5 font-bold opacity-60">€</span></span>
                                                                </td>
                                                                <td className="py-6 px-8 text-center uppercase">
                                                                    <div className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-heading font-black text-base tracking-tight shadow-sm min-w-[100px] ${
                                                                        saving > 0.01 
                                                                            ? "bg-accent/10 text-accent border border-accent/20" 
                                                                            : saving < -0.01 
                                                                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                                                                                : "bg-surface-2 text-text-muted border border-border"
                                                                    }`}>
                                                                        {saving > 0.01 ? (
                                                                            <>
                                                                                <ArrowDownRight className="w-4 h-4" />
                                                                                <span>{saving.toFixed(2)}<span className="text-[10px] ml-0.5">€</span></span>
                                                                            </>
                                                                        ) : saving < -0.01 ? (
                                                                            <>
                                                                                <ArrowUpRight className="w-4 h-4" />
                                                                                <span>{Math.abs(saving).toFixed(2)}<span className="text-[10px] ml-0.5">€</span></span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-sm">—</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 px-8">
                                                                    <div className="flex flex-col gap-2 items-center ml-auto">
                                                                        <button 
                                                                            onClick={() => {
                                                                                setSelectedTariffId(res.tariff.id!);
                                                                                setStep("detail");
                                                                            }}
                                                                            className="bg-surface border border-primary text-primary text-[10px] font-black px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all whitespace-nowrap uppercase tracking-widest shadow-sm active:scale-95"
                                                                        >
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
                                                                            className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 whitespace-nowrap ${
                                                                                res.tariff.id && favorites.includes(res.tariff.id)
                                                                                ? "bg-red-50 text-red-500 border border-red-100"
                                                                                : "text-text-muted hover:bg-surface-2 border border-transparent"
                                                                            }`}
                                                                        >
                                                                            <Heart className={`w-3.5 h-3.5 ${res.tariff.id && favorites.includes(res.tariff.id) ? "fill-current" : ""}`} />
                                                                            {res.tariff.id && favorites.includes(res.tariff.id) ? "Guardado" : "Guardar"}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>

                                            {/* Technical Footer Area */}
                                            <div className="relative z-10 py-6 px-8 border-t border-border flex items-center gap-3 text-slate-400 bg-surface-2/30">
                                                <Info className="w-4 h-4 opacity-50 text-primary" />
                                                <p className="text-xs font-semibold text-text-secondary">
                                                    Precios estimados con impuestos incluidos (IVA 21% e IEE). El ahorro real puede variar según su perfil de consumo técnico.
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    </div>
                                </div>

                                {/* BOTTOM BREAKDOWN BOX (THE BLACK BOX) */}
                                {results.length > 0 && (
                                    <div className="bg-slate-900 border border-slate-800 text-white rounded-[3rem] overflow-hidden p-8 md:p-12 relative shadow-2xl mt-16 transition-all duration-500">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                                        <div className="relative z-10 space-y-12">
                                            {/* HEADER INSIDE BLACK BOX */}
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
                                                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 backdrop-blur-md flex items-center justify-center p-4 border border-white/10 shadow-2xl overflow-hidden">
                                                        {results[0].tariff.company.includes("Referencia") || results[0].tariff.company === "COR" ? (
                                                            <div className="flex flex-col items-center justify-center text-center px-1">
                                                                <span className="text-[9px] font-black leading-tight text-white uppercase tracking-tighter">Comercializadoras</span>
                                                                <span className="text-[9px] font-black leading-tight text-white uppercase tracking-tighter">de Referencia</span>
                                                            </div>
                                                        ) : (
                                                            <img 
                                                                src={getLogoPath(results[0].tariff.company, mounted && resolvedTheme === 'dark')!} 
                                                                alt={results[0].tariff.company}
                                                                className="w-full h-full object-contain" 
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 text-center md:text-left">
                                                        <h4 className="text-lg font-bold tracking-tight text-white/90">Análisis Técnico de Facturación</h4>
                                                        <p className="text-[10px] text-white font-black uppercase tracking-[0.25em]">
                                                            Tarifa Ganadora: <span className={results[0].tariff.type?.includes('3 Periodos') ? 'text-primary' : 'text-orange-400 font-bold'}>{results[0].tariff.company} {results[0].tariff.name}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* TOTAL REUBICADO EN TOP RIGHT */}
                                                <div className="text-center md:text-right">
                                                    <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.25em] mb-3">Total Estimado Mensual</p>
                                                    <div className="flex items-baseline justify-center md:justify-end gap-3">
                                                        <p className="text-6xl font-900 text-savings drop-shadow-[0_0_30px_rgba(34,197,94,0.15)] tracking-tighter tabular-nums leading-none">
                                                            {results[0] ? results[0].total.toFixed(2) : "0.00"}
                                                            <span className="text-3xl ml-2 opacity-80">€</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-10 gap-y-12">
                                            {[
                                                { label: "Energía", val: results[0].costEnergy, sub: "Mercado " + (results[0].tariff.type === '3 Periodos' ? 'Indexado' : 'Libre'), icon: <Zap className="w-4 h-4 text-white" />, border: "border-white/30" },
                                                { label: "Potencia", val: results[0].costPower, sub: "Capacidad Contratada", icon: <Plug className="w-4 h-4 text-white" />, border: "border-white/20" },
                                                { label: "Bono Social", val: results[0].costBonoSocial, sub: "Financiación Obligatoria", icon: <Heart className="w-4 h-4 text-white" />, border: "border-white/20" },
                                                { label: "Contador", val: results[0].costMeter, sub: "Alquiler de Equipo", icon: <Gauge className="w-4 h-4 text-white" />, border: "border-white/20" },
                                                { label: "Impuesto IEE", val: results[0].taxIee, sub: "Imp. Eléctrico (5.11%)", icon: <Building2 className="w-4 h-4 text-white" />, border: "border-white/20" },
                                                { label: "IVA Aplicado", val: results[0].taxIva, sub: "IVA General (21%)", icon: <FileText className="w-4 h-4 text-white" />, border: "border-white/20" },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex flex-col h-full">
                                                    <div className="flex items-center gap-2 text-white min-h-[40px] mb-4">
                                                        <div className="text-white">{item.icon}</div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{item.label}</p>
                                                    </div>
                                                    <div className={`pl-4 border-l-2 ${item.border} flex flex-col gap-1`}>
                                                        <p className={`text-2xl font-900 tracking-tight text-white`}>{item.val.toFixed(2)} €</p>
                                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">{item.sub}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                            {/* TOTAL ESTIMATED DASHBOARD INSIDE BLACK BOX */}
                                            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest leading-none mb-1">Nota Técnica</p>
                                                        <p className="text-[12px] text-white/40 leading-relaxed font-medium">
                                                            Cálculos realizados en base al consumo informado y normativas eléctricas vigentes.
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
                        <div className="flex flex-col md:flex-row justify-between items-center bg-surface backdrop-blur-xl p-8 rounded-[2.5rem] border border-border shadow-xl">
                            <div className="text-center md:text-left mb-4 md:mb-0">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    <h3 className="text-2xl font-900 tracking-tight text-text-primary">Análisis Comparativo Gráfico</h3>
                                </div>
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] ml-3">Comparativa de Mercado en Tiempo Real</p>
                            </div>
                            <button
                                onClick={() => setStep("results")}
                                className="bg-surface-2 hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-2xl border border-border transition-all active:scale-95 flex items-center gap-2 group"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">Cerrar</span>
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="bg-surface border border-border rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                            <div className="relative z-10 space-y-16">
                                {/* CHART CONTAINER */}
                                <div className="space-y-12">
                                    {/* CURRENT BILL (REFERENCE) */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center border border-border">
                                                    <History className="text-text-muted w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted leading-none mb-1">Tu Situación Actual</p>
                                                    <p className="text-sm font-bold text-text-secondary uppercase tracking-tighter">Referencia de Mercado</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-900 text-text-muted line-through opacity-50">{(input.current_bill_total || 0).toFixed(2)} €</p>
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Gasto Base</p>
                                            </div>
                                        </div>
                                        <div className="h-4 bg-surface-2 rounded-full overflow-hidden border border-border relative">
                                            <div
                                                className="h-full bg-slate-300 dark:bg-slate-700/50 rounded-full transition-all duration-[1500ms] ease-out shadow-inner"
                                                style={{ width: '100%' }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                                            </div>
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
                                                                : "bg-surface-2 border-border text-slate-400"
                                                                }`}>
                                                                {idx === 0 ? (
                                                                    <Trophy className="w-5 h-5" />
                                                                ) : (
                                                                    <span className="text-xs font-black">#{idx + 1}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${idx === 0 ? "text-primary" : "text-slate-400"}`}>{res.tariff.company}</p>
                                                                <p className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors tracking-tight leading-tight">{res.tariff.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-3xl font-900 ${idx === 0 ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>{res.total.toFixed(2)} €</p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${saving > 0 ? "text-accent" : "text-text-muted"}`}>
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
                                                            style={{ width: `${percent >= 98 ? 100 : percent}%` }}
                                                        >
                                                            {idx === 0 && (
                                                                <div className="absolute inset-0 bg-white/20 animate-pulse opacity-50"></div>
                                                            )}
                                                            <div className="absolute right-3 inset-y-0 flex items-center">
                                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                                                                    {percent >= 98 ? 100 : percent.toFixed(0)}%
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
                                <div className="pt-12 border-t border-border grid md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-accent/[0.03] border border-accent/10 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
                                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-16 h-16 rounded-[1.25rem] bg-accent-bg flex items-center justify-center text-accent-bg-text shadow-lg shadow-success/10 group-hover:rotate-12 transition-transform">
                                                <PiggyBank className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-bg-text leading-none mb-2">Ahorro Máximo Proyectado</p>
                                                <p className="text-4xl font-900 text-savings tracking-tighter">{Math.max(0, ((input.current_bill_total || 0) - results[0].total) * 12).toFixed(2)} € <span className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">/ año</span></p>
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
                                            className="w-full bg-surface text-text-secondary hover:text-text-primary font-bold py-4 rounded-[1.5rem] text-[10px] uppercase tracking-widest border border-border transition-all"
                                        >
                                            Volver al Listado
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-slate-400">
                            <div className="h-px w-12 bg-border"></div>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Fin del Análisis Gráfico</p>
                            <div className="h-px w-12 bg-border"></div>
                        </div>
                    </div>
                )}

                {/* STEP 4: TARIFF DETAIL VIEW */}
                {
                    step === "detail" && selectedResult && (
                        <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-center mb-8 sm:mb-10 gap-2">
                                <button onClick={() => setStep("results")} className="text-[10px] sm:text-xs font-bold text-primary flex items-center gap-1.5 hover:opacity-70 transition-opacity whitespace-nowrap shrink-0">
                                    <ArrowLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    Volver a la Comparativa
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(selectedResult.tariff.url, '_blank')}
                                        className="bg-primary text-white font-bold py-3 px-5 sm:px-10 rounded-xl text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all whitespace-nowrap"
                                    >
                                        Contratar Ahora
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-surface rounded-3xl border border-border p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8 relative overflow-hidden premium-3d-card hover:translate-y-[-4px]">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                                        <div className="w-32 h-32 md:w-32 md:h-32 rounded-2xl bg-surface border border-border flex items-center justify-center p-4 md:p-6 shrink-0 shadow-sm relative z-10 mx-auto md:mx-0">
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
                                            ) : selectedResult.tariff.company.includes("Referencia") || selectedResult.tariff.company === "COR" ? (
                                                <div className="flex flex-col items-center justify-center text-center p-1">
                                                    <span className="text-[11px] font-black leading-tight text-primary uppercase tracking-tighter">Comercializadoras</span>
                                                    <span className="text-[11px] font-black leading-tight text-primary uppercase tracking-tighter">de Referencia</span>
                                                </div>
                                            ) : (
                                                <div className="relative flex items-center justify-center">
                                                    <div className="w-full aspect-square bg-surface-2 rounded blur-sm"></div>
                                                    <Building2 className="absolute text-4xl text-text-muted w-10 h-10" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative z-10 grow space-y-4">
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                                {selectedResult === results[0] && (
                                                    <span className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none flex items-center shadow-md shadow-primary/20">Top Recomendado</span>
                                                )}
                                                <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none flex items-center ${selectedResult.tariff.name.includes("PVPC") ? "bg-surface-2 text-text-secondary" : "bg-accent text-white shadow-md shadow-success/20"}`}>
                                                    {selectedResult.tariff.name.includes("PVPC") ? "Mercado Regulado" : "Energía 100% Verde"}
                                                </span>
                                            </div>
                                            <h1 className="text-3xl md:text-4xl font-800 tracking-tight">Tarifa {selectedResult.tariff.name}</h1>
                                            <p className="text-text-secondary leading-relaxed text-sm">
                                                {selectedResult.tariff.name.includes("PVPC")
                                                    ? "Tarifa del Mercado Regulado (Precio Voluntario para el Pequeño Consumidor). El precio varía cada hora según la demanda; los precios mostrados son las medias recientes."
                                                    : "Opción competitiva en el mercado libre para consumidores domésticos que buscan estabilidad o buen precio sin penalizaciones abusivas."}
                                            </p>
                                        </div>
                                        <div className="w-full md:w-auto text-center md:text-right shrink-0 mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-border">
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Coste Mensual Estimado</p>
                                            <p className="text-5xl md:text-6xl font-800 text-primary">{selectedResult.total.toFixed(2)} €</p>
                                            <p className="text-[10px] text-text-muted font-medium italic mt-2">impuestos incluidos (IVA 21%)</p>
                                        </div>
                                    </div>

                                    <div className="bg-surface rounded-3xl border border-border overflow-hidden">
                                        <div className="px-5 md:px-10 py-5 md:py-6 border-b border-border flex flex-row justify-between items-center bg-surface-2 gap-2 overflow-hidden">
                                            <div className="flex items-center gap-2 md:gap-3 shrink-1 min-w-0">
                                                <CreditCard className="text-primary w-5 h-5 md:w-6 md:h-6 shrink-0" />
                                                <h4 className="font-800 text-xs sm:text-base truncate">Detalle de Precios</h4>
                                            </div>
                                            <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full py-1.5 px-2 md:px-3 shadow-sm shrink-0">
                                                <span className="text-[8px] sm:text-[10px] font-bold text-text-secondary uppercase tracking-widest cursor-pointer select-none whitespace-nowrap transition-colors" onClick={() => setShowWithTaxes(!showWithTaxes)}>
                                                    {showWithTaxes ? 'Con impuestos' : 'Sin impuestos'}
                                                </span>
                                                <button
                                                    role="switch"
                                                    aria-checked={showWithTaxes}
                                                    onClick={() => setShowWithTaxes(!showWithTaxes)}
                                                    className={`${showWithTaxes ? 'bg-primary' : 'bg-text-muted'} relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none shrink-0`}
                                                >
                                                    <span className={`${showWithTaxes ? 'translate-x-4' : 'translate-x-0.5'} inline-block h-3 w-3 transform rounded-full bg-surface transition-transform`} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`p-6 md:p-10 grid grid-cols-1 ${selectedResult.tariff?.surplus_kwh && selectedResult.tariff.surplus_kwh > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-12`}>
                                            <div className="space-y-6">
                                                <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-tighter text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                                                    <span>🔌</span> Término de Potencia
                                                </h5>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center bg-violet-50/50 dark:bg-violet-900/10 p-4 rounded-xl border border-violet-100 dark:border-violet-900/50">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded bg-violet-500"></span>
                                                            <span className="text-xs font-bold text-text-primary">Punta (P1)</span>
                                                        </div>
                                                        <span className="font-mono text-sm font-bold text-violet-600 dark:text-violet-400">{applyTaxes(selectedResult.tariff?.p1_kw_day ?? 0, selectedResult.tariff?.p1_kw_day_with_taxes).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-text-secondary">€/kW día</span></span>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded bg-indigo-500"></span>
                                                            <span className="text-xs font-bold text-text-primary">Valle (P2)</span>
                                                        </div>
                                                        <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{applyTaxes(selectedResult.tariff?.p2_kw_day ?? 0, selectedResult.tariff?.p2_kw_day_with_taxes).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-text-secondary">€/kW día</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-tighter text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                                                    <span>⚡</span> Término de Energía
                                                </h5>
                                                {(selectedResult.tariff?.type || "").includes('3 Periodos') ? (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-orange-500"></span>
                                                                <span className="text-xs font-bold text-text-primary">Punta (E1)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">{applyTaxes(selectedResult.tariff?.e1_kwh ?? 0, selectedResult.tariff?.e1_kwh_with_taxes).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-text-secondary">€/kWh</span></span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-blue-500"></span>
                                                                <span className="text-xs font-bold text-text-primary">Llano (E2)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{applyTaxes(selectedResult.tariff?.e2_kwh ?? 0, selectedResult.tariff?.e2_kwh_with_taxes).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-text-secondary">€/kWh</span></span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-green-500"></span>
                                                                <span className="text-xs font-bold text-text-primary">Valle (E3)</span>
                                                            </div>
                                                            <span className="font-mono text-sm font-bold text-green-600 dark:text-green-400">{applyTaxes(selectedResult.tariff?.e3_kwh ?? 0, selectedResult.tariff?.e3_kwh_with_taxes).toFixed(5)} € <span className="text-[10px] font-normal opacity-70 text-text-secondary">€/kWh</span></span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center space-y-4 relative group mt-4">
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest leading-none shadow-sm shadow-primary/20">Precio Único (24h)</div>
                                                        <p className="text-3xl font-800 text-primary">{applyTaxes(selectedResult.tariff?.e1_kwh ?? 0, selectedResult.tariff?.e1_kwh_with_taxes).toFixed(5)} € <span className="text-sm font-normal opacity-60">€/kWh</span></p>
                                                        <p className="text-[10px] text-text-secondary italic leading-relaxed">Esta tarifa no discrimina por horarios, pagas lo mismo siempre.</p>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedResult.tariff?.surplus_kwh && selectedResult.tariff.surplus_kwh > 0 ? (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                                                    <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-tighter text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                                                        <span>☀️</span> Compensación de Excedentes
                                                    </h5>
                                                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/50 p-6 rounded-2xl text-center space-y-4 relative group mt-4">
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest leading-none shadow-sm shadow-emerald-500/20">Precio Excedente</div>
                                                        <p className="text-3xl font-800 text-emerald-600 dark:text-emerald-400">{(selectedResult.tariff.surplus_kwh || 0).toFixed(2)} € <span className="text-sm font-normal opacity-60 text-text-secondary">€/kWh</span></p>
                                                        <p className="text-[10px] text-text-secondary italic leading-relaxed">Esta tarifa compensa tu energía sobrante a un precio fijo.</p>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="bg-surface rounded-3xl border border-border overflow-hidden">
                                        <div className="px-6 py-6 md:px-10 border-b border-border flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 bg-surface-2">
                                            <FileText className="text-primary w-6 h-6" />
                                            <h4 className="font-800 text-center md:text-left">Desglose de Factura Estimada</h4>
                                        </div>
                                        <div className="p-6 md:p-10 space-y-5">
                                            {[
                                                { l: "Término de Potencia (" + (input.power_p1 === input.power_p2 ? input.power_p1.toFixed(2).replace(/\.00$/, '') : input.power_p1.toFixed(2).replace(/\.00$/, '') + "/" + input.power_p2.toFixed(2).replace(/\.00$/, '')) + " kW)", v: selectedResult.costPower.toFixed(2) + " €" },
                                                { l: "Término de Energía (" + (input.energy_p1 + input.energy_p2 + input.energy_p3).toFixed(2).replace(/\.00$/, '') + " kWh)", v: selectedResult.costEnergy.toFixed(2) + " €" },
                                            ].map((l, i) => (
                                                <div key={i} className="flex justify-between text-sm py-1 border-b border-border pb-3">
                                                    <span className="font-medium text-text-secondary">{l.l}</span>
                                                    <span className="font-bold">{l.v}</span>
                                                </div>
                                            ))}
                                            <div className="space-y-3 pt-4 text-xs">
                                                <div className="flex justify-between text-text-secondary"><span>Impuesto Electricidad (IEE 5.11%)</span><span className="font-mono">{selectedResult.taxIee.toFixed(2)} €</span></div>
                                                <div className="flex justify-between text-text-secondary"><span>Alquiler de Contador</span><span className="font-mono">{selectedResult.costMeter.toFixed(2)} €</span></div>
                                                <div className="flex justify-between text-text-secondary"><span>Bono Social</span><span className="font-mono">{selectedResult.costBonoSocial.toFixed(2)} €</span></div>
                                                <div className="flex justify-between text-text-secondary"><span>IVA (General 21%)</span><span className="font-mono">{selectedResult.taxIva.toFixed(2)} €</span></div>
                                            </div>
                                            <div className="pt-8 border-t border-border flex justify-between items-center">
                                                <span className="text-xl font-800">Total Factura</span>
                                                <div className="text-right">
                                                    <p className="text-3xl font-800 text-primary">{selectedResult.total.toFixed(2)} €</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-surface rounded-3xl border border-border p-10 space-y-10">
                                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 border-b border-border pb-4">
                                            <Gavel className="text-primary w-6 h-6" />
                                            <h4 className="font-800 text-center md:text-left">Condiciones Legales</h4>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                <div className="p-2 bg-green-500/10 text-green-500 rounded-xl"><ShieldCheckIcon className="w-4 h-4" /></div>
                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Sin Permanencia</p>
                                                    <p className="text-xs text-text-secondary leading-relaxed">Puedes cambiar de tarifa o compañía en cualquier momento sin penalización.</p>
                                                </div>
                                            </div>
                                            {selectedResult.tariff.name.includes("PVPC") ? (
                                                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><LineChart className="w-4 h-4" /></div>
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Precio Semi-Indexado</p>
                                                        <p className="text-xs text-text-secondary leading-relaxed">El precio real fluctúa cada hora. Los datos representados en este cuadro corresponden a un promedio orientativo basado en meses anteriores.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                        <div className="p-2 bg-primary/10 text-primary rounded-xl"><ClockIcon className="w-4 h-4" /></div>
                                                        <div>
                                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Precios Fijos 12 Meses</p>
                                                            <p className="text-xs text-text-secondary leading-relaxed">El precio de la energía no sufrirá incrementos inesperados al menos durante el primer año de contrato.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                                                        <div className="p-2 bg-warning/10 text-warning rounded-xl"><Medal className="w-4 h-4" /></div>
                                                        <div>
                                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Atención Continua</p>
                                                            <p className="text-xs text-text-secondary leading-relaxed">Incluye opciones de gestión rápida y posible aplicación de descuentos temporales directos de la comercializadora.</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-surface-2 border border-border p-8 rounded-3xl space-y-6">
                                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2">
                                            <InfoIcon className="text-primary w-4 h-4" />
                                            <h4 className="font-bold text-sm text-center md:text-left">Información Oficial</h4>
                                        </div>
                                        <p className="text-[11px] text-text-secondary leading-relaxed bg-surface p-6 rounded-2xl border border-border">
                                            {selectedResult.tariff.name.includes("PVPC")
                                                ? "Este contrato pertenece al Mercado Regulado, supervisado directamente por el Estado. Únicamente aplicable en potencias inferiores a 10 kW."
                                                : "Este contrato se encuentra en el mercado libre, lo que permite aprovechar promociones o estabilidad de precios, siempre rigiéndose bajo la normativa de la CNMC."}
                                        </p>

                                        <button
                                            onClick={() => window.open(selectedResult.tariff.url, '_blank')}
                                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
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
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
                                            >
                                                <Share2Icon className="w-4 h-4" /> WhatsApp
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const subject = encodeURIComponent(`Tarifa recomendada: ${selectedResult.tariff.company} ${selectedResult.tariff.name}`);
                                                    const body = encodeURIComponent(`Hola,\n\nHe encontrado esta tarifa de luz que podría interesarte:\n\nCompañía: ${selectedResult.tariff.company}\nTarifa: ${selectedResult.tariff.name}\nPrecio estimado: €${selectedResult.total.toFixed(2)} €/mes\n\nPuedes ver más detalles aquí: ${window.location.href}`);
                                                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
                                            >
                                                <MailIcon className="w-4 h-4" /> Email
                                            </button>
                                        </div>
                                    </div>


                            <div className="pt-20 flex flex-wrap justify-center items-center gap-6 md:gap-10 border-t border-border">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <Share2Icon className="w-6 h-6" />
                                    Compartir Tarifa
                                </button>
                                <div className="hidden md:block w-px h-6 bg-border"></div>
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <PrinterIcon className="w-6 h-6" />
                                    Imprimir Resumen
                                </button>
                                <div className="hidden md:block w-px h-6 bg-border"></div>
                                <Link
                                    href="/#faq"
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all px-6 py-3 rounded-full hover:bg-primary/5 active:scale-95"
                                >
                                    <HelpCircleIcon className="w-6 h-6" />
                                    Preguntas Frecuentes
                                </Link>
                            </div>
                        </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
        </div>
    );
}
