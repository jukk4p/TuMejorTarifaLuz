"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Zap, LayoutDashboard, Building2, Code, User, LogOut, Menu, Bell, ChevronDown } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                {/* Sidebar */}
                <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="min-w-[32px] h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Zap className="text-white w-4 h-4 fill-current" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-lg font-extrabold tracking-tight dark:text-white truncate">
                                Admin<span className="text-primary">Panel</span>
                            </span>
                        )}
                    </div>

                    <div className="flex-1 px-4 py-8 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
                                    {!isCollapsed && <span className="text-sm font-bold">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sidebar Footer / User Profile */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        {!isCollapsed && (
                            <div
                                onClick={handleLogout}
                                className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
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
                        )}
                        {isCollapsed && (
                            <div className="flex justify-center py-2">
                                <LogOut
                                    onClick={handleLogout}
                                    className="w-5 h-5 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                                />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest">
                                {menuItems.find(i => pathname === i.href)?.name || "Gestión"}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                             <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="w-4 h-4" />
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </header>

                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
