export interface Tariff {
    company: string;
    name: string;
    type: 'Fijo (1 Periodo)' | '3 Periodos';
    p1_kw_day: number; // Precio Potencia Punta €/kW/día
    p2_kw_day: number; // Precio Potencia Valle €/kW/día
    e1_kwh: number; // Precio Energía Punta €/kWh
    e2_kwh: number; // Precio Energía Llano €/kWh
    e3_kwh: number; // Precio Energía Valle €/kWh
    surplus_kwh?: number; // Precio Excedentes €/kWh
    
    // Precios con impuestos (opcionales)
    p1_kw_day_with_taxes?: number;
    p2_kw_day_with_taxes?: number;
    e1_kwh_with_taxes?: number;
    e2_kwh_with_taxes?: number;
    e3_kwh_with_taxes?: number;

    updatedAt?: string; // Fecha de última actualización (YYYY-MM-DD)
    permanence: boolean;
    url: string;
    logo_url?: string;
    id?: string;
}
export const getLogoPath = (companyName: string, isDark: boolean = false) => {
    const normalize = (str: string) =>
        (str || "").trim().toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const name = normalize(companyName);
    if (!name) return null;

    // Mapping normalized names/aliases to paths
    const logos: Record<string, { light: string, dark?: string, aliases?: string[] }> = {
        "imagina": { light: "/logos/logo_imaginaenergia.png", aliases: ["imagina energia"] },
        "visalia": { light: "/logos/logo_visalia.png" },
        "energia nufri": { light: "/logos/logo_energianufri_base.png", dark: "/logos/logo_energianufri_dark.png", aliases: ["nufri"] },
        "energya vm": { light: "/logos/logo_energiavm.png", aliases: ["vm", "energya"] },
        "total energies": { light: "/logos/logo_total_energies.png", aliases: ["totalenergies", "total"] },
        "chc energia": { light: "/logos/logo_chcenergia.png", aliases: ["chc"] },
        "niba": { light: "/logos/logo_niba_base.png", dark: "/logos/logo_niba_dark.png" },
        "octopus": { light: "/logos/logo_octopus_base.png", dark: "/logos/logo_octopus_dark.png", aliases: ["octopus energy"] },
        "repsol": { light: "/logos/logo_repsol_base.png", dark: "/logos/logo_repsol_dark.png" },
        "iberdrola": { light: "/logos/logo_iberdrola.png" },
        "endesa": { light: "/logos/logo_endesa.png" },
        "naturgy": { light: "/logos/logo_naturgy.png" },
        "esluz": { light: "/logos/logo_esluz.png" },
        "cor": { light: "/logos/COR.svg", aliases: ["comercializadoras de referencia", "referencia"] },
        "neolux energy": { light: "/logos/logo_neoluxenergy_base.webp", dark: "/logos/logo_neoluxenergy_dark.png", aliases: ["neolux"] }
    };

    // 1. Direct match or alias match
    for (const [key, data] of Object.entries(logos)) {
        if (name === key || data.aliases?.some(alias => name.includes(alias) || alias.includes(name))) {
            return isDark && data.dark ? data.dark : data.light;
        }
    }

    // 2. Fuzzy match (if extracted name contains the brand name)
    for (const [key, data] of Object.entries(logos)) {
        if (name.includes(key) || key.includes(name)) {
            return isDark && data.dark ? data.dark : data.light;
        }
    }

    return null;
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
    costPowerP1: number;
    costPowerP2: number;
    costEnergy: number;
    costEnergyP1: number;
    costEnergyP2: number;
    costEnergyP3: number;
    subtotal: number;
    taxIee: number;
    costBonoSocial: number;
    costMeter: number;
    taxableBase: number;
    taxIva: number;
    total: number;
}

export const CONSTANTS = {
    IEE: 0.005, // 0.5%
    IVA: 0.10, // 10%
    BONO_SOCIAL_PER_DAY: 0.01912,
    METER_RENT_PER_MONTH: 0.81
};

export function calculateTariffCost(tariff: Tariff, input: CalculationInput): CalculationResult {
    // Helper to use manually provided with-taxes price if available
    const getEffectivePrice = (base: number, withTaxes?: number) => {
        if (withTaxes && withTaxes > 0) {
            // We reverse-calculate the base price so that when the tax logic is applied, 
            // the result matches the manually provided price.
            return withTaxes / ((1 + CONSTANTS.IEE) * (1 + CONSTANTS.IVA));
        }
        return base;
    };

    const p1Price = getEffectivePrice(tariff.p1_kw_day, tariff.p1_kw_day_with_taxes);
    const p2Price = getEffectivePrice(tariff.p2_kw_day, tariff.p2_kw_day_with_taxes);
    const e1Price = getEffectivePrice(tariff.e1_kwh, tariff.e1_kwh_with_taxes);
    const e2Price = getEffectivePrice(tariff.e2_kwh, tariff.e2_kwh_with_taxes);
    const e3Price = getEffectivePrice(tariff.e3_kwh, tariff.e3_kwh_with_taxes);

    // 1. Término de Potencia
    const costPowerP1 = input.power_p1 * p1Price * input.days;
    const costPowerP2 = input.power_p2 * p2Price * input.days;
    const costPower = costPowerP1 + costPowerP2;

    // 2. Término de Energía
    const costEnergyP1 = input.energy_p1 * e1Price;
    const costEnergyP2 = input.energy_p2 * e2Price;
    const costEnergyP3 = input.energy_p3 * e3Price;
    const costEnergy = costEnergyP1 + costEnergyP2 + costEnergyP3;

    // Subtotal
    const subtotal = costPower + costEnergy;

    // 3. Impuesto sobre la Electricidad (IEE)
    const taxIee = subtotal * CONSTANTS.IEE;

    // 4. Otros Costes Regulados
    const costBonoSocial = CONSTANTS.BONO_SOCIAL_PER_DAY * input.days;
    const costMeter = (CONSTANTS.METER_RENT_PER_MONTH / 30) * input.days; // proportional per day

    // 5. Base Imponible
    const taxableBase = subtotal + taxIee + costBonoSocial + costMeter;

    // 6. IVA
    const taxIva = taxableBase * CONSTANTS.IVA;

    // 7. Total Factura
    const total = taxableBase + taxIva;

    return {
        tariff,
        costPower,
        costPowerP1,
        costPowerP2,
        costEnergy,
        costEnergyP1,
        costEnergyP2,
        costEnergyP3,
        subtotal,
        taxIee,
        costBonoSocial,
        costMeter,
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
