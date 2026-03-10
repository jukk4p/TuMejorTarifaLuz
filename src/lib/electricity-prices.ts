export interface ApiPriceData {
    value: number;
    datetime: string;
}

export interface ElectricityPriceData {
    current: number;
    average: number;
    min: number;
    minHour: string;
    max: number;
    maxHour: string;
    time: string;
    isLive: boolean;
    allHours: ApiPriceData[];
}

export async function getElectricityPrices(): Promise<ElectricityPriceData | null> {
    const rawToken = process.env.ESIOS_TOKEN;

    if (!rawToken) {
        console.error("ESIOS_DEBUG: Error - Variable ESIOS_TOKEN no está definida en el entorno.");
        return null;
    }

    // Limpieza profunda del token por si hay comillas o espacios ocultos (común en VPS)
    const TOKEN = rawToken.trim().replace(/^["']|["']$/g, '').trim();

    // Usar el indicador 1001 (Mercado) que es el estándar
    const INDICATOR = "1001";
    const PeninsulaGeoId = 8741;

    // Obtener fecha actual en formato local España para evitar desajustes de UTC
    const now = new Date();
    // Determinamos el día actual en formato YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    // URL determinista para el día de hoy
    const url = `https://api.esios.ree.es/indicators/${INDICATOR}?geo_ids=${PeninsulaGeoId}&start_date=${todayStr}T00:00&end_date=${todayStr}T23:59`;

    try {
        console.log(`ESIOS_DEBUG: Consultando API en ${url}`);

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json; application/vnd.esios-api-v2+json",
                "x-api-key": TOKEN,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            // IMPORTANTE: Forzamos no-store en esta fase para evitar que el VPS sirva un error cacheado
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`ESIOS_DEBUG: Error ${response.status} en la API ESIOS.`);
            console.error(`ESIOS_DEBUG: Token usado (primeros 5): ${TOKEN.substring(0, 5)}...`);
            console.error(`ESIOS_DEBUG: Respuesta técnica: ${errorBody.substring(0, 200)}`);

            // Intento de rescate sin filtros de fecha
            const rescueUrl = `https://api.esios.ree.es/indicators/${INDICATOR}?geo_ids=${PeninsulaGeoId}`;
            const rescueResponse = await fetch(rescueUrl, {
                headers: {
                    "Accept": "application/json; application/vnd.esios-api-v2+json",
                    "x-api-key": TOKEN
                },
                cache: 'no-store'
            });

            if (!rescueResponse.ok) return null;
            const rescueData = await rescueResponse.json();
            return processEsiosData(rescueData, now);
        }

        const data = await response.json();
        return processEsiosData(data, now);

    } catch (error: any) {
        console.error("ESIOS_DEBUG: Error crítico de conexión/red:", error.message);
        return null;
    }
}

function processEsiosData(data: any, now: Date): ElectricityPriceData | null {
    const rawValues = data.indicator?.values;
    if (!rawValues || rawValues.length === 0) {
        console.warn("ESIOS_DEBUG: No se recibieron valores de la API.");
        return null;
    }

    const todayStr = now.toISOString().split('T')[0];
    const prices = rawValues.map((v: any) => ({
        value: v.value / 1000,
        hour: new Date(v.datetime).getHours(),
        datetime: v.datetime
    }));

    // Asegurar orden horario
    prices.sort((a: any, b: any) => a.hour - b.hour);

    const sum = prices.reduce((acc: number, p: any) => acc + p.value, 0);
    const average = sum / prices.length;

    let minItem = prices[0];
    let maxItem = prices[0];

    prices.forEach((p: any) => {
        if (p.value < minItem.value) minItem = p;
        if (p.value > maxItem.value) maxItem = p;
    });

    const currentHour = now.getHours();
    const currentPriceItem = prices.find((p: any) => p.hour === currentHour) || prices[prices.length - 1];

    console.log(`ESIOS_DEBUG: Datos procesados correctamente. Actual: ${currentPriceItem.value.toFixed(4)}`);

    return {
        current: currentPriceItem.value,
        average: average,
        min: minItem.value,
        minHour: `${minItem.hour}:00`,
        max: maxItem.value,
        maxHour: `${maxItem.hour}:00`,
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        isLive: true,
        allHours: prices
    };
}
