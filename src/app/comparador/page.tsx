import ComparadorMain from "./ComparadorMain";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Tarifas de Luz Gratis: Analiza tu Factura en 30 Segundos | TuMejorTarifaLuz',
  description: 'Sube tu factura PDF o introduce tus datos. Nuestro algoritmo encuentra la tarifa más barata del mercado español en segundos. 100% gratis y sin registro.',
  alternates: { canonical: 'https://tumejortarifaluz.es/comparador' }
}

export default function ComparadorPage() {
    return <ComparadorMain />;
}
