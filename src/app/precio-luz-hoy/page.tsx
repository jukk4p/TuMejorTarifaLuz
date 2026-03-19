import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { getElectricityPrices } from "@/lib/electricity-prices";
import PrecioLuzHoyClient from "./PrecioLuzHoyClient";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const prices = await getElectricityPrices();
    const currentPrice = prices?.current.toFixed(3) || "---";
    
    return {
        title: "Precio de la Luz Hoy 2026: Horas más BARATAS y CARAS | TuMejorTarifaLuz",
        description: `Precio de la luz ahora: ${currentPrice} €/kWh. Consulta las horas más baratas y caras del día de hoy en España. Actualizado en tiempo real desde OMIE.`,
        openGraph: {
            title: "Precio de la Luz Hoy 2026: Horas más BARATAS y CARAS",
            description: `Precio de la luz ahora: ${currentPrice} €/kWh. Consulta las horas más baratas y caras en tiempo real.`,
            url: "https://tumejortarifaluz.es/precio-luz-hoy",
            siteName: "TuMejorTarifaLuz",
            locale: "es_ES",
            type: "website",
        },
        alternates: {
            canonical: "https://tumejortarifaluz.es/precio-luz-hoy"
        }
    };
}

export default async function PrecioLuzHoyPage() {
    const pricesData = await getElectricityPrices();
    
    if (!pricesData) {
        return <div>Error cargando datos...</div>;
    }

    const pricesArray = (pricesData.allHours || []).map((p) => ({
        hour: `${String(p.hour).padStart(2, '0')}:00 – ${String(p.hour + 1).padStart(2, '0')}:00`,
        price: p.value,
        isCheap: p.value < pricesData.average,
        hourNum: p.hour
    }));

    const currentHourStr = pricesData.time.split(":")[0];
    const initialHour = parseInt(currentHourStr) || new Date().getHours();

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Inicio", item: "/" },
        { name: "Precio de la luz hoy", item: "/precio-luz-hoy" }
    ]);

    const datasetSchema = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Precio de la luz hoy en España (PVPC/OMIE)",
        "description": "Precios horarios del mercado eléctrico mayorista español actualizados diariamente",
        "url": "https://tumejortarifaluz.es/precio-luz-hoy",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "provider": {
            "@type": "Organization",
            "name": "TuMejorTarifaLuz",
            "url": "https://tumejortarifaluz.es"
        },
        "temporalCoverage": new Date().toISOString().split('T')[0],
        "variableMeasured": "Precio de la energía eléctrica (€/kWh)"
    };

    return (
        <>
            <Navbar />
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={datasetSchema} />
            <PrecioLuzHoyClient 
                data={{...pricesData, pricesArray}} 
                initialHour={initialHour} 
            />
            <Footer />
        </>
    );
}
