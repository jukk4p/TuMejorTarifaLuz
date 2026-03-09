"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

function EnergyFlux({ count = 1500 }) {
    const pointsRef = useRef<THREE.Points>(null!);

    const [positions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
        return [pos];
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.02;
            pointsRef.current.rotation.x = time * 0.01;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#0ea5e9"
                size={0.08}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.15}
            />
        </Points>
    );
}

export default function InteractiveParticles() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-40">
            <Canvas camera={{ position: [0, 0, 40], fov: 45 }}>
                <EnergyFlux count={1500} />
            </Canvas>
        </div>
    );
}
