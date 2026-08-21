
import { notifySystemUpdate } from "@/lib/notifications";
import { NextResponse } from "next/server";

// FIX 2026-08-21: esto era un GET sin autenticacion, es decir, cualquiera
// que visitara esta URL disparaba una notificacion real y global (isGlobal:
// true) visible para todos los usuarios de la web. Se pasa a POST + el mismo
// header Admin-Key que ya usa el resto de rutas admin, para que no se pueda
// activar con solo entrar a la URL desde el navegador.
export async function POST(request: Request) {
    const adminKey = request.headers.get("Admin-Key");
    if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        console.warn(`[SECURITY] Intento de acceso no autorizado a /api/test-notif con IP: `, request.headers.get("x-forwarded-for"));
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const mockChanges = [
        {
            tariff: { company: "Octopus Energy", name: "Relax" },
            changes: [
                { label: "Energía Punta (E1)", oldValue: 0.1290, newValue: 0.0980 },
                { label: "Energía Llano (E2)", oldValue: 0.1290, newValue: 0.0980 },
                { label: "Energía Valle (E3)", oldValue: 0.1290, newValue: 0.0980 },
                { label: "Potencia Punta (P1)", oldValue: 0.0970, newValue: 0.0980 },
                { label: "Potencia Valle (P2)", oldValue: 0.0290, newValue: 0.0980 }
            ]
        },
        {
            tariff: { company: "Endesa", name: "Conecta 3 Periodos" },
            changes: [
                { label: "Potencia Punta (P1)", oldValue: 0.0902, newValue: 0.1104 },
                { label: "Potencia Valle (P2)", oldValue: 0.0902, newValue: 0.1104 }
            ]
        },
        {
            tariff: { company: "Iberdrola", name: "Plan Online" },
            changes: [
                { label: "Energía Punta (E1)", oldValue: 0.1917, newValue: 0.1850 },
                { label: "Energía Llano (E2)", oldValue: 0.1227, newValue: 0.1180 },
                { label: "Energía Valle (E3)", oldValue: 0.1047, newValue: 0.1010 }
            ]
        }
    ];

    try {
        await notifySystemUpdate(
            "Prueba de actualización masiva",
            "Resumen visual de cambios en el mercado eléctrico para pruebas de diseño.",
            mockChanges
        );
        return NextResponse.json({ success: true, message: "Notificación de prueba enviada correctamente" });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
    }
}
