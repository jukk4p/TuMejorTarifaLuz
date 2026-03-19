import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { blogPosts } from "@/lib/blogData";
import JsonLd, { webAppSchema, faqSchema, getBreadcrumbSchema, webSiteSchema, organizationSchema } from "@/components/seo/JsonLd";
import ElectricityPriceWidget from "@/components/layout/ElectricityPriceWidget";
import ElectricityPriceSkeleton from "@/components/layout/ElectricityPriceSkeleton";
import { CloudUpload, TrendingDown, FileText, Brain, PiggyBank, ChevronDown, Newspaper, ArrowRight, UserPlus, CheckCircle, Bell, BarChart3, History as HistoryIcon, TrendingUp, Heart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-glow-1 {
          position: absolute;
          top: 0;
          left: 25%;
          width: 500px;
          height: 500px;
          background: rgba(19, 127, 236, 0.1);
          border-radius: 9999px;
          filter: blur(120px);
          transform: translateY(-50%);
          opacity: 0.6;
          z-index: 0;
        }
        .hero-glow-2 {
          position: absolute;
          bottom: 0;
          right: 25%;
          width: 384px;
          height: 384px;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 9999px;
          filter: blur(100px);
          transform: translateY(50%);
          opacity: 0.3;
          z-index: 0;
        }
      `}} />
      <Navbar />
      <JsonLd data={webSiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={getBreadcrumbSchema([
        { name: "Inicio", item: "/" },
        { name: "Comparador de Tarifas", item: "/comparador" }
      ])} />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-20 min-h-[70vh] flex items-center bg-gradient-to-br from-background via-primary/5 to-background">
          {/* Subtle Glow Layer (Static CSS - Inlined for Performance) */}
          <div className="hero-glow-1"></div>
          <div className="hero-glow-2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-white font-body text-xs font-semibold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Motor de comparación 2026 - Actualizado hoy
                </div>
                <h1 className="font-heading text-5xl font-bold text-text-primary leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                  Comparador de <span className="text-primary">tarifas de luz</span> gratis para ahorrar en tu factura
                </h1>
                <p className="font-body text-lg font-normal text-text-secondary max-w-xl leading-relaxed mt-4">
                  Analizamos tu consumo real en segundos. Sube tu factura o introduce tus datos y obtén el mejor precio del mercado sin complicaciones ni llamadas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/comparador?mode=upload" className="flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-primary hover:bg-primary-hover text-white font-body font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 text-sm md:text-base">
                    <CloudUpload size={20} />
                    Subir mi factura
                  </Link>
                  <Link href="/comparador?mode=manual" className="flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-surface border-2 border-border hover:border-primary/40 text-text-secondary font-body font-semibold rounded-xl transition-all text-sm md:text-base">
                    Introducir datos manualmente
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 pt-6 text-center sm:text-left">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop"
                    ].map((src, i) => (
                      <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-surface overflow-hidden shadow-sm relative z-10 bg-surface-2">
                        <Image alt="" className="w-full h-full object-cover" src={src} width={40} height={40} quality={60} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] md:text-sm text-text-secondary max-w-[250px] sm:max-w-none">
                    Forma parte de la comunidad de <span className="font-bold text-text-primary underline decoration-border underline-offset-4">miles de familias</span> que ya han tomado el control de su gasto energético.
                  </p>
                </div>
              </div>

              <div className="relative lg:block hidden perspective-1000">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent-bg rounded-full blur-3xl"></div>
                <div className="relative premium-card premium-3d-card overflow-hidden !border-8 !border-surface rounded-[2.5rem]">
                  <Image
                    alt="Familia real ahorrando en su moderna cocina con Tu Mejor Tarifa Luz"
                    className="w-full aspect-[4/3] object-cover scale-105"
                    src="/family-kitchen.webp"
                    width={800}
                    height={600}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-5 bg-surface backdrop-blur-md rounded-2xl shadow-2xl border border-border">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-accent/20 rounded-2xl text-accent flex items-center justify-center shrink-0">
                        <TrendingDown size={32} className="text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted tracking-[0.15em]">Ahorro medio anual</p>
                        <p className="font-heading text-4xl font-bold text-text-primary tracking-tight flex items-baseline gap-2">
                          312,00€ <span className="text-[12px] font-bold text-savings uppercase tracking-wider">(-38%)</span>
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
        <section className="py-8 md:py-12 bg-background overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<ElectricityPriceSkeleton />}>
              <ElectricityPriceWidget />
            </Suspense>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="como-funciona" className="py-24 bg-background relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-semibold text-text-primary mb-4">¿Cómo funciona nuestro comparador?</h2>
              <p className="text-lg text-text-secondary">Nuestro proceso inteligente elimina la complejidad de las facturas de luz en tres pasos sencillos.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-surface-2 -z-0"></div>

              <div className="relative z-10 text-center group">
                <div className="w-12 h-12 mx-auto bg-surface border-2 border-border rounded-full flex items-center justify-center mb-6 group-hover:border-primary group-hover:shadow-xl transition-all duration-300">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                </div>
                <h3 className="font-heading text-xl font-medium text-text-primary mb-3">Sube tu factura</h3>
                <p className="font-body text-sm font-normal text-text-secondary">Arrastra tu PDF. Analizamos potencias contratadas, consumos por tramos y servicios adicionales.</p>
              </div>

              <div className="relative z-10 text-center group">
                <div className="w-12 h-12 mx-auto bg-surface border-2 border-border rounded-full flex items-center justify-center mb-6 group-hover:border-primary group-hover:shadow-xl transition-all duration-300">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Brain size={20} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                </div>
                <h3 className="font-heading text-xl font-medium text-text-primary mb-3">Análisis Matemático</h3>
                <p className="font-body text-sm font-normal text-text-secondary">Nuestro algoritmo avanzado cruza tu perfil de consumo real con el mercado actual en tiempo real.</p>
              </div>

              <div className="relative z-10 text-center group">
                <div className="w-12 h-12 mx-auto bg-surface border-2 border-border rounded-full flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-xl transition-all duration-300">
                  <div className="w-8 h-8 bg-accent-bg rounded-full flex items-center justify-center text-accent-bg-text group-hover:scale-110 transition-transform">
                    <PiggyBank size={20} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-text rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                </div>
                <h3 className="font-heading text-xl font-medium text-text-primary mb-3">Descubre tu ahorro</h3>
                <p className="font-body text-sm font-normal text-text-secondary">Recibe una recomendación personalizada con la tarifa que realmente te hará ahorrar cada mes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="pb-24 pt-12 bg-background scroll-mt-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl font-semibold text-text-primary mb-4">Preguntas Frecuentes</h2>
              <p className="text-lg text-text-secondary">Todo lo que necesitas saber sobre nuestro motor de comparación.</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "¿Es seguro subir mi factura?",
                  a: "Absolutamente. Utilizamos cifrado de nivel bancario (SSL/TLS) y protocolos de seguridad avanzada. Tu factura solo se procesa para extraer los datos técnicos necesarios; no almacenamos datos personales sensibles ni los vendemos a terceros. Tu privacidad es nuestro compromiso número uno."
                },
                {
                  q: "¿Cómo se analizan los datos?",
                  a: "Nuestra tecnología de OCR de última generación escanea tu factura en milisegundos. Identificamos automáticamente tu CUPS (anonimizado), potencias contratadas y perfiles de consumo horario. Cruzamos esta información con todas las ofertas vigentes del mercado para encontrar tu pareja ideal de ahorro."
                },
                {
                  q: "¿Tengo que cambiarme de compañía tras el análisis?",
                  a: "En absoluto. El comparador es una herramienta de consulta totalmente libre. Te mostramos cuánto podrías ahorrar y con qué proveedor, pero la decisión final de contratar o no es siempre tuya. No hay compromisos ni llamadas comerciales intrusivas."
                },
                {
                  q: "¿Tengo que pagar por usar el comparador?",
                  a: "Nunca. TuMejorTarifaLuz es un proyecto independiente y 100% gratuito. Nuestro objetivo es democratizar el acceso a la información energética. Si decides cambiarte, te facilitamos el enlace directo a la web oficial de la compañía para que hagas el trámite tú mismo, sin intermediarios.",
                  success: true
                },
                {
                  q: "¿Las tarifas están actualizadas?",
                  a: "Sintonizamos nuestro motor diariamente con el mercado mayorista (OMIE) y las bases de datos oficiales de las comercializadoras. Si una compañía lanza una oferta nueva en España, nosotros la tenemos en el comparador en menos de 24 horas."
                },
                {
                  q: "¿Sirve para empresas o solo para hogares?",
                  a: "Nuestro motor actual está optimizado para tarifas domésticas y pymes (tarifas 2.0TD, hasta 15kW). Si eres una gran industria con perfiles 3.0TD o superiores, contacta con nosotros para un análisis personalizado por uno de nuestros técnicos asociados."
                },
                {
                  q: "¿Qué ahorro medio puedo esperar?",
                  a: "Depende de tu contrato actual, pero de media, nuestros usuarios detectan un ahorro potencial de entre el 25% y el 40% anual. En cifras reales, esto suele suponer entre 200€ y 450€ de ahorro simplemente ajustando la tarifa a su consumo real."
                },
                {
                  q: "¿Cómo puedo contactar con vosotros?",
                  a: "¿Tienes una duda técnica o no entiendes un resultado? Escríbenos a hola@tumejortarifaluz.es. Responderemos a tu consulta personalizada lo antes posible. Somos personas reales ayudando a personas."
                }
              ].map((faq, i) => (
                <details key={i} className="group premium-card overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer select-none list-none">
                    <span className="font-heading text-base font-medium text-text-primary">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-open:rotate-180 ${faq.success ? "bg-accent-bg text-accent-bg-text" : "bg-primary/10 text-primary"}`}>
                      <ChevronDown size={20} />
                    </div>
                  </summary>
                  <div className="font-body text-sm font-normal px-6 pb-6 text-text-secondary leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge Center Section */}
        <section id="guias" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                  <Newspaper size={14} />
                  Blog & Noticias
                </div>
                <h2 className="font-heading text-3xl font-semibold text-text-primary tracking-tight">Consejos para ahorrar en tu recibo</h2>
                <p className="text-lg text-text-secondary leading-relaxed">Aprende a navegar el mercado eléctrico con la información de nuestros expertos.</p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all">
                Ver todo el blog
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 6).map((post, i) => (
                <Link key={i} href={`/blog/${post.slug}`} className="group premium-card premium-3d-card p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border border-border">
                  <p className="font-body text-xs font-normal opacity-60 text-text-muted uppercase tracking-widest mb-6">{post.date}</p>
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 group-hover:text-primary transition-colors leading-tight min-h-[3.5rem] line-clamp-2">{post.title}</h3>
                  <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-surface-2">
                    <Image src={post.image} alt={post.imageAlt} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-grow">{post.excerpt}</p>
                  <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-primary tracking-widest">Leer artículo completo<span className="sr-only"> sobre {post.title}</span></span>
                    <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" size={24} aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-surface dark:bg-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mb-48 opacity-30"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="font-heading text-3xl font-semibold text-text-primary tracking-tight leading-tight">
                    Toma el control total de <br />
                    <span className="text-primary italic">tu factura de luz</span>
                  </h2>
                  <p className="text-xl text-text-secondary leading-relaxed">
                    Al registrarte en TuMejorTarifaLuz, accedes a herramientas avanzadas diseñadas para maximizar tu ahorro a largo plazo.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: "analytics", title: "Estudio de Ahorro", desc: "Accede al desglose mensual y anual de tu ahorro real con la nueva tarifa: distribución de costes entre energía y potencia, y proyección de impacto sobre tu factura." },
                    { icon: "brain", title: "Análisis IA Personalizado", desc: "Cada tarifa genera un análisis único adaptado a tu perfil: tipo de contrato, origen del ahorro, fracturas de permanencia y recomendaciones concretas para maximizar tu beneficio." },
                    { icon: "heart", title: "Tarifas favoritas", desc: "Guarda las ofertas más interesantes en tu lista para compararlas fácilmente y recibir avisos cuando cambien sus condiciones o price." },
                    { icon: "bell", title: "Sistema de alertas", desc: "Recibe avisos personalizados en tiempo real cuando detectemos una tarifa que mejore automáticamente tu contrato actual." }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-surface transition-all duration-300">
                        {benefit.icon === 'analytics' && <BarChart3 size={24} />}
                        {benefit.icon === 'brain' && <Brain size={24} />}
                        {benefit.icon === 'heart' && <Heart size={24} />}
                        {benefit.icon === 'bell' && <Bell size={24} />}
                        {benefit.icon === 'description' && <FileText size={24} />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading text-base font-semibold text-text-primary group-hover:text-primary transition-colors">{benefit.title}</h4>
                        <p className="font-body text-sm font-normal text-text-secondary leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/?auth=register" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-body font-semibold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Crear mi cuenta gratuita
                    <UserPlus size={20} className="ml-2" />
                  </Link>
                  <Link href="/comparador" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-surface/50 backdrop-blur-sm border border-border hover:border-primary/30 hover:bg-surface text-text-muted hover:text-text-primary font-body font-bold text-sm tracking-tight rounded-2xl transition-all group active:scale-95 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <CheckCircle size={16} className="transition-transform group-hover:scale-110" />
                    </div>
                    O usa el comparador sin registro
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block relative">
                {/* Visual Backdrop Glows */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-accent/20 rounded-full blur-[80px] animate-pulse delay-700"></div>

                <div className="bg-surface/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-border shadow-3xl relative overflow-hidden group/skeleton">
                  {/* Glassmorphism Shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover/skeleton:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-border/40 pb-7">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md animate-pulse"></div>
                          <div className="w-14 h-14 bg-surface-2 rounded-2xl relative z-10 border border-border"></div>
                        </div>
                        <div className="space-y-2.5">
                          <div className="w-40 h-3.5 bg-surface-2 rounded-full animate-pulse"></div>
                          <div className="w-28 h-2 bg-surface-2/60 rounded-full animate-pulse delay-300"></div>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                        <Bell size={18} className="text-primary animate-bounce" />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="h-44 bg-surface-2/30 rounded-[2rem] border border-border/40 flex items-center justify-center relative overflow-hidden group/chart">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>
                        <BarChart3 size={64} className="text-primary/20 group-hover/chart:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="h-24 bg-surface-2/40 rounded-3xl border border-border/60 relative overflow-hidden">
                          <div className="absolute top-3 left-3 w-8 h-1 bg-primary/20 rounded-full"></div>
                        </div>
                        <div className="h-24 bg-surface-2/40 rounded-3xl border border-border/60 relative overflow-hidden">
                          <div className="absolute top-3 left-3 w-8 h-1 bg-accent/20 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Logos Grid Section */}
        <section className="py-24 bg-surface-2 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading text-3xl font-semibold text-text-primary">Comparamos entre las mejores comercializadoras</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
              {[
                { name: "Iberdrola", logo: "Iberdrola.png", scale: "scale-145", slug: "iberdrola" },
                { name: "Endesa", logo: "Endesa.png", scale: "scale-60", slug: "endesa" },
                { name: "Naturgy", logo: "Naturgy.png", scale: "scale-130", slug: "naturgy" },
                { name: "Repsol", logo: "Repsol.png", darkLogo: "Repsolv1.png", scale: "scale-135", slug: "repsol" },
                { name: "Octopus", logo: "Octopus.png", darkLogo: "Octopusv1.png", scale: "scale-120", slug: "octopus-energy" },
                { name: "TotalEnergies", logo: "TotalEnergies.png", scale: "scale-110", slug: "total-energies" },
                { name: "Niba", logo: "Nibav1.png", darkLogo: "Niba.png", lightScale: "scale-100", darkScale: "scale-100", slug: "niba" },
                { name: "Imagina", logo: "Imaginaenergia.png", scale: "scale-125", slug: "imagina-energia" },
                { name: "Visalia", logo: "Visalia.png", scale: "scale-85", slug: "visalia" },
                { name: "Energía Nufri", logo: "Energianufri.png", darkLogo: "Energianufriv1.png", slug: "energia-nufri" },
                { name: "Energya VM", logo: "Energiavm.png", scale: "scale-120", slug: "energia-vm" },
                { name: "CHC Energía", logo: "Chcenergia.png", scale: "scale-125", slug: "chc-energia" },
                { name: "Esluz", logo: "Esluz.png", scale: "scale-155", slug: "esluz" },
                { name: "COR", logo: "Comercializadoras-de-referencia.png", scale: "scale-110", slug: "comercializadoras-referencia" },
              ].map((brand, i) => (
                <Link key={i} href={`/companias/${brand.slug}`} className="flex flex-col items-center gap-3 group">
                  <div className="w-full aspect-[16/9] bg-surface rounded-2xl p-4 flex items-center justify-center premium-card !shadow-sm group-hover:!shadow-xl transition-all duration-300 border border-border group-hover:border-primary/30 group-hover:-translate-y-1">
                    {brand.darkLogo ? (
                      <>
                        <Image src={`/logos/${brand.logo}`} alt={brand.name} width={120} height={40} unoptimized className={`max-h-10 max-w-full object-contain transition-all duration-500 dark:hidden ${(brand as any).lightScale || brand.scale || ""}`} />
                        <Image src={`/logos/${brand.darkLogo}`} alt={brand.name} width={120} height={40} unoptimized className={`max-h-10 max-w-full object-contain transition-all duration-500 hidden dark:block ${(brand as any).darkScale || brand.scale || ""}`} />
                      </>
                    ) : (
                      <Image src={`/logos/${brand.logo}`} alt={brand.name} width={120} height={40} unoptimized className={`max-h-10 max-w-full object-contain transition-all duration-500 ${brand.scale || ""}`} />
                    )}
                  </div>
                  <span className="font-body text-xs font-medium text-text-muted tracking-widest uppercase group-hover:text-primary transition-colors">{brand.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/companias"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-surface border border-border text-text-secondary font-bold hover:shadow-xl transition-all group"
              >
                Ver análisis detallado y opiniones de comercializadoras
                <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto bg-primary rounded-[2rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            <h2 className="font-heading text-3xl font-semibold mb-6 relative z-10">¿Listo para dejar de pagar de más?</h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Solo necesitas 30 segundos para subir tu factura. Nuestro motor de optimización hará el resto del trabajo por ti.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/comparador?mode=upload" className="px-10 py-5 bg-white text-primary font-body font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-black/10 hover:scale-105 active:scale-95 duration-200">
                Comenzar análisis gratuito
              </Link>
              <Link href="/tarifas" className="px-10 py-5 bg-white/10 border border-white/30 text-white font-body font-semibold rounded-xl hover:bg-white/20 transition-colors duration-200">
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
