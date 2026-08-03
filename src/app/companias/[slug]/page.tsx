import { providers } from "../providersData";
import { notFound } from "next/navigation";
import ProviderClient from "./ProviderClient";
import { Metadata } from "next";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { getProviderReviews } from "@/lib/reviews";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const company = providers.find(p => p.slug === slug);
  
  if (!company) {
    return { title: 'Compañía no encontrada' }
  }

  const categoryLabel = company.category === 'big' ? 'una de las Grandes Eléctricas' : 
                        company.category === 'regulated' ? 'del Mercado Regulado' : 
                        'una Comercializadora Independiente';
  const prosSummary = company.pros.slice(0, 2).join(', ');
  
  return {
    title: `Tarifas ${company.name} 2026: Precios, Opiniones y Análisis`,
    description: `Análisis de ${company.name} (${categoryLabel}) en 2026. Destaca por ${prosSummary}. Precio mínimo de ${company.minPrice.toFixed(3)} €/kWh en su plan ${company.popularTariffName || 'destacado'} y puntuación de ${company.rating}/5.`,
    alternates: {
      canonical: `https://www.tumejortarifaluz.es/companias/${slug}`
    }
  }
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const provider = providers.find(p => p.slug === slug);

    if (!provider) {
        notFound();
    }

    const reviewCount = getProviderReviews(provider.id).length;

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
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `¿Qué precio tiene el kWh de ${provider.name}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Actualmente ${provider.name} ofrece precios desde ${provider.minPrice.toFixed(3)} €/kWh en su tarifa ${provider.popularTariffName || 'destacada'}.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `¿Tiene permanencia ${provider.name}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": provider.hasPermanence 
                                ? `Sí, algunas tarifas de ${provider.name} pueden tener compromiso de permanencia.` 
                                : `No, ${provider.name} destaca por no tener compromiso de permanencia en sus contratos de luz.`
                        }
                    }
                ]
            }} />
            <ProviderClient provider={provider} />
        </>
    );
}
