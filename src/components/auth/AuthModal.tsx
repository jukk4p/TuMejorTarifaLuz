"use client";

import { useState, useEffect } from "react";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { X, ShieldCheck } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(initialMode === "login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setError("");
            setResetSent(false);
        } else {
            setIsLogin(initialMode === "login");
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const initializeUserProfile = async (user: any) => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                email: user.email,
                favorites: [],
                lastLogin: new Date(),
                createdAt: user.metadata.creationTime || new Date()
            }, { merge: true });
        } catch (err) {
            console.error("Error initializing user profile:", err);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await initializeUserProfile(result.user);
            onClose();
        } catch (err: any) {
            setError("Error al conectar con Google. Inténtalo de nuevo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                await initializeUserProfile(result.user);
            }
            onClose();
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                setError("Este correo electrónico ya está registrado.");
            } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                setError("Correo o contraseña incorrectos.");
            } else if (err.code === "auth/weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres.");
            } else {
                setError("Ocurrió un error. El sistema está en mantenimiento.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Introduce tu correo para restablecer la contraseña.");
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
            setError("");
        } catch (err) {
            setError("Error al enviar el correo de recuperación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-surface-2/40 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all z-10 border border-white/50 dark:border-white/5"
                >
                    <X size={20} />
                </button>

                <div className="p-8 sm:p-10 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-800 dark:text-white">
                            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                            {isLogin ? "Accede a tus facturas y favoritos" : "Ahorra con inteligencia en cada factura"}
                        </p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full h-14 flex items-center justify-center gap-3 px-6 bg-surface-2 border border-border rounded-2xl font-bold text-sm text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                            />
                            <path
                                fill="#34A853"
                                d="M16.04 15.345c-1.077.733-2.427 1.164-4.04 1.164-2.955 0-5.46-1.99-6.355-4.664L1.585 14.94C3.59 18.96 7.74 21.818 12 21.818c3.245 0 6.19-1.082 8.355-2.945l-4.314-3.528Z"
                            />
                            <path
                                fill="#4285F4"
                                d="M23.49 12.273c0-.773-.077-1.564-.214-2.318H12v4.51h6.468C18.19 15.6 17.25 16.69 16.04 17.5l4.314 3.527c2.518-2.318 4.136-5.718 4.136-9.754Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.645 11.845a7.032 7.032 0 0 1 0-2.08L1.62 6.65a11.967 11.967 0 0 0 0 10.3l4.025-3.105Z"
                            />
                        </svg>
                        <span>Continuar con Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="px-4 bg-surface text-slate-400">O con tu correo</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-white/5 rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contraseña</label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={handleResetPassword}
                                        className="text-[10px] font-bold text-primary hover:underline tracking-widest"
                                    >
                                        ¿Olvidaste la clave?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-white/5 rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        {resetSent && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl text-green-600 dark:text-green-400 text-xs font-bold">
                                Email de recuperación enviado correctamente.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-primary text-white font-900 text-sm tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Procesando..." : isLogin ? "Iniciar sesión" : "Crear mi cuenta"}
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                        >
                            {isLogin ? "¿No tienes cuenta? Regístrate gratis" : "¿Ya tienes cuenta? Inicia sesión"}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-900/40 p-6 border-t border-border flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-primary" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Acceso seguro y encriptado
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}
