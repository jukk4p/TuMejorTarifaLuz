import { providers } from "../providersData";
import { notFound } from "next/navigation";
import ProviderClient from "./ProviderClient";
import { Metadata } from "next";
import JsonLd, { getBreadcrumbSchema, getFaqSchema } from "@/components/seo/JsonLd";
import { getProviderFaqs } from "@/lib/faqContent";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const company = providers.find(p => p.slug === slug);
  
  if (!company) {
    return { title: 'Compañía no encontrada' }
  }

  // Title y description con longitud fija independiente del nombre/pros de la
  // compañía: con el template anterior (categoryLabel + 2 pros + tariffName)
  // las 16 páginas superaban 180-230 caracteres y Google las truncaba a mitad
  // de frase. Comprobado con las 16 compañías: title ≤60 (con sufijo " | TuMejorTarifaLuz"),
  // description ≤136.
  const title = `${company.name} 2026: Precios y Opiniones`;
  const description = `Compara ${company.name} en 2026: precio desde ${company.minPrice.toFixed(3)} €/kWh, valorado con ${company.rating}/5 en opiniones reales. Analiza si es tu mejor tarifa de luz.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.tumejortarifaluz.es/companias/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `https://www.tumejortarifaluz.es/companias/${slug}`,
      type: 'website',
    },
  }
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const provider = providers.find(p => p.slug === slug);

    if (!provider) {
        notFound();
    }

    const reviewCount = provider.trustpilotReviewCount ?? 0;

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Product",
                "name": `Tarifas de luz de ${provider.name}`,
                "description": provider.description,
                "image": `https://www.tumejortarifaluz.es${provider.logo}`,
                "brand": {
                    "@type": "Brand",
                    "name": provider.name
                },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "EUR",
                    "price": provider.minPrice,
                    "description": `Desde ${provider.minPrice.toFixed(3)} €/kWh con el plan ${provider.popularTariffName || 'base'}`,
                    "url": `https://www.tumejortarifaluz.es/companias/${slug}`
                },
                ...(reviewCount > 0 && {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": provider.rating,
                        "bestRating": "5",
                        "worstRating": "1",
                        "ratingCount": reviewCount
                    }
                })
            }} />
            <JsonLd data={getBreadcrumbSchema([
                { name: "Inicio", item: "/" },
                { name: "Compañías", item: "/companias" },
                { name: provider.name, item: `/companias/${slug}` }
            ])} />
            <JsonLd data={getFaqSchema(getProviderFaqs(provider))} />
            <ProviderClient provider={provider} />
        </>
    );
}
