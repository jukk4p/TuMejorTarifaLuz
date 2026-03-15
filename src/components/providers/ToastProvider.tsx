"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from "lucide-react";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
    id: string;
    message: string;
    description?: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, description?: string, duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "success", description?: string, duration: number = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type, description, duration };
        
        setToasts((prev) => [...prev, newToast]);

        if (type !== "loading" && duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }

        return id;
    }, [hideToast]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        loading: <Loader2 className="w-5 h-5 text-primary animate-spin" />
    };

    const bgColors = {
        success: "border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/20 backdrop-blur-md",
        error: "border-red-500/20 bg-red-50/90 dark:bg-red-950/20 backdrop-blur-md",
        info: "border-blue-500/20 bg-blue-50/90 dark:bg-blue-950/20 backdrop-blur-md",
        loading: "border-primary/20 bg-primary/5 dark:bg-primary/10 backdrop-blur-md"
    };

    return (
        <div className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-full duration-300 min-w-[320px] max-w-md ${bgColors[toast.type]}`}>
            <div className="shrink-0 pt-0.5">
                {icons[toast.type]}
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {toast.message}
                </p>
                {toast.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {toast.description}
                    </p>
                )}
            </div>
            <button 
                onClick={onClose}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};
