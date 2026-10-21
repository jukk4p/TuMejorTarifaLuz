export interface FaqItem {
    q: string;
    a: string;
}

export const COMPARADOR_FAQS: FaqItem[] = [
    {
        q: "¿Qué pasa con los datos de mi factura cuando la subo?",
        a: "Solo extraemos los datos técnicos necesarios para el cálculo: CUPS, potencia contratada y consumo por periodos. Usamos cifrado SSL/TLS y no almacenamos ni vendemos tu información personal a terceros."
    },
    {
        q: "¿Qué significa la potencia contratada (P1, P2) que me pide el formulario?",
        a: "Es la potencia máxima que puedes demandar en cada periodo (punta y valle), medida en kW. Aparece en tu factura como 'Potencia contratada'. Si no la tienes a mano, puedes subir el PDF y la detectamos automáticamente."
    },
    {
        q: "¿Qué es una tarifa 'Fijo (1 Periodo)' y qué es '3 Periodos'?",
        a: "Fijo (1 Periodo) cobra el mismo precio de energía a cualquier hora del día. 3 Periodos (punta, llano y valle) cobra distinto según la hora, más caro en punta y más barato en valle — conviene si puedes desplazar consumo a la noche o el fin de semana."
    },
    {
        q: "¿Tengo que pagar o registrarme para usar el comparador?",
        a: "No. Es gratuito y no exige registro para ver el resultado. Solo te pedimos datos de contacto si decides que te ayudemos con el cambio de compañía."
    },
    {
        q: "Si encuentro una tarifa mejor, ¿cómo cambio de compañía?",
        a: "Te damos el enlace directo a la web oficial de la comercializadora para que hagas el trámite tú mismo, sin intermediarios ni llamadas comerciales. La decisión de contratar siempre es tuya."
    },
    {
        q: "¿Las tarifas que muestra el comparador están actualizadas?",
        a: "Sí, revisamos y actualizamos más de 25 tarifas diariamente, sincronizando con el mercado mayorista OMIE y las publicaciones oficiales de las comercializadoras."
    }
];

export const TARIFAS_FAQS: FaqItem[] = [
    {
        q: "¿Cómo se diferencian las tarifas 'Fijo', '3 Periodos' y 'PVPC' del catálogo?",
        a: "Fijo cobra un único precio de energía a cualquier hora. 3 Periodos varía el precio según punta, llano o valle. PVPC es la tarifa regulada, indexada a diario al mercado mayorista — solo la ofrecen las comercializadoras de referencia."
    },
    {
        q: "¿Qué significa que una tarifa tenga 'permanencia'?",
        a: "Que si te das de baja antes de cumplir el plazo pactado (normalmente 1 o 2 años), la compañía puede cobrarte una penalización. Lo indicamos en cada tarifa del catálogo para que lo tengas en cuenta antes de contratar."
    },
    {
        q: "¿Cómo sé cuál es la mejor tarifa para mi caso concreto?",
        a: "El catálogo te deja comparar precios y condiciones, pero el resultado exacto depende de tu consumo real por periodos. Para eso está el comparador: sube tu factura o introduce tus datos y te decimos cuánto pagarías con cada tarifa."
    },
    {
        q: "¿Con qué frecuencia se actualizan los precios del catálogo?",
        a: "A diario. Sincronizamos con el mercado mayorista OMIE y con las publicaciones oficiales de las comercializadoras, así que si una compañía cambia una tarifa la verás reflejada en menos de 24 horas."
    },
    {
        q: "¿Puedo comparar varias tarifas entre sí antes de decidir?",
        a: "Sí, selecciona las tarifas que te interesen con el botón de comparar y verás una tabla lado a lado con precios, tipo de periodo y condiciones de permanencia."
    }
];

// Compartido entre ProviderClient.tsx (render visible) y companias/[slug]/page.tsx
// (FAQPage schema), para que el structured data de cada compañía coincida con lo
// que el usuario ve en pantalla.
export const getProviderFaqs = (provider: { name: string; minPrice: number; popularTariffName?: string; hasPermanence?: boolean }): FaqItem[] => [
    {
        q: `¿Qué precio tiene el kWh de ${provider.name}?`,
        a: `Actualmente ${provider.name} ofrece precios desde ${provider.minPrice.toFixed(3)} €/kWh en su tarifa ${provider.popularTariffName || 'destacada'}.`
    },
    {
        q: `¿Tiene permanencia ${provider.name}?`,
        a: provider.hasPermanence
            ? `Sí, algunas tarifas de ${provider.name} pueden tener compromiso de permanencia.`
            : `No, ${provider.name} destaca por no tener compromiso de permanencia en sus contratos de luz.`
    }
];

export const PRECIO_LUZ_HOY_FAQS: FaqItem[] = [
    {
        q: "¿Qué es el PVPC y por qué cambia el precio cada hora?",
        a: "El PVPC (Precio Voluntario para el Pequeño Consumidor) es la tarifa regulada en España. Su precio se fija cada hora según el mercado mayorista eléctrico (OMIE), que varía con la demanda y la generación disponible en cada momento del día."
    },
    {
        q: "¿Cuándo suele ser más barata la luz normalmente?",
        a: "Por lo general, de madrugada y durante el fin de semana, cuando baja la demanda. Con alta generación solar o eólica, también pueden aparecer horas muy baratas a mediodía. Consulta siempre la tabla de hoy, porque varía cada día."
    },
    {
        q: "¿Estos precios aplican a cualquier tarifa o solo al PVPC?",
        a: "Aplican directamente a quienes tienen una tarifa PVPC o una tarifa indexada del mercado libre. Si tienes una tarifa fija, pagas el mismo precio de energía a cualquier hora, así que esta tabla no afecta a tu factura, aunque te sirve para comparar."
    },
    {
        q: "¿Puedo ver el precio de la luz de mañana?",
        a: "Los precios del mercado mayorista para el día siguiente se publican por la tarde (normalmente alrededor de las 20:30h). Actualizamos esta página en cuanto están disponibles."
    },
    {
        q: "¿De dónde salen estos datos y son fiables?",
        a: "Provienen de Red Eléctrica de España (ESIOS) y del mercado mayorista OMIE, las mismas fuentes oficiales que usan las comercializadoras para calcular el PVPC. Los sincronizamos a diario."
    }
];
