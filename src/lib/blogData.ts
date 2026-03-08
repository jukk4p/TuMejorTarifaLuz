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
  imageAlt: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "guia-factura-luz-2026",
    slug: "como-leer-entender-factura-luz-2026",
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
    imageAlt: "Análisis experto de una factura de luz española con todos sus conceptos",
    readTime: "5 min"
  },
  {
    id: "mercado-libre-vs-regulado",
    slug: "mercado-libre-vs-pvpc-cual-es-mejor-para-ti",
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
    imageAlt: "Comparativa mercado libre vs PVPC tarifa regulada electricidad España",
    readTime: "6 min"
  },
  {
    id: "optimizacion-potencia-ahorro",
    slug: "como-reducir-potencia-contratada-luz-ahorrar",
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
    imageAlt: "Optimización de potencia eléctrica para ahorrar en el recibo de la luz",
    readTime: "4 min"
  },
  {
    id: "discriminacion-horaria-estrategias",
    slug: "discriminacion-horaria-horas-valle-llano-punta-como-ahorrar",
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
    imageAlt: "Reloj con las horas baratas de la luz: valle llano y punta",
    readTime: "4 min"
  },
  {
    id: "autoconsumo-solar-pisos",
    slug: "autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad",
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
    imageAlt: "Instalación de paneles solares en una comunidad de vecinos para autoconsumo",
    readTime: "6 min"
  },
  {
    id: "guia-carga-coche-electrico",
    slug: "mejor-tarifa-luz-coche-electrico-recarga-nocturna",
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
    imageAlt: "Carga nocturna de vehículo eléctrico en garaje con tarifa valle",
    readTime: "5 min"
  },
  {
    id: "preguntas-frecuentes-tarifa-de-luz",
    slug: "preguntas-frecuentes-tarifa-de-luz",
    title: "Preguntas Frecuentes sobre tu Tarifa de Luz: Guía Completa de Ahorro",
    excerpt: "¿Tienes dudas sobre el PVPC, la discriminación horaria o el CUPS? Respondemos a todas las preguntas frecuentes para que entiendas tu recibo.",
    content: `
      <h2>Todo lo que necesitas saber sobre tu tarifa de luz</h2>
      <p>Entender el mercado eléctrico español puede parecer una misión imposible. En esta guía, resolvemos las dudas más comunes de forma clara y directa.</p>
      
      <h3>¿Qué es el PVPC y cuándo me interesa?</h3>
      <p>El PVPC es el Precio Voluntario para el Pequeño Consumidor. Es la tarifa regulada por el Gobierno. Interesa si consumes principalmente en horas valle o si tienes derecho al Bono Social.</p>
      
      <h3>¿Qué es la discriminación horaria?</h3>
      <p>Es un sistema donde el precio de la energía varía según la hora del día. Se divide en tres tramos: Punta (caro), Llano (medio) y Valle (barato).</p>
      
      <h3>¿Qué son las horas valle, llano y punta?</h3>
      <p>Valle: de 00:00 a 08:00 y todo el fin de semana. Llano: tramos intermedios mañana y tarde. Punta: horas de mayor demanda y precio más alto.</p>
      
      <h3>¿Cuánto puedo ahorrar cambiando de tarifa?</h3>
      <p>El ahorro medio de nuestros usuarios al optimizar su contrato es de 312€ al año. Algunos hogares han llegado a reducir su factura a la mitad.</p>
      
      <h3>¿Cómo se calcula la factura de la luz?</h3>
      <p>Se compone del término de potencia (fijo), término de energía (variable), impuesto eléctrico, alquiler de contador e IVA.</p>
      
      <h3>¿Qué es el CUPS en la factura?</h3>
      <p>Es el Código Universal de Punto de Suministro. Es como el DNI de tu instalación eléctrica. Lo necesitas para cualquier trámite o cambio de compañía.</p>
    `,
    date: "08/03/2026",
    author: "TuMejorTarifaLuz Team",
    category: "Educación",
    image: "/guides/faq_energy.png",
    imageAlt: "Persona analizando dudas sobre su contrato eléctrico en una tablet",
    readTime: "12 min"
  },
  {
    id: "horas-baratas-luz-horarios-valle-llano-punta",
    slug: "horas-baratas-luz-horarios-valle-llano-punta",
    title: "Horas más baratas de la luz: Horarios Valle, Llano y Punta en 2026",
    excerpt: "Consulta los horarios actualizados para ahorrar. Descubre cuándo es más barato poner la lavadora o cargar tu coche.",
    content: `
      <h2>Horarios de la luz en 2026: Cuándo ahorrar</h2>
      <p>Organizar tus tareas domésticas según los tramos horarios es la forma más rápida de bajar el importe de tu factura sin inversión alguna.</p>
      
      <h3>Tabla de Horarios Valle, Llano y Punta</h3>
      <ul>
        <li><strong>Hora Valle (Económica):</strong> Lunes a Viernes de 00:00 a 08:00. Fines de semana y festivos nacionales las 24 horas.</li>
        <li><strong>Hora Llano (Precio Medio):</strong> Lunes a Viernes de 08:00 a 10:00, de 14:00 a 18:00 y de 22:00 a 00:00.</li>
        <li><strong>Hora Punta (Cara):</strong> Lunes a Viernes de 10:00 a 14:00 y de 18:00 a 22:00.</li>
      </ul>
      
      <h3>Consejos para aprovechar las horas valle</h3>
      <p>Programa tu lavadora y lavavajillas para que funcionen de madrugada o durante el fin de semana. Si tienes coche eléctrico, configúralo para que cargue solo a partir de las 00:00.</p>
    `,
    date: "08/03/2026",
    author: "Equipo Técnico",
    category: "Ahorro",
    image: "/guides/electricity_clock.png",
    imageAlt: "Infografía de horarios de luz valle llano y punta para 2026",
    readTime: "8 min"
  }
];
