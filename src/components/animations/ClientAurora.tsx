'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface AuroraProps {
    colorStops?: string[];
    amplitude?: number;
    blend?: number;
    speed?: number;
}

const Aurora = dynamic<AuroraProps>(() => import('./Aurora'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 animate-pulse" />
});

export default function ClientAurora() {
    return (
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-50 dark:opacity-40 overflow-hidden">
            <Aurora
                colorStops={["#1a4731", "#b5c99a", "#FFBF00"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
            {/* Overlay to soften the effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 dark:via-slate-900/20 to-white dark:to-slate-900" />
        </div>
    );
}
