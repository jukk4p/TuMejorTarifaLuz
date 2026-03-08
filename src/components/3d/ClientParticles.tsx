"use client";

import nextDynamic from "next/dynamic";

const InteractiveParticles = nextDynamic(() => import("./InteractiveParticles"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-900/10 animate-pulse" />
});

export default function ClientParticles() {
    return <InteractiveParticles />;
}
