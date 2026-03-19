import CompaniasClient from "./CompaniasClient";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparativa de Comercializadoras de Luz en España 2026',
  description: 'Ranking de las mejores comercializadoras de luz en España 2026. Analizamos Octopus, Niba, Iberdrola, Endesa y 10 compañías más por precio, atención y transparencia.',
  alternates: { canonical: 'https://tumejortarifaluz.es/companias' }
}

export default function CompaniasPage() {
    return <CompaniasClient />;
}
