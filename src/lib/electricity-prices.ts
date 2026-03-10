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

/**
 * Función ultra-robusta preparada para entornos VPS con problemas de permisos o regionalización.
 */
export async function getElectricityPrices(): Promise<ElectricityPriceData | null> {
    const rawToken = process.env.ESIOS_TOKEN;

    if (!rawToken) {
        console.error("ESIOS_DEBUG: Error - ESIOS_TOKEN no definido.");
        return null;
    }

    const TOKEN = rawToken.trim().replace(/^["']|["']$/g, '').trim();
    console.log(`ESIOS_DEBUG: Iniciando fetch (Token len: ${TOKEN.length})`);

    // Intentamos varias combinaciones de URLs y formatos que suelen funcionar de forma distinta en Local vs VPS
    const attempts = [
        { url: "https://api.esios.ree.es/indicators/1001?geo_ids[]=8741", name: "Indicator 1001 (geo_ids[])" },
        { url: "https://api.esios.ree.es/indicators/1001?geo_ids=8741", name: "Indicator 1001 (geo_ids standard)" },
        { url: "https://api.esios.ree.es/indicators/1739?geo_ids=8741", name: "Indicator 1739 (PVPC 2.0TD)" }
    ];

    for (const attempt of attempts) {
        try {
            console.log(`ESIOS_DEBUG: Probando ${attempt.name}...`);
            const response = await fetch(attempt.url, {
                headers: {
                    "Accept": "application/json; application/vnd.esios-api-v2+json",
                    "x-api-key": TOKEN,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                },
                cache: 'no-store'
            });

            if (response.ok) {
                const data = await response.json();
                const processed = processEsiosData(data);
                if (processed) {
                    console.log(`ESIOS_DEBUG: ¡ÉXITO! Datos obtenidos con ${attempt.name}`);
                    return processed;
                }
            } else {
                console.warn(`ESIOS_DEBUG: ${attempt.name} falló con status ${response.status}`);
            }
        } catch (err: any) {
            console.error(`ESIOS_DEBUG: Error en ${attempt.name}:`, err.message);
        }
    }

    console.error("ESIOS_DEBUG: Todos los intentos fallaron.");
    return null;
}

function processEsiosData(data: any): ElectricityPriceData | null {
    try {
        const rawValues = data.indicator?.values;
        if (!rawValues || rawValues.length === 0) return null;

        const now = new Date();
        const prices = rawValues.map((v: any) => ({
            value: v.value / 1000,
            hour: new Date(v.datetime).getHours(),
            datetime: v.datetime,
            dateOnly: v.datetime.split('T')[0]
        }));

        // Filtrar por hoy (España suele estar en UTC+1/+2)
        // Usamos la fecha del sistema pero con resiliencia
        const todayStr = now.toISOString().split('T')[0];
        let filteredPrices = prices.filter((p: any) => p.dateOnly === todayStr);

        // Si el filtro de fecha falla (ej: estamos a las 00:05 y el VPS va con retraso), cogemos los últimos 24
        if (filteredPrices.length === 0) {
            filteredPrices = prices.slice(-24);
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
    } catch (e) {
        return null;
    }
}
