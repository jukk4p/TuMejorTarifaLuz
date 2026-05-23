"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import AdminGuard from "@/components/admin/AdminGuard";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Zap, LayoutDashboard, Building2, Code, User, LogOut, Menu, Bell, ChevronDown, Sun, Moon, ExternalLink, Settings } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const cleanup = () => {
            const elementsToRemove = ["cc-banner", "cc-modal", "cc-modal-overlay", "cookie-consent-styles"];
            elementsToRemove.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
        };

        cleanup();

        // Monitor DOM to remove lazy-loaded elements instantly if they are added later
        const observer = new MutationObserver(() => {
            cleanup();
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }

        return () => {
            observer.disconnect();
        };
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
        { name: "Gestión Tarifas", icon: Zap, href: "/admin/dashboard/tarifas" },
        { name: "Proveedores", icon: Building2, href: "/admin/dashboard/proveedores" },
        { name: "Logs Sistema", icon: Code, href: "/admin/dashboard/logs" },
    ];

    return (
        <AdminGuard>
            <div className="flex h-screen bg-slate-50 dark:bg-[#0B0F13] transition-colors duration-300">
                {/* Backdrop for mobile */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed md:sticky top-0 bottom-0 left-0 z-50 flex flex-col bg-surface border-r border-border transition-all duration-300 h-screen shrink-0
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    ${isCollapsed ? 'md:w-20' : 'md:w-72'}
                    w-72
                `}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="min-w-[32px] h-8 flex items-center justify-center overflow-hidden">
                            <Image 
                                src="/Logo.png" 
                                alt="Logo" 
                                width={32} 
                                height={32} 
                                className="object-contain"
                            />
                        </div>
                        <span className={`text-lg font-extrabold tracking-tight dark:text-white truncate transition-opacity duration-200 ${isCollapsed ? 'md:hidden md:opacity-0' : 'md:inline md:opacity-100'}`}>
                            Admin<span className="text-primary">Panel</span>
                        </span>
                    </div>

                    <div className="flex-1 px-4 py-8 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
                                    <span className={`text-sm font-bold transition-opacity duration-200 ${isCollapsed ? 'md:hidden md:opacity-0' : 'md:inline md:opacity-100'}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sidebar Footer / User Profile */}
                    <div className="p-4 border-t border-border">
                        <div
                            onClick={handleLogout}
                            className={`bg-surface-2 p-4 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ${isCollapsed ? 'md:hidden' : 'flex'}`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                <User className="text-slate-400 w-5 h-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-extrabold truncate dark:text-white">Admin User</p>
                                <p className="text-[10px] text-slate-400 font-bold truncate">admin@tarifa.es</p>
                            </div>
                            <LogOut className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
                        </div>
                        <div className={`justify-center py-2 ${isCollapsed ? 'hidden md:flex' : 'hidden'}`}>
                            <LogOut
                                onClick={handleLogout}
                                className="w-5 h-5 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                            />
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <header className="h-20 bg-surface backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        setIsMobileMenuOpen(!isMobileMenuOpen);
                                    } else {
                                        setIsCollapsed(!isCollapsed);
                                    }
                                }}
                                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest hidden md:block">
                                {menuItems.find(i => pathname === i.href)?.name || "Gestión"}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Theme Toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="relative h-9 w-16 rounded-full bg-surface-2 p-1 flex items-center justify-between border border-border transition-all hover:border-primary/30 shadow-inner mr-2"
                                    aria-label="Toggle theme"
                                >
                                    <div className={`absolute h-7 w-7 rounded-full bg-white dark:bg-primary shadow-lg transform transition-all duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`} />
                                    <span className={`z-10 w-7 flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'text-slate-500' : 'text-warning'}`}>
                                        <Sun size={14} />
                                    </span>
                                    <span className={`z-10 w-7 flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>
                                        <Moon size={14} />
                                    </span>
                                </button>
                            )}

                             <button 
                                onClick={() => router.push("/admin/dashboard/notificaciones")}
                                className="p-2 text-slate-400 hover:text-primary transition-colors relative"
                                title="Gestionar Notificaciones"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 bg-surface-2 pl-2 pr-4 py-1.5 rounded-full border border-border hover:border-primary/30 transition-all active:scale-95"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsUserMenuOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-3 w-56 bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            <div className="p-4 border-b border-border bg-surface-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sesión de Admin</p>
                                                <p className="text-sm font-bold dark:text-white truncate">admin@tarifa.es</p>
                                            </div>
                                            <div className="p-2">
                                                <Link 
                                                    href="/"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-text-body hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                                                >
                                                    <ExternalLink size={16} className="text-slate-400 group-hover:text-primary" />
                                                    Ir a la Web Pública
                                                </Link>
                                                <Link 
                                                    href="/mi-cuenta"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-text-body hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                                                >
                                                    <Settings size={16} className="text-slate-400 group-hover:text-primary" />
                                                    Ajustes de Cuenta
                                                </Link>
                                                <div className="h-px bg-surface-2 my-2 mx-2"></div>
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors group"
                                                >
                                                    <LogOut size={16} className="text-red-400 group-hover:text-red-500" />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
