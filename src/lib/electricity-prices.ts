export interface ElectricityPriceData {
    current: number;
    average: number;
    min: number;
    minHour: string;
    max: number;
    maxHour: string;
    time: string;
    isLive: boolean;
    allHours: any[];
}

export async function getElectricityPrices(): Promise<ElectricityPriceData | null> {
    let TOKEN = process.env.ESIOS_TOKEN;

    if (!TOKEN) {
        console.error("DEBUG ESIOS: No se encontró ESIOS_TOKEN en las variables de entorno.");
        return null;
    }

    // Limpieza profunda de comillas, espacios y caracteres invisibles
    TOKEN = TOKEN.trim().replace(/^["']|["']$/g, '').trim();

    const INDICATOR = "1001"; // PVPC
    const PeninsulaGeoId = 8741;
    const url = `https://api.esios.ree.es/indicators/${INDICATOR}?geo_ids[]=${PeninsulaGeoId}`;

    try {
        console.log("DEBUG ESIOS: Intentando petición con x-api-key (Token length:", TOKEN.length, ")");

        let response = await fetch(url, {
            headers: {
                "Accept": "application/json; application/vnd.esios-api-v2+json",
                "Content-Type": "application/json",
                "x-api-key": TOKEN
            },
            cache: 'no-store'
        });

        // Si falla con x-api-key, reintentamos con Authorization: Token token=
        if (!response.ok) {
            console.warn(`DEBUG ESIOS: Falló x-api-key (${response.status}). Reintentando con Authorization...`);
            response = await fetch(url, {
                headers: {
                    "Accept": "application/json; application/vnd.esios-api-v2+json",
                    "Authorization": `Token token=${TOKEN}`
                },
                cache: 'no-store'
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DEBUG ESIOS: Error crítico tras reintentos (${response.status}):`, errorText);
            return null;
        }

        const data = await response.json();
        const values = data.indicator?.values;

        if (!values || values.length === 0) {
            console.error("DEBUG ESIOS: La API respondió correctamente pero sin valores.");
            return null;
        }

        const now = new Date();
        const prices = values.map((v: any) => ({
            value: v.value / 1000,
            hour: new Date(v.datetime).getHours(),
            datetime: v.datetime
        }));

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

        console.log("DEBUG ESIOS: ¡ÉXITO! Datos de precios recuperados y procesados.");

        return {
            current: currentPriceItem.value,
            average: average,
            min: minItem.value,
            minHour: `${minItem.hour}:00 - ${minItem.hour + 1}:00`,
            max: maxItem.value,
            maxHour: `${maxItem.hour}:00 - ${maxItem.hour + 1}:00`,
            time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
            isLive: true,
            allHours: prices
        };

    } catch (error) {
        console.error("DEBUG ESIOS: Error de red o ejecución fatal:", error);
        return null;
    }
}
