export interface Provider {
    id: string;
    name: string;
    logo: string;
    logo_dark?: string;
    rating: number;
    description: string;
    pros: string[];
    cons: string[];
    slug: string;
    color: string;
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
        cons: ["Marca relativamente joven en España", "Menos oficinas físicas que las tradicionales"],
        slug: "octopus-energy",
        color: "#ff008c"
    },
    {
        id: "niba",
        name: "Niba",
        logo: "/logos/Nibav1.png",
        logo_dark: "/logos/Niba.png",
        rating: 4.7,
        description: "Una comercializadora digital que simplifica la energía para el consumidor moderno. Ofrece tarifas claras y una experiencia de usuario optimizada a través de su App.",
        pros: ["Experiencia 100% digital", "Tarifas muy competitivas (Zen/Tres)", "Sin trámites farragosos", "Enfoque en la eficiencia energética"],
        cons: ["Solo gestión online", "Poca presencia de marca a nivel nacional"],
        slug: "niba",
        color: "#00d1b2"
    },
    {
        id: "repsol",
        name: "Repsol",
        logo: "/logos/Repsol.png",
        logo_dark: "/logos/Repsolv1.png",
        rating: 4.5,
        description: "Gigante multi-energía que ofrece ahorros integrados a través de Waylet. Ideal para quienes buscan unificar suministros de luz, gas y carburante.",
        pros: ["Descuentos en carburante (Waylet)", "Solidez y confianza de marca", "Amplia gama de servicios adicionales", "Fuerte apuesta por el autoconsumo"],
        cons: ["Estructura de descuentos compleja", "Precio base menos competitivo sin usar sus descuentos cruzados"],
        slug: "repsol",
        color: "#ff4d00"
    },
    {
        id: "energianufri",
        name: "Energía Nufri",
        logo: "/logos/Energianufri.png",
        logo_dark: "/logos/Energianufriv1.png",
        rating: 4.3,
        description: "Comercializadora con tarifas competitivas y un enfoque claro en el ahorro doméstico y de pequeñas empresas.",
        pros: ["Precios muy competitivos", "Claridad en las facturas", "Atención personalizada"],
        cons: ["Marca en expansión", "Menos servicios añadidos"],
        slug: "energia-nufri",
        color: "#00a1e1"
    },
    {
        id: "iberdrola",
        name: "Iberdrola",
        logo: "/logos/Iberdrola.png",
        rating: 4.2,
        description: "La mayor eléctrica de España y líder mundial en eólica. Ofrece una infraestructura robusta y planes personalizados como el Plan Online.",
        pros: ["Líder mundial en renovables", "Infraestructura de red propia", "App móvil muy completa", "Atención al cliente presencial masiva"],
        cons: ["Precios menos agresivos que las 'low-cost'", "Facturación a veces difícil de entender"],
        slug: "iberdrola",
        color: "#3d9e3d"
    },
    {
        id: "endesa",
        name: "Endesa",
        logo: "/logos/Endesa.png",
        rating: 4.1,
        description: "Una de las 'Big Three' en España, destaca por su digitalización agresiva y tarifas como Conecta Endesa que suelen liderar los rankings de precio.",
        pros: ["Tarifas online muy baratas (Conecta)", "Gran red de puntos de servicio", "Digitalización avanzada", "Promociones frecuentes"],
        cons: ["Servicio post-venta mejorable", "Gestión administrativa lenta"],
        slug: "endesa",
        color: "#0054a6"
    },
    {
        id: "naturgy",
        name: "Naturgy",
        logo: "/logos/Naturgy.png",
        rating: 4.0,
        description: "Histórica gasista reconvertida en gigante multi-energía. Ofrece estabilidad y un servicio al cliente muy cercano a la tradición familiar.",
        pros: ["Excelencia en atención telefónica", "Tarifas de noche muy competitivas", "Estabilidad de marca", "Buenas opciones para gas natural"],
        cons: ["Menos innovadora tecnológicamente", "Tarifas fijas algo elevadas"],
        slug: "naturgy",
        color: "#f39200"
    },
    {
        id: "totalenergies",
        name: "TotalEnergies",
        logo: "/logos/TotalEnergies.png",
        rating: 4.2,
        description: "Multinacional francesa con gran presencia en España tras adquirir la cartera de EDP. Ofrece programas de fidelización atractivos.",
        pros: ["Programa de puntos y regalos", "Energía limpia certificada", "Tarifas estables", "Buen servicio de mantenimiento (Facilita)"],
        cons: ["Proceso de cambio a veces lento", "Publicidad algo intrusiva"],
        slug: "total-energies",
        color: "#ed1c24"
    },
    {
        id: "imagina",
        name: "Imagina Energía",
        logo: "/logos/Imaginaenergia.png",
        rating: 4.4,
        description: "Energía 100% solar sin necesidad de instalar paneles en tu tejado. Especialistas en energía local y sostenible.",
        pros: ["Energía 100% solar", "Sin permanencia", "Apoyo a la producción local", "Sencillez radical"],
        cons: ["Catálogo de tarifas limitado", "Nicho muy específico"],
        slug: "imagina-energia",
        color: "#ffc20e"
    },
    {
        id: "visalia",
        name: "Visalia",
        logo: "/logos/Visalia.png",
        rating: 4.1,
        description: "Grupo energético independiente que ofrece soluciones personalizadas para hogares y empresas, destacando por su proximidad y flexibilidad.",
        pros: ["Atención cercana", "Flexibilidad en contratos", "Energía verde"],
        cons: ["Marca menos conocida", "Menos servicios digitales"],
        slug: "visalia",
        color: "#00b4ff"
    },
    {
        id: "energia-vm",
        name: "Energya VM",
        logo: "/logos/Energiavm.png",
        rating: 4.2,
        description: "Parte del Grupo Villar Mir, ofrece estabilidad y experiencia en el mercado energético con tarifas competitivas y energía 100% renovable.",
        pros: ["Respaldo de gran grupo", "Tarifas competitivas", "Experiencia en mercado"],
        cons: ["Interfaz digital básica", "Procesos tradicionales"],
        slug: "energia-vm",
        color: "#1e3a8a"
    },
    {
        id: "chc-energia",
        name: "CHC Energía",
        logo: "/logos/Chcenergia.png",
        rating: 4.0,
        description: "Cercanía y servicio local. CHC Energía destaca por su amplia red de oficinas físicas en entornos rurales y semi-urbanos.",
        pros: ["Gran red física", "Trato humano", "Factura sencilla"],
        cons: ["Poca innovación tecnológica", "Tarifas menos dinámicas"],
        slug: "chc-energia",
        color: "#ed1c24"
    },
    {
        id: "esluz",
        name: "Esluz",
        logo: "/logos/Esluz.png",
        rating: 4.1,
        description: "Comercializadora ágil y dinámica que busca simplificar el ahorro energético para el cliente doméstico con tarifas directas.",
        pros: ["Simplicidad", "Trato ágil", "Tarifas claras"],
        cons: ["Estructura pequeña", "Menos variedad de planes"],
        slug: "esluz",
        color: "#84cc16"
    }
];
