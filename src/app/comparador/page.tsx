import ComparadorMain from "./ComparadorMain";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Comparador de Tarifas de Luz IA 2026 | TuMejorTarifaLuz",
    description: "Usa nuestra inteligencia artificial para analizar tu factura de luz gratis. Comparamos tu consumo real con todas las ofertas del mercado para encontrarte el máximo ahorro garantizado.",
    alternates: {
        canonical: "https://tumejortarifaluz.es/comparador"
    },
    openGraph: {
        title: "Comparador de Luz con Inteligencia Artificial — TuMejorTarifaLuz",
        description: "Sube tu factura y ahorra hasta 300€ al año. Análisis técnico imparcial en segundos.",
        url: "https://tumejortarifaluz.es/comparador",
        images: [{ url: "/og-image-comparador.jpg" }]
    }
};

export default function ComparadorPage() {
    return <ComparadorMain />;
}
