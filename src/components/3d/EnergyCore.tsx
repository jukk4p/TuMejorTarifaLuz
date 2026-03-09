"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Sphere,
    MeshDistortMaterial,
    GradientTexture,
    Text,
    Float as DreiFloat
} from "@react-three/drei";
import * as THREE from "three";

interface EnergyCoreProps {
    progress: number;
    isComplete: boolean;
}

function ReactorCore({ progress, isComplete }: EnergyCoreProps) {
    const coreRef = useRef<THREE.Mesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Constant slow rotation
            groupRef.current.rotation.y += delta * (hovered ? 0.1 : 0.4);

            // Zoom/Pause effect on hover
            const targetZ = hovered ? 1.2 : 1;
            groupRef.current.scale.lerp(new THREE.Vector3(targetZ, targetZ, targetZ), 0.1);
        }

        if (coreRef.current) {
            // Pulsing effect
            const pulse = 1 + Math.sin(time * 4) * 0.05;
            coreRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Main Reactor Body */}
            <Sphere ref={coreRef} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color={progress > 90 ? "#00F2FF" : "#137fec"}
                    speed={hovered ? 1 : 4}
                    distort={0.4}
                    radius={1}
                >
                    <GradientTexture
                        stops={[0, 1]}
                        colors={['#001C30', '#137fec']}
                    />
                </MeshDistortMaterial>
            </Sphere>

            {/* Progress Text - Simplified to standard text for reliability */}
            <Text
                position={[0, 0, 1.1]}
                fontSize={0.4}
                color="#00F2FF"
                anchorX="center"
                anchorY="middle"
            >
                {`${Math.round(progress)}%`}
            </Text>

            {/* Orbital Rings */}
            <OrbitalRings speedFactor={hovered ? 0.2 : 1.5} />

            {/* Data Beams (Inward Flow) */}
            <DataFlow count={40} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#00F2FF" />
        </group>
    );
}

function OrbitalRings({ speedFactor = 1 }) {
    const ring1 = useRef<THREE.Group>(null!);
    const ring2 = useRef<THREE.Group>(null!);
    const ring3 = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {
        if (ring1.current) ring1.current.rotation.z += delta * 1 * speedFactor;
        if (ring2.current) ring2.current.rotation.x += delta * 0.8 * speedFactor;
        if (ring3.current) ring3.current.rotation.y += delta * 1.2 * speedFactor;
    });

    return (
        <group>
            {/* Green Ring */}
            <group ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
                <mesh>
                    <torusGeometry args={[1.4, 0.015, 16, 100]} />
                    <meshBasicMaterial color="#00C853" transparent opacity={0.6} />
                </mesh>
            </group>

            {/* Orange Ring */}
            <group ref={ring2} rotation={[0, Math.PI / 4, 0]}>
                <mesh>
                    <torusGeometry args={[1.7, 0.015, 16, 100]} />
                    <meshBasicMaterial color="#FFB800" transparent opacity={0.5} />
                </mesh>
            </group>

            {/* Blue Ring */}
            <group ref={ring3} rotation={[Math.PI / 2, Math.PI / 6, 0]}>
                <mesh>
                    <torusGeometry args={[2.0, 0.015, 16, 100]} />
                    <meshBasicMaterial color="#00F2FF" transparent opacity={0.4} />
                </mesh>
            </group>
        </group>
    );
}

function DataFlow({ count }: { count: number }) {
    const pointsRef = useRef<THREE.Points>(null!);

    const particles = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const rand = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const r = 2.5 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            rand[i] = Math.random();
        }
        return { pos, rand };
    }, [count]);

    useFrame((state) => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < count; i++) {
                const x = positions[i * 3];
                const y = positions[i * 3 + 1];
                const z = positions[i * 3 + 2];
                const dist = Math.sqrt(x * x + y * y + z * z);

                if (dist < 0.8) {
                    const r = 2.5 + Math.random() * 2;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                    positions[i * 3 + 2] = r * Math.cos(phi);
                } else {
                    const speed = 0.03 + particles.rand[i] * 0.05;
                    positions[i * 3] -= (x / dist) * speed;
                    positions[i * 3 + 1] -= (y / dist) * speed;
                    positions[i * 3 + 2] -= (z / dist) * speed;
                }
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.pos, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#FFFFFF"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function Confetti({ isComplete }: { isComplete: boolean }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (isComplete) {
            setActive(true);
            setTimeout(() => setActive(false), 3000);
        }
    }, [isComplete]);

    const count = 300;
    const particles = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = 0;
            pos[i * 3 + 1] = 0;
            pos[i * 3 + 2] = 0;
            vel[i * 3] = (Math.random() - 0.5) * 0.4;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        }
        return { pos, vel };
    }, []);

    useFrame(() => {
        if (active && pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < count; i++) {
                positions[i * 3] += particles.vel[i * 3];
                positions[i * 3 + 1] += particles.vel[i * 3 + 1];
                positions[i * 3 + 2] += particles.vel[i * 3 + 2];
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    if (!active) return null;

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.pos, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#00C853"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function EnergyCore({ progress = 0, isComplete = false }: EnergyCoreProps) {
    return (
        <div className="w-full h-full min-h-[400px] relative flex flex-col items-center justify-center">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ReactorCore progress={progress} isComplete={isComplete} />
                <Confetti isComplete={isComplete} />
            </Canvas>

            <div className="mt-4 text-center">
                <p className="text-slate-400 font-mono text-sm tracking-widest animate-pulse max-w-xs transition-all duration-500">
                    {progress < 100 ? "Sincronizando con mercado mayorista..." : "¡Tarifa óptima encontrada!"}
                </p>
            </div>
        </div>
    );
}
