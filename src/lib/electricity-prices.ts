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
        console.error("ESIOS_DEBUG: Error - ESIOS_TOKEN no está en process.env. Comprueba tu VPS.");
        return null;
    }

    const TOKEN = rawToken.trim().replace(/^["']|["']$/g, '').trim();

    // 1001: Precio de mercado (Pool), 1002: PVPC
    const INDICATOR = "1001";
    const PeninsulaGeoId = 8741;

    const now = new Date();
    // Forzamos fecha de hoy para la URL
    const todayStr = now.toISOString().split('T')[0];

    // Intento 1: Sin filtros de fecha (suele devolver hoy y parte de mañana si están disponibles)
    // Es el método más fiable para evitar errores de zona horaria del servidor
    const url = `https://api.esios.ree.es/indicators/${INDICATOR}?geo_ids=${PeninsulaGeoId}`;

    try {
        console.log(`ESIOS_DEBUG: Pidiendo datos a REE... (Token len: ${TOKEN.length})`);

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json; application/vnd.esios-api-v2+json",
                "x-api-key": TOKEN
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`ESIOS_DEBUG: API respondió con error ${response.status}`);
            console.error(`ESIOS_DEBUG: Cuerpo error: ${errorBody.substring(0, 100)}`);
            return null;
        }

        const data = await response.json();
        const results = processEsiosData(data, now);

        if (results) {
            console.log(`ESIOS_DEBUG: Éxito total. Precio cargado: ${results.current}`);
            return results;
        } else {
            console.warn("ESIOS_DEBUG: Procesamiento fallido (values vacío)");
            return null;
        }

    } catch (error: any) {
        console.error("ESIOS_DEBUG: Error de red:", error.message);
        return null;
    }
}

function processEsiosData(data: any, now: Date): ElectricityPriceData | null {
    const rawValues = data.indicator?.values;
    if (!rawValues || rawValues.length === 0) return null;

    // Convertir y Normalizar
    const prices = rawValues.map((v: any) => ({
        value: v.value / 1000, // De MWh a kWh
        hour: new Date(v.datetime).getHours(),
        datetime: v.datetime,
        dateOnly: v.datetime.split('T')[0]
    }));

    // Intentamos filtrar por hoy, pero si no hay nada (raro), cogemos lo que haya
    const todayStr = now.toISOString().split('T')[0];
    let filteredPrices = prices.filter((p: any) => p.dateOnly === todayStr);

    if (filteredPrices.length === 0) {
        console.log("ESIOS_DEBUG: No hay datos para hoy específicamente, usando últimos datos disponibles.");
        filteredPrices = prices.slice(-24); // Últimas 24 horas si no hay match de fecha
    }

    if (filteredPrices.length === 0) return null;

    filteredPrices.sort((a: any, b: any) => a.hour - b.hour);

    const sum = filteredPrices.reduce((acc: number, p: any) => acc + p.value, 0);
    const average = sum / filteredPrices.length;

    let minItem = filteredPrices[0];
    let maxItem = filteredPrices[0];

    filteredPrices.forEach((p: any) => {
        if (p.value < minItem.value) minItem = p;
        if (p.value > maxItem.value) maxItem = p;
    });

    // Encontrar el precio de la hora actual
    const currentHour = now.getHours();
    const currentPriceItem = filteredPrices.find((p: any) => p.hour === currentHour) || filteredPrices[filteredPrices.length - 1];

    return {
        current: currentPriceItem.value,
        average: average,
        min: minItem.value,
        minHour: `${minItem.hour}:00`,
        max: maxItem.value,
        maxHour: `${maxItem.hour}:00`,
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        isLive: true,
        allHours: filteredPrices
    };
}
