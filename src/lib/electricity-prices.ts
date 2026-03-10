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
 * Función original para obtener precios de ESIOS.
 * Devuelve null si falla la API oficial, activando el estado de "Muestra" en la UI.
 */
export async function getElectricityPrices(): Promise<ElectricityPriceData | null> {
    const rawToken = process.env.ESIOS_TOKEN;

    if (!rawToken) {
        console.error("ESIOS_DEBUG: ESIOS_TOKEN no definido.");
        return null;
    }

    const TOKEN = rawToken.trim().replace(/^["']|["']$/g, '').trim();

    try {
        // Usamos solo la URL oficial que ESIOS recomienda
        const response = await fetch("https://api.esios.ree.es/indicators/1001?geo_ids[]=8741", {
            headers: {
                "x-api-key": TOKEN,
                "Accept": "application/json; application/vnd.esios-api-v2+json",
                "User-Agent": "Mozilla/5.0"
            },
            next: { revalidate: 3600 } // Volvemos a la caché de 1h
        });

        if (!response.ok) {
            console.error(`Status de ESIOS: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return processEsiosData(data);
    } catch (e) {
        console.error("Error cargando ESIOS:", e);
        return null;
    }
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

        const todayStr = now.toISOString().split('T')[0];
        let filteredPrices = prices.filter((p: any) => p.dateOnly === todayStr);

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
