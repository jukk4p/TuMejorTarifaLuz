"use client";

import { useState } from "react";
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RegistroPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const initializeUserProfile = async (user: any, customName?: string) => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                displayName: customName || user.displayName || "",
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

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
                await updateProfile(result.user, { displayName: name });
            }
            await initializeUserProfile(result.user, name);
            router.push("/mi-cuenta");
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                setError("Este correo electrónico ya está registrado.");
            } else if (err.code === "auth/weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres.");
            } else {
                setError("Ocurrió un error inesperado. Inténtalo más tarde.");
            }
            console.error(err);
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
                    <div className="absolute top-[20%] right-[-5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-[-10%] w-[35rem] h-[35rem] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-[0.03]"></div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Content Column */}
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="space-y-4">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-[0.2em]">
                                    Únete a la comunidad
                                </span>
                                <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-[0.95]">
                                    Controla tu gasto <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">con inteligencia.</span>
                                </h1>
                                <p className="text-xl text-text-secondary font-medium leading-relaxed max-w-lg">
                                    Regístrate gratis para guardar tus comparativas, recibir alertas de ahorro y gestionar tus facturas en un solo lugar.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: <Zap className="w-5 h-5" />, title: "Análisis instantáneo", desc: "Sube tu factura y descubre el ahorro real en segundos." },
                                    { icon: <ShieldCheck className="w-5 h-5" />, title: "Independencia total", desc: "No dependemos de ninguna eléctrica. Solo buscamos tu beneficio." },
                                    { icon: <Heart className="w-5 h-5" />, title: "Guarda favoritos", desc: "Sigue las tarifas que más te interesen y contrata cuando quieras." }
                                ].map((benefit, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            {benefit.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-primary">{benefit.title}</h4>
                                            <p className="text-sm text-text-secondary">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-surface/50 backdrop-blur-md rounded-3xl border border-border inline-flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                    +2,400 usuarios ya están ahorrando
                                </p>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="order-1 lg:order-2">
                            <div className="glass-card premium-shadow p-8 sm:p-12 rounded-[3rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-black text-text-primary mb-2">Comienza ahora</h2>
                                        <p className="text-sm text-text-secondary font-medium">Es gratis y solo te llevará 30 segundos.</p>
                                    </div>

                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="w-full h-14 flex items-center justify-center gap-3 px-6 bg-surface-2 border border-border rounded-2xl font-bold text-sm text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                    >
                                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                        <span>Regístrate con Google</span>
                                    </button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-border"></div>
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                                            <span className="px-4 bg-surface text-text-subtle">O rellena tus datos</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleEmailRegister} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-14 bg-surface-2 border border-border rounded-2xl px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
                                                placeholder="Ej. Juan Pérez"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-14 bg-surface-2 border border-border rounded-2xl px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
                                                placeholder="tu@email.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Contraseña</label>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-14 bg-surface-2 border border-border rounded-2xl px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold text-center">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-16 bg-primary text-white font-black text-sm tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                                        >
                                            {loading ? "Creando cuenta..." : (
                                                <>
                                                    Crear cuenta gratis
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="text-center pt-4">
                                        <p className="text-sm text-text-secondary font-medium">
                                            ¿Ya tienes una cuenta?{" "}
                                            <Link href="/login" className="text-primary font-bold hover:underline">
                                                Inicia sesión aquí
                                            </Link>
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-text-subtle font-bold uppercase tracking-widest">
                                        <ShieldCheck className="w-3 h-3" />
                                        Protegido por cifrado SSL de 256 bits
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
