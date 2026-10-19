import CompaniasClient from "./CompaniasClient";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comercializadoras de Luz en España 2026',
  description: 'Ranking de las mejores comercializadoras de luz en España 2026. Analizamos Octopus, Iberdrola, Endesa y más compañías por precio, atención y transparencia.',
  alternates: { canonical: 'https://www.tumejortarifaluz.es/companias' }
}

export default function CompaniasPage() {
    return <CompaniasClient />;
}
