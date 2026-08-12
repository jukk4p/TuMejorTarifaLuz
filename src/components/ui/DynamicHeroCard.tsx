"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, TrendingDown, History, Info, RefreshCw } from "lucide-react";
import { motion, AnimatePresence, useSpring, useTransform, animate } from "framer-motion";
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

// Componente para contadores animados (Efecto 'WOW')
function AnimatedNumber({ value, precision = 2, suffix = "" }: { value: number, precision?: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = value.toLocaleString('es-ES', { 
            minimumFractionDigits: precision, 
            maximumFractionDigits: precision 
          }) + suffix;
        }
      }
    });
    return () => controls.stop();
  }, [value, precision, suffix]);

  return <span ref={ref}>0</span>;
}

const getLogoScale = (companyName: string) => {
  const name = companyName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (name.includes("iberdrola")) return "scale-[1.5]";
  if (name.includes("endesa")) return "scale-[0.75]";
  if (name.includes("naturgy")) return "scale-[1.4]";
  if (name.includes("repsol")) return "scale-[1.4]";
  if (name.includes("octopus")) return "scale-[1.35]";
  if (name.includes("totalenerg")) return "scale-[1.25]";
  if (name.includes("imagina")) return "scale-[1.4]";
  if (name.includes("nufri")) return "scale-[1.2]";
  if (name.includes("vm") || name.includes("energya")) return "scale-[1.3]";
  if (name.includes("chc")) return "scale-[1.3]";
  if (name.includes("referencia") || name.includes("cor")) return "scale-[1.2]";
  if (name.includes("visalia")) return "scale-[0.95]";
  if (name.includes("atulado")) return "scale-[1.1]";
  return "scale-100";
};

