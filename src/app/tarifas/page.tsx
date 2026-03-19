import TarifasClient from "./TarifasClient";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifas de Luz 2026: Iberdrola, Endesa, Octopus y más',
  description: 'Catálogo completo de tarifas de luz en España 2026. Compara precios de energía y potencia de Iberdrola, Endesa, Octopus y 11 compañías más. Actualizado diariamente.',
  alternates: { canonical: 'https://tumejortarifaluz.es/tarifas' }
}

export default function TarifasPage() {
    return <TarifasClient />;
}
