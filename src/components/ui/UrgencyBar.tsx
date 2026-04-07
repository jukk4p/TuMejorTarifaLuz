import { Zap, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { getElectricityPrices, ApiPriceData } from "@/lib/energy-prices";

// Mejora 1: Lógica para determinar la etiqueta de zona horaria
function getPriceZoneLabel(currentPrice: number, avgPrice: number, peakPrice: number): {
  label: string
  className: string
} {
  if (currentPrice >= peakPrice * 0.9) {
    return { label: 'Hora punta · precio máximo', className: 'text-red-400' }
  }
  if (currentPrice <= avgPrice * 0.85) {
    return { label: 'Hora valle · buen momento', className: 'text-green-400' }
  }
  return { label: 'Precio normal', className: 'text-slate-400' }
}

// Mejora 2: Copy de urgencia dinámico
function getUrgencyCopy(currentPrice: number, avgPrice: number, peakHour: number): {
  headline: string
  subtext: string
} {
  const isPeak = currentPrice >= avgPrice * 1.2

  if (isPeak) {
    return {
      headline: '¿Sabes cuánto te cuesta esta hora con tu tarifa actual?',
      subtext: `Estás en la hora más cara del día. Con una tarifa fija pagarías lo mismo a las 3h.`,
    }
  }

  return {
    headline: 'Ahora mismo la luz está barata — ¿tu tarifa lo aprovecha?',
    subtext: `El precio llega a su máximo a las ${String(peakHour).padStart(2,'0')}:00. Comprueba si tu tarifa te protege.`,
  }
}

// Mejora 3: Mini-chart de 24 barras
function MiniChart({
  prices,
  currentHour,
  peakPrice,
  avgPrice,
}: {
  prices: ApiPriceData[]
  currentHour: number
  peakPrice: number
  avgPrice: number
}) {
  const sorted = [...prices].sort((a, b) => a.hour - b.hour)

  return (
    <div className="flex items-end gap-[3px] h-8 px-5 border-l border-r border-white/5 mx-2">
      {sorted.map(({ hour, value }) => {
        const isNow = hour === currentHour
        const heightPct = Math.round((value / peakPrice) * 100)

        let barColor = 'bg-green-500/60'
        if (value >= peakPrice * 0.85) barColor = 'bg-red-400/80'
        else if (value >= avgPrice * 1.1) barColor = 'bg-amber-400/70'
        if (isNow) barColor = 'bg-primary' // primary color for current hour

        return (
          <div key={hour} className="flex flex-col items-center gap-[3px]">
            <div
              className={`w-[8px] sm:w-[10px] rounded-t-[1.5px] ${barColor} transition-all duration-500`}
              style={{ height: `${Math.max(heightPct * 0.35, 4)}px` }}
            />
            <span className={`text-[8px] leading-none select-none transition-colors ${
              isNow ? 'text-primary font-bold' : 'text-transparent'
            }`}>
              {isNow ? String(hour).padStart(2, '0') : '.'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default async function UrgencyBar() {
  const prices = await getElectricityPrices();
  if (!prices || !prices.allHours) return null;

  const currentHour = parseInt(prices.time.split(":")[0]) || 0;
  const peakHourNum = parseInt(prices.maxHour.split(":")[0]) || 19;
  
  const zone = getPriceZoneLabel(prices.current, prices.average, prices.max);
  const copy = getUrgencyCopy(prices.current, prices.average, peakHourNum);

  return (
    <div className="bg-[#0F1923] border-y border-white/5 py-5 relative overflow-hidden group">
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10 px-2 lg:px-4">
          
          {/* Mejora 1: Precio actual + Zone Label */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
                <Zap size={24} className="text-primary opacity-90" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest leading-none mb-2">Precio ahora</span>
                <span className="text-2xl lg:text-3xl font-900 text-[#F1F5F9] tracking-tight leading-none">
                  {prices.current.toFixed(4)}
                  <span className="ml-2 text-xs text-[#94A3B8] font-bold uppercase tracking-tighter">€/kWh</span>
                </span>
                <p className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${zone.className}`}>
                  {zone.label}
                </p>
              </div>
            </div>

            {/* Mejora 3: MiniChart (hidden on mobile) */}
            <div className="hidden lg:flex items-center">
              <MiniChart 
                prices={prices.allHours}
                currentHour={currentHour}
                peakPrice={prices.max}
                avgPrice={prices.average}
              />
            </div>
          </div>

          {/* Mejora 2: Copy de urgencia (hidden on mobile) */}
          <div className="flex-1 px-5 hidden md:block max-w-lg">
            <p className="text-[14px] lg:text-[15px] font-bold text-[#F1F5F9] leading-tight mb-1.5">
              {copy.headline}
            </p>
            <p className="text-[11px] lg:text-[12px] text-[#CBD5E1] font-medium leading-snug">
              {copy.subtext}{' '}
              <Link href="/precio-luz-hoy" className="text-primary hover:text-primary-hover font-bold transition-colors inline-flex items-center gap-1 group/link">
                Ver detalle horario <ArrowRight size={10} className="transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </p>
          </div>

          {/* Mejora 4 & 5: CTAs */}
          <div className="flex flex-col items-center md:items-end gap-2.5 w-full md:w-auto shrink-0">
            {/* Botón principal */}
            <Link 
              href="/comparador?mode=upload" 
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 lg:px-10 py-4 bg-primary text-white font-semibold text-[13px] rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-center"
            >
              Comparar mi tarifa
              <ArrowRight size={18} />
            </Link>

            {/* Enlace secundario */}
            <Link
              href="/precio-luz-hoy"
              className="flex items-center gap-2 text-[11px] font-bold text-[#94A3B8] hover:text-[#F1F5F9] transition-colors whitespace-nowrap px-4 py-1"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="6" cy="6" r="4"/>
                <path d="M6 4v2l1.5 1"/>
              </svg>
              Ver precio hora a hora
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
