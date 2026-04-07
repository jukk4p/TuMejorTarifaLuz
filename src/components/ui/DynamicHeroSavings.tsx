"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingDown } from "lucide-react";
import { motion, animate } from "framer-motion";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = Math.round(value).toString();
        }
      }
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>0</span>;
}

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
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="text-xl md:text-2xl font-900 tracking-tight flex items-center justify-center lg:justify-start gap-2" 
      style={{ color: 'var(--color-savings-text)' }}
    >
      {savingsPct !== null ? (
        <>
          y ahorra un <span className="text-primary italic px-1 md:-ml-1"><AnimatedNumber value={savingsPct} />%</span> real
        </>
      ) : (
        <>y ahorra hasta un <span className="text-primary italic px-1"><AnimatedNumber value={34} />%</span> anual</>
      )}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <TrendingDown className="text-savings hidden md:block" size={24} />
      </motion.div>
    </motion.div>
  );
}
