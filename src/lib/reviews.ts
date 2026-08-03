import reviewsData from './reviews.json';

const REPSOL_ELEC_KEYWORDS = [
    'luz', 'electric', 'factur', 'tarif', 'kwh', 'suministr',
    'contrato', 'potencia', 'energi', 'bono social', 'waylet',
    'alta de', 'cambio de compa', 'comercializ', 'hogar confort'
];
const GAS_STATION_KEYWORDS = [
    'surtidor', 'repost', 'estaci', 'combustibl', 'gasolinera',
    'carburant', 'diesel', 'lavado', 'lubricant', 'glp', 'gasoil',
    'depósito', 'lavar el coche'
];

export function getProviderReviews(providerId: string): any[] {
    const all: any[] = (reviewsData as Record<string, any>)[providerId] || [];
    if (providerId !== 'repsol') return all;
    // Repsol's Trustpilot mixes electricity + gas station reviews.
    // Require a positive electricity signal AND no gas station signal.
    return all.filter(rev => {
        const text = ((rev.title || '') + ' ' + (rev.text || '')).toLowerCase();
        const isGas = GAS_STATION_KEYWORDS.some(kw => text.includes(kw));
        const hasElec = REPSOL_ELEC_KEYWORDS.some(kw => text.includes(kw));
        return !isGas && hasElec;
    });
}
