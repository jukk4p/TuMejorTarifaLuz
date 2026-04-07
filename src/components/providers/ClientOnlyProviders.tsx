"use client";

import dynamic from "next/dynamic";
import React from "react";

const AuthModalHandler = dynamic(() => import("@/components/auth/AuthModalHandler"), {
  ssr: false,
});

const ToastProvider = dynamic(() => import("@/components/providers/ToastProvider").then(mod => mod.ToastProvider), {
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
