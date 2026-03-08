"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

function EnergyFlux({ count = 1500 }) {
    const pointsRef = useRef<THREE.Points>(null!);

    // Initialize particle positions and colors with an "electric" theme
    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // More spread out, line-like distribution
            pos[i * 3] = (Math.random() - 0.5) * 45;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

            // Electric colors: Cyan, Amber (Electric sparks), and Soft White
            const palette = ["#00F2FF", "#FFB800", "#FFFFFF", "#7000FF"];
            color.set(palette[i % palette.length]);
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }
        return [pos, col];
    }, [count]);

    const { viewport } = useThree();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (pointsRef.current) {
            // Very gentle rotation
            pointsRef.current.rotation.y = time * 0.02;

            // Fluid follow mouse
            const targetX = (state.pointer.x * viewport.width) / 20;
            const targetY = (state.pointer.y * viewport.height) / 20;

            pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.03;
            pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.03;

            // Simulate energy pulse
            const pulse = 1 + Math.sin(time * 1.5) * 0.03;
            pointsRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.3}
            />
        </Points>
    );
}

export default function InteractiveParticles() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-40">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <EnergyFlux count={2000} />
            </Canvas>
        </div>
    );
}
