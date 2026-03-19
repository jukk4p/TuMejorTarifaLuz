import { providers } from "../providersData";
import { notFound } from "next/navigation";
import ProviderClient from "./ProviderClient";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const company = providers.find(p => p.slug === slug);
  
  if (!company) {
    return { title: 'Compañía no encontrada' }
  }
  
  return {
    title: `Tarifas ${company.name} 2026: Precios y Análisis Completo`,
    description: `Análisis completo de ${company.name} en España 2026. Tarifa ${company.popularTariffName || 'destacada'} desde ${company.minPrice.toFixed(3)} €/kWh. Opiniones, puntuación ${company.rating}/5 y comparativa detallada.`,
    alternates: {
      canonical: `https://tumejortarifaluz.es/companias/${slug}`
    }
  }
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const provider = providers.find(p => p.slug === slug);

    if (!provider) {
        notFound();
    }

    return <ProviderClient provider={provider} />;
}
