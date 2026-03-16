import CompaniasClient from "./CompaniasClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mejores Compañías Eléctricas 2026: Ranking y Opiniones",
    description: "Comparamos las comercializadoras de luz más populares en España. Análisis imparcial de Iberdrola, Endesa, Naturgy, Octopus y muchas más. Descubre cuál tiene mejor atención al cliente.",
    alternates: {
        canonical: "https://tumejortarifaluz.es/companias"
    },
    openGraph: {
        title: "Ranking de Comercializadoras Eléctricas 2026 — TuMejorTarifaLuz",
        description: "Análisis experto y opiniones reales de las principales eléctricas en España.",
        url: "https://tumejortarifaluz.es/companias",
        images: [{ url: "/og-image-companias.jpg" }]
    }
};

export default function CompaniasPage() {
    return <CompaniasClient />;
}
