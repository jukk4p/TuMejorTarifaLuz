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
 * Función ultra-robusta con sistema de RESCATE si Red Eléctrica bloquea la IP del VPS.
 */
export async function getElectricityPrices(): Promise<ElectricityPriceData | null> {
    const rawToken = process.env.ESIOS_TOKEN;

    // 1. INTENTOS CON ESIOS (API OFICIAL)
    if (rawToken) {
        const TOKEN = rawToken.trim().replace(/^["']|["']$/g, '').trim();
        console.log(`ESIOS_DEBUG: Iniciando fetch oficial (Token len: ${TOKEN.length})`);

        const attempts = [
            { url: "https://api.esios.ree.es/indicators/1001?geo_ids[]=8741", name: "ESIOS 1001 (geo_ids[])" },
            { url: "https://api.esios.ree.es/indicators/1001?geo_ids=8741", name: "ESIOS 1001 (standard)" }
        ];

        for (const attempt of attempts) {
            try {
                const response = await fetch(attempt.url, {
                    headers: {
                        "Accept": "application/json; application/vnd.esios-api-v2+json",
                        "x-api-key": TOKEN,
                        "User-Agent": "Mozilla/5.0"
                    },
                    cache: 'no-store'
                });

                if (response.ok) {
                    const data = await response.json();
                    const processed = processEsiosData(data);
                    if (processed) return processed;
                }
            } catch (err: any) {
                console.warn(`ESIOS_DEBUG: Fallo en ${attempt.name}: ${err.message}`);
            }
        }
    }

    // 2. SISTEMA DE RESCATE: API SECUNDARIA (Si el VPS está bloqueado por REE)
    console.warn("ESIOS_DEBUG: VPS BLOQUEADO O TOKEN INVÁLIDO. Activando sistema de rescate...");
    try {
        const rescueUrl = "https://api.preciodelaluz.org/v1/prices/all?zone=PCB";
        const response = await fetch(rescueUrl, { cache: 'no-store' });

        if (response.ok) {
            const data = await response.json();
            const processed = processRescueData(data);
            if (processed) {
                console.log("ESIOS_DEBUG: ¡ÉXITO! Datos recuperados vía API de Rescate (preciodelaluz.org)");
                return processed;
            }
        }
    } catch (rescueErr: any) {
        console.error("ESIOS_DEBUG: Falló también la API de rescate:", rescueErr.message);
    }

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

        const todayStr = now.toISOString().split('T')[0];
        let filteredPrices = prices.filter((p: any) => p.dateOnly === todayStr);
        if (filteredPrices.length === 0) filteredPrices = prices.slice(-24);
        if (filteredPrices.length === 0) return null;

        filteredPrices.sort((a, b) => a.hour - b.hour);
        const sum = filteredPrices.reduce((acc, p) => acc + p.value, 0);
        const average = sum / filteredPrices.length;

        let minItem = filteredPrices[0], maxItem = filteredPrices[0];
        filteredPrices.forEach(p => {
            if (p.value < minItem.value) minItem = p;
            if (p.value > maxItem.value) maxItem = p;
        });

        const currentHour = now.getHours();
        const currentPriceItem = filteredPrices.find(p => p.hour === currentHour) || filteredPrices[filteredPrices.length - 1];

        return {
            current: currentPriceItem.value,
            average,
            min: minItem.value,
            minHour: `${minItem.hour}:00`,
            max: maxItem.value,
            maxHour: `${maxItem.hour}:00`,
            time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
            isLive: true,
            allHours: filteredPrices
        };
    } catch { return null; }
}

function processRescueData(data: any): ElectricityPriceData | null {
    try {
        // La API de preciodelaluz.org devuelve un objeto con llaves "00-01", "01-02", etc.
        const hours = Object.values(data) as any[];
        if (hours.length === 0) return null;

        const now = new Date();
        const prices = hours.map((h: any) => ({
            value: h.price / 1000,
            hour: parseInt(h.hour.split('-')[0]),
            datetime: new Date().toISOString() // Aproximado
        }));

        prices.sort((a, b) => a.hour - b.hour);
        const sum = prices.reduce((acc, p) => acc + p.value, 0);
        const average = sum / prices.length;

        let minItem = prices[0], maxItem = prices[0];
        prices.forEach(p => {
            if (p.value < minItem.value) minItem = p;
            if (p.value > maxItem.value) maxItem = p;
        });

        const currentHour = now.getHours();
        const currentPriceItem = prices.find(p => p.hour === currentHour) || prices[0];

        return {
            current: currentPriceItem.value,
            average,
            min: minItem.value,
            minHour: `${minItem.hour}:00`,
            max: maxItem.value,
            maxHour: `${maxItem.hour}:00`,
            time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
            isLive: true,
            allHours: prices
        };
    } catch { return null; }
}
