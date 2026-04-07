import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tumejortarifaluz.es'),
  title: {
    default: 'TuMejorTarifaLuz | Comparador de Tarifas de Luz Gratis',
    template: '%s | TuMejorTarifaLuz'
  },
  description: "Compara más de 25 tarifas de luz en segundos subiendo tu factura. 100% gratuito e independiente. Ahorra hasta 312€/año analizando tu consumo real en más de 14 compañías sin registros.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.tumejortarifaluz.es",
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
    canonical: "https://www.tumejortarifaluz.es"
  }
};

import { Viewport } from "next";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/providers/ToastProvider";
import AuthModalHandler from "@/components/auth/AuthModalHandler";
import JsonLd, { organizationSchema } from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth overflow-x-clip">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background dark:bg-background text-slate-900 dark:text-slate-100 font-body transition-colors duration-300 overflow-x-clip`}>
        {/* GTM Noscript */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KMVCF4NV" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />

        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <AuthModalHandler />
            <ToastProvider>
              <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": "https://www.tumejortarifaluz.es/#organization",
                    "name": "TuMejorTarifaLuz",
                    "url": "https://www.tumejortarifaluz.es",
                    "logo": "https://www.tumejortarifaluz.es/Logo.png",
                    "sameAs": [
                      "https://x.com/tumejortarifaluz",
                      "https://facebook.com/tumejortarifaluz"
                    ]
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://www.tumejortarifaluz.es/#website",
                    "url": "https://www.tumejortarifaluz.es",
                    "name": "TuMejorTarifaLuz",
                    "publisher": { "@id": "https://www.tumejortarifaluz.es/#organization" }
                  }
                ]
              }} />
              <div className="relative w-full overflow-x-hidden">
                {children}
              </div>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>

        {/* Pre-initialize DataLayer for GTM */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>

        {/* Google Tag Manager (GTM) */}
        <Script id="gtm-loader" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KMVCF4NV');`}
        </Script>

        {/* Cookie Consent System */}
        <Script id="cookie-consent-script" src="/cookies-consent.js" strategy="lazyOnload" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.tumejortarifaluz.es/#organization",
                  "name": "TuMejorTarifaLuz",
                  "url": "https://www.tumejortarifaluz.es",
                  "foundingDate": "2025",
                  "founder": { "@type": "Person", "name": "Iván González" },
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.tumejortarifaluz.es/Logo.png"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "contacto@tumejortarifaluz.es",
                    "contactType": "customer support",
                    "availableLanguage": "Spanish"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.tumejortarifaluz.es/#website",
                  "url": "https://www.tumejortarifaluz.es",
                  "name": "TuMejorTarifaLuz",
                  "publisher": {
                    "@id": "https://www.tumejortarifaluz.es/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.tumejortarifaluz.es/tarifas?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
