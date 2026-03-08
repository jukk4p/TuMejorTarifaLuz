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
    default: "Comparador de Tarifas de Luz Gratis 2026 | Sube tu Factura y Ahorra | TuMejorTarifaLuz",
    template: "%s | Tu Mejor Tarifa Luz"
  },
  description: "Compara +20 tarifas de luz en segundos subiendo tu factura. 100% gratuito e independiente. Ahorra hasta 312€/año analizando tu consumo real sin registros.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://tumejortarifaluz.es",
    siteName: "Tu Mejor Tarifa Luz",
    title: "Comparador de Tarifas de Luz Gratis 2026 | Sube tu Factura y Ahorra",
    description: "Analizamos tu consumo real en segundos para encontrarte la mejor tarifa de luz del mercado español.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparador de Tarifas de Luz Inteligente | Ahorra en 30 segundos",
    description: "Sube tu factura PDF y descubre cuánto puedes ahorrar hoy con el comparador independiente TuMejorTarifaLuz.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://tumejortarifaluz.es"
  }
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import JsonLd, { organizationSchema } from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={`${manrope.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <JsonLd data={organizationSchema} />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
