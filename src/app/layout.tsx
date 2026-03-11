import type { Metadata } from "next";
import { Manrope, JetBrains_Mono, Outfit } from "next/font/google";
import Script from "next/script";
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
  description: "Compara más de 25 tarifas de luz en segundos subiendo tu factura. 100% gratuito e independiente. Ahorra hasta 312€/año analizando tu consumo real sin registros.",
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
      </head>
      <body className={`${manrope.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300`}>
        {/* GTM Noscript */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KMVCF4NV" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />

        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <JsonLd data={organizationSchema} />
            {children}
          </ThemeProvider>
        </AuthProvider>

        {/* GTM Componentized - Using worker strategy for better performance if possible, or lazyOnload */}
        <Script id="gtm-loader" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KMVCF4NV');`}
        </Script>

        {/* Cookie Consent System */}
        <Script id="cookie-consent-script" src="/cookies-consent.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
