import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60; // 60 seconds to avoid timeout in Vercel

const RATE_LIMIT_RESET_MS = 60 * 60 * 1000; // 1 Hora
const MAX_REQUESTS_PER_IP = 10;
const ipRequestsMap = new Map<string, { count: number, resetAt: number }>();

function getClientIp(request: Request): string {
    return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        "unknown_ip";
}

export async function POST(request: Request) {
    try {
        const clientIp = getClientIp(request);
        const now = Date.now();
        const requestData = ipRequestsMap.get(clientIp);

        if (requestData) {
            if (now > requestData.resetAt) {
                ipRequestsMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_RESET_MS });
            } else if (requestData.count >= MAX_REQUESTS_PER_IP && clientIp !== "unknown_ip") {
                console.warn(`[RATE LIMIT] IP ${clientIp} excedió el límite de procesado de Gemini.`);
                return NextResponse.json({ error: "Has excedido el límite de análisis. Inténtalo más tarde." }, { status: 429 });
            } else {
                requestData.count++;
                ipRequestsMap.set(clientIp, requestData);
            }
        } else {
            ipRequestsMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_RESET_MS });
        }

        const { fileData, mimeType } = await request.json();

        if (!fileData || !mimeType) {
            return NextResponse.json({ error: "No file data provided" }, { status: 400 });
        }

        // Limite estricto de ~5MB para el Base64 (gemini limits or abuse)
        if (fileData.length > 7_000_000) {
            return NextResponse.json({ error: "Imagen/PDF demasiado grande para procesar." }, { status: 413 });
        }

        // VALIDACIÓN: Magic Bytes (solo leyendo cabecera para no consumir RAM)
        try {
            const headerBuffer = Buffer.from(fileData.substring(0, 100), 'base64');
            const headerHex = headerBuffer.subarray(0, 4).toString('hex').toLowerCase();
            
            const isPDF = headerHex === '25504446'; // %PDF
            const isJPEG = headerHex.startsWith('ffd8'); // JPEG
            const isPNG = headerHex === '89504e47'; // PNG
            
            if (!isPDF && !isJPEG && !isPNG) {
                return NextResponse.json(
                    { error: "Formato de archivo no válido o malicioso. Solo se permiten PDF, PNG y JPG." },
                    { status: 415 }
                );
            }
        } catch (e) {
            return NextResponse.json({ error: "Data corrupta" }, { status: 400 });
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

        Estructura requerida (todas las propiedades deben estar presentes):
        {
          "company_name": <Nombre de la compañía comercializadora (ej: Iberdrola, Endesa, Naturgy, etc) (string)>,
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
        
        Nota importante: Busca expresamente el nombre de la compañía (logo o texto) para el campo "company_name" y fíjate en el término "€/kWh", "Eur/kWh", "precio" o la columna de precio para "current_price_p1", p2, y p3.`;

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
                    company_name: aiData.company_name || null,
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
