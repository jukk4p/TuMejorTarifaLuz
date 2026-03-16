import ComparadorMain from "./ComparadorMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Comparador de Tarifas de Luz: Analiza tu Factura Gratis | TuMejorTarifaLuz',
  description: 'Sube tu factura PDF o introduce tus datos. Nuestro algoritmo analiza tu consumo real y encuentra la tarifa más barata del mercado en 30 segundos. 100% gratis.',
  alternates: { canonical: 'https://tumejortarifaluz.es/comparador' }
}

export default function ComparadorPage() {
    return <ComparadorMain />;
}
