"use client";

import { useState, useEffect, useRef } from "react";

interface SocialProofProps {
  count: number;
}

export default function SocialProof({ count }: SocialProofProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000; // 2 seconds
          const steps = 60;
          const stepValue = count / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += stepValue;
            if (current >= count) {
              setDisplayCount(count);
              clearInterval(interval);
            } else {
              setDisplayCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [count, hasAnimated]);

  return (
    <span ref={elementRef} className="font-900 text-text-primary underline decoration-primary/30 decoration-4 underline-offset-4">
      {displayCount.toLocaleString("es-ES")} familias
    </span>
  );
}
