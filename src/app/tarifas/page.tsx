import TarifasClient from "./TarifasClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Comparativa de Tarifas de Luz 2026: Precios kWh Actualizados",
    description: "Consulta nuestro catálogo completo de tarifas de luz en España. Comparamos más de 150 ofertas de Iberdrola, Endesa, Octopus y más para que encuentres el precio más bajo.",
    alternates: {
        canonical: "https://tumejortarifaluz.es/tarifas"
    }
};

export default function TarifasPage() {
    return <TarifasClient />;
}
