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
        console.error("ESIOS_DEBUG: Error - ESIOS_TOKEN no está definido.");
        return null;
    }

    const TOKEN = rawToken.trim().replace(/^["']|["']$/g, '').trim();
    const INDICATOR = "1001";
    const PeninsulaGeoId = 8741;

    // USAMOS geo_ids[] con corchetes (formato que funcionaba anteriormente en el VPS)
    const url = `https://api.esios.ree.es/indicators/${INDICATOR}?geo_ids[]=${PeninsulaGeoId}`;

    try {
        console.log(`ESIOS_DEBUG: Consultando con formato compatible VPS (geo_ids[])...`);

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json; application/vnd.esios-api-v2+json",
                "x-api-key": TOKEN,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`ESIOS_DEBUG: Error ${response.status} en la API.`);
            return null;
        }

        const data = await response.json();
        return processEsiosData(data);

    } catch (error: any) {
        console.error("ESIOS_DEBUG: Error de red:", error.message);
        return null;
    }
}

function processEsiosData(data: any): ElectricityPriceData | null {
    const rawValues = data.indicator?.values;
    if (!rawValues || rawValues.length === 0) return null;

    const now = new Date();
    const prices = rawValues.map((v: any) => ({
        value: v.value / 1000,
        hour: new Date(v.datetime).getHours(),
        datetime: v.datetime,
        dateOnly: v.datetime.split('T')[0]
    }));

    // Detectamos el día de hoy en formato local
    const todayStr = now.toISOString().split('T')[0];
    let filteredPrices = prices.filter((p: any) => p.dateOnly === todayStr);

    // Si no hay de hoy (por cambio de hora a medianoche), usamos los últimos 24
    if (filteredPrices.length === 0) {
        filteredPrices = prices.slice(-24);
    }

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
}
