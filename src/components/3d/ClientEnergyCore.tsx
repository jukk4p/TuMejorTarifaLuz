"use client";

import nextDynamic from "next/dynamic";

const EnergyCore = nextDynamic(() => import("./EnergyCore"), {
    ssr: false,
    loading: () => <div className="w-24 h-24 bg-primary/10 rounded-3xl animate-pulse mx-auto mb-10" />
});

export default function ClientEnergyCore({ progress = 0, isComplete = false }: { progress?: number; isComplete?: boolean }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <EnergyCore progress={progress} isComplete={isComplete} />
        </div>
    );
}
