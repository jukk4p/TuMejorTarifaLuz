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
import JsonLd, { organizationSchema } from "@/components/seo/JsonLd";
import { ClientOnlyProviders } from "@/components/providers/ClientOnlyProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth overflow-x-clip">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background dark:bg-background text-slate-900 dark:text-slate-100 font-body transition-colors duration-300 overflow-x-clip`}>
        {/* GTM Noscript */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KMVCF4NV" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />

        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <ClientOnlyProviders>
              <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@id": "https://www.tumejortarifaluz.es/#organization",
                    "@type": "Organization",
                    "logo": "https://www.tumejortarifaluz.es/Logo.png",
                    "name": "TuMejorTarifaLuz",
                    "sameAs": [
                      "https://x.com/tumejortarifaluz",
                      "https://facebook.com/tumejortarifaluz"
                    ],
                    "url": "https://www.tumejortarifaluz.es"
                  },
                  {
                    "@id": "https://www.tumejortarifaluz.es/#website",
                    "@type": "WebSite",
                    "name": "TuMejorTarifaLuz",
                    "publisher": { "@id": "https://www.tumejortarifaluz.es/#organization" },
                    "url": "https://www.tumejortarifaluz.es"
                  }
                ]
              }} />
              <div className="relative w-full overflow-x-hidden">
                {children}
              </div>
            </ClientOnlyProviders>
          </ThemeProvider>
        </AuthProvider>

        {/* Deferred Analytics & GTM - Manual 5s delay to save main thread for LCP */}
        <Script id="gtm-delayed-loader" strategy="afterInteractive">
          {`
            setTimeout(() => {
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KMVCF4NV');
            }, 5000);
          `}
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
                  "@id": "https://www.tumejortarifaluz.es/#organization",
                  "@type": "Organization",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "availableLanguage": "Spanish",
                    "contactType": "customer support",
                    "email": "contacto@tumejortarifaluz.es"
                  },
                  "founder": { "@type": "Person", "name": "Iván González" },
                  "foundingDate": "2025",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.tumejortarifaluz.es/Logo.png"
                  },
                  "name": "TuMejorTarifaLuz",
                  "url": "https://www.tumejortarifaluz.es"
                },
                {
                  "@id": "https://www.tumejortarifaluz.es/#website",
                  "@type": "WebSite",
                  "name": "TuMejorTarifaLuz",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "query-input": "required name=search_term_string",
                    "target": "https://www.tumejortarifaluz.es/tarifas?q={search_term_string}"
                  },
                  "publisher": {
                    "@id": "https://www.tumejortarifaluz.es/#organization"
                  },
                  "url": "https://www.tumejortarifaluz.es"
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
