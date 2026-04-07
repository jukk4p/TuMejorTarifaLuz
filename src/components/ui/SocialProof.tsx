"use client";

import { useState, useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";

interface SocialProofProps {
  count: number;
}

export default function SocialProof({ count }: SocialProofProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, count, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString("es-ES") + " familias";
          }
        }
      });
      return () => controls.stop();
    }
  }, [count, isInView]);

  return (
    <span 
      ref={ref} 
      className="font-900 text-text-primary underline decoration-primary/30 decoration-4 underline-offset-4"
    >
      {count.toLocaleString("es-ES")} familias
    </span>
  );
}
