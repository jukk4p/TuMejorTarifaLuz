import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { getElectricityPrices } from "@/lib/electricity-prices";

export default async function Home() {
  const pricesData = await getElectricityPrices();

  const prices = pricesData || {
    current: 0.1425,
    average: 0.1125,
    min: 0.0821,
    minHour: "15:00 - 16:00",
    max: 0.2140,
    maxHour: "20:00 - 21:00",
    time: "11:31"
  };
  return (
    <>
      <Navbar />
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
                  Comparamos más de 20 tarifas para que ahorres con nuestro <span className="text-primary">comparador inteligente</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mt-4">
                  Analizamos tu consumo real en segundos. Sube tu factura o introduce tus datos y obtén el mejor precio del mercado sin complicaciones ni llamadas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/comparador?mode=upload" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-0.5">
                    <span className="material-icons">cloud_upload</span>
                    Subir mi factura
                  </Link>
                  <Link href="/comparador?mode=manual" className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary/40 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all">
                    Introducir datos manualmente
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex -space-x-3">
                    {[
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgJZQLt6-Fyqf7_moqrzPYfb7hYORGQiwwLlbzBqJe1WMBjd-d993iGNPMVfgZ_BPSPmM15QjwwXJRgavLxf79XiNjkv0N-3F-9l2b2VOoiO5seRHx4F7P9XLYm6oR13ntO5S4FU9kVavHjge-6qa25Po0lpR5Wk6LzrW38qQT1hB7RPp4PWFYh-BIjdWAoxiqZKXKhxKbZ7rwVnmXN8Z9ULQzoI6W7bBRA94b9nxE7jWybm0oFuBTHomGLUOtnoAemEIZ9wf1gpw",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBli1BMN222idiRlnhliAhCGByaT_VOnwaUcrEhoCMrbY5F82v499DlVDa4FaeT50R3eCtd_oVQXiZeG8FwdFLh7HpnDE-UVH-NsPrjtrq7-O6z0d_IgqMeZtX9Y4kX53AIeE8w_KZuNM-FWQSgzKezNBK_umbtEPXzKgirmjs8OUm8MAP5tkjDO1dJHpMJTDGQY9Wh9NXrCrb_nPSBQr92BCs-UTajK5eVFeAsT-R1rjhyJKyWvudIfUsbnRrxbrm2qXMZ5ADpAM",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuB84wJGq-7l9kzTmEL8gIZ5gA8DN4CkAQ8juywJhHG8EidRWw_dsheDrH-P1ZtG5YPaHx7KeIkDqH-lYSkDtoGJCWre0crF0bN32ihXd7eqiKgonkFEVCFxl79gzzzWAr9-RUS_TYVpE_bXRH272UKZyq4b0rfpqlGBQnauln_LpXxqvCzewwIq5snDHR7U-zS_ljytqxyzqEG4vB8T_RMM1HZUnfIhnmDzQnZP8kWY5bapSRP2j4OeAxkZ1zU_elmTslpxVBA3XCg"
                    ].map((src, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden shadow-sm relative z-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="Customer avatar" className="w-full h-full object-cover" src={src} />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
        <section className="py-12 bg-white dark:bg-background-dark overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative premium-card perspective-1000 p-8 md:p-12 overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-icons text-[200px]">bolt</span>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="text-center md:text-left space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-primary">
                    <span className="material-icons">bolt</span>
                    <h3 className="text-lg font-bold tracking-tight">Precio de la Luz Hoy</h3>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono font-bold text-slate-500">{prices.time}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">PRECIO MEDIO NACIONAL</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl md:text-7xl font-800 text-slate-900 dark:text-white tracking-tight">{prices.average.toFixed(4)}</span>
                      <span className="text-xl md:text-2xl font-bold text-slate-400">€/kWh</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-bold">
                    <span className="material-icons text-lg">trending_down</span>
                    {prices.current < prices.average ? 'Precio actual por debajo de la media' : 'Precio estable en mercado'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                  <div className="bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 text-center space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mínimo Hoy</p>
                    <p className="text-2xl font-800 text-success">{prices.min.toFixed(4)}€</p>
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400">
                      <span className="material-icons text-sm">schedule</span>
                      {prices.minHour}
                    </div>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 text-center space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Máximo Hoy</p>
                    <p className="text-2xl font-800 text-error">{prices.max.toFixed(4)}€</p>
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400">
                      <span className="material-icons text-sm">schedule</span>
                      {prices.maxHour}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-start gap-4 border border-primary/10 relative z-10">
                <span className="material-icons text-primary mt-1">info</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Datos actualizados del mercado mayorista (POOL). Recuerda que si tienes una <span className="font-bold text-slate-900 dark:text-white">tarifa fija</span>, el precio que pagas es siempre el mismo independientemente de estos valores.
                </p>
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
                        "text": "No, el uso de nuestra plataforma es 100% gratuito para los usuarios. Recibimos una pequeña comisión por parte de las comercializadoras cuando decides cambiarte a una tarifa mejor a través de nuestro enlace, lo que nos permite mantener nuestro servicio independiente y libre de costes para ti."
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
                  a: "No, el uso de nuestra plataforma es 100% gratuito para los usuarios. Recibimos una pequeña comisión por parte de las comercializadoras cuando decides cambiarte a una tarifa mejor a través de nuestro enlace, lo que nos permite mantener nuestro servicio independiente y libre de costes para ti.",
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
              {[
                {
                  id: "guia-factura-luz-2026",
                  date: "01/03/2026",
                  title: "Guía Definitiva 2026: Entiende cada concepto de tu factura de la luz",
                  desc: "Desglosamos término a término tu recibo: potencia contratada, energía consumida, peajes e impuestos para que dejes de pagar por lo que no entiendes.",
                  image: "/guides/bill_expert_analysis.png",
                },
                {
                  id: "mercado-libre-vs-regulado",
                  date: "26/02/2026",
                  title: "Mercado Libre vs Regulado (PVPC): ¿Cuál es más rentable tras la reforma?",
                  desc: "Analizamos el nuevo sistema de cálculo del PVPC frente a las tarifas fijas del mercado libre. Datos reales para una elección inteligente.",
                  image: "/guides/market_comparison.png",
                },
                {
                  id: "optimizacion-potencia-ahorro",
                  date: "20/02/2026",
                  title: "Optimización de Potencia: El ahorro directo que el 90% de los hogares ignora",
                  desc: "Te enseñamos a identificar si tienes contratada más potencia de la necesaria y cómo ajustarla para ahorrar hasta 150€ al año sin esfuerzo.",
                  image: "/guides/energy_efficiency.png",
                },
                {
                  id: "discriminacion-horaria-estrategias",
                  date: "15/02/2026",
                  title: "Discriminación Horaria: Cómo reducir un 40% tu gasto sin cambiar de hábitos",
                  desc: "Domina los tramos Punta, Llano y Valle. Estrategias prácticas para desplazar consumos críticos a las horas más económicas del día.",
                  image: "/guides/electricity_clock.png",
                },
                {
                  id: "autoconsumo-solar-pisos",
                  date: "10/02/2026",
                  title: "Autoconsumo Solar en Pisos: ¿Es posible y rentable instalar paneles en 2026?",
                  desc: "Todo sobre el autoconsumo compartido, subvenciones vigentes y plazos de amortización para comunidades de vecinos y bloques de apartamentos.",
                  image: "/guides/solar_panels.png",
                },
                {
                  id: "guia-carga-coche-electrico",
                  date: "05/03/2026",
                  title: "Carga de Vehículo Eléctrico: Cómo configurar tu tarifa para no pagar de más",
                  desc: "Analizamos las mejores tarifas para VE y cómo aprovechar la potencia en horas valle para cargar por menos de 2€.",
                  image: "/guides/ev_charging.png",
                }
              ].map((article, i) => (
                <Link key={i} href={`/blog/${article.id}`} className="group premium-card premium-3d-card p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border border-slate-50 dark:border-slate-800/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{article.date}</p>
                  <h3 className="text-xl font-800 text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight">{article.title}</h3>
                  <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">{article.desc}</p>
                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Leer artículo completo</span>
                    <span className="material-icons text-primary group-hover:translate-x-2 transition-transform">east</span>
                  </div>
                </Link>
              ))}
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
                        <img src={`/logos/${brand.logo}`} alt={brand.name} className={`max-h-10 max-w-full object-contain transition-all duration-500 dark:hidden ${(brand as any).lightScale || brand.scale || ""}`} />
                        <img src={`/logos/${brand.darkLogo}`} alt={brand.name} className={`max-h-10 max-w-full object-contain transition-all duration-500 hidden dark:block ${(brand as any).darkScale || brand.scale || ""}`} />
                      </>
                    ) : (
                      <img src={`/logos/${brand.logo}`} alt={brand.name} className={`max-h-10 max-w-full object-contain transition-all duration-500 ${brand.scale || ""}`} />
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
