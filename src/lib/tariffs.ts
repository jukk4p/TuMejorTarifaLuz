export interface Tariff {
    company: string;
    name: string;
    type: 'Fijo (1 Periodo)' | '3 Periodos';
    p1_kw_day: number; // Precio Potencia Punta €/kW/día
    p2_kw_day: number; // Precio Potencia Valle €/kW/día
    e1_kwh: number; // Precio Energía Punta €/kWh
    e2_kwh: number; // Precio Energía Llano €/kWh
    e3_kwh: number; // Precio Energía Valle €/kWh
    permanence: boolean;
    url: string;
    logo_url?: string;
    fee_monthly?: number;
    id?: string;
}
export const getLogoPath = (companyName: string, isDark: boolean = false) => {
    // Normalize: lowercase, trim, and remove accents
    const normalize = (str: string) =>
        (str || "").trim().toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const name = normalize(companyName);

    if (isDark) {
        switch (name) {
            case "niba": return "/logos/Niba.png";
            case "energia nufri": return "/logos/Energianufriv1.png";
            case "repsol": return "/logos/Repsolv1.png";
            case "octopus": return "/logos/Octopusv1.png";
        }
    }
    switch (name) {
        case "imagina": return "/logos/Imaginaenergia.png";
        case "domestica - visalia": return "/logos/Visalia.png";
        case "energia nufri": return "/logos/Energianufri.png";
        case "energya vm": return "/logos/Energiavm.png";
        case "total energies": return "/logos/TotalEnergies.png";
        case "chc energia": return "/logos/Chcenergia.png";
        case "niba": return "/logos/Nibav1.png";
        case "octopus": return "/logos/Octopus.png";
        case "repsol": return "/logos/Repsol.png";
        case "iberdrola": return "/logos/Iberdrola.png";
        case "endesa": return "/logos/Endesa.png";
        case "naturgy": return "/logos/Naturgy.png";
        case "esluz": return "/logos/Esluz.png";
        default: return null;
    }
};

import tariffsData from './data.json';
export const TARIFF_DATABASE: Tariff[] = tariffsData as Tariff[];

export interface CalculationInput {
    days: number;
    power_p1: number;
    power_p2: number;
    energy_p1: number;
    energy_p2: number;
    energy_p3: number;
    current_bill_total?: number;
    current_price_p1?: number;
    current_price_p2?: number;
    current_price_p3?: number;
}

export interface CalculationResult {
    tariff: Tariff;
    costPower: number;
    costEnergy: number;
    subtotal: number;
    taxIee: number;
    costBonoSocial: number;
    costMeter: number;
    fee: number;
    taxableBase: number;
    taxIva: number;
    total: number;
}

const CONSTANTS = {
    IEE: 0.0511, // 5.11%
    IVA: 0.21, // 21%
    BONO_SOCIAL_PER_DAY: 0.01912,
    METER_RENT_PER_MONTH: 0.81
};

export function calculateTariffCost(tariff: Tariff, input: CalculationInput): CalculationResult {
    // 1. Término de Potencia
    const costPowerP1 = input.power_p1 * (tariff.p1_kw_day ?? 0) * input.days;
    const costPowerP2 = input.power_p2 * (tariff.p2_kw_day ?? 0) * input.days;
    const costPower = costPowerP1 + costPowerP2;

    // 2. Término de Energía
    const costEnergyP1 = input.energy_p1 * (tariff.e1_kwh ?? 0);
    const costEnergyP2 = input.energy_p2 * (tariff.e2_kwh ?? 0);
    const costEnergyP3 = input.energy_p3 * (tariff.e3_kwh ?? 0);
    const costEnergy = costEnergyP1 + costEnergyP2 + costEnergyP3;

    // Subtotal
    const subtotal = costPower + costEnergy;

    // 3. Impuesto sobre la Electricidad (IEE)
    const taxIee = subtotal * CONSTANTS.IEE;

    // 4. Otros Costes Regulados
    const costBonoSocial = CONSTANTS.BONO_SOCIAL_PER_DAY * input.days;
    const costMeter = (CONSTANTS.METER_RENT_PER_MONTH / 30) * input.days; // proportional per day

    // 5. Cuota de la Compañía (Fee)
    const fee = tariff.fee_monthly || 0;

    // 6. Base Imponible
    const taxableBase = subtotal + taxIee + costBonoSocial + costMeter + fee;

    // 7. IVA
    const taxIva = taxableBase * CONSTANTS.IVA;

    // 8. Total Factura
    const total = taxableBase + taxIva;

    return {
        tariff,
        costPower,
        costEnergy,
        subtotal,
        taxIee,
        costBonoSocial,
        costMeter,
        fee,
        taxableBase,
        taxIva,
        total: Math.round(total * 100) / 100
    };
}

export function getTariffId(tariff: Tariff): string {
    if (tariff.id) return tariff.id;
    // Generate a stable ID based on company and name
    const slug = (str: string) => str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .trim();
    return `local-${slug(tariff.company)}-${slug(tariff.name)}`;
}

export function compareAllTariffs(tariffs: Tariff[], input: CalculationInput): CalculationResult[] {
    const results = tariffs.map(tariff => ({
        ...calculateTariffCost(tariff, input),
        tariff: { ...tariff, id: getTariffId(tariff) }
    }));
    return results.sort((a, b) => a.total - b.total);
}
