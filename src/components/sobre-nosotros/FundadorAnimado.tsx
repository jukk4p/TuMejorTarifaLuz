"use client";

import { PhoneOff, CreditCard, Lock } from "lucide-react";

export default function FundadorAnimado() {
  return (
    <div className="grid sm:grid-cols-3 gap-6 pt-12">
      <div className="p-8 bg-white dark:bg-slate-800/40 rounded-3xl border border-border flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
          <PhoneOff className="text-primary w-8 h-8" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Sin Llamadas</p>
        <p className="text-xs text-slate-500 mt-2">Nunca te pediremos tu teléfono</p>
      </div>
      <div className="p-8 bg-white dark:bg-slate-800/40 rounded-3xl border border-border flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
          <CreditCard className="text-primary w-8 h-8" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Sin Comisiones</p>
        <p className="text-xs text-slate-500 mt-2">100% gratuito para el usuario</p>
      </div>
      <div className="p-8 bg-white dark:bg-slate-800/40 rounded-3xl border border-border flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
          <Lock className="text-primary w-8 h-8" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Privacidad Total</p>
        <p className="text-xs text-slate-500 mt-2">Tus datos nunca serán vendidos</p>
      </div>
    </div>
  );
}
