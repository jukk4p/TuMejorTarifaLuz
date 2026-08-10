"use client";

import dynamic from "next/dynamic";
import React from "react";
// ToastProvider envuelve {children}, así que NO puede ir con ssr: false: eso deja
// todo el árbol de páginas fuera del render de servidor y hace que el notFound()
// de las rutas dinámicas se resuelva en cliente, devolviendo HTTP 200 (soft 404).
import { ToastProvider } from "@/components/providers/ToastProvider";

const AuthModalHandler = dynamic(() => import("@/components/auth/AuthModalHandler"), {
  ssr: false,
});

export function ClientOnlyProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthModalHandler />
      <ToastProvider>
        {children}
      </ToastProvider>
    </>
  );
}
