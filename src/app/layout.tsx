import type { Metadata } from "next";
import { Manrope, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tumejortarifaluz.es'),
  title: {
    default: "Tu Mejor Tarifa Luz | Comparador Inteligente de Energía",
    template: "%s | Tu Mejor Tarifa Luz"
  },
  description: "Ahorra en tu factura de la luz con inteligencia artificial. Análisis automático de tu factura real.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://tumejortarifaluz.es",
    siteName: "Tu Mejor Tarifa Luz",
    title: "Tu Mejor Tarifa Luz | Ahorra en tu factura con IA",
    description: "Comparamos todas las tarifas del mercado analizando tu consumo real.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu Mejor Tarifa Luz | Comparador Inteligente",
    description: "Analizamos tu factura de luz en segundos con IA.",
    images: ["/og-image.jpg"],
  }
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${manrope.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
