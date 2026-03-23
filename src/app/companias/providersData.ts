export interface Provider {
    id: string;
    name: string;
    logo: string;
    logo_dark?: string;
    rating: number;
    description: string;
    pros: string[];
    prosDetail?: string[];
    cons: string[];
    consDetail?: string[];
    slug: string;
    color: string;
    minPrice: number;
    category: 'big' | 'independent' | 'regulated';
    hasPermanence: boolean;
    popularTariffName?: string;
    scores: {
        price: number;
        support: number;
        app: number;
        transparency: number;
        onboarding: number;
    };
}

export const providers: Provider[] = [
    {
        id: "octopus",
        name: "Octopus Energy",
        logo: "/logos/Octopus.png",
        logo_dark: "/logos/Octopusv1.png",
        rating: 4.9,
        description: "Líder mundial en tecnología energética con un enfoque obsesivo en el cliente y energía 100% renovable. Conocida por su tarifa Octopus Relax y su excelente servicio técnico.",
        pros: ["Atención al cliente premiada", "Tecnología Kraken de última generación", "Energía 100% verde certificada", "Transparencia total en facturación"],
        prosDetail: ["Premio Which? 2024", "Optimización por IA", "Garantía de origen", "Factura sin sorpresas"],
        cons: ["Marca joven en España", "Menos oficinas físicas"],
        consDetail: ["Llegada en 2021", "Modelo 100% digital"],
        slug: "octopus-energy",
        color: "#ff008c",
        minPrice: 0.129,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Relax",
        scores: { price: 4.5, support: 5.0, app: 4.8, transparency: 5.0, onboarding: 4.7 }
    },
    {
        id: "niba",
        name: "Niba",
        logo: "/logos/Nibav1.png",
        logo_dark: "/logos/Niba.png",
        rating: 4.7,
        description: "Una comercializadora digital que simplifica la energía para el consumidor moderno. Ofrece tarifas claras y una experiencia de usuario optimizada a través de su App.",
        pros: ["Experiencia 100% digital", "Tarifas competitivas", "Sin trámites farragosos", "Energía eficiente"],
        prosDetail: ["App nativa fluida", "Tarifas Zen/Tres", "Contratación en 2 min", "Monitorización real"],
        cons: ["Solo gestión online", "Reducida presencia"],
        consDetail: ["Sin atención física", "Sin publicidad masiva"],
        slug: "niba",
        color: "#00d1b2",
        minPrice: 0.118,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Zen",
        scores: { price: 5.0, support: 4.2, app: 4.5, transparency: 4.8, onboarding: 5.0 }
    },
    {
        id: "repsol",
        name: "Repsol",
        logo: "/logos/Repsol.png",
        logo_dark: "/logos/Repsolv1.png",
        rating: 4.5,
        description: "Gigante multi-energía que ofrece ahorros integrados a través de Waylet. Ideal para quienes buscan unificar suministros de luz, gas y carburante.",
        pros: ["Descuentos en carburante", "Solidez y confianza", "Servicios adicionales", "Fuerte en autoconsumo"],
        prosDetail: ["Ahorros vía Waylet", "Marca Ibex 35", "Gas y mantenimiento", "Líder en solar"],
        cons: ["Estructura compleja", "Precio base medio"],
        consDetail: ["Depende de otros productos", "Tarifas estándar elevadas"],
        slug: "repsol",
        color: "#ff4d00",
        minPrice: 0.120,
        category: 'big',
        hasPermanence: false,
        popularTariffName: "Ahorro Plus",
        scores: { price: 4.0, support: 4.3, app: 4.5, transparency: 4.0, onboarding: 4.2 }
    },
    {
        id: "energianufri",
        name: "Energía Nufri",
        logo: "/logos/Energianufri.png",
        logo_dark: "/logos/Energianufriv1.png",
        rating: 4.3,
        description: "Comercializadora con tarifas competitivas y un enfoque claro en el ahorro doméstico y de pequeñas empresas.",
        pros: ["Precios competitivos", "Claridad en facturas", "Atención personalizada"],
        prosDetail: ["Bajo margen de beneficio", "Sin costes ocultos", "Gestor asignado"],
        cons: ["Marca en expansión", "Menos servicios añadidos"],
        consDetail: ["Menor red comercial", "Foco solo en energía"],
        slug: "energia-nufri",
        color: "#00a1e1",
        minPrice: 0.125,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Calma",
        scores: { price: 4.6, support: 4.1, app: 3.6, transparency: 4.4, onboarding: 4.6 }
    },
    {
        id: "iberdrola",
        name: "Iberdrola",
        logo: "/logos/Iberdrola.png",
        rating: 4.2,
        description: "La mayor eléctrica de España y líder mundial en eólica. Ofrece una infraestructura robusta y planes personalizados como el Plan Online.",
        pros: ["Líder renovables", "Infraestructura propia", "App muy completa", "Atención presencial"],
        prosDetail: ["Líder mundial eólica", "Distribución i-DE", "Smart Home integrada", "Más de 500 oficinas"],
        cons: ["Precios menos agresivos", "Facturación compleja"],
        consDetail: ["Coste extra de marca", "Múltiples conceptos"],
        slug: "iberdrola",
        color: "#3d9e3d",
        minPrice: 0.110,
        category: 'big',
        hasPermanence: false,
        popularTariffName: "Plan Online",
        scores: { price: 3.8, support: 4.0, app: 4.5, transparency: 3.8, onboarding: 4.0 }
    },
    {
        id: "endesa",
        name: "Endesa",
        logo: "/logos/Endesa.png",
        rating: 4.1,
        description: "Una de las 'Big Three' en España, destaca por su digitalización agresiva y tarifas como Conecta Endesa que suelen liderar los rankings de precio.",
        pros: ["Tarifas online baratas", "Gran red de servicio", "Digitalización avanzada", "Promociones frecuentes"],
        prosDetail: ["Tarifa Conecta líder", "Presencia en todo el país", "Gestión vía App 24/7", "Descuentos en factura"],
        cons: ["Post-venta mejorable", "Gestión lenta"],
        consDetail: ["Tiempos de espera", "Trámites burocráticos"],
        slug: "endesa",
        color: "#0054a6",
        minPrice: 0.100,
        category: 'big',
        hasPermanence: false,
        popularTariffName: "Fija 24h Online",
        scores: { price: 4.5, support: 3.8, app: 4.3, transparency: 4.0, onboarding: 4.5 }
    },
    {
        id: "naturgy",
        name: "Naturgy",
        logo: "/logos/Naturgy.png",
        rating: 4.0,
        description: "Histórica gasista reconvertida en gigante multi-energía. Ofrece estabilidad y un servicio al cliente muy cercano a la tradición familiar.",
        pros: ["Atención telefónica", "Tarifas de noche", "Estabilidad de marca", "Especialista en gas"],
        prosDetail: ["Casi 100% satisfacción", "Plan Noche ahorro", "Más de 175 años", "Servihogar incluible"],
        cons: ["Menos innovadora", "Tarifas fijas elevadas"],
        consDetail: ["App con menos funciones", "Precio base conservador"],
        slug: "naturgy",
        color: "#f39200",
        minPrice: 0.0718,
        category: 'big',
        hasPermanence: false,
        popularTariffName: "Tarifa Noche",
        scores: { price: 3.9, support: 4.5, app: 3.8, transparency: 3.9, onboarding: 3.8 }
    },
    {
        id: "totalenergies",
        name: "TotalEnergies",
        logo: "/logos/TotalEnergies.png",
        rating: 4.2,
        description: "Multinacional francesa con gran presencia en España tras adquirir la cartera de EDP. Ofrece programas de fidelización atractivos.",
        pros: ["Puntos y regalos", "Energía limpia", "Tarifas estables", "Servicio Facilita"],
        prosDetail: ["Canjeable en productos", "Certificación verde", "Sin cambios imprevistos", "Mantenimiento premium"],
        cons: ["Cambio lento", "Publicidad intrusiva"],
        consDetail: ["Plazos de activación", "Contactos comerciales"],
        slug: "total-energies",
        color: "#ed1c24",
        minPrice: 0.110,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "A tu Aire Luz Siempre",
        scores: { price: 4.4, support: 4.0, app: 3.8, transparency: 4.0, onboarding: 4.2 }
    },
    {
        id: "imagina",
        name: "Imagina Energía",
        logo: "/logos/Imaginaenergia.png",
        rating: 4.4,
        description: "Energía 100% solar sin necesidad de instalar paneles en tu tejado. Especialistas en energía local y sostenible.",
        pros: ["Energía 100% solar", "Sin permanencia", "Producción local", "Sencillez radical"],
        prosDetail: ["Origen garantizado", "Libre de contratos largos", "Huertos solares propios", "Factura de una página"],
        cons: ["Catálogo limitado", "Nicho específico"],
        consDetail: ["Pocas opciones de tramo", "Enfoque puramente solar"],
        slug: "imagina-energia",
        color: "#ffc20e",
        minPrice: 0.105,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Tarifa base Sin Horas",
        scores: { price: 4.6, support: 4.0, app: 3.8, transparency: 4.5, onboarding: 4.8 }
    },
    {
        id: "visalia",
        name: "Visalia",
        logo: "/logos/Visalia.png",
        rating: 4.1,
        description: "Grupo energético independiente que ofrece soluciones personalizadas para hogares y empresas, destacando por su proximidad y flexibilidad.",
        pros: ["Atención cercana", "Flexibilidad", "Energía verde"],
        prosDetail: ["Trato humano", "Planes a medida", "100% renovable"],
        cons: ["Marca menos conocida", "Menos servicios digitales"],
        consDetail: ["Menor inversión en marketing", "Web funcional básica"],
        slug: "visalia",
        color: "#00b4ff",
        minPrice: 0.098,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Luz Fijo 24h",
        scores: { price: 4.8, support: 4.3, app: 3.5, transparency: 4.3, onboarding: 4.5 }
    },
    {
        id: "energia-vm",
        name: "Energya VM",
        logo: "/logos/Energiavm.png",
        rating: 4.2,
        description: "Parte del Grupo Villar Mir, ofrece estabilidad y experiencia en el mercado energético con tarifas competitivas y energía 100% renovable.",
        pros: ["Respaldo de gran grupo", "Tarifas competitivas", "Experiencia en mercado"],
        prosDetail: ["Solidez financiera", "Márgenes ajustados", "Desde 2002"],
        cons: ["Interfaz digital básica", "Procesos tradicionales"],
        consDetail: ["Portal cliente sencillo", "Gestión menos ágil"],
        slug: "energia-vm",
        color: "#1e3a8a",
        minPrice: 0.106,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Formula 24h",
        scores: { price: 4.4, support: 4.0, app: 3.8, transparency: 4.0, onboarding: 4.2 }
    },
    {
        id: "chc-energia",
        name: "CHC Energía",
        logo: "/logos/Chcenergia.png",
        rating: 4.0,
        description: "Cercanía y servicio local. CHC Energía destaca por su amplia red de oficinas físicas en entornos rurales y semi-urbanos.",
        pros: ["Gran red física", "Trato humano", "Factura sencilla"],
        prosDetail: ["+150 oficinas rurales", "Cercanía real", "Sin tecnicismos"],
        cons: ["Poca innovación", "Tarifas menos dinámicas"],
        consDetail: ["App básica", "Menos ofertas flash"],
        slug: "chc-energia",
        color: "#ed1c24",
        minPrice: 0.0593,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Plan Vehículo Eléctrico",
        scores: { price: 3.9, support: 4.6, app: 3.3, transparency: 4.1, onboarding: 3.9 }
    },
    {
        id: "esluz",
        name: "Esluz",
        logo: "/logos/Esluz.png",
        rating: 4.1,
        description: "Comercializadora ágil y dinámica que busca simplificar el ahorro energético para el cliente doméstico con tarifas directas.",
        pros: ["Simplicidad", "Trato ágil", "Tarifas claras"],
        prosDetail: ["Contrato sin letra pequeña", "Activación rápida", "Precio directo"],
        cons: ["Estructura pequeña", "Menos variedad"],
        consDetail: ["Sin servicios extra", "Solo un par de planes"],
        slug: "esluz",
        color: "#84cc16",
        minPrice: 0.0853,
        category: 'independent',
        hasPermanence: false,
        popularTariffName: "Tarifa Solar 2.0",
        scores: { price: 4.5, support: 4.0, app: 3.7, transparency: 4.3, onboarding: 4.7 }
    },
    {
        id: "cor",
        name: "COR",
        logo: "/logos/COR.svg",
        rating: 4.5,
        description: "Comercializadoras de Referencia autorizadas por el Gobierno para ofrecer la tarifa regulada PVPC y gestionar el Bono Social Eléctrico.",
        pros: ["Precio regulado", "Acceso Bono Social", "Transparencia", "Sin permanencia"],
        prosDetail: ["Basado en el pool", "Ayuda a vulnerables", "Control estatal", "Total libertad"],
        cons: ["Precio volátil", "Sin servicios añadidos"],
        consDetail: ["Cambia cada hora", "Luz básica solamente"],
        slug: "comercializadoras-referencia",
        color: "#137fec",
        minPrice: 0.1047,
        category: 'regulated',
        hasPermanence: false,
        popularTariffName: "PVPC - Mercado Regulado",
        scores: { price: 5.0, support: 3.5, app: 3.0, transparency: 4.8, onboarding: 3.5 }
    }
];
