'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface IridescenceProps {
    color?: [number, number, number];
    speed?: number;
    amplitude?: number;
    mouseReact?: boolean;
}

const Iridescence = dynamic<IridescenceProps>(() => import('./Iridescence'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 animate-pulse" />
});

export default function ClientIridescence() {
    return (
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-30 overflow-hidden">
            <Iridescence
                color={[0.1, 0.4, 0.2]} // Un verde oscuro premium
                speed={1.0}
                amplitude={0.15}
                mouseReact={true}
            />
            {/* Overlay to soften the effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 dark:via-slate-900/10 to-white dark:to-slate-900" />
        </div>
    );
}
