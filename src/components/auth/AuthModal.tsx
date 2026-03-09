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
import { doc, setDoc, getDoc } from "firebase/firestore";

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

            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all z-10"
                >
                    <span className="material-icons text-lg">close</span>
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
                        className="w-full h-14 flex items-center justify-center gap-3 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        <span>Continuar con Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-400">O con tu correo</span>
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
                                className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
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
                                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
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
                                className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
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
                            className="w-full h-14 bg-primary text-white font-900 text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Crear Mi Cuenta"}
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

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Únete a +2,400 ahorradores
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
