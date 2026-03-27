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

    return <ProviderClient provider={provider} />;
}
