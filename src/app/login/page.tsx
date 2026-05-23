"use client";

import { useState } from "react";
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Heart, Mail, Lock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const router = useRouter();

    const initializeUserProfile = async (user: any) => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                email: user.email,
                lastLogin: new Date(),
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
            router.push("/mi-cuenta");
        } catch (err: any) {
            const errorMessage = err.code === 'auth/unauthorized-domain' 
                ? "Dominio no autorizado. Añade 'tumejortarifaluz.es' en Firebase Console."
                : `Error (${err.code}): Inténtalo de nuevo.`;
            setError(errorMessage);
            console.error("Firebase Auth Error:", err.code, err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await initializeUserProfile(result.user);
            router.push("/mi-cuenta");
        } catch (err: any) {
            if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                setError("Email o contraseña incorrectos.");
            } else {
                setError("Ocurrió un error al iniciar sesión. Inténtalo más tarde.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Introduce tu email para recuperar la contraseña.");
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
        <div className="min-h-screen bg-mesh selection:bg-primary/20">
            <Navbar />
            
            <main className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[-5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[-5%] w-[35rem] h-[35rem] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Content Column */}
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="space-y-4 text-center lg:text-left">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em]">
                                    Bienvenido de nuevo
                                </span>
                                <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-[0.95]">
                                    Accede a tu <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">panel de ahorro.</span>
                                </h1>
                                <p className="text-xl text-text-secondary font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    Inicia sesión para ver tus facturas guardadas, gestionar tus favoritos y recibir alertas de precios.
                                </p>
                            </div>

                            <div className="hidden lg:grid grid-cols-2 gap-6">
                                {[
                                    { icon: <FileText className="w-5 h-5" />, title: "Facturas", desc: "Tus facturas digitalizadas." },
                                    { icon: <Star className="w-5 h-5" />, title: "Favoritos", desc: "Tarifas que estás siguiendo." },
                                    { icon: <Zap className="w-5 h-5" />, title: "Alertas", desc: "Avisos de ahorro real." },
                                    { icon: <ShieldCheck className="w-5 h-5" />, title: "Seguro", desc: "Tus datos están protegidos." }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 bg-surface/50 backdrop-blur-md rounded-3xl border border-border group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold text-text-primary text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-text-secondary">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="order-1 lg:order-2">
                            <div className="glass-card premium-shadow p-8 sm:p-12 rounded-[3rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-black text-text-primary mb-2">Iniciar Sesión</h2>
                                        <p className="text-sm text-text-secondary font-medium">Introduce tus datos para acceder.</p>
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
                                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                                            <span className="px-4 bg-surface text-text-subtle">O con tu email</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleEmailLogin} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full h-14 bg-surface-2 border border-border rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
                                                    placeholder="tu@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Contraseña</label>
                                                <button 
                                                    type="button" 
                                                    onClick={handleResetPassword}
                                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                                >
                                                    ¿Olvidaste la clave?
                                                </button>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full h-14 bg-surface-2 border border-border rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold text-center">
                                                {error}
                                            </div>
                                        )}

                                        {resetSent && (
                                            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl text-green-600 dark:text-green-400 text-xs font-bold text-center">
                                                Email de recuperación enviado. Revisa tu bandeja.
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-16 bg-primary text-white font-black text-sm tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading ? "Iniciando sesión..." : "Entrar a mi cuenta"}
                                        </button>
                                    </form>

                                    <div className="text-center pt-4">
                                        <p className="text-sm text-text-secondary font-medium">
                                            ¿No tienes una cuenta?{" "}
                                            <Link href="/registro" className="text-primary font-bold hover:underline">
                                                Regístrate gratis aquí
                                            </Link>
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-text-subtle font-bold uppercase tracking-widest">
                                        <ShieldCheck className="w-3 h-3" />
                                        Acceso seguro y encriptado
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

import { FileText, Star } from "lucide-react";
