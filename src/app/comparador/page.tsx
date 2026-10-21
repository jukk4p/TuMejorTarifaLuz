import ComparadorMain from "./ComparadorMain";
import JsonLd, { getFaqSchema } from "@/components/seo/JsonLd";
import { COMPARADOR_FAQS } from "@/lib/faqContent";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Tarifas de Luz: 30 Segundos',
  description: 'Sube tu factura PDF o introduce tus datos. Nuestro algoritmo encuentra la tarifa más barata del mercado español en segundos. 100% gratis y sin registro.',
  alternates: { canonical: 'https://www.tumejortarifaluz.es/comparador' }
}

export default function ComparadorPage() {
    return (
        <>
            <JsonLd data={getFaqSchema(COMPARADOR_FAQS)} />
            <ComparadorMain />
        </>
    );
}
