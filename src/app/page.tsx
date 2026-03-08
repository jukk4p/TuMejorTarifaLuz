import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { getElectricityPrices } from "@/lib/electricity-prices";
import { blogPosts } from "@/lib/blogData";
import JsonLd, { webAppSchema } from "@/components/seo/JsonLd";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const pricesData = await getElectricityPrices();

  const prices = pricesData || {
    current: 0.1250,
    average: 0.1100,
    min: 0.0800,
    minHour: "--:--",
    max: 0.2000,
    maxHour: "--:--",
    time: "--:--",
    isLive: false,
    allHours: []
  };
  return (
    <>
      <Navbar />
      <JsonLd data={webAppSchema} />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Motor de comparación 2026 - Actualizado hoy
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-900 text-slate-900 dark:text-white leading-[1.05] tracking-tight">
                  Comparador de <span className="text-primary">tarifas de luz</span> gratis para ahorrar en tu factura
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mt-4">
                  Analizamos tu consumo real en segundos. Sube tu factura o introduce tus datos y obtén el mejor precio del mercado sin complicaciones ni llamadas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/comparador?mode=upload" className="flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 text-sm md:text-base">
                    <span className="material-icons text-xl">cloud_upload</span>
                    Subir mi factura
                  </Link>
                  <Link href="/comparador?mode=manual" className="flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary/40 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all text-sm md:text-base">
                    Introducir datos manualmente
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 pt-6 text-center sm:text-left">
                  <div className="flex -space-x-3">
                    {[
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgJZQLt6-Fyqf7_moqrzPYfb7hYORGQiwwLlbzBqJe1WMBjd-d993iGNPMVfgZ_BPSPmM15QjwwXJRgavLxf79XiNjkv0N-3F-9l2b2VOoiO5seRHx4F7P9XLYm6oR13ntO5S4FU9kVavHjge-6qa25Po0lpR5Wk6LzrW38qQT1hB7RPp4PWFYh-BIjdWAoxiqZKXKhxKbZ7rwVnmXN8Z9ULQzoI6W7bBRA94b9nxE7jWybm0oFuBTHomGLUOtnoAemEIZ9wf1gpw",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBli1BMN222idiRlnhliAhCGByaT_VOnwaUcrEhoCMrbY5F82v499DlVDa4FaeT50R3eCtd_oVQXiZeG8FwdFLh7HpnDE-UVH-NsPrjtrq7-O6z0d_IgqMeZtX9Y4kX53AIeE8w_KZuNM-FWQSgzKezNBK_umbtEPXzKgirmjs8OUm8MAP5tkjDO1dJHpMJTDGQY9Wh9NXrCrb_nPSBQr92BCs-UTajK5eVFeAsT-R1rjhyJKyWvudIfUsbnRrxbrm2qXMZ5ADpAM",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuB84wJGq-7l9kzTmEL8gIZ5gA8DN4CkAQ8juywJhHG8EidRWw_dsheDrH-P1ZtG5YPaHx7KeIkDqH-lYSkDtoGJCWre0crF0bN32ihXd7eqiKgonkFEVCFxl79gzzzWAr9-RUS_TYVpE_bXRH272UKZyq4b0rfpqlGBQnauln_LpXxqvCzewwIq5snDHR7U-zS_ljytqxyzqEG4vB8T_RMM1HZUnfIhnmDzQnZP8kWY5bapSRP2j4OeAxkZ1zU_elmTslpxVBA3XCg"
                    ].map((src, i) => (
                      <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden shadow-sm relative z-10 bg-slate-100 dark:bg-slate-800">
                        <Image alt="" className="w-full h-full object-cover" src={src} width={40} height={40} quality={80} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 max-w-[200px] sm:max-w-none">
                    Únete a las <span className="font-bold text-slate-800 dark:text-slate-100 underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4">primeras familias</span> que ya están optimizando su factura
                  </p>
                </div>
              </div>

              <div className="relative lg:block hidden perspective-1000">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-success/10 rounded-full blur-3xl"></div>
                <div className="relative premium-card premium-3d-card overflow-hidden !border-8 !border-white dark:!border-slate-800 rounded-[2.5rem]">
                  <Image
                    alt="Happy family in their modern energy efficient kitchen"
                    className="w-full aspect-[4/3] object-cover scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuClS9NHFc7VEE6wgqxL4w3PtcYpeM-RMSaiMOc_W8EPB7RQ8Nx9PksvClT5BQDNrbs3uYNfA1rae4CFWMRvfKM3tUOIgzD8Aa3oU-T_VC3OdAm-LkqgHCPwXuVNxIJa3pD32GYQOy28Yr95R9yzKcTg8gUGHwhTZ7MAx2wTnDzYC8FbPzeMYvb67vRG9-gDR0JoNeJJ7r5aeC4jpkaqGuIrb9jbMeLriooSPlONL357HBqMjrwF03OaZgfaa3aF-E2FptDbq-OR3iQ"
                    width={800}
                    height={600}
                    priority
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-success/20 rounded-2xl text-success flex items-center justify-center shrink-0">
                        <span className="material-icons text-3xl font-bold">trending_down</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">Ahorro medio anual</p>
                        <p className="text-3xl font-900 text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2">
                          312,00€ <span className="text-[12px] font-bold text-success uppercase tracking-wider">(-38%)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Electricity Price Widget */}
        <section className="py-8 md:py-12 bg-white dark:bg-background-dark overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative premium-card p-6 md:p-10 overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
                <span className="material-icons text-[120px] md:text-[160px]">bolt</span>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative z-10">
                <div className="text-center md:text-left space-y-4 max-w-md w-full">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-primary">
                    <span className="material-icons text-xl md:text-2xl">bolt_outline</span>
                    <h3 className="text-sm md:text-base font-bold tracking-tight whitespace-nowrap">Precio de la Luz Hoy</h3>
                    <div className="flex items-center gap-2">
                      {prices.isLive ? (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-success/10 text-success rounded text-[7px] md:text-[8px] font-bold uppercase tracking-wider">
                          <span className="w-1 h-1 bg-success rounded-full animate-pulse"></span>
                          En vivo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded text-[7px] md:text-[8px] font-bold uppercase tracking-wider">
                          Muestra
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-0">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">MEDIA NACIONAL POOL</p>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                      <span className="text-5xl md:text-6xl font-800 text-slate-900 dark:text-white tracking-tight leading-none">{prices.average.toFixed(4)}</span>
                      <span className="text-base md:text-lg font-bold text-slate-400">€/kWh</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-[10px] md:text-[11px] font-bold">
                      <span className="material-icons text-xs md:text-sm">trending_down</span>
                      {prices.current < prices.average ? 'Bajo media' : 'Estable'}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] md:text-[11px] font-bold">
                      <span className="material-icons text-xs md:text-sm">update</span>
                      {prices.time}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto">
                  <div className="bg-slate-50/50 dark:bg-slate-800/20 p-3 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 text-center space-y-2 min-w-[110px] md:min-w-[130px]">
                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mínimo</p>
                    <p className="text-base md:text-xl font-800 text-success">{prices.min.toFixed(4)}€</p>
                    <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] font-bold text-slate-400/70">
                      <span className="material-icons text-[12px] md:text-[14px]">schedule</span>
                      {prices.minHour}
                    </div>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-800/20 p-3 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 text-center space-y-2 min-w-[110px] md:min-w-[130px]">
                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Máximo</p>
                    <p className="text-base md:text-xl font-800 text-slate-900 dark:text-white">{prices.max.toFixed(4)}€</p>
                    <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] font-bold text-slate-400/70">
                      <span className="material-icons text-[12px] md:text-[14px]">schedule</span>
                      {prices.maxHour}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <span className="material-icons text-sm text-primary">info</span>
                  <p className="text-[11px] leading-relaxed italic">
                    POOL mayorista. Si tienes **tarifa fija**, tu precio no depende de estos valores.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-bold border border-primary/10 uppercase tracking-tight">
                  <span className="material-icons text-xs">no_accounts</span>
                  Comparator de uso libre sin registro
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="como-funciona" className="py-24 bg-white dark:bg-background-dark relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-800 text-slate-900 dark:text-white mb-4">¿Cómo funciona nuestro comparador?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Nuestro proceso inteligente elimina la complejidad de las facturas de luz en tres pasos sencillos.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>

              <div className="relative z-10 text-center group">
                <div className="w-12 h-12 mx-auto bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:border-primary group-hover:shadow-xl transition-all duration-300">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons text-xl">upload_file</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                </div>
                <h3 className="text-xl font-800 text-slate-900 dark:text-white mb-3">Sube tu factura</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Arrastra tu PDF. Analizamos potencias contratadas, consumos por tramos y servicios adicionales.</p>
              </div>

              <div className="relative z-10 text-center group">
                <div className="w-12 h-12 mx-auto bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:border-primary group-hover:shadow-xl transition-all duration-300">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons text-xl">psychology</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                </div>
                <h3 className="text-xl font-800 text-slate-900 dark:text-white mb-3">Análisis Matemático</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Nuestro algoritmo avanzado cruza tu perfil de consumo real con el mercado actual en tiempo real.</p>
              </div>

              <div className="relative z-10 text-center group">
                <div className="w-12 h-12 mx-auto bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:border-success group-hover:shadow-xl transition-all duration-300">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                    <span className="material-icons text-xl">savings</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                </div>
                <h3 className="text-xl font-800 text-slate-900 dark:text-white mb-3">Descubre tu ahorro</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Recibe una recomendación personalizada con la tarifa que realmente te hará ahorrar cada mes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="pb-24 pt-12 bg-background-light dark:bg-slate-900/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "¿Es seguro subir mi factura?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Absolutamente. Utilizamos protocolos de cifrado de nivel bancario (SSL/TLS) para proteger tus archivos. Solo extraemos los datos necesarios para el análisis y no compartimos tu información personal con terceros sin tu consentimiento explícito. Tu privacidad es nuestra prioridad absoluta."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Cómo se analizan los datos?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Nuestra tecnología de Procesamiento de Datos y OCR de última generación escanea tu factura en milisegundos. Identifica automáticamente tu CUPS, potencia contratada, consumo horario y los conceptos facturados para entender exactamente qué estás pagando y dónde están las oportunidades de ahorro."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Tengo que pagar por usar el comparador?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No, el uso de nuestra plataforma es 100% gratuito. Este es un proyecto independiente que busca ayudar a los usuarios a ahorrar de forma altruista. Los enlaces que proporcionamos son los oficiales de cada comercializadora y no recibimos comisión alguna por las contrataciones."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Las tarifas están actualizadas?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sí, nuestra base de datos se sincroniza en tiempo real con las ofertas publicadas por las comercializadoras y el mercado mayorista (OMIE). Revisamos y actualizamos más de 25 tarifas diariamente para asegurarnos de que siempre veas la opción más competitiva disponible en el mercado español."
                      }
                    }
                  ]
                })
              }}
            />
            <div className="text-center mb-16">
              <h2 className="text-3xl font-800 text-slate-900 dark:text-white mb-4">Preguntas Frecuentes</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Todo lo que necesitas saber sobre nuestro motor de comparación.</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "¿Es seguro subir mi factura?",
                  a: "Absolutamente. Utilizamos protocolos de cifrado de nivel bancario (SSL/TLS) para proteger tus archivos. Solo extraemos los datos necesarios para el análisis y no compartimos tu información personal con terceros sin tu consentimiento explícito. Tu privacidad es nuestra prioridad absoluta."
                },
                {
                  q: "¿Cómo se analizan los datos?",
                  a: "Nuestra tecnología de Procesamiento de Datos y OCR de última generación escanea tu factura en milisegundos. Identifica automáticamente tu CUPS, potencia contratada, consumo horario y los conceptos facturados para entender exactamente qué estás pagando y dónde están las oportunidades de ahorro."
                },
                {
                  q: "¿Tengo que pagar por usar el comparador?",
                  a: "No, el uso de nuestra plataforma es 100% gratuito. Este es un proyecto independiente y altruista diseñado para ayudar a las familias a ahorrar en su factura de la luz. Proporcionamos enlaces oficiales directos a las comercializadoras y no percibimos ningún tipo de comisión por ello.",
                  success: true
                },
                {
                  q: "¿Las tarifas están actualizadas?",
                  a: "Sí, nuestra base de datos se sincroniza en tiempo real con las ofertas publicadas por las comercializadoras y el mercado mayorista (OMIE). Revisamos y actualizamos más de 25 tarifas diariamente para asegurarnos de que siempre veas la opción más competitiva disponible en el mercado español."
                }
              ].map((faq, i) => (
                <details key={i} className="group premium-card overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer select-none list-none">
                    <span className="text-lg font-700 text-slate-900 dark:text-white">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-open:rotate-180 ${faq.success ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                      <span className="material-icons">expand_more</span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge Center Section */}
        <section id="guias" className="py-24 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                  <span className="material-icons text-sm">newspaper</span>
                  Blog & Noticias
                </div>
                <h2 className="text-4xl md:text-5xl font-800 text-slate-900 dark:text-white tracking-tight">Consejos para ahorrar en tu recibo</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">Aprende a navegar el mercado eléctrico con la información de nuestros expertos.</p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all">
                Ver todo el blog
                <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 6).map((post, i) => (
                <Link key={i} href={`/blog/${post.id}`} className="group premium-card premium-3d-card p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border border-slate-50 dark:border-slate-800/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{post.date}</p>
                  <h3 className="text-xl font-800 text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                  <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image src={post.image} alt={post.imageAlt} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">{post.excerpt}</p>
                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Leer artículo completo<span className="sr-only"> sobre {post.title}</span></span>
                    <span className="material-icons text-primary group-hover:translate-x-2 transition-transform" aria-hidden="true">east</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-slate-900 dark:bg-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mb-48 opacity-30"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-800 text-white tracking-tight leading-tight">
                    Toma el control total de <br />
                    <span className="text-primary italic">tu factura de luz</span>
                  </h2>
                  <p className="text-xl text-slate-400 leading-relaxed">
                    Al registrarte en TuMejorTarifaLuz, accedes a herramientas avanzadas diseñadas para maximizar tu ahorro a largo plazo.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: "history", title: "Historial de Análisis", desc: "Guarda tus comparativas y observa cómo evoluciona tu ahorro año tras año." },
                    { icon: "analytics", title: "Seguimiento Real", desc: "Monitoriza tus consumos y recibe alertas cuando aparezca una tarifa mejor." },
                    { icon: "description", title: "Gestor de Facturas", desc: "Almacena tus facturas PDF de forma segura y organizada en un solo lugar." },
                    { icon: "auto_graph", title: "Optimización Pro", desc: "Accede a predicciones basadas en el mercado mayorista personalizadas para ti." }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-primary">{benefit.icon}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white">{benefit.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/mi-cuenta" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Crear mi cuenta gratuita
                    <span className="material-icons ml-2">person_add</span>
                  </Link>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-icons text-sm">check_circle</span>
                    O usa el comparador sin registro
                  </p>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[3rem] border border-white/10 shadow-3xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="w-32 h-3 bg-slate-700 rounded animate-pulse"></div>
                          <div className="w-24 h-2 bg-slate-800 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-icons text-primary text-sm">notifications</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-40 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-center">
                        <span className="material-icons text-6xl text-slate-700">insights</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-slate-800/50 rounded-2xl border border-white/5"></div>
                        <div className="h-20 bg-slate-800/50 rounded-2xl border border-white/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Logos Grid Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-800 text-slate-900 dark:text-white">Comparamos entre las mejores comercializadoras</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
              {[
                { name: "Iberdrola", logo: "Iberdrola.png", scale: "scale-145" },
                { name: "Endesa", logo: "Endesa.png", scale: "scale-60" },
                { name: "Naturgy", logo: "Naturgy.png", scale: "scale-130" },
                { name: "Repsol", logo: "Repsol.png", darkLogo: "Repsolv1.png", scale: "scale-135" },
                { name: "Octopus", logo: "Octopus.png", darkLogo: "Octopusv1.png", scale: "scale-120" },
                { name: "TotalEnergies", logo: "TotalEnergies.png", scale: "scale-110" },
                { name: "Niba", logo: "Nibav1.png", darkLogo: "Niba.png", lightScale: "scale-100", darkScale: "scale-100" },
                { name: "Imagina", logo: "Imaginaenergia.png", scale: "scale-125" },
                { name: "Visalia", logo: "Visalia.png", scale: "scale-85" },
                { name: "Nufri", logo: "Energianufri.png", darkLogo: "Energianufriv1.png" },
                { name: "Energya VM", logo: "Energiavm.png", scale: "scale-120" },
                { name: "CHC Energía", logo: "Chcenergia.png", scale: "scale-125" },
                { name: "Esluz", logo: "Esluz.png", scale: "scale-155" },
              ].map((brand, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-full aspect-[16/9] bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-center premium-card !shadow-sm group hover:!shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                    {brand.darkLogo ? (
                      <>
                        <Image src={`/logos/${brand.logo}`} alt={brand.name} width={120} height={40} className={`max-h-10 max-w-full object-contain transition-all duration-500 dark:hidden ${(brand as any).lightScale || brand.scale || ""}`} />
                        <Image src={`/logos/${brand.darkLogo}`} alt={brand.name} width={120} height={40} className={`max-h-10 max-w-full object-contain transition-all duration-500 hidden dark:block ${(brand as any).darkScale || brand.scale || ""}`} />
                      </>
                    ) : (
                      <Image src={`/logos/${brand.logo}`} alt={brand.name} width={120} height={40} className={`max-h-10 max-w-full object-contain transition-all duration-500 ${brand.scale || ""}`} />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 tracking-widest uppercase">{brand.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/companias"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:shadow-xl transition-all group"
              >
                Ver análisis detallado y opiniones de comercializadoras
                <span className="material-icons text-primary group-hover:translate-x-1 transition-transform">east</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto bg-primary rounded-[2rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            <h2 className="text-3xl md:text-4xl font-800 mb-6 relative z-10">¿Listo para dejar de pagar de más?</h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Solo necesitas 30 segundos para subir tu factura. Nuestro motor de optimización hará el resto del trabajo por ti.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/comparador?mode=upload" className="px-10 py-5 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg shadow-black/10 hover:scale-105 active:scale-95 duration-200">
                Comenzar análisis gratuito
              </Link>
              <Link href="/tarifas" className="px-10 py-5 bg-white/10 border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors duration-200">
                Ver tarifas actuales
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
