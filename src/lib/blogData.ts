export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: string;
    image: string;
    readTime: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "entender-factura-luz-2026",
        title: "Cómo entender tu factura de la luz en 2026: Guía completa",
        excerpt: "Desglosamos todos los términos de tu recibo para que sepas exactamente qué estás pagando cada mes.",
        content: `
      <h2>El laberinto de la factura eléctrica</h2>
      <p>Entender la factura de la luz se ha convertido en un reto para la mayoría de los consumidores en España. Con los cambios normativos de 2026, han aparecido nuevos conceptos que pueden confundirnos.</p>
      
      <h3>1. Término de Potencia</h3>
      <p>Es la parte fija de tu factura. Pagas por la capacidad de conectar varios aparatos a la vez. Actualmente, puedes tener dos potencias distintas: una para las horas punta y otra para las valle.</p>
      
      <h3>2. Término de Energía</h3>
      <p>Este es el coste del consumo real. Se mide en kWh y suele estar dividido en tres tramos horarios: Punta, Llano y Valle.</p>
      
      <h3>3. Impuestos y Peajes</h3>
      <p>No olvides el Impuesto Eléctrico y el IVA, que fluctúan según las decisiones gubernamentales para paliar la crisis energética.</p>
      
      <p>Nuestro comparador inteligente analiza estos datos automáticamente subiendo tu PDF, ahorrándote el trabajo sucio.</p>
    `,
        date: "2026-03-01",
        author: "Comité Experto",
        category: "Ahorro",
        image: "/guides/bill_expert_analysis.png",
        readTime: "5 min"
    },
    {
        id: "2",
        slug: "trucos-ahorrar-energia-verano",
        title: "5 Trucos infalibles para ahorrar energía este verano",
        excerpt: "No dejes que el aire acondicionado arruine tu economía. Aprende a mantener tu casa fresca de forma eficiente.",
        content: `
      <h2>Prepárate para el calor sin pagar de más</h2>
      <p>El aire acondicionado puede suponer hasta el 40% del gasto eléctrico en verano. Aquí tienes consejos prácticos para optimizarlo.</p>
      
      <h3>1. La regla de los 24 grados</h3>
      <p>Cada grado que bajes por debajo de los 24 aumenta el consumo un 8%. Mantener una temperatura constante es la clave.</p>
      
      <h3>2. Aprovecha las corrientes naturales</h3>
      <p>Ventila solo en las horas más frescas (madrugada) y mantén las persianas bajadas durante el día en las zonas donde da el sol directamente.</p>
      
      <h3>3. Mantenimiento de filtros</h3>
      <p>Un equipo con filtros sucios trabaja un 15% más para enfriar lo mismo. Límpialos antes de empezar la temporada.</p>
    `,
        date: "2026-02-15",
        author: "Equipo Técnico",
        category: "Consejos",
        image: "/guides/energy_efficiency.png",
        readTime: "4 min"
    },
    {
        id: "3",
        slug: "ventajas-instalar-paneles-solares",
        title: "Ventajas de instalar paneles solares en tu comunidad",
        excerpt: "El autoconsumo compartido es la gran tendencia de 2026. Te contamos cuánto puedes ahorrar realmente.",
        content: `
      <h2>Energía del sol para todos</h2>
      <p>Ya no necesitas vivir en un chalet para disfrutar de la energía solar. El autoconsumo compartido permite a las comunidades de vecinos reducir su factura drásticamente.</p>
      
      <h3>¿Cómo funciona?</h3>
      <p>Se instalan paneles en el tejado común y la energía generada se reparte entre los vecinos según coeficientes acordados.</p>
      
      <h3>Beneficios económicos</h3>
      <p>La amortización de estas instalaciones ha bajado a menos de 5 años gracias a las ayudas del Plan MOVES y las bonificaciones del IBI.</p>
    `,
        date: "2026-02-10",
        author: "Dpto. Renovables",
        category: "Solar",
        image: "/guides/solar_panels.png",
        readTime: "6 min"
    }
];
