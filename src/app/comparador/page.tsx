import ComparadorMain from "./ComparadorMain";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Tarifas de Luz: Analiza tu Factura Gratis en 30 Segundos',
  description: 'Sube tu factura PDF o introduce tus datos. Nuestro algoritmo encuentra la tarifa más barata del mercado español en segundos. 100% gratis y sin registro.',
  alternates: { canonical: 'https://www.tumejortarifaluz.es/comparador' }
}

export default function ComparadorPage() {
    return <ComparadorMain />;
}
