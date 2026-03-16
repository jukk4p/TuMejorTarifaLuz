export interface ApiPriceData {
    value: number;
    datetime: string;
    hour: number;
    dateOnly: string;
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
 * Función para obtener precios de ESIOS.
 * CUMPLE CON LAS NORMAS DE ESIOS (REE):
 * 1. Acceso desde servidor propio (Node.js/Next.js) para no exponer token.
 * 2. Caché local implementada para evitar peticiones masivas/redundantes.
 */
export async function getElectricityPrices(): Promise<ElectricityPriceData | null> {
    const rawToken = process.env.ESIOS_TOKEN;

    if (!rawToken) {
        console.error("ESIOS_DEBUG: ESIOS_TOKEN no definido.");
        return null;
    }

    const TOKEN = rawToken.trim().replace(/^["']|["']$/g, '').trim();

    try {
        // Probamos una URL más sencilla y cabeceras minimalistas
        const url = "https://api.esios.ree.es/indicators/1001?geo_ids=8741";
        const response = await fetch(url, {
            headers: {
                "x-api-key": TOKEN,
                "Authorization": `Token token=${TOKEN}`,
                "Accept": "application/json; application/vnd.esios-api-v2+json"
            },
            next: { revalidate: 3600 }
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

        // Forzamos la hora de Madrid (España)
        const now = new Date();
        const madridTime = new Intl.DateTimeFormat('es-ES', {
            timeZone: 'Europe/Madrid',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        }).formatToParts(now);
        
        const currentHour = parseInt(madridTime.find(p => p.type === 'hour')?.value || '0');
        const currentMinute = madridTime.find(p => p.type === 'minute')?.value || '00';

        // Obtener la fecha actual en Madrid para el filtrado
        const madridToday = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);

        const prices = rawValues.map((v: any) => {
            const date = new Date(v.datetime);
            // Obtener la fecha y hora en Madrid para cada punto de datos
            const formatter = new Intl.DateTimeFormat('es-ES', {
                timeZone: 'Europe/Madrid',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                hour12: false
            });
            const parts = formatter.formatToParts(date);
            
            const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
            const day = parts.find(p => p.type === 'day')?.value;
            const month = parts.find(p => p.type === 'month')?.value;
            const year = parts.find(p => p.type === 'year')?.value;
            
            // Re-formatear a YYYY-MM-DD para comparar con madridToday
            const dateOnly = `${year}-${month}-${day}`;

            return {
                value: v.value / 1000,
                hour: hour === 24 ? 0 : hour, // Ajuste para algunas APIs que devuelven 24
                datetime: v.datetime,
                dateOnly: dateOnly
            };
        });

        // Filtrar estrictamente por el día de hoy en Madrid
        let filteredPrices = prices.filter((p: any) => p.dateOnly === madridToday);

        // Si es muy temprano y no hay datos del día (raro en ESIOS), cogemos los últimos 24
        if (filteredPrices.length === 0) {
            filteredPrices = prices.slice(0, 24);
        }

        // Eliminar posibles duplicados de horas (a veces sucede en cambios de hora o solapamientos)
        const uniqueHours = new Map();
        filteredPrices.forEach((p: any) => {
            if (!uniqueHours.has(p.hour)) {
                uniqueHours.set(p.hour, p);
            }
        });
        
        filteredPrices = Array.from(uniqueHours.values());
        
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

        const currentPriceItem = filteredPrices.find((p: any) => p.hour === currentHour) || filteredPrices[filteredPrices.length - 1];

        return {
            current: currentPriceItem.value,
            average: average,
            min: minItem.value,
            minHour: `${String(minItem.hour).padStart(2, '0')}:00`,
            max: maxItem.value,
            maxHour: `${String(maxItem.hour).padStart(2, '0')}:00`,
            time: `${String(currentHour).padStart(2, '0')}:${currentMinute}`,
            isLive: true,
            allHours: filteredPrices
        };
    } catch (e) {
        return null;
    }
}
