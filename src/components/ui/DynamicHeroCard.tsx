"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, TrendingDown, History } from "lucide-react";
import { getLogoPath } from "@/lib/tariffs";

interface ComparisonData {
  timestamp: number;
  current: {
    company: string;
    price: number;
    logo: string | null;
  };
  recommended: {
    company: string;
    name: string;
    price: number; shade?: string;
    savings: number;
    savingsPct: number;
    logo: string | null;
  };
}

export default function DynamicHeroCard() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("tmtl_last_comparison");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Expiration check: 24h
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setData(parsed);
        }
      } catch (e) {
        console.error("Error parsing hero data:", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="relative group/hero-img py-6 md:py-12 animate-pulse">
        <div className="relative glass-card premium-shadow rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col w-full max-w-[640px] mx-auto lg:ml-auto h-[480px] bg-white/5 shadow-2xl"></div>
    </div>
  );

  // If no data, show original static preview
  if (!data) {
    return (
      <div className="relative group/hero-img py-6 md:py-12 text-left">
        <div className="absolute -top-16 -right-16 w-64 md:w-[500px] h-64 md:h-[500px] bg-primary/20 rounded-full blur-[100px] md:blur-[140px] animate-pulse"></div>
        <div className="absolute -bottom-16 -left-16 w-48 md:w-96 h-48 md:h-96 bg-accent/15 rounded-full blur-[80px] md:blur-[100px] animate-pulse delay-700"></div>
        
        <div 
          className="relative glass-card premium-shadow rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col w-full max-w-[640px] mx-auto lg:ml-auto" style={{ backgroundColor: 'var(--section-white-alpha)' }}
        >
           <div 
            className="px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6 md:pb-8 flex items-center justify-between"
            style={{ background: 'linear-gradient(to bottom, rgba(var(--primary-rgb), 0.05), transparent)' }}
           >
             <div className="space-y-1 md:space-y-1.5">
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--color-text-subtle)' }}>Tu potencial de</p>
                <p className="text-xs sm:text-sm md:text-[18px] font-black uppercase tracking-[0.12em] flex items-center gap-2" style={{ color: 'var(--color-text-heading)' }}>
                  Ahorro real
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </p>
             </div>
             <div 
              className="px-3 md:px-4 py-1.5 md:py-2 border border-savings/25 rounded-full flex items-center gap-1.5 md:gap-2.5"
              style={{ background: 'var(--color-savings-bg)' }}
             >
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full animate-pulse" style={{ background: 'var(--color-savings-text)' }}></div>
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-savings-text)' }}>Optimizado hoy</span>
             </div>
           </div>

           <div className="w-full h-px bg-border/40 dark:bg-white/10"></div>

           <div className="p-5 sm:p-8 md:p-10 space-y-6 md:space-y-10">
             <div className="flex items-start justify-between gap-3 sm:gap-6 relative">
                <div className="flex-1 space-y-3 md:space-y-5 text-center">
                   <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Tarifa actual</p>
                   <div className="space-y-3 md:space-y-4">
                      <div className="mx-auto h-14 md:h-20 w-32 md:w-40 bg-surface border border-border/50 rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-sm group-hover:shadow-md transition-all duration-300">
                         <Image 
                           src="/logos/Iberdrola.png" 
                           alt="Iberdrola" 
                           width={120} 
                           height={40} 
                           className="object-contain max-h-full scale-[1.6]"
                           unoptimized
                         />
                      </div>
                      <p className="text-[10px] md:text-[13px] font-bold tracking-tight" style={{ color: 'var(--color-text-muted)' }}>Plan Estable</p>
                   </div>
                   <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                      <span className="text-xl sm:text-3xl md:text-4xl font-900 tracking-tight" style={{ color: 'var(--color-text-heading)' }}>0,162</span>
                      <span className="text-[9px] md:text-sm font-bold opacity-60" style={{ color: 'var(--color-text-muted)' }}>€/kWh*</span>
                   </div>
                </div>

                <div className="absolute left-1/2 top-[52px] md:top-[75px] -translate-x-1/2 -translate-y-1/2 z-20">
                   <div className="w-12 h-12 md:w-24 md:h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(var(--primary-rgb),0.4)] border-4 border-white/20 dark:border-white/10 transition-transform hover:scale-110 active:scale-95 cursor-pointer">
                      <ArrowRight size={32} className="md:w-12 md:h-12 stroke-[3]" />
                   </div>
                </div>

                <div className="flex-1 space-y-3 md:space-y-5 text-center">
                   <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-savings-text)' }}>Recomendada</p>
                   <div className="space-y-3 md:space-y-4">
                      <div className="mx-auto h-14 md:h-20 w-32 md:w-40 bg-white dark:bg-white/5 border border-border/50 rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-sm group-hover:shadow-md transition-all duration-300">
                         <Image 
                           src="/logos/Visalia.png" 
                           alt="Visalia" 
                           width={100} 
                           height={40} 
                           className="object-contain max-h-full scale-110"
                           unoptimized
                         />
                      </div>
                      <p className="text-[10px] md:text-[13px] font-bold tracking-tight" style={{ color: 'var(--color-text-muted)' }}>Luz Fijo 24h</p>
                   </div>
                   <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                      <span className="text-xl sm:text-3xl md:text-4xl font-900 tracking-tight" style={{ color: 'var(--color-savings-text)' }}>0,098</span>
                      <span className="text-[9px] md:text-sm font-bold opacity-60" style={{ color: 'var(--color-text-muted)' }}>€/kWh*</span>
                   </div>
                </div>
             </div>

             <div 
              className="rounded-2xl md:rounded-[2rem] p-5 md:p-8 flex items-center justify-between gap-4 relative overflow-hidden group/savings border premium-shadow transition-all duration-500 hover:border-savings/40"
              style={{ background: 'var(--color-savings-bg)', borderColor: 'var(--color-savings-text)' }}
             >
                <div className="absolute inset-0 bg-gradient-to-r from-savings/10 to-transparent -translate-x-full group-hover/savings:translate-x-full transition-transform duration-1000"></div>
                <div className="space-y-2 relative z-10 text-left">
                   <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] leading-none" style={{ color: 'var(--color-savings-text)' }}>Ahorro estimado anual</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-5xl font-900 tracking-tighter drop-shadow-sm" style={{ color: 'var(--color-accent)' }}>339,24€</span>
                      <span className="text-sm md:text-base font-black opacity-60" style={{ color: 'var(--color-accent)' }}>/ año</span>
                   </div>
                </div>
                <div 
                  className="px-5 py-3 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-center flex items-center gap-2.5 shrink-0 relative z-10 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-all duration-300"
                >
                   <span className="text-2xl md:text-3xl font-900 leading-none">-34,37%</span>
                   <TrendingDown size={20} className="hidden sm:block" />
                </div>
             </div>
           </div>

           <div 
            className="px-5 sm:px-8 md:px-10 py-5 sm:py-6 md:py-8 border-t mt-auto flex items-center justify-between"
            style={{ background: 'linear-gradient(to right, var(--color-section-muted), transparent)', borderColor: 'var(--color-border)' }}
           >
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                   <History size={14} className="text-primary" />
                </div>
                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--color-text-subtle)' }}>Cálculo basado en tus datos de consumo real</p>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/hero-img py-6 md:py-12 animate-in fade-in zoom-in duration-700 text-left">
      <div className="absolute -top-16 -right-16 w-64 md:w-[500px] h-64 md:h-[500px] bg-primary/20 rounded-full blur-[100px] md:blur-[140px] animate-pulse"></div>
      
      <div 
        className="relative glass-card premium-shadow rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col w-full max-w-[640px] mx-auto lg:ml-auto border border-white/20 dark:border-white/5 shadow-2xl shadow-primary/5" 
        style={{ backgroundColor: 'var(--section-white-alpha)' }}
      >
         <div className="px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6 md:pb-8 flex items-center justify-between" style={{ background: 'linear-gradient(to bottom, rgba(var(--primary-rgb), 0.05), transparent)' }}>
           <div className="space-y-1 md:space-y-1.5 text-left">
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--color-text-subtle)' }}>Tu ahorro personalizado</p>
              <p className="text-xs sm:text-sm md:text-[18px] font-black uppercase tracking-[0.12em] flex items-center gap-2 text-primary">
                Análisis completado
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              </p>
           </div>
           <div className="px-3 md:px-4 py-1.5 md:py-2 border border-emerald-500/25 rounded-full flex items-center gap-1.5 md:gap-2.5 bg-emerald-500/10">
              <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Datos reales</span>
           </div>
         </div>

         <div className="w-full h-px bg-border/40"></div>

         <div className="p-5 sm:p-8 md:p-10 space-y-6 md:space-y-10">
           <div className="flex items-start justify-between gap-3 sm:gap-6 relative">
              <div className="flex-1 space-y-3 md:space-y-5 text-center">
                 <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Situación Actual</p>
                 <div className="mx-auto h-14 md:h-20 w-32 md:w-40 bg-surface border border-border/50 rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-sm bg-white dark:bg-white/5">
                    {data.current.logo ? (
                      <Image src={data.current.logo} alt={data.current.company} width={120} height={40} className="object-contain max-h-full" unoptimized />
                    ) : (
                      <span className="text-xs font-black uppercase text-text-muted">{data.current.company}</span>
                    )}
                 </div>
                 <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-heading)' }}>{data.current.price.toFixed(3)}</span>
                    <span className="text-[9px] md:text-xs font-bold opacity-60" style={{ color: 'var(--color-text-muted)' }}>€/kWh</span>
                 </div>
              </div>

              <div className="absolute left-1/2 top-[47px] md:top-[68px] -translate-x-1/2 -translate-y-1/2 z-20">
                 <div className="w-10 h-10 md:w-16 md:h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform">
                    <ArrowRight size={20} className="md:w-8 md:h-8 stroke-[3]" />
                 </div>
              </div>

              <div className="flex-1 space-y-3 md:space-y-5 text-center">
                 <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Top Recomendada</p>
                 <div className="mx-auto h-14 md:h-20 w-32 md:w-40 bg-white dark:bg-white/5 border border-primary/20 rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-md bg-white dark:bg-white/5">
                    {data.recommended.logo ? (
                      <Image src={data.recommended.logo} alt={data.recommended.company} width={100} height={40} className="object-contain max-h-full" unoptimized />
                    ) : (
                      <span className="text-xs font-black uppercase text-primary">{data.recommended.company}</span>
                    )}
                 </div>
                 <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-primary">{data.recommended.price.toFixed(3)}</span>
                    <span className="text-[9px] md:text-xs font-bold opacity-60 text-primary/60">€/kWh</span>
                 </div>
              </div>
           </div>

           <div 
            className="rounded-2xl md:rounded-[2rem] p-5 md:p-8 flex items-center justify-between gap-4 relative overflow-hidden group/savings border border-emerald-500/30 shadow-2xl transition-all duration-500 hover:scale-[1.02] text-left"
            style={{ background: 'linear-gradient(135deg, #10b98115, #10b98130)' }}
           >
              <div className="space-y-2 relative z-10">
                 <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] leading-none text-emerald-600 dark:text-emerald-400">Ahorro anual calculado</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-5xl font-900 tracking-tighter text-emerald-600 dark:text-emerald-400">
                      {data.recommended.savings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                    </span>
                    <span className="text-sm md:text-base font-black opacity-60 text-emerald-600/60 leading-none">/ año</span>
                 </div>
              </div>
              <div className="px-5 py-3 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-center flex items-center gap-2.5 shadow-lg shadow-emerald-500/40">
                 <span className="text-2xl md:text-3xl font-900 leading-none">-{data.recommended.savingsPct}%</span>
                 <TrendingDown size={20} className="hidden sm:block" />
              </div>
           </div>
         </div>

         <div className="px-5 sm:px-8 md:px-10 py-5 sm:py-6 md:py-8 bg-surface-2 border-t mt-auto flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <History size={14} className="text-primary" />
               </div>
               <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">Personalizado hace {Math.round((Date.now() - data.timestamp) / 1000 / 60)} min</p>
            </div>
            <button 
              onClick={() => { localStorage.removeItem('tmtl_last_comparison'); window.location.reload(); }}
              className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
            >
              Recalcular →
            </button>
         </div>
      </div>
    </div>
  );
}
