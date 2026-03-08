import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60; // 60 seconds to avoid timeout in Vercel

export async function POST(request: Request) {
    try {
        const { fileData, mimeType } = await request.json();

        if (!fileData || !mimeType) {
            return NextResponse.json({ error: "No file data provided" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("No se ha configurado la clave GEMINI_API_KEY");
            // Devolver un flag especial si falta la API Key para mostrar aviso al usuario
            return NextResponse.json({ error: "MISSING_API_KEY" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Analiza esta factura de luz y extrae los siguientes datos numéricos de forma estricta. Usa punto para los decimales. Si algún dato no aparece o no estás seguro, devuélvelo como 0. 

        Estructura requerida:
        {
          "power_p1": <Potencia punta contratada en kW (número)>,
          "power_p2": <Potencia valle contratada en kW (número)>,
          "energy_p1": <Energía consumida en punta e1 en kWh (número)>,
          "energy_p2": <Energía consumida en llano e2 en kWh (número)>,
          "energy_p3": <Energía consumida en valle e3 en kWh (número)>,
          "days": <Días de facturación (número)>,
          "current_bill_total": <Importe total de la factura en euros (número)>,
          "current_price_p1": <PRECIO UNITARIO de la energía en punta (e1) en €/kWh (número). Suele venir junto al consumo, ej: "Consumo 100 kWh x 0.15 €/kWh". Devuelve solo el 0.15>,
          "current_price_p2": <PRECIO UNITARIO de la energía en llano (e2) en €/kWh (número)>,
          "current_price_p3": <PRECIO UNITARIO de la energía en valle (e3) en €/kWh (número)>
        }
        
        Nota importante: Busca expresamente el término "€/kWh", "Eur/kWh", "precio" o fíjate en la columna de precio en la tabla de facturación para obtener "current_price_p1", p2, y p3.`;

        const imageParts = [
            {
                inlineData: {
                    data: fileData,
                    mimeType
                }
            }
        ];

        try {
            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const textResponse = response.text();

            try {
                // Como forzamos application/json, parseamos directamente
                const aiData = JSON.parse(textResponse);

                // Retornar los datos planos que hemos pedido, aplicando fallbacks básicos de seguridad
                // para que la UI no reciba ceros si la IA los metió en otro hueco (ej. tarifas planas o P3 por P2)
                const extracted = {
                    power_p1: aiData.power_p1 || null,
                    power_p2: aiData.power_p2 || aiData.power_p3 || aiData.power_p1 || null,
                    energy_p1: aiData.energy_p1 || null,
                    energy_p2: aiData.energy_p2 || null,
                    energy_p3: aiData.energy_p3 || null,
                    days: aiData.days || null,
                    current_bill_total: aiData.current_bill_total || null,
                    current_price_p1: aiData.current_price_p1 || null,
                    current_price_p2: aiData.current_price_p2 || aiData.current_price_p1 || null,
                    current_price_p3: aiData.current_price_p3 || aiData.current_price_p1 || null
                };
                return NextResponse.json(extracted);
            } catch (e) {
                console.error("Error parseando la respuesta del LLM:", textResponse);
                return NextResponse.json({ error: "Error de formato de IA" }, { status: 500 });
            }
        } catch (apiError: unknown) {
            console.error("Gemini API Error:", apiError);
            const message = apiError instanceof Error ? apiError.message : String(apiError);
            return NextResponse.json({ error: "API Gemini falló: " + message }, { status: 500 });
        }

    } catch (error: unknown) {
        console.error("Error en extracción:", error);
        const message = error instanceof Error ? error.message : "Error al procesar";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
