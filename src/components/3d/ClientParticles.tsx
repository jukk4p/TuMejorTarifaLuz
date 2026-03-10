"use client";

import { useState, useEffect } from "react";
import nextDynamic from "next/dynamic";

const InteractiveParticles = nextDynamic(() => import("./InteractiveParticles"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-900/10 animate-pulse" />
});

export default function ClientParticles() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null;
    return <InteractiveParticles />;
}
