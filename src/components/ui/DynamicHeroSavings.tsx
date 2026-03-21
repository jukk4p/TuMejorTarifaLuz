"use client";

import { useEffect, useState } from "react";
import { TrendingDown } from "lucide-react";

export default function DynamicHeroSavings() {
  const [savingsPct, setSavingsPct] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tmtl_last_comparison");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setSavingsPct(parsed.recommended.savingsPct);
        }
      } catch (e) {
        console.error("Error parsing hero savings:", e);
      }
    }
  }, []);

  return (
    <p 
      className="text-xl md:text-2xl font-900 tracking-tight flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-1000" 
      style={{ color: 'var(--color-savings-text)' }}
    >
      {savingsPct !== null ? (
        <>
          y ahorra un <span className="text-primary italic px-1">{savingsPct}%</span> real
        </>
      ) : (
        <>y ahorra hasta un 34%</>
      )}
      <TrendingDown className="text-savings animate-bounce" size={24} />
    </p>
  );
}
