import CompaniasClient from "./CompaniasClient";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparativa de Comercializadoras de Luz en España 2026',
  description: 'Análisis independiente de Iberdrola, Endesa, Naturgy, Octopus, Repsol y más. Precios actualizados y opiniones objetivas. Sin comisiones.',
  alternates: { canonical: 'https://tumejortarifaluz.es/companias' }
}

export default function CompaniasPage() {
    return <CompaniasClient />;
}