export default function DynamicHeroCard() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    const saved = localStorage.getItem("tmtl_last_comparison");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          if (!parsed.current.logo && parsed.current.company) {
            parsed.current.logo = getLogoPath(parsed.current.company);
          }
          if (!parsed.recommended.logo && parsed.recommended.company) {
            parsed.recommended.logo = getLogoPath(parsed.recommended.company);
          }
          setData(parsed);
        }
      } catch (e) {
        console.error("Error parsing hero data:", e);
      }
    }
  }, []);

  return (
    <div className="relative group/hero-img py-6 md:py-12 overflow-visible">
      <AnimatePresence mode="wait">
        {!isBrowser || !data ? (
          <motion.div
            key="static"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -top-16 -right-16 w-64 md:w-[500px] h-64 md:h-[500px] bg-primary/10 rounded-full blur-[100px] md:blur-[140px]"></div>
            <div className="absolute -bottom-16 -left-16 w-48 md:w-96 h-48 md:h-96 bg-accent/10 rounded-full blur-[80px] md:blur-[100px]"></div>
            
            <div 
              className="relative glass-card premium-shadow rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col w-full max-w-[640px] mx-auto lg:ml-auto transition-all duration-500 hover:shadow-primary/5" 
              style={{ backgroundColor: 'var(--section-white-alpha)' }}
            >
               {/* Header Preview */}
               <div className="px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6 md:pb-8 flex items-center justify-between" style={{ background: 'linear-gradient(to bottom, rgba(var(--primary-rgb), 0.05), transparent)' }}>
                 <div className="space-y-1 md:space-y-1.5">
                    <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--color-text-subtle)' }}>Tu potencial de</p>
                     <div className="text-xs sm:text-sm md:text-[18px] font-black uppercase tracking-[0.12em] flex items-center gap-2" style={{ color: 'var(--color-text-heading)' }}>
                      Ahorro real
                      <span className="w-2 h-2 rounded-full bg-primary opacity-80 transition-opacity"></span>
                    </div>
                 </div>
                 <div className="px-3 md:px-4 py-1.5 md:py-2 border border-savings/25 rounded-full flex items-center gap-1.5 md:gap-2.5 bg-savings/10">
                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-savings opacity-80 transition-opacity"></div>
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-savings-text">Optimizado hoy</span>
                 </div>
               </div>

               <div className="w-full h-px bg-border/40"></div>

               <div className="p-5 sm:p-8 md:p-10 space-y-6 md:space-y-10">
                 <div className="flex items-start justify-between gap-3 sm:gap-6 relative">
                    <div className="flex-1 space-y-3 md:space-y-5 text-center">
                       <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Tarifa actual</p>
                       <div className="mx-auto h-14 md:h-20 w-32 md:w-40 bg-surface border border-border/50 rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-sm">
                          <Image src="/logos/logo_iberdrola.png" alt="Iberdrola" width={217} height={163} className="object-contain h-auto w-auto max-h-full scale-[1.6]" priority sizes="(max-width: 768px) 100px, 120px" />
                       </div>
                       <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                          <span className="text-xl sm:text-3xl md:text-4xl font-900 tracking-tight" style={{ color: 'var(--color-text-heading)' }}>0,162</span>
                          <span className="text-[9px] md:text-sm font-bold opacity-60" style={{ color: 'var(--color-text-muted)' }}>€/kWh*</span>
                       </div>
                    </div>

                    <div className="absolute left-1/2 top-[52px] md:top-[75px] -translate-x-1/2 -translate-y-1/2 z-20">
                       <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 md:w-20 md:h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900"
                       >
                          <ArrowRight size={24} className="md:w-10 md:h-10 stroke-[3]" />
                       </motion.div>
                    </div>

                    <div className="flex-1 space-y-3 md:space-y-5 text-center">
                       <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-savings-text">Recomendada</p>
                       <div className="mx-auto h-14 md:h-20 w-32 md:w-40 bg-surface border border-border/50 rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-md">
                          <Image src="/logos/logo_visalia.png" alt="Visalia" width={150} height={43} className="object-contain h-auto w-auto max-h-full scale-110" priority sizes="(max-width: 768px) 100px, 120px" />
                       </div>
                       <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                          <span className="text-xl sm:text-3xl md:text-4xl font-900 tracking-tight text-savings-text">0,098</span>
                          <span className="text-[9px] md:text-sm font-bold opacity-60 text-savings-text/60">€/kWh*</span>
                       </div>
                    </div>
                 </div>

                 <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl md:rounded-[2rem] p-5 md:p-8 flex items-center justify-between bg-savings-bg border border-savings/30 shadow-lg"
                 >
                    <div className="space-y-1">
                       <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-savings-text">Ahorro anual estimado</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-3xl md:text-5xl font-900 tracking-tighter text-accent">339,24€</span>
                       </div>
                    </div>
                    <div className="px-5 py-3 bg-emerald-700 text-white rounded-2xl text-center flex items-center gap-2 shadow-lg shadow-savings/40">
                       <span className="text-2xl md:text-3xl font-900 leading-none">-34%</span>
                       <TrendingDown size={20} className="hidden sm:block" />
                    </div>
                 </motion.div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <div className="absolute -top-16 -right-16 w-64 md:w-[500px] h-64 md:h-[500px] bg-primary/25 rounded-full blur-[100px] md:blur-[140px]"></div>
            
            <div 
              className="relative glass-card premium-shadow rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col w-full max-w-[640px] mx-auto lg:ml-auto border border-white/20 shadow-2xl" 
              style={{ backgroundColor: 'var(--section-white-alpha)' }}
            >
               {/* Active Header */}
               <div className="px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6 md:pb-8 flex items-center justify-between" style={{ background: 'linear-gradient(to bottom, rgba(var(--primary-rgb), 0.08), transparent)' }}>
                 <div className="space-y-1">
                    <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--color-text-subtle)' }}>Análisis personalizado</p>
                     <div className="text-xs sm:text-sm md:text-[18px] font-black uppercase tracking-[0.12em] flex items-center gap-2 text-primary">
                      Comparativa Completada
                      <span className="w-2 h-2 rounded-full bg-primary opacity-80" />
                    </div>
                 </div>
                 <div className="px-3 md:px-4 py-1.5 md:py-2 border border-emerald-500/25 rounded-full flex items-center gap-1.5 md:gap-2.5 bg-emerald-500/10">
                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-savings-text">Datos Reales</span>
                 </div>
               </div>

               <div className="w-full h-px bg-border/40"></div>

               <div className="p-5 sm:p-8 md:p-10 space-y-6 md:space-y-10">
                 <div className="flex items-start justify-between gap-3 sm:gap-6 relative">
                    {/* Current Company */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-1 space-y-3 md:space-y-5 text-center"
                    >
                       <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Situación Actual</p>
                       <div className="mx-auto h-12 md:h-20 w-[105px] sm:w-32 md:w-40 bg-surface border border-border/50 rounded-2xl flex items-center justify-center p-2 md:p-4 shadow-sm">
                          {data.current.logo ? (
                            <Image 
                               src={data.current.logo} 
                               alt={data.current.company} 
                               width={100} 
                               height={28} 
                               className={`object-contain h-auto w-auto max-h-full transition-transform duration-500 ${getLogoScale(data.current.company)}`}
                               priority
                               sizes="(max-width: 768px) 80px, 100px"
                             />
                          ) : (
                            <span className="text-[10px] font-black uppercase">{data.current.company}</span>
                          )}
                       </div>
                       <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight"><AnimatedNumber value={data.current.price} precision={3} /></span>
                          <span className="text-[9px] md:text-xs font-bold opacity-60">€/kWh</span>
                       </div>
                    </motion.div>

                    <div className="absolute left-1/2 top-[43px] md:top-[68px] -translate-x-1/2 -translate-y-1/2 z-20">
                       <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                        className="w-10 h-10 md:w-16 md:h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800"
                       >
                          <ArrowRight size={20} className="md:w-8 md:h-8 stroke-[3]" />
                       </motion.div>
                    </div>

                    {/* Recommended Company */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex-1 space-y-3 md:space-y-5 text-center"
                    >
                       <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-savings-text">Top Recomendada</p>
                       <motion.div 
                        whileHover={{ y: -5 }}
                        className="mx-auto h-12 md:h-20 w-[105px] sm:w-32 md:w-40 bg-surface border border-primary/20 rounded-2xl flex items-center justify-center p-2 md:p-4 shadow-md"
                       >
                          {data.recommended.logo ? (
                            <Image 
                               src={data.recommended.logo} 
                               alt={data.recommended.company} 
                               width={90} 
                               height={28} 
                               className={`object-contain h-auto w-auto max-h-full transition-transform duration-500 ${getLogoScale(data.recommended.company)}`}
                               priority
                               sizes="(max-width: 768px) 70px, 90px"
                             />
                          ) : (
                            <span className="text-[10px] font-black uppercase text-primary">{data.recommended.company}</span>
                          )}
                       </motion.div>
                       <div className="flex items-baseline gap-1 md:gap-1.5 justify-center">
                          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-primary"><AnimatedNumber value={data.recommended.price} precision={3} /></span>
                          <span className="text-[9px] md:text-xs font-bold opacity-60 text-primary/60">€/kWh</span>
                       </div>
                    </motion.div>
                 </div>

                 {/* Savings Badge */}
                 <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl md:rounded-[2rem] p-5 md:p-8 flex items-center justify-between text-left relative overflow-hidden group/savings border border-emerald-500/30 shadow-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))' }}
                 >
                    <div className="space-y-1 relative z-10">
                       <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-savings-text">Ahorro anual calculado</p>
                       <div className="flex items-baseline gap-2 text-savings-text">
                          <span className="text-3xl md:text-6xl font-900 tracking-tighter">
                            <AnimatedNumber value={data.recommended.savings} suffix="€" />
                          </span>
                          <span className="text-sm md:text-base font-black opacity-60">/ año</span>
                       </div>
                    </div>
                    <div className="px-5 py-3 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-center flex items-center gap-2 shadow-lg shadow-emerald-500/30">
                       <span className="text-2xl md:text-4xl font-900 leading-none">
                         -<AnimatedNumber value={data.recommended.savingsPct} precision={0} suffix="%" />
                       </span>
                       <TrendingDown size={24} className="hidden sm:block" />
                    </div>
                 </motion.div>
               </div>

               {/* Footer Info */}
               <div className="px-5 sm:px-8 md:px-10 py-5 sm:py-6 md:py-8 bg-surface-2/40 border-t mt-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <History size={14} className="text-primary" />
                     </div>
                     <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">Personalizado hace {Math.round((Date.now() - data.timestamp) / 1000 / 60)} min</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { localStorage.removeItem('tmtl_last_comparison'); window.location.reload(); }}
                    className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-primary hover:text-primary-hover uppercase tracking-widest"
                  >
                    <RefreshCw size={12} />
                    Recalcular Comparativa
                  </motion.button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
