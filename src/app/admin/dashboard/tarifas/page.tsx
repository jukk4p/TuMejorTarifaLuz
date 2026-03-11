"use client";

import Image from "next/image";

import { useState } from "react";
import { Tariff, getLogoPath } from "@/lib/tariffs";
import { useTariffs } from "@/hooks/useTariffs";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { INITIAL_TARIFFS } from "@/lib/initialTariffs";
import { Search, RotateCcw, Plus, Edit2, Trash2, SearchX, X, Tag, Zap, CreditCard, Info } from "lucide-react";

export default function TarifasAdminPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { tariffs: TARIFF_DATABASE } = useTariffs();

    const filteredTariffs = TARIFF_DATABASE.filter(t =>
        (t.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (t.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const openEditor = (tariff?: Tariff) => {
        setSelectedTariff(tariff || {
            company: "",
            name: "",
            type: "Fijo (1 Periodo)",
            p1_kw_day: 0,
            p2_kw_day: 0,
            e1_kwh: 0,
            e2_kwh: 0,
            e3_kwh: 0,
            permanence: false,
            url: "",
            logo_url: ""
        });
        setSelectedIndex(tariff?.id ?? null);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedTariff) return;
        setIsSubmitting(true);
        try {
            // Clean up the object to remove things like id if it's there as a field
            const { id, ...payload } = selectedTariff as any;

            if (selectedIndex) {
                // Update
                const docRef = doc(db, "tariffs", selectedIndex);
                // Ensure numeric fields are actually numbers before saving
                const cleanPayload = {
                    ...payload,
                    p1_kw_day: Number(payload.p1_kw_day || 0),
                    p2_kw_day: Number(payload.p2_kw_day || 0),
                    e1_kwh: Number(payload.e1_kwh || 0),
                    e2_kwh: Number(payload.e2_kwh || 0),
                    e3_kwh: Number(payload.e3_kwh || 0),
                };
                await updateDoc(docRef, cleanPayload);
            } else {
                // Add
                const cleanPayload = {
                    ...payload,
                    p1_kw_day: Number(payload.p1_kw_day || 0),
                    p2_kw_day: Number(payload.p2_kw_day || 0),
                    e1_kwh: Number(payload.e1_kwh || 0),
                    e2_kwh: Number(payload.e2_kwh || 0),
                    e3_kwh: Number(payload.e3_kwh || 0),
                };
                await addDoc(collection(db, "tariffs"), cleanPayload);
            }

            setIsModalOpen(false);
            // No need for window.location.reload() because useTariffs is real-time!
        } catch (error) {
            console.error("Error saving to Firebase:", error);
            alert("Error al guardar: " + (error as any).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("¿Estás seguro de que deseas eliminar esta tarifa de la base de datos?")) return;
        try {
            await deleteDoc(doc(db, "tariffs", id));
        } catch (error) {
            console.error("Error deleting from Firebase:", error);
            alert("Error al eliminar: " + (error as any).message);
        }
    };

    const handleRestore = async () => {
        if (!confirm("Esta acción restaurará todas las tarifas iniciales desde el sistema. ¿Deseas continuar?")) return;
        setIsSubmitting(true);
        try {
            const batch = writeBatch(db);
            const tariffsCol = collection(db, "tariffs");

            INITIAL_TARIFFS.forEach(tariff => {
                const newDocRef = doc(tariffsCol);
                batch.set(newDocRef, tariff);
            });

            await batch.commit();
            alert("Base de datos restaurada con éxito!");
        } catch (error) {
            console.error("Error restoring database:", error);
            alert("Error al restaurar: " + (error as any).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold tracking-tight dark:text-white uppercase">Explorador de Tarifas</h1>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Base de datos técnica del comparador</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por compañía o nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleRestore}
                        disabled={isSubmitting}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Restaurar Base
                    </button>
                    <button
                        onClick={() => openEditor()}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Añadir Tarifa
                    </button>
                </div>
            </div>

            <div className="premium-card overflow-hidden !border-none !shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fcfdfe] dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-5">Distribuidora / Compañía</th>
                                <th className="px-8 py-5">Nombre Tarifa</th>
                                <th className="px-8 py-5">Tipo</th>
                                <th className="px-8 py-5">Punta (P1)</th>
                                <th className="px-8 py-5">Estado</th>
                                <th className="px-8 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredTariffs.map((tariff, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 font-bold text-[10px] text-slate-400 border border-slate-100 dark:border-slate-800 overflow-hidden p-1 shadow-sm shrink-0">
                                                {tariff.logo_url ? (
                                                    <Image src={tariff.logo_url} alt={tariff.company} width={80} height={40} className="w-full h-full object-contain" />
                                                ) : getLogoPath(tariff.company) ? (
                                                    <Image src={getLogoPath(tariff.company)!} alt={tariff.company} width={80} height={40} className="w-full h-full object-contain" />
                                                ) : (
                                                    (tariff.company || "?").charAt(0)
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{tariff.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{tariff.name}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-2.5 py-1 rounded-md bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-tighter border border-primary/10">
                                            {tariff.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">{(tariff.e1_kwh ?? 0).toFixed(4)} €</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-tighter">
                                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                            Activa
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => openEditor(tariff)}
                                            className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all text-slate-400"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(tariff.id)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-slate-400 ml-1">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredTariffs.length === 0 && (
                    <div className="p-20 text-center space-y-4 bg-white dark:bg-slate-900">
                        <div className="w-16 h-16 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full mx-auto">
                            <SearchX className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No se encontraron resultados para "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* MODAL EDITOR (Drawer Style right side as per image) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-500 ease-out">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-extrabold dark:text-white uppercase tracking-tight">Editor Manual de Tarifas</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    Consistencia: <span className="text-primary">backend_schema_v2</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12">
                            {/* Section: IDENTIFICATION LABELS */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <Tag className="w-5 h-5" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest">Etiquetas de Identificación</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Nombre Distribuidora / Compañía</label>
                                            <span className="text-[10px] font-mono text-primary/50">provider_name</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={selectedTariff?.company || ""}
                                                    onChange={e => setSelectedTariff({ ...selectedTariff!, company: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                    placeholder="Ej: Energía Nufri"
                                                />
                                            </div>
                                            <div className="w-20 h-14 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2 shadow-sm shrink-0">
                                                {selectedTariff?.logo_url ? (
                                                    <Image
                                                        src={selectedTariff.logo_url}
                                                        alt="Custom Preview"
                                                        width={80}
                                                        height={56}
                                                        className="max-h-full max-w-full object-contain transition-all"
                                                    />
                                                ) : getLogoPath(selectedTariff?.company || "") ? (
                                                    <Image
                                                        src={getLogoPath(selectedTariff?.company || "")!}
                                                        alt="System Preview"
                                                        width={80}
                                                        height={56}
                                                        className="max-h-full max-w-full object-contain transition-all"
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">No Logo</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Nombre de la Tarifa</label>
                                            <span className="text-[10px] font-mono text-primary/50">tariff_name</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={selectedTariff?.name || ""}
                                            onChange={e => setSelectedTariff({ ...selectedTariff!, name: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">URL de Contratación</label>
                                                <span className="text-[10px] font-mono text-primary/50">contract_url</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={selectedTariff?.url || ""}
                                                onChange={e => setSelectedTariff({ ...selectedTariff!, url: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">URL del Logo (Opcional)</label>
                                                <span className="text-[10px] font-mono text-primary/50">logo_custom_url</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={selectedTariff?.logo_url || ""}
                                                onChange={e => setSelectedTariff({ ...selectedTariff!, logo_url: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="https://.../logo.png"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Tipo de Tarifa</label>
                                            <select
                                                value={selectedTariff?.type}
                                                onChange={e => setSelectedTariff({ ...selectedTariff!, type: e.target.value as Tariff['type'] })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                                                <option value="Fijo (1 Periodo)">Fixed / Fijo</option>
                                                <option value="3 Periodos">3 Periods / Indexado</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Estado del Registro</label>
                                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                                                <option>Active / Publicado</option>
                                                <option>Draft / Borrador</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: POTENCIA */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <Zap className="w-5 h-5 fill-current" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest">Potencia / Power Capacity</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Potencia Punta (P1)</label>
                                            <span className="text-[10px] font-mono text-primary/50">price_power_peak</span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">€</span>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={selectedTariff?.p1_kw_day ?? ""}
                                                onChange={e => setSelectedTariff({ ...selectedTariff!, p1_kw_day: e.target.value.replace(',', '.') as any })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl pl-10 pr-5 py-4 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Potencia Valle (P2)</label>
                                            <span className="text-[10px] font-mono text-primary/50">price_power_offpeak</span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">€</span>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={selectedTariff?.p2_kw_day ?? ""}
                                                onChange={e => setSelectedTariff({ ...selectedTariff!, p2_kw_day: e.target.value.replace(',', '.') as any })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl pl-10 pr-5 py-4 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: ENERGIA */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <CreditCard className="w-5 h-5" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest">Energía / Consumption Rates</h4>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Energía Punta / Única (E1)</label>
                                            <span className="text-[10px] font-mono text-primary/50">price_energy_peak</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={selectedTariff?.e1_kwh ?? ""}
                                                onChange={e => setSelectedTariff({ ...selectedTariff!, e1_kwh: e.target.value.replace(',', '.') as any })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">KWH</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Energía Llano (E2)</label>
                                                <span className="text-[10px] font-mono text-primary/50">price_energy_mid</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={selectedTariff?.e2_kwh ?? ""}
                                                    onChange={e => setSelectedTariff({ ...selectedTariff!, e2_kwh: e.target.value.replace(',', '.') as any })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">KWH</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Energía Valle (E3)</label>
                                                <span className="text-[10px] font-mono text-primary/50">price_energy_offpeak</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={selectedTariff?.e3_kwh ?? ""}
                                                    onChange={e => setSelectedTariff({ ...selectedTariff!, e3_kwh: e.target.value.replace(',', '.') as any })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">KWH</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Warning Box */}
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
                                <div className="text-primary mt-1">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-800 dark:text-white uppercase">Aviso de Sincronización</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                        Las modificaciones manuales en campos mapeados por <span className="text-primary">price_*</span> se bloquearán hasta la próxima conciliación de CSV para mantener la integridad del motor de cálculo.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-[#fcfdfe] dark:bg-slate-900/50 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Registro"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
