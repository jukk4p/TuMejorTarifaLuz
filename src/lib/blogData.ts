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
        slug: "guia-factura-luz-2026",
        title: "Guía Definitiva 2026: Entiende cada concepto de tu factura de la luz",
        excerpt: "Desglosamos término a término tu recibo: potencia contratada, energía consumida, peajes e impuestos para que dejes de pagar por lo que no entiendes.",
        content: `
      <h2>El laberinto de la factura eléctrica</h2>
      <p>Entender la factura de la luz se ha convertido en un reto para la mayoría de los consumidores en España. Con los cambios normativos de 2026, han aparecido nuevos conceptos que pueden confundirnos.</p>
      
      <h3>1. Término de Potencia</h3>
      <p>Es la parte fija de tu factura. Pagas por la capacidad de conectar varios aparatos a la vez. Actualmente, puedes tener dos potencias distintas: una para las horas punta y otra para las valle.</p>
      
      <h3>2. Término de Energía</h3>
      <p>Este es el coste del consumo real. Se mide en kWh y suele estar dividido en tres tramos horarios: Punta, Llano y Valle.</p>
      
      <h3>3. Impuestos y Peajes</h3>
      <p>No olvides el Impuesto Eléctrico y el IVA, que fluctúan según las decisiones gubernamentales para paliar la crisis energética.</p>
      
      <p>Nuestro análisis algorítmico procesa estos datos automáticamente al subir tu factura, ahorrándote el trabajo técnico.</p>
    `,
        date: "2026-03-01",
        author: "Comité Experto",
        category: "Educación",
        image: "/guides/bill_expert_analysis.png",
        readTime: "5 min"
    },
    {
        id: "2",
        slug: "mercado-libre-vs-regulado",
        title: "Mercado Libre vs Regulado (PVPC): ¿Cuál es más rentable tras la reforma?",
        excerpt: "Analizamos el nuevo sistema de cálculo del PVPC frente a las tarifas fijas del mercado libre. Datos reales para una elección inteligente.",
        content: `
      <h2>PVPC o Mercado Libre: El eterno dilema</h2>
      <p>Con la reciente reforma del Precio Voluntario para el Pequeño Consumidor (PVPC), el precio ahora incluye una cesta de futuros que reduce la volatilidad. Sin embargo, muchas comercializadoras del mercado libre están lanzando ofertas agresivas que podrían ser más estables.</p>
      
      <h3>Mercado Regulado (PVPC)</h3>
      <p>El precio cambia cada hora según el mercado mayorista. Es la única vía para acceder al Bono Social, pero te expone a las subidas puntuales del mercado.</p>
      
      <h3>Mercado Libre</h3>
      <p>Pagas un precio fijo (o variable) acordado con tu compañía. Ofrece estabilidad a largo plazo y la posibilidad de contratar servicios adicionales o descuentos personalizados.</p>
    `,
        date: "2026-02-26",
        author: "Departamento de Análisis",
        category: "Comparativa",
        image: "/guides/market_comparison.png",
        readTime: "6 min"
    },
    {
        id: "3",
        slug: "optimizacion-potencia-ahorro",
        title: "Optimización de Potencia: El ahorro directo que el 90% ignora",
        excerpt: "Te enseñamos a identificar si tienes contratada más potencia de la necesaria y cómo ajustarla para ahorrar hasta 150€ al año sin esfuerzo.",
        content: `
      <h2>Paga solo por lo que necesitas</h2>
      <p>Muchas familias pagan una potencia 'por si acaso' que nunca llegan a utilizar por completo. Si nunca te han saltado los plomos al poner el horno y la lavadora a la vez, es probable que tengas margen para bajar tu potencia contratada.</p>
      
      <h3>¿Cuánto puedes ahorrar?</h3>
      <p>Cada kW de potencia menos puede suponer un ahorro de unos 50€ al año. Explicamos cómo mirar tu 'pico de potencia máximo' en el área de cliente de tu distribuidora para tomar la decisión correcta.</p>
    `,
        date: "2026-02-20",
        author: "Equipo Técnico",
        category: "Ahorro",
        image: "/guides/energy_efficiency.png",
        readTime: "4 min"
    },
    {
        id: "4",
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
    `,
        date: "2026-02-15",
        author: "Equipo Técnico",
        category: "Eficiencia",
        image: "/guides/electricity_clock.png",
        readTime: "4 min"
    },
    {
        id: "5",
        slug: "ventajas-instalar-paneles-solares",
        title: "Ventajas de instalar paneles solares en tu comunidad",
        excerpt: "El autoconsumo compartido es la gran tendencia de 2026. Te contamos cuánto puedes ahorrar realmente.",
        content: `
      <h2>Energía del sol para todos</h2>
      <p>Ya no necesitas vivir en un chalet para disfrutar de la energía solar. El autoconsumo compartido permite a las comunidades de vecinos reducir su factura drásticamente.</p>
      
      <h3>¿Cómo funciona?</h3>
      <p>Se instalan paneles en el tejado común y la energía generada se reparte entre los vecinos según coeficientes acordados.</p>
    `,
        date: "2026-02-10",
        author: "Dpto. Renovables",
        category: "Solar",
        image: "/guides/solar_panels.png",
        readTime: "6 min"
    }
];
