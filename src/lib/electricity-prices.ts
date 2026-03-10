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
    let TOKEN = process.env.ESIOS_TOKEN;

    if (!TOKEN) {
        console.error("DEBUG ESIOS: Token faltante en process.env.ESIOS_TOKEN");
        return null;
    }

    TOKEN = TOKEN.trim().replace(/^["']|["']$/g, '').trim();

    // 1001 (Market Price), 1739 (PVPC 2.0TD)
    const INDICATOR = "1001";
    const PeninsulaGeoId = 8741;

    // Filtro de fecha para hoy
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Intentamos con una URL que especifíca el día para ser más deterministas
    const url = `https://api.esios.ree.es/indicators/${INDICATOR}?geo_ids=${PeninsulaGeoId}&start_date=${todayStr}T00:00&end_date=${todayStr}T23:59`;

    try {
        console.log(`DEBUG ESIOS: Consultando ${url}`);

        let response = await fetch(url, {
            headers: {
                "Accept": "application/json; application/vnd.esios-api-v2+json",
                "x-api-key": TOKEN,
                "User-Agent": "TuMejorTarifaLuz-Bot/1.0"
            },
            next: { revalidate: 3600 } // Cache por 1 hora a nivel Next.js
        });

        if (!response.ok) {
            console.error(`DEBUG ESIOS: Error ${response.status} al consultar API.`);
            // Intento 2: Sin rango de fechas (algunos indicadores prefieren esto)
            const fallbackUrl = `https://api.esios.ree.es/indicators/${INDICATOR}?geo_ids=${PeninsulaGeoId}`;
            response = await fetch(fallbackUrl, {
                headers: {
                    "Accept": "application/json; application/vnd.esios-api-v2+json",
                    "x-api-key": TOKEN
                }
            });
        }

        if (!response.ok) return null;

        const data = await response.json();
        const rawValues = data.indicator?.values;

        if (!rawValues || rawValues.length === 0) {
            console.warn("DEBUG ESIOS: No hay valores para hoy.");
            return null;
        }

        // Convertir y filtrar solo los de hoy (por si la API devuelve más)
        const prices = rawValues
            .filter((v: any) => v.datetime.startsWith(todayStr))
            .map((v: any) => ({
                value: v.value / 1000,
                hour: new Date(v.datetime).getHours(),
                datetime: v.datetime
            }));

        if (prices.length === 0) {
            // Si no hay de hoy específicamente, usamos lo que haya (probablemente ayer o mañana)
            prices.push(...rawValues.map((v: any) => ({
                value: v.value / 1000,
                hour: new Date(v.datetime).getHours(),
                datetime: v.datetime
            })));
        }

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

    } catch (error) {
        console.error("DEBUG ESIOS: Error en fetch:", error);
        return null;
    }
}
