import TarifasClient from "./TarifasClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Tarifas de Luz 2026: Precios de Iberdrola, Endesa, Octopus y más | TuMejorTarifaLuz',
  description: 'Catálogo actualizado diariamente con más de 25 tarifas de luz en España. Tarifa fija, tres periodos y PVPC. Compara precios reales del kWh sin intermediarios.',
  alternates: {
    canonical: 'https://tumejortarifaluz.es/tarifas'
  }
}

export default function TarifasPage() {
    return <TarifasClient />;
}
