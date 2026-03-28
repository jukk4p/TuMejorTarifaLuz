import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { getElectricityPrices } from "@/lib/energy-prices";
import PrecioLuzHoyClient from "./PrecioLuzHoyClient";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const prices = await getElectricityPrices();
    const currentPrice = prices?.current.toFixed(3) || "---";
    const todayStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return {
        title: `Precio de la Luz Hoy en España ${todayStr} — Horas Baratas y Caras | TuMejorTarifaLuz`,
        description: `Consulta el precio del kWh hora a hora hoy, ${todayStr}, en España. Identifica las horas más baratas del PVPC y programa tus electrodomésticos para ahorrar en tu factura de luz. Precio ahora: ${currentPrice} €/kWh.`,
        openGraph: {
            title: `Precio de la Luz Hoy en España ${todayStr}: Horas más BARATAS y CARAS`,
            description: `Consulta el precio del kWh para hoy ${todayStr}. Identifica las horas más baratas y ahorra en tu factura. Precio ahora: ${currentPrice} €/kWh.`,
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
        "creator": {
            "@type": "Organization",
            "name": "Red Eléctrica de España (ESIOS)",
            "url": "https://www.esios.ree.es"
        },
        "isBasedOn": "https://www.esios.ree.es",
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
