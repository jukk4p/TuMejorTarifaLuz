"use client";

import { motion, useInView, Variant, AnimatePresence } from "framer-motion";
import { useRef, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  className?: string;
  stagger?: boolean;
  viewTrigger?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  className = "",
  stagger = false,
  viewTrigger = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 },
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay,
        ...(stagger && {
          staggerChildren: 0.1,
        }),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={viewTrigger ? (isInView ? "visible" : "hidden") : "visible"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStagger({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <FadeIn stagger delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}
