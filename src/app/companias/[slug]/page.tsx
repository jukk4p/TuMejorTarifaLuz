import { providers } from "../providersData";
import { notFound } from "next/navigation";
import ProviderClient from "./ProviderClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const provider = providers.find(p => p.slug === slug);

    if (!provider) return { title: "Compañía no encontrada" };

    return {
        title: `Tarifas ${provider.name} 2026: Precios y Opiniones | TuMejorTarifaLuz`,
        description: `Análisis independiente de las tarifas de luz de ${provider.name} en 2026. Precios actualizados del kWh, pros y contras, y comparativa con otras compañías. Sin comisiones.`,
        alternates: {
            canonical: `https://tumejortarifaluz.es/companias/${provider.slug}`
        },
        openGraph: {
            title: `Tarifas ${provider.name} 2026 — ¿Es la opción más barata?`,
            description: `Descubre cuánto puedes ahorrar con ${provider.name}. Análisis técnico de sus tarifas fijas y con discriminación horaria.`,
            url: `https://tumejortarifaluz.es/companias/${provider.slug}`,
            images: [
                {
                    url: provider.logo,
                    width: 800,
                    height: 400,
                    alt: `Logo ${provider.name}`,
                }
            ],
        }
    };
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const provider = providers.find(p => p.slug === slug);

    if (!provider) {
        notFound();
    }

    return <ProviderClient provider={provider} />;
}
