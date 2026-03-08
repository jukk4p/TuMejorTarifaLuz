export interface ElectricityPriceData {
    current: number;
    average: number;
    min: number;
    minHour: string;
    max: number;
    maxHour: string;
    time: string;
    allHours: any[];
}

export async function getElectricityPrices(): Promise<ElectricityPriceData | null> {
    const TOKEN = process.env.ESIOS_TOKEN;
    if (!TOKEN) {
        console.error("Missing ESIOS_TOKEN env variable");
        return null;
    }

    const INDICATOR = "1001"; // PVPC
    const PeninsulaGeoId = 8741;

    const now = new Date();
    // Fetch for today in Spain (approximate with local time)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    const url = `https://api.esios.ree.es/indicators/${INDICATOR}?start_date=${start}&end_date=${end}&geo_ids[]=${PeninsulaGeoId}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Accept": "application/json; application/vnd.esios-api-v2+json",
                "Content-Type": "application/json",
                "x-api-key": TOKEN
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`ESIOS error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        const values = data.indicator?.values;

        if (!values || values.length === 0) {
            return null;
        }

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
        const currentPriceItem = prices.find((p: any) => p.hour === currentHour) || prices[0];

        return {
            current: currentPriceItem.value,
            average: average,
            min: minItem.value,
            minHour: `${minItem.hour}:00 - ${minItem.hour + 1}:00`,
            max: maxItem.value,
            maxHour: `${maxItem.hour}:00 - ${maxItem.hour + 1}:00`,
            time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
            allHours: prices
        };

    } catch (error) {
        console.error("Error fetching electricity prices:", error);
        return null;
    }
}
