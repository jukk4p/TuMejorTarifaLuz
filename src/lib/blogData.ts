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
    id: "guia-factura-luz-2026",
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
    date: "01/03/2026",
    author: "Comité Experto",
    category: "Educación",
    image: "/guides/bill_expert_analysis.png",
    readTime: "5 min"
  },
  {
    id: "mercado-libre-vs-regulado",
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
    date: "26/02/2026",
    author: "Departamento de Análisis",
    category: "Comparativa",
    image: "/guides/market_comparison.png",
    readTime: "6 min"
  },
  {
    id: "optimizacion-potencia-ahorro",
    slug: "optimizacion-potencia-ahorro",
    title: "Optimización de Potencia: El ahorro directo que el 90% ignora",
    excerpt: "Te enseñamos a identificar si tienes contratada más potencia de la necesaria y cómo ajustarla para ahorrar hasta 150€ al año sin esfuerzo.",
    content: `
      <h2>Paga solo por lo que necesitas</h2>
      <p>Muchas familias pagan una potencia 'por si acaso' que nunca llegan a utilizar por completo. Si nunca te han saltado los plomos al poner el horno y la lavadora a la vez, es probable que tengas margen para bajar tu potencia contratada.</p>
      
      <h3>¿Cuánto puedes ahorrar?</h3>
      <p>Cada kW de potencia menos puede suponer un ahorro de unos 50€ al año. Explicamos cómo mirar tu 'pico de potencia máximo' en el área de cliente de tu distribuidora para tomar la decisión correcta.</p>
    `,
    date: "20/02/2026",
    author: "Equipo Técnico",
    category: "Ahorro",
    image: "/guides/energy_efficiency.png",
    readTime: "4 min"
  },
  {
    id: "discriminacion-horaria-estrategias",
    slug: "discriminacion-horaria-estrategias",
    title: "Discriminación Horaria: Cómo reducir un 40% tu gasto",
    excerpt: "Domina los tramos Punta, Llano y Valle. Estrategias prácticas para desplazar consumos críticos a las horas más económicas.",
    content: `
      <h2>Ahorrar sin cambiar de vida</h2>
      <p>La discriminación horaria no significa dejar de vivir, sino vivir con inteligencia financiera. Desplazar el uso de electrodomésticos de alto consumo a las horas valle puede reducir drásticamente tu factura.</p>
      
      <h3>Tramos Horarios en 2026</h3>
      <p>Es vital conocer los horarios exactos de tu tarifa. Por lo general, las horas de madrugada y fines de semana son las más económicas (Valle). Las horas centrales del día suelen ser Punta.</p>
    `,
    date: "15/02/2026",
    author: "Equipo Técnico",
    category: "Estrategia",
    image: "/guides/electricity_clock.png",
    readTime: "4 min"
  },
  {
    id: "autoconsumo-solar-pisos",
    slug: "autoconsumo-solar-pisos",
    title: "Autoconsumo Solar en Pisos: ¿Es posible y rentable?",
    excerpt: "Todo sobre el autoconsumo compartido, subvenciones y plazos de amortización para comunidades de vecinos en 2026.",
    content: `
      <h2>Energía del sol en la comunidad</h2>
      <p>Ya no necesitas vivir en un chalet para disfrutar de la energía solar. El autoconsumo compartido permite a las comunidades de vecinos reducir su factura drásticamente.</p>
      
      <h3>Legislación Actual</h3>
      <p>Las leyes vigentes facilitan la instalación de paneles en tejados comunes. Solo necesitas el acuerdo de una mayoría simple de la comunidad para empezar a ahorrar.</p>
    `,
    date: "10/02/2026",
    author: "Dpto. Renovables",
    category: "Solar",
    image: "/guides/solar_panels.png",
    readTime: "6 min"
  },
  {
    id: "guia-carga-coche-electrico",
    slug: "guia-carga-coche-electrico",
    title: "Carga de Vehículo Eléctrico: Ahorra en cada kilómetro",
    excerpt: "Analizamos las mejores tarifas para VE y cómo aprovechar la potencia en horas valle para cargar por menos de 2€.",
    content: `
      <h2>La batería de tu coche, tu mayor aliado</h2>
      <p>Cargar un coche eléctrico puede ser extremadamente barato si sabes cuándo hacerlo. Muchas tarifas ofrecen precios ultra-reducidos de 1am a 7am.</p>
      
      <h3>Potencia vs Tiempo</h3>
      <p>No siempre necesitas la máxima potencia de carga. Ajustar el cargador a una potencia menor compensa con la duración de la carga durante la noche, protegiendo tu instalación.</p>
    `,
    date: "05/03/2026",
    author: "Movilidad Sostenible",
    category: "Movilidad",
    image: "/guides/ev_charging.png",
    readTime: "5 min"
  }
];
