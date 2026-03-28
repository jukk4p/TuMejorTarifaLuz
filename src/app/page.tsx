import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { blogPosts } from "@/lib/blogData";
import JsonLd, { webAppSchema, faqSchema, getBreadcrumbSchema, webSiteSchema, organizationSchema } from "@/components/seo/JsonLd";
import SupportSection from "@/components/ui/SupportSection";
import SocialProof from "@/components/ui/SocialProof";
import { CloudUpload, TrendingDown, FileText, Brain, PiggyBank, ChevronDown, Newspaper, ArrowRight, UserPlus, CheckCircle, Bell, BarChart3, History as HistoryIcon, TrendingUp, Heart, Search, Zap } from "lucide-react";
import { getElectricityPrices } from "@/lib/energy-prices";
import UrgencyBar from "@/components/ui/UrgencyBar";
import { AvatarInitials } from "@/components/ui/AvatarInitials";
import DynamicHeroCard from "@/components/ui/DynamicHeroCard";
import DynamicHeroSavings from "@/components/ui/DynamicHeroSavings";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const prices = await getElectricityPrices();

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          .hero-glow-1 {
            position: absolute;
            top: 0;
            left: 25%;
            width: 500px;
            height: 500px;
            background: rgba(var(--primary-rgb), 0.1);
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
        <JsonLd data={{
          ...webSiteSchema,
          potentialAction: {
            "@type": "SearchAction",
            "target": "https://tumejortarifaluz.es/tarifas?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Es seguro subir mi factura?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutamente. Utilizamos cifrado de nivel bancario (SSL/TLS). Tu factura solo se procesa para extraer datos técnicos; no almacenamos datos personales sensibles ni los vendemos a terceros."
              }
            },
            {
              "@type": "Question",
              "name": "¿Tengo que pagar por usar el comparador?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nunca. TuMejorTarifaLuz es un proyecto independiente y 100% gratuito. Nuestro objetivo es democratizar el acceso a la información energética."
              }
            },
            {
              "@type": "Question",
              "name": "¿Las tarifas están actualizadas?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sintonizamos nuestro motor diariamente con el mercado mayorista (OMIE) y las bases de datos oficiales de las comercializadoras en menos de 24 horas."
              }
            }
          ]
        }} />
        <JsonLd data={organizationSchema} />
        <JsonLd data={webAppSchema} />
        <JsonLd data={getBreadcrumbSchema([
          { name: "Inicio", item: "/" },
          { name: "Comparador de Tarifas", item: "/comparador" }
        ])} />
        
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-32 min-h-[85vh] flex items-center transition-colors duration-300"
          style={{ background: 'linear-gradient(160deg, var(--color-section-muted) 0%, var(--color-section-white) 100%)' }}
        >
          <div className="hero-glow-1"></div>
          <div className="hero-glow-2"></div>

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-32 items-center">
              <div className="space-y-8 md:space-y-12 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-primary text-white font-body text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] shadow-2xl shadow-primary/30 backdrop-blur-md border border-white/20 mx-auto lg:mx-0">
                  <span className="relative flex h-2 md:h-2.5 w-2 md:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 md:h-2.5 w-2 md:w-2.5 bg-white"></span>
                  </span>
                  Motor de comparación 2026 – Actualizado hoy
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h1 
                    className="font-heading text-4xl md:text-6xl lg:text-[72px] xl:text-[96px] font-900 leading-[0.92] tracking-[-0.05em]"
                    style={{ color: 'var(--color-text-heading)' }}
                  >
                    Compara <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent italic pr-1">tarifas de luz</span> gratis
                  </h1>
                  <DynamicHeroSavings />
                </div>

                <p 
                  className="font-body text-lg md:text-xl font-normal max-w-xl lg:max-w-none leading-relaxed text-pretty mx-auto lg:mx-0 opacity-70"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Analizamos tu consumo real en segundos. Sube tu factura o introduce tus datos y obtén el mejor precio del mercado <strong>sin llamadas comerciales</strong> ni letra pequeña.
                </p>
                <div className="flex flex-col items-center lg:items-start gap-5 md:gap-7">
                  <Link 
                    href="/comparador?mode=upload" 
                    className="w-full sm:w-auto flex items-center justify-center gap-4 px-8 md:px-12 py-5 md:py-6 bg-primary hover:bg-primary-hover text-white font-body font-900 border-2 border-primary rounded-2.5xl md:rounded-3xl transition-all shadow-2xl shadow-primary/35 transform hover:-translate-y-1 active:scale-95 text-lg md:text-xl lg:text-2xl tracking-tighter"
                  >
                    <CloudUpload size={28} className="md:w-8 md:h-8" />
                    Subir mi factura y ahorrar
                  </Link>
                  <Link 
                    href="/comparador?mode=manual" 
                    className="text-[12px] md:text-[13px] font-black text-text-secondary hover:text-primary transition-colors uppercase tracking-[0.2em] flex items-center gap-2 md:gap-3 italic group"
                  >
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-surface-2 group-hover:bg-primary/10 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 md:w-[18px] md:h-[18px]">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </div>
                    <span>o introduce los datos manualmente</span>
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-8 md:pt-10 border-t border-border/40">
                  <div className="flex items-center">
                    <AvatarInitials initials="JP" bgColor="#3B82F6" size={48} first />
                    <AvatarInitials initials="AM" bgColor="#8B5CF6" size={48} />
                    <AvatarInitials initials="CL" bgColor="#F59E0B" size={48} />
                  </div>
                  <p className="text-xs md:text-base text-text-secondary max-w-[240px] md:max-w-none leading-tight font-bold">
                    Únete a las <SocialProof count={3891} /> que ya han tomado el control de su ahorro este mes.
                  </p>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative">
                <DynamicHeroCard />
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Bar */}
        <UrgencyBar />

        {/* Support & Independence Section */}
        <section 
          className="py-24 relative overflow-hidden transition-colors duration-300"
          style={{ background: 'var(--color-section-muted)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
              
              {/* Left Side: Brand & Mission */}
              <div className="space-y-12">
                <div 
                  className="inline-flex items-center gap-4 p-2 rounded-2xl border pr-6"
                  style={{ background: 'var(--color-section-white)', borderColor: 'var(--color-border)' }}
                >
                  <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Heart size={24} className="fill-current" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-900 text-primary">Misión independencia</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>Tu ahorro es nuestro compromiso</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-4xl md:text-5xl font-900 leading-[1.1] tracking-tight" style={{ color: 'var(--color-text-heading)' }}>
                    Un comparador <span className="text-primary italic">libre de intereses</span> para familias reales
                  </h3>
                  <p className="text-lg leading-relaxed font-medium" style={{ color: 'var(--color-text-body)' }}>
                    TuMejorTarifaLuz nació con un propósito claro: democratizar el acceso a la energía barata sin intereses comerciales. <strong>No pertenecemos a ninguna eléctrica</strong> — nos sostenemos únicamente con donaciones voluntarias de usuarios satisfechos como tú.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 pt-4">
                    {["Sin comisiones", "Sin publicidad", "Sin afiliados", "100% gratuito"].map((chip) => (
                      <div key={chip} className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full">
                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">{chip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Quote & Donation */}
              <div className="space-y-8">
                {/* Quote Card */}
                <div 
                  className="p-8 md:p-10 rounded-[2.5rem] space-y-8 border"
                  style={{ background: 'var(--color-section-white)', borderColor: 'var(--color-border)' }}
                >
                  <div className="text-primary opacity-30">
                    <HistoryIcon size={24} className="rotate-180" />
                  </div>
                  <p className="text-lg font-bold italic leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                    Si el comparador te ha ahorrado dinero, tu donación ayuda a que más familias puedan seguir usando este servicio gratuito y sin publicidad.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter border border-primary/20">
                      TM
                    </div>
                    <p className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>
                      — Equipo TuMejorTarifaLuz
                    </p>
                  </div>
                </div>
                
                {/* Donation Card */}
                <div 
                  className="border rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm"
                  style={{ background: 'var(--color-section-white)', borderColor: 'var(--color-border)' }}
                >
                  <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>Apoya el proyecto</p>
                      <p className="text-lg font-900" style={{ color: 'var(--color-text-heading)' }}>Si te ha ahorrado dinero, devuelve un poco</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <SupportSection />
                  </div>
                  <div 
                    className="px-8 py-5 border-t flex justify-center text-center"
                    style={{ background: 'var(--color-section-muted)', borderColor: 'var(--color-border)' }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: 'var(--color-text-muted)' }}>
                      Pago seguro · Sin suscripción · Gracias por apoyar
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="como-funciona" className="py-24 relative transition-colors duration-300" style={{ background: 'var(--color-section-white)' }}>
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
        <section id="faq" className="pb-24 pt-12 scroll-mt-32 transition-colors duration-300" style={{ background: 'var(--color-section-muted)' }}>
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
                <details 
                  key={i} 
                  className="group overflow-hidden [&_summary::-webkit-details-marker]:hidden rounded-2xl border transition-all duration-300"
                  style={{ 
                    background: 'var(--color-section-white)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer select-none list-none">
                    <span className="font-heading text-base font-medium" style={{ color: 'var(--color-text-heading)' }}>{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-open:rotate-180 ${faq.success ? "bg-accent-bg text-accent-bg-text" : "bg-primary/10 text-primary"}`}>
                      <ChevronDown size={20} />
                    </div>
                  </summary>
                  <div className="font-body text-sm font-normal px-6 pb-6 leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            {/* Post-FAQ Action Block */}
            <div className="mt-16 bg-surface-2 dark:bg-white/5 border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                {/* Doubt Column */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-heading)' }}>¿Todavía tienes dudas?</h3>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--color-text-body)' }}>
                    Si no has encontrado la respuesta que buscabas o tu factura es compleja, nuestro equipo te ayuda de forma personalizada.
                  </p>
                  <a 
                    href="mailto:hola@tumejortarifaluz.es" 
                    className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px] hover:gap-4 transition-all"
                  >
                    Escríbenos a hola@tumejortarifaluz.es
                    <ArrowRight size={14} />
                  </a>
                </div>

                {/* Ready Column */}
                <div className="space-y-6 flex flex-col justify-center">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-heading)' }}>¿Ya tienes todo claro?</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                      La media de ahorro es de 312€ al año. No esperes más para empezar a ahorrar hoy.
                    </p>
                  </div>
                  <Link 
                    href="/comparador?mode=upload" 
                    className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-center"
                  >
                    Sube tu factura ahora
                    <CloudUpload size={18} className="ml-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Center Section */}
        <section id="guias" className="py-24 transition-colors duration-300" style={{ background: 'var(--color-section-white)' }}>
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
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 6).map((post, i) => (
                <Link key={i} href={`/blog/${post.slug}`} className="group premium-card premium-3d-card p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border border-border">
                  <p className="font-body text-xs font-normal opacity-60 text-text-muted uppercase tracking-widest mb-6">{post.date}</p>
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 group-hover:text-primary transition-colors leading-tight min-h-[3.5rem] line-clamp-2">{post.title}</h3>
                  <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-surface-2">
                    <Image src={post.image} alt={post.title} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-grow">{post.excerpt}</p>
                  <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-primary tracking-widest">Leer artículo completo<span className="sr-only"> sobre {post.title}</span></span>
                    <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" size={24} aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-surface border border-border text-text-secondary font-bold hover:shadow-xl transition-all group hover:border-primary/30"
              >
                Ver todos los artículos
                <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" size={24} />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 relative overflow-hidden transition-colors duration-300" style={{ background: 'var(--color-section-white)' }}>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mb-48 opacity-30"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="font-heading text-3xl md:text-4xl font-900 text-text-primary tracking-tight leading-tight">
                    ¿Quieres ahorrar de verdad o <br />
                    <span className="text-primary italic">solo mirar un número?</span>
                  </h2>
                  <p className="text-xl text-text-secondary leading-relaxed font-medium">
                    <span className="text-text-primary font-bold">Sin cuenta solo ves el resultado una vez.</span> Con tu cuenta gratuita guardas tu análisis, recibes alertas automáticas y comparas tu ahorro en el tiempo para no volver a pagar de más nunca.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: "analytics", title: "Estudio de Ahorro Pro", desc: "No te quedes en la superficie. Accede al desglose técnico de potencia y energía para entender exactamente dónde se va tu dinero cada mes." },
                    { icon: "brain", title: "Tu Consultor IA 24/7", desc: "Nuestro motor analiza la letra pequeña y te avisa de permanencias ocultas o costes fantasma antes de que los pagues." },
                    { icon: "heart", title: "Radar de Oportunidades", desc: "Guarda tus tarifas favoritas y recibe un aviso instantáneo si bajan de precio o si aparece una oferta superior para tu perfil." },
                    { icon: "bell", title: "Alertas Anti-Subidas", desc: "Te avisamos de inmediato si detectamos una oportunidad de ahorro masivo o si tu contrato actual deja de ser competitivo." }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-surface transition-all duration-300">
                        {benefit.icon === 'analytics' && <BarChart3 size={24} />}
                        {benefit.icon === 'brain' && <Brain size={24} />}
                        {benefit.icon === 'heart' && <Heart size={24} />}
                        {benefit.icon === 'bell' && <Bell size={24} />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading text-base font-black text-text-primary group-hover:text-primary transition-colors">{benefit.title}</h4>
                        <p className="font-body text-sm font-normal text-text-secondary leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/registro" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-body font-semibold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Crear mi cuenta gratuita
                    <UserPlus size={20} className="ml-2" />
                  </Link>
                  <Link href="/comparador" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-surface/50 dark:bg-surface-2/50 backdrop-blur-sm border border-border hover:border-primary/30 hover:bg-surface text-text-muted hover:text-text-primary font-body font-bold text-sm tracking-tight rounded-2xl transition-all group active:scale-95 shadow-sm hover:shadow-xl hover:shadow-primary/5">
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
        <section 
          className="py-24 border-y border-border transition-colors duration-300" 
          style={{ background: 'var(--color-section-muted)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading text-3xl font-semibold text-text-primary">Comparamos entre las mejores comercializadoras</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
              {[
                { name: "Iberdrola", logo: "logo_iberdrola.png", scale: "scale-150", slug: "iberdrola" },
                { name: "Endesa", logo: "logo_endesa.png", scale: "scale-75", slug: "endesa" },
                { name: "Naturgy", logo: "logo_naturgy.png", scale: "scale-140", slug: "naturgy" },
                { name: "Repsol", logo: "logo_repsol_base.png", darkLogo: "logo_repsol_dark.png", scale: "scale-140", slug: "repsol" },
                { name: "Octopus", logo: "logo_octopus_base.png", darkLogo: "logo_octopus_dark.png", scale: "scale-135", slug: "octopus-energy" },
                { name: "TotalEnergies", logo: "logo_total_energies.png", scale: "scale-125", slug: "total-energies" },
                { name: "Niba", logo: "logo_niba_base.png", darkLogo: "logo_niba_dark.png", scale: "scale-110", slug: "niba" },
                { name: "Imagina", logo: "logo_imaginaenergia.png", scale: "scale-140", slug: "imagina-energia" },
                { name: "Visalia", logo: "logo_visalia.png", scale: "scale-95", slug: "visalia" },
                { name: "Energía Nufri", logo: "logo_energianufri_base.png", darkLogo: "logo_energianufri_dark.png", scale: "scale-120", slug: "energia-nufri" },
                { name: "Energya VM", logo: "logo_energiavm.png", scale: "scale-130", slug: "energia-vm" },
                { name: "Neolux Energy", logo: "logo_neoluxenergy_base.webp", darkLogo: "logo_neoluxenergy_dark.png", scale: "scale-140", slug: "neolux-energy" },
                { name: "Esluz", logo: "logo_esluz.png", scale: "scale-85", slug: "esluz" },
                { name: "COR", logo: "COR.svg", scale: "scale-125", slug: "comercializadoras-referencia" },
              ].map((brand, i) => (
                <Link key={i} href={`/companias/${brand.slug}`} className="flex flex-col items-center gap-3 group">
                  <div 
                    className="w-full aspect-[2/1] rounded-xl p-4 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 border group-hover:border-primary/40 group-hover:-translate-y-1"
                    style={{ 
                      background: 'var(--color-section-white)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    {brand.darkLogo ? (
                      <>
                        <Image src={`/logos/${brand.logo}`} alt={brand.name} width={120} height={40} unoptimized className={`h-9 md:h-10 max-w-[90%] object-contain transition-all duration-500 dark:hidden ${brand.scale || ""}`} />
                        <Image src={`/logos/${brand.darkLogo}`} alt={brand.name} width={120} height={40} unoptimized className={`h-9 md:h-10 max-w-[90%] object-contain transition-all duration-500 hidden dark:block ${brand.scale || ""}`} />
                      </>
                    ) : (
                      <Image src={`/logos/${brand.logo}`} alt={brand.name} width={120} height={40} unoptimized className={`h-9 md:h-10 max-w-[90%] object-contain transition-all duration-500 ${brand.scale || ""}`} />
                    )}
                  </div>
                  <span className="font-body text-xs font-medium tracking-widest uppercase group-hover:text-primary transition-colors" style={{ color: 'var(--color-text-muted)' }}>{brand.name}</span>
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
        <section id="final-cta" className="py-20 px-4 transition-colors duration-300" style={{ background: 'var(--color-section-white)' }}>
          <div className="max-w-5xl mx-auto bg-[#0F1923] rounded-[2rem] p-8 md:p-16 text-center text-[#F1F5F9] relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            <h2 className="font-heading text-3xl md:text-5xl font-900 mb-6 relative z-10 leading-tight text-[#F1F5F9]">
              La media de ahorro es de <span className="text-white underline decoration-white/20">312€ al año</span>.<br />
              ¿Cuánto podrías ahorrar tú?
            </h2>
            <p className="text-[#CBD5E1] text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto relative z-10 text-pretty">
              Solo necesitas 30 segundos para subir tu factura. Nuestro motor analiza el mercado en tiempo real y encuentra tu tarifa ideal sin que tengas que hacer nada.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/comparador?mode=upload" className="px-10 py-5 bg-primary text-white font-body font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-black/10 hover:scale-105 active:scale-95 duration-200 text-[15px]">
                Comenzar análisis gratuito
              </Link>
              <Link href="/tarifas" className="px-10 py-5 bg-white/10 border border-white/20 text-[#CBD5E1] font-body font-bold rounded-xl hover:bg-white/20 transition-all text-[15px]">
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
