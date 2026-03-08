import { useState, useCallback } from "react";

// ─── CAMPOS QUE SE ACTUALIZAN ────────────────────────────────────────────────
const PRICE_FIELDS = [
  { key: "price_power_peak",    label: "Potencia Punta",   unit: "€/kW/año" },
  { key: "price_power_offpeak", label: "Potencia Valle",   unit: "€/kW/año" },
  { key: "price_energy_peak",   label: "Energía P1",       unit: "€/kWh" },
  { key: "price_energy_mid",    label: "Energía P2",       unit: "€/kWh" },
  { key: "price_energy_offpeak",label: "Energía P3",       unit: "€/kWh" },
  { key: "monthly_fee",         label: "Cuota mensual",    unit: "€/mes" },
];

const SOURCE_TARIFFS = [{"id":"niba-zen","provider":"Niba","name":"Zen","price_power_peak":0.097,"price_power_offpeak":0.047,"price_energy_peak":0.118,"price_energy_mid":0.118,"price_energy_offpeak":0.118,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://niba.es/luz-y-gas","logo_url":"/logos/Nibav1.png"},{"id":"niba-tres","provider":"Niba","name":"Tres","price_power_peak":0.097,"price_power_offpeak":0.047,"price_energy_peak":0.195,"price_energy_mid":0.116,"price_energy_offpeak":0.079,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://niba.es/luz-y-gas","logo_url":"/logos/Nibav1.png"},{"id":"octopus-relax","provider":"Octopus","name":"Relax","price_power_peak":0.097,"price_power_offpeak":0.027,"price_energy_peak":0.122,"price_energy_mid":0.122,"price_energy_offpeak":0.122,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://octopusenergy.es/precios","logo_url":"/logos/Octopus.png"},{"id":"imagina-sin-horas","provider":"Imagina","name":"Tarifa base Sin Horas","price_power_peak":0.087,"price_power_offpeak":0.044,"price_energy_peak":0.105,"price_energy_mid":0.105,"price_energy_offpeak":0.105,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://ofertas.imaginaenergia.com/plan-online-imagina/","logo_url":"/logos/Imaginaenergia.png"},{"id":"imagina-noches-findes","provider":"Imagina","name":"Tarifa base Noches y Findes","price_power_peak":0.101,"price_power_offpeak":0.022,"price_energy_peak":0.177,"price_energy_mid":0.103,"price_energy_offpeak":0.069,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://ofertas.imaginaenergia.com/plan-online-imagina/","logo_url":"/logos/Imaginaenergia.png"},{"id":"visalia-fijo-24h","provider":"Doméstica - Visalia","name":"Luz Fijo 24h","price_power_peak":0.060274,"price_power_offpeak":0.060274,"price_energy_peak":0.101995,"price_energy_mid":0.101995,"price_energy_offpeak":0.101995,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://visalia.es/luz/fijo24horas/","logo_url":"/logos/Visalia.png"},{"id":"repsol-ahorro-plus","provider":"Repsol","name":"Ahorro Plus","price_power_peak":0.068219,"price_power_offpeak":0.068219,"price_energy_peak":0.1299,"price_energy_mid":0.1299,"price_energy_offpeak":0.1299,"monthly_fee":0,"is_green":false,"has_commitment":true,"url":"https://www.repsol.es/particulares/hogar/luz-y-gas/tarifas/tarifa-ahorro-plus/","logo_url":"/logos/Repsol.svg"},{"id":"repsol-solar-bateria","provider":"Repsol","name":"Solar con Batería Virtual","price_power_peak":0.068219,"price_power_offpeak":0.068219,"price_energy_peak":0.1499,"price_energy_mid":0.1499,"price_energy_offpeak":0.1499,"monthly_fee":0,"is_green":false,"has_commitment":true,"url":"https://www.repsol.es/particulares/hogar/luz-y-gas/tarifas-luz/","logo_url":"/logos/Repsol.svg"},{"id":"nufri-con-horarios","provider":"Energía Nufri","name":"Con Horarios","price_power_peak":0.089601,"price_power_offpeak":0.034864,"price_energy_peak":0.194233,"price_energy_mid":0.119194,"price_energy_offpeak":0.08666,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.energianufri.com/es/landing/mas-tarifas-luz-gas","logo_url":"/logos/Energianufri.png"},{"id":"nufri-sin-horarios","provider":"Energía Nufri","name":"Sin Horarios","price_power_peak":0.089601,"price_power_offpeak":0.034864,"price_energy_peak":0.129492,"price_energy_mid":0.129492,"price_energy_offpeak":0.129492,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.energianufri.com/es/landing/mas-tarifas-luz-gas","logo_url":"/logos/Energianufri.png"},{"id":"nufri-flex","provider":"Energía Nufri","name":"Flex","price_power_peak":0.094533,"price_power_offpeak":0.046371,"price_energy_peak":0.165812,"price_energy_mid":0.090774,"price_energy_offpeak":0.058239,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.energianufri.com/es/landing/mas-tarifas-luz-gas","logo_url":"/logos/Energianufri.png"},{"id":"nufri-calma","provider":"Energía Nufri","name":"Calma","price_power_peak":0.094533,"price_power_offpeak":0.046371,"price_energy_peak":0.101072,"price_energy_mid":0.101072,"price_energy_offpeak":0.101072,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.energianufri.com/es/landing/mas-tarifas-luz-gas","logo_url":"/logos/Energianufri.png"},{"id":"iberdrola-online-3","provider":"Iberdrola","name":"Plan Online Tres Periodos","price_power_peak":0.091074,"price_power_offpeak":0.013483,"price_energy_peak":0.194,"price_energy_mid":0.136,"price_energy_offpeak":0.09999,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.iberdrola.es/luz/plan-online-tres-periodos","logo_url":"/logos/Iberdrola.svg"},{"id":"iberdrola-online-1","provider":"Iberdrola","name":"Plan Online","price_power_peak":0.108192,"price_power_offpeak":0.057507,"price_energy_peak":0.1099,"price_energy_mid":0.1099,"price_energy_offpeak":0.1099,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.iberdrola.es/luz/plan-online","logo_url":"/logos/Iberdrola.svg"},{"id":"endesa-conecta","provider":"Endesa","name":"Conecta Endesa","price_power_peak":0.094966,"price_power_offpeak":0.094966,"price_energy_peak":0.0999,"price_energy_mid":0.0999,"price_energy_offpeak":0.0999,"monthly_fee":0,"is_green":false,"has_commitment":false,"url":"https://www.endesa.com/es/luz-y-gas/luz/conecta-de-endesa","logo_url":"/logos/Endesa.svg"},{"id":"endesa-one-promo","provider":"Endesa","name":"One Luz Promo","price_power_peak":0.094966,"price_power_offpeak":0.094966,"price_energy_peak":0.121223,"price_energy_mid":0.121223,"price_energy_offpeak":0.121223,"monthly_fee":0,"is_green":false,"has_commitment":false,"url":"https://www.endesa.com/es/luz-y-gas/luz/one/tarifa-one-luz","logo_url":"/logos/Endesa.svg"},{"id":"endesa-one-3","provider":"Endesa","name":"One Tres Periodos","price_power_peak":0.090214,"price_power_offpeak":0.090214,"price_energy_peak":0.1476,"price_energy_mid":0.0792,"price_energy_offpeak":0.0558,"monthly_fee":0,"is_green":false,"has_commitment":false,"url":"https://www.endesa.com/es/luz-y-gas/luz/one/tarifa-one-luz-3periodos","logo_url":"/logos/Endesa.svg"},{"id":"naturgy-noche","provider":"Naturgy","name":"Tarifa Noche","price_power_peak":0.12303,"price_power_offpeak":0.037337,"price_energy_peak":0.1802,"price_energy_mid":0.1072,"price_energy_offpeak":0.0718,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.naturgy.es/hogar/luz/tarifa_noche","logo_url":"/logos/Naturgy.svg"},{"id":"energyavm-fija-3","provider":"Energya VM","name":"Formula Fija 3 Periodos Luz","price_power_peak":0.083333,"price_power_offpeak":0.002776,"price_energy_peak":0.16605,"price_energy_mid":0.13005,"price_energy_offpeak":0.10305,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.energyavm.es/luz/formula-fija-3-periodos-luz/","logo_url":"/logos/Energiavm.png"},{"id":"energyavm-24h","provider":"Energya VM","name":"Formula 24h","price_power_peak":0.09444,"price_power_offpeak":0.04722,"price_energy_peak":0.105705,"price_energy_mid":0.105705,"price_energy_offpeak":0.105705,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.energyavm.es/","logo_url":"/logos/Energiavm.png"},{"id":"total-ahorro","provider":"Total Energies","name":"A tu Aire Luz Ahorro","price_power_peak":0.072603,"price_power_offpeak":0.072575,"price_energy_peak":0.173572,"price_energy_mid":0.10393,"price_energy_offpeak":0.076176,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.totalenergies.es/es/hogares/tarifas-luz/a-tu-aire-ahorro","logo_url":"/logos/TotalEnergies.svg"},{"id":"total-siempre","provider":"Total Energies","name":"A tu Aire Luz Siempre","price_power_peak":0.145178,"price_power_offpeak":0.145178,"price_energy_peak":0.1099,"price_energy_mid":0.1099,"price_energy_offpeak":0.1099,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.totalenergies.es/es/hogares/tarifas-luz/a-tu-aire-siempre","logo_url":"/logos/TotalEnergies.svg"},{"id":"chc-vehiculo","provider":"CHC Energía","name":"Plan Vehículo Eléctrico","price_power_peak":0.088956,"price_power_offpeak":0.088382,"price_energy_peak":0.224003,"price_energy_mid":0.224003,"price_energy_offpeak":0.059339,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://www.chcenergia.es/","logo_url":"/logos/Chcenergia.png"},{"id":"esluz-solar","provider":"Esluz","name":"Tarifa Solar 2.0","price_power_peak":0.080533,"price_power_offpeak":0.007407,"price_energy_peak":0.187021,"price_energy_mid":0.135066,"price_energy_offpeak":0.085298,"monthly_fee":0,"is_green":true,"has_commitment":false,"url":"https://esluz.es/tarifa-solar-2-0/","logo_url":"/logos/Esluz.png"},{"id":"pvpc-regulado","provider":"Comercializadoras de Referencia","name":"PVPC - Mercado Regulado","price_power_peak":0.0844,"price_power_offpeak":0.002,"price_energy_peak":0.1709,"price_energy_mid":0.1019,"price_energy_offpeak":0.0839,"monthly_fee":0,"is_green":false,"has_commitment":false,"url":"https://sede.cnmc.gob.es/listado/censo/10","logo_url":"/logo-app/Logo.png"}];

function today() { return new Date().toISOString().split("T")[0]; }

function pct(oldVal, newVal) {
  if (!oldVal || oldVal === 0) return null;
  return ((newVal - oldVal) / oldVal * 100).toFixed(1);
}

function diffColor(p) {
  if (p === null) return "#475569";
  const n = parseFloat(p);
  if (n > 1) return "#f87171";
  if (n < -1) return "#4ade80";
  return "#facc15";
}

async function fetchTariffWithClaude(tariff) {
  const isFlat = tariff.price_energy_peak === tariff.price_energy_mid &&
                 tariff.price_energy_mid === tariff.price_energy_offpeak;

  const prompt = `Busca en internet los precios actuales vigentes de la tarifa de electricidad "${tariff.name}" del proveedor "${tariff.provider}" en España.

URL oficial: ${tariff.url}

Valores actuales en mi base de datos (hace ~1 semana):
- price_energy_peak (P1/punta): ${tariff.price_energy_peak} €/kWh
- price_energy_mid (P2/llano): ${tariff.price_energy_mid} €/kWh
- price_energy_offpeak (P3/valle): ${tariff.price_energy_offpeak} €/kWh
- price_power_peak (potencia punta): ${tariff.price_power_peak} €/kW/año
- price_power_offpeak (potencia valle): ${tariff.price_power_offpeak} €/kW/año
- monthly_fee: ${tariff.monthly_fee} €/mes

${isFlat
  ? "Esta es una tarifa PLANA (mismo precio 24h). price_energy_mid y price_energy_offpeak deben ser iguales a price_energy_peak."
  : "Esta tarifa tiene DISCRIMINACIÓN HORARIA. Busca los 3 precios distintos (P1/P2/P3)."}

Reglas:
- Extrae precios SIN IVA
- Si no encuentras un valor con certeza, devuelve null (no inventes)
- confidence: "high" si los encontraste en la web directamente, "medium" si los infiriste, "low" si no estás seguro

Responde SOLO con JSON válido sin markdown:
{
  "price_power_peak": null,
  "price_power_offpeak": null,
  "price_energy_peak": null,
  "price_energy_mid": null,
  "price_energy_offpeak": null,
  "monthly_fee": null,
  "confidence": "high",
  "notes": ""
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function Badge({ status }) {
  const cfg = {
    idle:    { label: "Pendiente",   bg: "#1e293b", fg: "#334155" },
    skip:    { label: "Omitida",     bg: "#111827", fg: "#1f2937" },
    loading: { label: "Consultando", bg: "#0f2d4a", fg: "#38bdf8" },
    done:    { label: "Consultada",  bg: "#052e16", fg: "#4ade80" },
    error:   { label: "Error",       bg: "#3b0000", fg: "#f87171" },
  }[status] || { label: status, bg: "#1e293b", fg: "#94a3b8" };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".06em", fontFamily: "monospace",
      padding: "2px 8px", borderRadius: 99, background: cfg.bg, color: cfg.fg, border: `1px solid ${cfg.fg}44` }}>
      {cfg.label}
    </span>
  );
}

function DiffRow({ field, oldVal, newVal, accepted, onToggle }) {
  if (newVal === null || newVal === undefined) return null;
  const changed = Math.abs((newVal - oldVal) / (oldVal || 1)) > 0.0001;
  const p = changed ? pct(oldVal, newVal) : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0",
      borderBottom: "1px solid #0c1220", opacity: accepted ? 1 : 0.35 }}>
      <input type="checkbox" checked={accepted} onChange={onToggle}
        style={{ accentColor: "#38bdf8", cursor: "pointer", width: 14, height: 14, flexShrink: 0 }} />
      <span style={{ width: 130, fontSize: 12, color: "#64748b", flexShrink: 0 }}>{field.label}</span>
      <span style={{ fontSize: 11, color: "#334155", fontFamily: "monospace",
        textDecoration: changed ? "line-through" : "none", minWidth: 80 }}>
        {oldVal?.toFixed(6)} {field.unit}
      </span>
      {changed ? (
        <>
          <span style={{ color: "#1e293b", fontSize: 12 }}>→</span>
          <span style={{ fontSize: 12, fontFamily: "monospace", color: diffColor(p), fontWeight: 700 }}>
            {newVal?.toFixed(6)} {field.unit}
          </span>
          <span style={{ fontSize: 10, color: diffColor(p), background: diffColor(p) + "18",
            border: `1px solid ${diffColor(p)}33`, padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", marginLeft: 4 }}>
            {p > 0 ? "+" : ""}{p}%
          </span>
        </>
      ) : (
        <span style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace" }}>sin cambios</span>
      )}
    </div>
  );
}

export default function App() {
  const [tariffs, setTariffs]       = useState(SOURCE_TARIFFS.map(t => ({ ...t })));
  const [statuses, setStatuses]     = useState(() => Object.fromEntries(SOURCE_TARIFFS.map(t => [t.id, "idle"])));
  const [fetched, setFetched]       = useState({});
  const [accepted, setAccepted]     = useState({});
  const [log, setLog]               = useState([]);
  const [running, setRunning]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [tab, setTab]               = useState("estado");
  const [skipPvpc, setSkipPvpc]     = useState(true);

  const addLog = useCallback((msg, type = "info") => {
    setLog(l => [...l, { ts: new Date().toLocaleTimeString("es-ES"), msg, type }]);
  }, []);

  function initAccepted(id, result) {
    const acc = {};
    PRICE_FIELDS.forEach(f => { acc[f.key] = result[f.key] !== null && result[f.key] !== undefined; });
    setAccepted(prev => ({ ...prev, [id]: acc }));
  }

  function toggleField(id, key) {
    setAccepted(prev => ({ ...prev, [id]: { ...prev[id], [key]: !prev[id][key] } }));
  }

  function applyTariff(id) {
    const result = fetched[id];
    const acc = accepted[id] || {};
    setTariffs(prev => prev.map(t => {
      if (t.id !== id) return t;
      const u = { ...t };
      PRICE_FIELDS.forEach(f => {
        if (acc[f.key] && result[f.key] !== null && result[f.key] !== undefined) u[f.key] = result[f.key];
      });
      return u;
    }));
    addLog(`✅ Cambios aplicados a "${id}"`, "success");
  }

  function applyAll() {
    Object.keys(fetched).forEach(id => applyTariff(id));
    addLog("✅ Todos los cambios aplicados", "success");
  }

  async function runPipeline() {
    setRunning(true);
    setProgress(0);
    setFetched({});
    setAccepted({});
    setLog([]);
    setStatuses(Object.fromEntries(SOURCE_TARIFFS.map(t => [t.id, "idle"])));

    const queue = tariffs.filter(t => !(skipPvpc && t.id === "pvpc-regulado"));
    addLog(`🚀 Pipeline iniciado — ${queue.length} tarifas a consultar`);

    for (let i = 0; i < queue.length; i++) {
      const t = queue[i];
      setStatuses(prev => ({ ...prev, [t.id]: "loading" }));
      addLog(`🤖 [${i + 1}/${queue.length}] ${t.provider} · ${t.name}`);
      try {
        const result = await fetchTariffWithClaude(t);
        setFetched(prev => ({ ...prev, [t.id]: result }));
        initAccepted(t.id, result);
        setStatuses(prev => ({ ...prev, [t.id]: "done" }));
        const changes = PRICE_FIELDS.filter(f =>
          result[f.key] !== null && Math.abs((result[f.key] - t[f.key]) / (t[f.key] || 1)) > 0.0001
        );
        addLog(
          changes.length > 0
            ? `  ↳ ${changes.length} campo(s) con cambios — confianza: ${result.confidence}`
            : `  ↳ Sin cambios detectados`,
          changes.length > 0 ? "warn" : "info"
        );
        if (result.notes) addLog(`  ↳ Nota: ${result.notes}`, "info");
      } catch (e) {
        setStatuses(prev => ({ ...prev, [t.id]: "error" }));
        addLog(`  ↳ Error: ${e.message}`, "error");
      }
      setProgress(Math.round(((i + 1) / queue.length) * 100));
      if (i < queue.length - 1) await new Promise(r => setTimeout(r, 1500));
    }

    if (skipPvpc) setStatuses(prev => ({ ...prev, "pvpc-regulado": "skip" }));
    addLog(`✅ Completado — revisa los diffs y exporta el JSON`, "success");
    setTab("diffs");
    setRunning(false);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ tariffs }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tariffs_${today()}.json`;
    a.click();
  }

  const totalDone    = Object.values(statuses).filter(s => s === "done").length;
  const totalErrors  = Object.values(statuses).filter(s => s === "error").length;
  const totalChanges = Object.entries(fetched).reduce((sum, [id, r]) => {
    const t = tariffs.find(x => x.id === id);
    return sum + PRICE_FIELDS.filter(f =>
      r[f.key] !== null && t && Math.abs((r[f.key] - t[f.key]) / (t[f.key] || 1)) > 0.0001
    ).length;
  }, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", color: "#e2e8f0",
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontSize: 14 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px } ::-webkit-scrollbar-track { background: #0c1220 }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px }
        .row:hover { background: #0c1422 !important }
        .tab { background: none; border: none; cursor: pointer; padding: 10px 18px;
          font-family: inherit; font-size: 11px; font-weight: 600; letter-spacing: .06em;
          text-transform: uppercase; transition: all .15s; border-bottom: 2px solid transparent }
        .tab.on  { color: #38bdf8; border-color: #38bdf8 }
        .tab.off { color: #1e293b }
        .tab.off:hover { color: #475569 }
        .btn { border: none; cursor: pointer; font-family: inherit; font-weight: 600;
          font-size: 12px; border-radius: 7px; padding: 8px 18px; transition: all .2s }
        .btn:disabled { opacity: .3; cursor: not-allowed }
        .btn-blue  { background: linear-gradient(135deg,#0ea5e9,#2563eb); color: #fff }
        .btn-blue:hover:not(:disabled)  { box-shadow: 0 4px 16px #0ea5e940; transform: translateY(-1px) }
        .btn-ghost { background: none; border: 1px solid #1e293b; color: #475569 }
        .btn-ghost:hover:not(:disabled) { border-color: #334155; color: #94a3b8 }
        .btn-green { background: #052e16; border: 1px solid #166534; color: #4ade80 }
        .btn-green:hover:not(:disabled) { background: #064e3b }
        .card { background: #0c1220; border: 1px solid #1a2540; border-radius: 12px }
        .scan { animation: scan 1.4s ease-in-out infinite }
        @keyframes scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }
        .pulse { animation: pulse 2s infinite }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .fade { animation: fade .35s ease }
        @keyframes fade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#090d18", borderBottom: "1px solid #141c2e",
        padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%",
            background: running ? "#4ade80" : "#1e293b",
            boxShadow: running ? "0 0 12px #4ade80" : "none" }} className={running ? "pulse" : ""} />
          <div>
            <div style={{ fontSize: 10, color: "#334155", letterSpacing: ".1em", fontFamily: "monospace", textTransform: "uppercase" }}>
              tariffs.json · {tariffs.length} tarifas · PVPC manual
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", letterSpacing: "-.02em" }}>
              Pipeline Actualizador de Tarifas
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#334155", cursor: "pointer" }}>
            <input type="checkbox" checked={skipPvpc} onChange={e => setSkipPvpc(e.target.checked)}
              style={{ accentColor: "#38bdf8" }} />
            Omitir PVPC
          </label>
          <button className="btn btn-ghost" onClick={exportJSON} disabled={running}>↓ Exportar JSON</button>
          <button className="btn btn-green" onClick={applyAll}
            disabled={running || Object.keys(fetched).length === 0}>✓ Aplicar todos</button>
          <button className="btn btn-blue" onClick={runPipeline} disabled={running}>
            {running ? `⟳  ${progress}%` : "▶  Ejecutar Pipeline"}
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ height: 3, background: "#0c1220" }}>
        <div style={{ height: "100%", width: `${progress}%`, transition: "width .4s",
          background: "linear-gradient(90deg,#0ea5e9,#6366f1)", boxShadow: "0 0 8px #0ea5e950" }} />
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid #0c1220" }}>
        {[
          { label: "Total",       val: tariffs.length, color: "#38bdf8" },
          { label: "Consultadas", val: totalDone,       color: "#4ade80" },
          { label: "Cambios",     val: totalChanges,    color: "#facc15" },
          { label: "Errores",     val: totalErrors,     color: "#f87171" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "10px 22px", borderRight: i < 3 ? "1px solid #0c1220" : "none",
            display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 11, color: "#334155" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ borderBottom: "1px solid #0c1220", paddingLeft: 18 }}>
        {[["estado","Estado"], ["diffs","Diffs"], ["log","Log"]].map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? "on" : "off"}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 24px" }}>

        {/* ── ESTADO ── */}
        {tab === "estado" && (
          <div className="card fade" style={{ overflow: "hidden" }}>
            {tariffs.map((t, i) => {
              const st = statuses[t.id];
              const res = fetched[t.id];
              const changes = res ? PRICE_FIELDS.filter(f =>
                res[f.key] !== null && Math.abs((res[f.key] - t[f.key]) / (t[f.key] || 1)) > 0.0001
              ).length : 0;
              return (
                <div key={t.id} className="row" style={{ display: "flex", alignItems: "center",
                  padding: "10px 18px", borderBottom: i < tariffs.length - 1 ? "1px solid #0a0f1a" : "none",
                  transition: "background .15s" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{t.provider}</span>
                    <span style={{ color: "#334155", marginLeft: 6 }}>· {t.name}</span>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "#1e293b", marginRight: 10 }}>
                    P1: {t.price_energy_peak.toFixed(4)}
                  </span>
                  {st === "loading" && (
                    <div style={{ width: 60, height: 2, background: "#1e293b", borderRadius: 2, marginRight: 12, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "50%", background: "#38bdf8" }} className="scan" />
                    </div>
                  )}
                  {changes > 0 && (
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: "#facc15",
                      background: "#2d1f0060", border: "1px solid #78350f55", borderRadius: 6,
                      padding: "1px 7px", marginRight: 8 }}>
                      {changes} cambio{changes > 1 ? "s" : ""}
                    </span>
                  )}
                  <Badge status={st} />
                </div>
              );
            })}
          </div>
        )}

        {/* ── DIFFS ── */}
        {tab === "diffs" && (
          <div className="fade" style={{ display: "grid", gap: 10 }}>
            {Object.keys(fetched).length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#1e293b" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⚡</div>
                Ejecuta el pipeline para ver los diffs
              </div>
            ) : tariffs.filter(t => fetched[t.id]).map(t => {
              const result = fetched[t.id];
              const acc = accepted[t.id] || {};
              const changes = PRICE_FIELDS.filter(f =>
                result[f.key] !== null && Math.abs((result[f.key] - t[f.key]) / (t[f.key] || 1)) > 0.0001
              );
              const confColor = { high: "#4ade80", medium: "#facc15", low: "#f87171" }[result.confidence] || "#475569";
              return (
                <div key={t.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{t.provider}</span>
                      <span style={{ color: "#334155" }}>· {t.name}</span>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: confColor,
                        background: confColor + "18", border: `1px solid ${confColor}33`,
                        padding: "1px 7px", borderRadius: 4 }}>
                        {result.confidence}
                      </span>
                      {changes.length === 0 && (
                        <span style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace" }}>sin cambios</span>
                      )}
                    </div>
                    <button className="btn btn-green" style={{ fontSize: 11, padding: "5px 12px" }}
                      onClick={() => applyTariff(t.id)}>
                      Aplicar
                    </button>
                  </div>
                  {PRICE_FIELDS.map(f => (
                    <DiffRow key={f.key} field={f}
                      oldVal={t[f.key]} newVal={result[f.key]}
                      accepted={acc[f.key] ?? false}
                      onToggle={() => toggleField(t.id, f.key)} />
                  ))}
                  {result.notes && (
                    <div style={{ marginTop: 10, fontSize: 11, color: "#475569", fontStyle: "italic",
                      background: "#0a0f1a", borderRadius: 6, padding: "7px 10px" }}>
                      📝 {result.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── LOG ── */}
        {tab === "log" && (
          <div className="fade" style={{ background: "#050810", border: "1px solid #1a2540",
            borderRadius: 12, padding: "14px 18px", fontFamily: "monospace", fontSize: 12,
            maxHeight: 480, overflowY: "auto" }}>
            {log.length === 0
              ? <span style={{ color: "#1e293b" }}>$ esperando ejecución…</span>
              : log.map((l, i) => (
                <div key={i} style={{ marginBottom: 3,
                  color: l.type === "success" ? "#4ade80" : l.type === "warn" ? "#fbbf24" : l.type === "error" ? "#f87171" : "#334155" }}>
                  <span style={{ color: "#1e293b" }}>[{l.ts}]</span> {l.msg}
                </div>
              ))
            }
          </div>
        )}
      </div>

      <div style={{ padding: "10px 24px", borderTop: "1px solid #0a0f1a",
        fontSize: 10, color: "#1e293b", fontFamily: "monospace", display: "flex", justifyContent: "space-between" }}>
        <span>Claude API · web_search · PVPC manual · {tariffs.length} tarifas</span>
        <span>{today()}</span>
      </div>
    </div>
  );
}
