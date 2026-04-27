"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface PremiumTiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltReverse?: boolean;
}

export default function PremiumTiltCard({ 
  children, 
  className = "",
  tiltReverse = false 
}: PremiumTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values para la posición del mouse
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Configuración de resortes (Springs) para fluidez premium
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Transformaciones para la rotación (3D Tilt)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], tiltReverse ? [10, -10] : [-10, 10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], tiltReverse ? [-10, 10] : [10, -10]);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;

    const { left, top, width, height } = rectRef.current;

    // Calculamos la posición relativa del mouse (-0.5 a 0.5)
    const mouseX = (e.clientX - left) / width - 0.5;
    const mouseY = (e.clientY - top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
