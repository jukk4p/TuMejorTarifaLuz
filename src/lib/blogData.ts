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
    title: "Guía Definitiva 2026: Cómo entender cada concepto de tu factura de la luz",
    excerpt: "Desglosamos término a término tu recibo: potencia contratada, energía consumida, peajes e impuestos para que dejes de pagar por lo que no entiendes.",
    content: `
      <h2>El laberinto del recibo eléctrico en 2026</h2>
      <p>Entender la factura de la luz se ha convertido en un reto de ingeniería para la mayoría de los consumidores en España. Con los cambios normativos aplicados este 2026, han aparecido conceptos técnicos que pueden disparar tu gasto si no los vigilas de cerca.</p>
      
      <h3>1. Término de Potencia (Fijo)</h3>
      <p>Es el precio que pagas por la capacidad de conectar aparatos simultáneamente. Se mide en **kW** y representa el coste fijo de tu recibo, consumas o no. En el sistema actual, puedes optimizar tu gasto contratando dos potencias distintas: una para las **horas punta** y otra para las **horas valle**, algo vital si tienes coche eléctrico.</p>
      
      <h3>2. Término de Energía (Variable)</h3>
      <p>Este es el coste del consumo real. Se mide en **kWh** y su precio fluctúa según el mercado mayorista o el acuerdo con tu comercializadora. La clave aquí es la **discriminación horaria**, dividida en tres tramos: Punta (caro), Llano (medio) y Valle (barato).</p>
      
      <h3>3. Peajes, Cargos e Impuestos</h3>
      <p>Casi el 50% de tu factura son costes regulados. El **Impuesto Eléctrico** y el **IVA** son variables que el Gobierno ajusta para frenar la inflación energética. Conocer su impacto es fundamental para no llevarte sorpresas a final de mes.</p>
      
      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 my-8">
        <p className="font-bold text-primary mb-2">💡 Consejo de Experto:</p>
        <p>No pierdas tiempo haciendo cálculos manuales. Nuestro **comparador inteligente** procesa estos datos automáticamente al subir tu PDF, analizando más de 50 tarifas en segundos.</p>
      </div>
    `,
    date: "01/03/2026",
    author: "Comité Experto",
    category: "Educación",
    image: "/guides/bill_expert_analysis.png",
    imageAlt: "Análisis experto de una factura de luz española con todos sus conceptos detallados",
    readTime: "7 min"
  },
  {
    id: "mercado-libre-vs-regulado",
    slug: "mercado-libre-vs-pvpc-cual-es-mejor-para-ti",
    title: "Mercado Libre vs Regulado (PVPC): ¿Cuál es más rentable en 2026?",
    excerpt: "Analizamos el nuevo sistema de cálculo del PVPC frente a las tarifas fijas del mercado libre tras la reforma energética.",
    content: `
      <h2>PVPC o Mercado Libre: ¿Dónde está el ahorro real?</h2>
      <p>Tras la reciente reforma del **Precio Voluntario para el Pequeño Consumidor (PVPC)**, el cálculo de la tarifa regulada ha cambiado para incluir una cesta de futuros, reduciendo la volatilidad extrema. Sin embargo, el mercado libre sigue compitiendo con **tarifas fijas 24h** que pueden ser la mejor opción para ciertos perfiles.</p>
      
      <h3>El Nuevo Mercado Regulado (PVPC)</h3>
      <p>El precio cambia cada hora según la oferta y demanda del mercado mayorista. Es la única vía para acceder al **Bono Social**, un descuento vital para consumidores vulnerables. Si puedes desplazar tu consumo a la madrugada y fines de semana, el PVPC suele ser muy competitivo.</p>
      
      <h3>La Estabilidad del Mercado Libre</h3>
      <p>Aquí acuerdas un precio con tu compañía. Las **tarifas planas** o de precio fijo te protegen de las subidas bruscas del mercado. En 2026, estamos viendo ofertas agresivas con descuentos en el término de potencia que pueden superar al regulado si tu consumo es lineal durante el día.</p>
      
      <h4>¿Cuál elegir?</h4>
      <p>No hay una respuesta única. Si buscas **estabilidad y tranquilidad**, el mercado libre suele ganar. Si buscas el **precio más bajo a riesgo de volatilidad** o necesitas el Bono Social, el PVPC es tu destino.</p>
    `,
    date: "26/02/2026",
    author: "Dpto. de Análisis",
    category: "Comparativa",
    image: "/guides/market_comparison.png",
    imageAlt: "Gráfico comparativo entre mercado libre y PVPC para el ahorro eléctrico",
    readTime: "8 min"
  },
  {
    id: "optimizacion-potencia-ahorro",
    slug: "como-reducir-potencia-contratada-luz-ahorrar",
    title: "Optimización de Potencia: El ahorro que el 90% de los usuarios ignora",
    excerpt: "Te enseñamos a identificar si tienes contratada más potencia de la necesaria y cómo ajustarla para ahorrar hasta 150€ al año.",
    content: `
      <h2>Paga solo por la potencia que realmente utilizas</h2>
      <p>Casi el 70% de los hogares españoles tienen contratada una potencia superior a la que necesitan "por si acaso". Este miedo a que "salten los plomos" cuesta de media **50€ anuales por cada kW de exceso**. En TuMejorTarifaLuz consideramos que la potencia es el ahorro más directo y garantizado que existe.</p>
      
      <h3>¿Cómo saber si te sobra potencia?</h3>
      <p>Si nunca han saltado las protecciones de tu cuadro eléctrico al encender simultáneamente el horno, la lavadora y el aire acondicionado, tienes margen de mejora. Gracias a los nuevos contadores inteligentes, puedes consultar tu **pico máximo de potencia** en el área de cliente de tu distribuidora.</p>
      
      <h3>Doble potencia: Una oportunidad de ahorro</h3>
      <p>Recuerda que puedes contratar potencias distintas en los tramos **Punta y Valle**. Si cargas un coche eléctrico de noche, podrías subir la potencia en el tramo valle (más barato) y mantener una potencia mínima en el tramo punta para ahorrar en el término fijo.</p>
    `,
    date: "20/02/2026",
    author: "Equipo Técnico",
    category: "Ahorro",
    image: "/guides/energy_efficiency.png",
    imageAlt: "Esquema de optimización de potencia eléctrica para reducir gastos fijos",
    readTime: "6 min"
  },
  {
    id: "discriminacion-horaria-estrategias",
    slug: "discriminacion-horaria-horas-valle-llano-punta-como-ahorrar",
    title: "Discriminación Horaria: Estrategias para reducir un 40% tu gasto",
    excerpt: "Domina los tramos Punta, Llano y Valle. Estrategias prácticas para desplazar consumos críticos a las horas más económicas en 2026.",
    content: `
      <h2>Domina el reloj para dominar tu factura</h2>
      <p>La discriminación horaria no significa cambiar tu estilo de vida, sino aplicar **inteligencia energética**. Pequeños ajustes en el horario de tus electrodomésticos pueden suponer una diferencia abismal a final de año, especialmente en tarifas reguladas o variables.</p>
      
      <h3>Los tres tramos que debes conocer</h3>
      <ul>
        <li>**Hora Valle (00h-08h y fines de semana)**: La energía es más barata. Ideal para lavadoras, lavavajillas y termos eléctricos.</li>
        <li>**Hora Llano (Tramos intermedios)**: Un precio equilibrado. Uso normal del hogar.</li>
        <li>**Hora Punta (Mañanas y noches)**: El precio más alto. Evita el consumo intensivo en estas horas si quieres ahorrar de verdad.</li>
      </ul>
      
      <p>Consulta nuestro gráfico de precios en tiempo real para planificar tu jornada y maximizar el ahorro diario.</p>
    `,
    date: "15/02/2026",
    author: "Estratega Energético",
    category: "Estrategia",
    image: "/guides/electricity_clock.png",
    imageAlt: "Infografía de tramos horarios punta llano y valle para ahorro de luz",
    readTime: "5 min"
  },
  {
    id: "autoconsumo-solar-pisos",
    slug: "autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad",
    title: "Autoconsumo Solar en Pisos: ¿Es rentable en 2026?",
    excerpt: "Todo sobre el autoconsumo compartido, subvenciones y plazos de amortización para comunidades de vecinos en España.",
    content: `
      <h2>Energía limpia sin necesidad de tejado propio</h2>
      <p>El **autoconsumo colectivo** ha revolucionado el panorama energético en España. Ya no necesitas un chalet para disfrutar de la energía solar; ahora puedes compartir una instalación en tu comunidad de vecinos y reducir tu dependencia de la red eléctrica.</p>
      
      <h3>¿Cómo funciona el reparto de energía?</h3>
      <p>La energía generada por las placas se reparte entre los vecinos según coeficientes acordados. Esto permite que incluso vecinos que no han invertido inicialmente puedan sumarse más tarde, democratizando el acceso a las renovables.</p>
      
      <h4>Rentabilidad y Subvenciones</h4>
      <p>Con las ayudas de los fondos europeos y las deducciones en el IRPF, el plazo de amortización de estas instalaciones se ha reducido a los **4-6 años**. Teniendo en cuenta que los paneles duran más de 25 años, el beneficio a largo plazo es incuestionable.</p>
    `,
    date: "10/02/2026",
    author: "Consultoría Solar",
    category: "Solar",
    image: "/guides/solar_panels.png",
    imageAlt: "Paneles solares instalados en edificio residencial para autoconsumo compartido",
    readTime: "9 min"
  },
  {
    id: "guia-carga-coche-electrico",
    slug: "mejor-tarifa-luz-coche-electrico-recarga-nocturna",
    title: "Cargar el Coche Eléctrico en Casa: Guía definitiva para ahorrar",
    excerpt: "Analizamos las mejores tarifas para VE y cómo aprovechar la potencia en horas valle para cargar por menos de 2€.",
    content: `
      <h2>Convierte tu garaje en tu propia estación de servicio low-cost</h2>
      <p>Tener un vehículo eléctrico solo es verdaderamente rentable si optimizas la carga en casa. Cargar la batería de tu coche durante las **horas valle (00:00 a 08:00)** puede costar hasta diez veces menos que hacerlo en un cargador público de vía rápida.</p>
      
      <h3>La potencia necesaria: No te pases de frenada</h3>
      <p>Muchos usuarios instalan cargadores de alta potencia (7.4kW) que obligan a subir mucho el término fijo de la factura. En la mayoría de casos, una carga lenta a **3.7kW** durante 8 horas es suficiente para cubrir los desplazamientos diarios, ahorrándote mucho dinero en potencia fija contratada.</p>
      
      <p>Utiliza nuestra herramienta para encontrar la **tarifa especial VE** que mejor se adapte a tus kilómetros anuales.</p>
    `,
    date: "05/03/2026",
    author: "Movilidad Sostenible",
    category: "Movilidad",
    image: "/guides/ev_charging.png",
    imageAlt: "Carga de vehículo eléctrico optimizada para tarifas valle nocturnas",
    readTime: "7 min"
  },
  {
    id: "preguntas-frecuentes-tarifa-de-luz",
    slug: "preguntas-frecuentes-tarifa-de-luz",
    title: "FAQs: Dudas resueltas sobre tu factura y ahorro de luz",
    excerpt: "¿Tienes dudas sobre el PVPC o el CUPS? Respondemos a todas las preguntas frecuentes para que domines tu recibo en 2026.",
    content: `
      <h2>Resolvemos las dudas que tu compañía no te aclara</h2>
      <p>El sector eléctrico utiliza un lenguaje deliberadamente opaco. En TuMejorTarifaLuz apostamos por la **transparencia radical**. Aquí tienes las respuestas a lo que siempre te has preguntado.</p>
      
      <h3>¿Qué es el PVPC y por qué es tan polémico?</h3>
      <p>Es la tarifa regulada. Su precio cambia cada hora. Es transparente pero volátil. Solo con ella puedes pedir el **Bono Social**. Si no lo tienes, a veces el mercado libre es más barato.</p>
      
      <h3>¿Puedo cambiar de compañía si tengo permanencia?</h3>
      <p>La mayoría de tarifas domésticas no tienen permanencia. Si la tienes, la ley establece límites muy claros a la penalización. **Nunca dejes de ahorrar por miedo a una multa inexistente**.</p>
      
      <h3>¿Qué es el código CUPS?</h3>
      <p>Es el identificador único de tu contador. Piensa en él como el "número de bastidor" de tu suministro. Lo necesitarás para cualquier cambio de tarifa o baja.</p>
      
      <p>¿No encuentras tu duda? Usa nuestro comparador y nuestro algoritmo analizará tu caso específico sin compromiso.</p>
    `,
    date: "08/03/2026",
    author: "TuMejorTarifaLuz Team",
    category: "Educación",
    image: "/guides/faq_energy.png",
    imageAlt: "Usuario resolviendo dudas técnicas sobre su contrato de luz",
    readTime: "10 min"
  },
  {
    id: "horas-baratas-luz-horarios-valle-llano-punta",
    slug: "horas-baratas-luz-horarios-valle-llano-punta",
    title: "Horas más baratas de la luz: Horarios Valle, Llano y Punta en 2026",
    excerpt: "Consulta los horarios actualizados para ahorrar hoy mismo. Descubre cuándo es más barato usar tus electrodomésticos.",
    content: `
      <h2>Planifica tu jornada y ahorra sin esfuerzo</h2>
      <p>Saber cuándo poner la lavadora ya no es una manía, es una estrategia financiera. En 2026, los tramos horarios siguen siendo la herramienta de ahorro más potente al alcance de cualquier hogar.</p>
      
      <h3>Tabla Maestra de Horarios</h3>
      <ul>
        <li>**Valle (Súper barata)**: Lunes a viernes (00h a 08h) y las 24h de sábados, domingos y festivos.</li>
        <li>**Llano (Barrera intermedia)**: Mañanas (08h-10h), tardes (14h-18h) y noches (22h-00h).</li>
        <li>**Punta (Peligro, costo alto)**: Las franjas de máxima actividad (10h-14h y 18h-22h).</li>
      </ul>
      
      <p>Recuerda que estas horas se aplican a nivel nacional. Si organizas tu consumo intensivo el fin de semana, notarás una bajada de hasta el **25% en tu factura mensual**.</p>
    `,
    date: "08/03/2026",
    author: "Análisis de Datos",
    category: "Ahorro",
    image: "/guides/electricity_clock.png",
    imageAlt: "Guía visual de las horas más baratas para el consumo eléctrico en 2026",
    readTime: "8 min"
  }
];
