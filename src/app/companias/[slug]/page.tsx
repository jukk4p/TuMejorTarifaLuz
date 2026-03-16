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
    title: `Tarifas ${company.name} 2026: Precios y Análisis`,
    description: `Precios actualizados de las tarifas de luz de ${company.name} en 2026. Análisis independiente: pros, contras y comparativa con otras compañías. Sin comisiones.`,
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
