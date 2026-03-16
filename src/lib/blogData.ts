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
    title: "Guía Maestra 2026: Cómo descifrar cada concepto de tu factura eléctrica",
    excerpt: "No permitas que la jerga técnica te confunda. Desglosamos paso a paso cada término de tu recibo para que detectes errores y optimices tu gasto mensual.",
    content: `
      <h2>El laberinto del recibo eléctrico: Claves para el consumidor en 2026</h2>
      <p>Entender la factura de la luz es el primer paso crítico para el ahorro real. Tras la última reforma energética, el recibo ha ganado en complejidad técnica, pero también en oportunidades para quienes saben dónde mirar.</p>
      
      <div class="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 my-12">
        <h4 class="text-primary font-900 uppercase tracking-widest text-xs flex items-center gap-3 mb-6">
          <span class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-lg">📊</span>
          Desglose Táctico de Costes
        </h4>
        <ul class="space-y-6">
          <li class="flex gap-5">
            <span class="font-900 text-primary text-xl opacity-40">01.</span>
            <div>
              <p class="font-bold text-slate-900 dark:text-white mb-1">Término de Potencia (Peaje de Acceso)</p>
              <p class="text-sm opacity-80 leading-relaxed">Es tu "coste fijo". Se paga por la capacidad de conectar dispositivos. Si nunca saltan los plomos, probablemente estés pagando de más por potencia que no usas.</p>
            </div>
          </li>
          <li class="flex gap-5">
            <span class="font-900 text-primary text-xl opacity-40">02.</span>
            <div>
              <p class="font-bold text-slate-900 dark:text-white mb-1">Término de Energía (Consumo Real)</p>
              <p class="text-sm opacity-80 leading-relaxed">El precio por cada kWh consumido. Aquí es donde la optimización de horarios y la elección de una tarifa adecuada (Fija vs Indexada) marcan la diferencia.</p>
            </div>
          </li>
          <li class="flex gap-5">
            <span class="font-900 text-primary text-xl opacity-40">03.</span>
            <div>
              <p class="font-bold text-slate-900 dark:text-white mb-1">Impuestos y Cargos Regulados</p>
              <p class="text-sm opacity-80 leading-relaxed">Incluye el Impuesto Eléctrico, el IVA (revisado en 2026) y el alquiler del contador. Representan casi la mitad del total de tu factura.</p>
            </div>
          </li>
        </ul>
      </div>

      <h3>Estrategia de Optimización por Tramos</h3>
      <p>En el mercado actual, la flexibilidad es poder. Utilizar potencias diferenciadas para los tramos punta y valle permite, por ejemplo, mantener un coste fijo bajo durante el día y una potencia alta para cargar un vehículo eléctrico de noche sin penalizaciones.</p>
      
      <div class="grid sm:grid-cols-2 gap-6 my-10">
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <p class="font-900 text-xs uppercase tracking-widest mb-3 opacity-50">Tramo Punta ☀️</p>
          <p class="text-sm leading-relaxed">Mantén una potencia ajustada al mínimo necesario para las tareas domésticas esenciales. Es el tramo más caro para el término fijo.</p>
        </div>
        <div class="p-6 bg-primary/10 rounded-3xl border border-primary/20">
          <p class="font-900 text-xs uppercase tracking-widest text-primary mb-3">Tramo Valle 🌙</p>
          <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">Aprovecha para configurar potencias superiores si tienes equipos de alta demanda nocturna, como acumuladores o aerotermia.</p>
        </div>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-200 dark:border-amber-900/30 my-10">
        <p class="font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-3">
          <span class="text-xl">💡</span>
          Veredicto del Analista
        </p>
        <p class="text-sm leading-relaxed">Analizar estos datos a mano es ineficiente. Nuestro algoritmo procesa miles de combinaciones tarifarias analizando directamente tu factura en PDF para ofrecerte el ahorro exacto sin margen de error.</p>
      </div>
    `,
    date: "2026-03-01",
    author: "Comité Experto",
    category: "Educación",
    image: "/guides/bill_expert_analysis.webp",
    imageAlt: "Análisis técnico detallado de una factura de luz moderna",
    readTime: "7 min"
  },
  {
    id: "mercado-libre-vs-regulado",
    slug: "mercado-libre-pvpc",
    title: "Mercado Libre vs Regulado (PVPC): El Análisis Definitivo tras la Reforma",
    excerpt: "Tras los últimos cambios legislativos de 2026, la comparativa entre tarifas indexadas y fijas ha dado un giro. ¿Cuál protege mejor tu bolsillo?",
    content: `
      <h2>¿Seguridad o volatilidad? El dilema energético en 2026</h2>
      <p>La elección entre el mercado regulado (PVPC) y el mercado libre ya no es una cuestión de blanco o negro. En el escenario actual, la volatilidad geopolítica hace que las estrategias de ahorro deban ser más dinámicas que nunca.</p>
      
      <div class="overflow-x-auto my-12">
        <table class="w-full text-left border-collapse rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-6 font-bold uppercase tracking-widest text-xs">Atributo</th>
              <th class="p-6 font-bold uppercase tracking-widest text-xs">PVPC (Regulado)</th>
              <th class="p-6 font-bold uppercase tracking-widest text-xs">Mercado Libre</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="p-6 font-bold text-slate-900 dark:text-white">Precio Energía</td>
              <td class="p-6 text-sm">Cambia cada hora (Pool)</td>
              <td class="p-6 text-sm">Precio pactado (Fijo/Híbrido)</td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="p-6 font-bold text-slate-900 dark:text-white">Bono Social</td>
              <td class="p-6 text-sm font-bold text-emerald-600">✅ Compatible</td>
              <td class="p-6 text-sm text-rose-600">❌ No compatible</td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="p-6 font-bold text-slate-900 dark:text-white">Estabilidad</td>
              <td class="p-6 text-sm italic">Baja (Riesgo mercado)</td>
              <td class="p-6 text-sm font-medium">Alta (Previsibilidad total)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Escenarios Recomendados según Perfil</h3>
      <p>Si tu prioridad es la **estabilidad presupuestaria**, el mercado libre con tarifas fijas competitivas es tu mejor aliado este año. Evitas sorpresas ante picos de demanda invernales o crisis internacionales.</p>
      
      <p>Por otro lado, el **PVPC** sigue siendo la opción ganadora para usuarios que pueden automatizar el 80% de su consumo en horas de madrugada o fines de semana, y es imperativo para quienes cumplen los requisitos del Bono Social.</p>

      <div class="border-l-4 border-primary pl-8 py-4 my-12 italic text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
        "No existe la mejor tarifa universal, existe la mejor tarifa para TU perfil de consumo. Ignorar esto es perder hasta un 30% de ahorro potencial."
      </div>
    `,
    date: "2026-02-26",
    author: "Dpto. de Análisis",
    category: "Comparativa",
    image: "/guides/market_comparison.webp",
    imageAlt: "Comparativa técnica profesional de mercados eléctricos",
    readTime: "8 min"
  },
  {
    id: "reclamar-factura-luz-excesiva",
    slug: "guia-paso-a-paso-reclamar-factura-luz-excesiva-errores",
    title: "Cómo reclamar una factura de luz excesiva: Guía de Derechos 2026",
    excerpt: "¿Crees que tu contador está mal o te han cobrado de más? Te explicamos el proceso legal exacto para reclamar a tu compañía y recuperar tu dinero.",
    content: `
      <h2>Tus derechos como consumidor frente a las eléctricas</h2>
      <p>Las lecturas estimadas incorrectas y los errores en el peaje de acceso son las principales causas de facturaciones hinchadas. En 2026, la normativa protege al usuario, pero es fundamental seguir los pasos legales correctos para que tu reclamación sea efectiva.</p>
      
      <div class="space-y-6 my-12">
        <div class="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
          <h4 class="font-900 text-slate-900 dark:text-white mb-4 text-lg">1. Reclamación Directa (Atención al Cliente)</h4>
          <p class="text-sm leading-relaxed opacity-80">El primer paso es siempre contactar con tu comercializadora. Debes solicitar un **número de incidencia**. Sin este código, no podrás escalar tu caso a organismos superiores.</p>
        </div>
        
        <div class="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
          <h4 class="font-900 text-slate-900 dark:text-white mb-4 text-lg">2. Junta Arbitral de Consumo u OMIC</h4>
          <p class="text-sm leading-relaxed opacity-80">Si en 30 días no tienes respuesta o esta es insatisfactoria, acude a la **OMIC** de tu ayuntamiento. El arbitraje de consumo es un proceso gratuito y vinculante para las empresas adheridas.</p>
        </div>

        <div class="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
          <h4 class="font-900 text-slate-900 dark:text-white mb-4 text-lg">3. Ministerio para la Transición Ecológica</h4>
          <p class="text-sm leading-relaxed opacity-80">Para casos técnicos complejos relacionados con el contador o la red, puedes elevar tu queja a la **Dirección General de Energía** de tu comunidad autónoma.</p>
        </div>
      </div>

      <div class="bg-rose-50 dark:bg-rose-900/10 p-8 rounded-3xl border border-rose-200 dark:border-rose-900/30 my-10">
        <h4 class="text-rose-800 dark:text-rose-400 font-bold mb-3 flex items-center gap-3">
          <span class="text-xl">⚠️</span>
          Importante: No devuelvas el recibo sin avisar
        </h4>
        <p class="text-sm leading-relaxed text-rose-900/80 dark:text-rose-400/80">Devolver un recibo bancario sin haber iniciado un proceso de reclamación oficial puede conllevar intereses de demora o incluso el corte de suministro. Reclama primero, paga bajo protesta si es necesario, pero mantén siempre cubiertas las bases legales.</p>
      </div>

      <h3>Consejo experto: Documenta todo</h3>
      <p>Haz fotos a tu contador el mismo día que recibes la factura. Esta prueba visual es irrefutable en un proceso de arbitraje si la lectura de la factura no coincide con la realidad.</p>
    `,
    date: "2026-03-12",
    author: "Asesoría Jurídica",
    category: "Educación",
    image: "/guides/legal_claim.webp",
    imageAlt: "Documentación legal y factura de luz para proceso de reclamación",
    readTime: "9 min"
  },
  {
    id: "etiquetado-energetico-electrodomesticos",
    slug: "nuevo-etiquetado-energetico-electrodomesticos-ahorro-luz",
    title: "Etiquetado Energético: Cómo elegir electrodomésticos que se pagan solos",
    excerpt: "La diferencia entre una lavadora Clase A y una Clase F puede suponer 800€ de ahorro a lo largo de su vida útil. Aprende a leer la nueva etiqueta.",
    content: `
      <h2>Más allá de las letras: La rentabilidad de la eficiencia</h2>
      <p>A menudo compramos el electrodoméstico más barato fijándonos solo en el precio del ticket. Sin embargo, un aparato eficiente es una inversión financiera con un retorno garantizado a través de tu factura de luz.</p>
      
      <div class="grid sm:grid-cols-2 gap-8 my-12">
        <div class="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30">
          <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-emerald-500/20">A</div>
          <h4 class="font-bold text-emerald-900 dark:text-emerald-400 mb-2">Clase A (Máxima Eficiencia)</h4>
          <p class="text-xs leading-relaxed opacity-80">Tecnología punta, menor consumo de agua y energía. Amortización rápida en hogares con uso intensivo.</p>
        </div>
        <div class="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <div class="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-rose-500/20">G</div>
          <h4 class="font-bold text-slate-900 dark:text-white mb-2">Clase G (Mínima Eficiencia)</h4>
          <p class="text-xs leading-relaxed opacity-80">Precio inicial bajo, pero coste operativo disparado. Acaba costando el doble al cabo de 5 años.</p>
        </div>
      </div>

      <h3>¿Qué ha cambiado en las etiquetas?</h3>
      <p>Desde la última actualización, se han eliminado las confusas categorías A+, A++ y A+++. Ahora la escala es de la **A a la G**, siendo más rigurosa y dejando espacio para futuras innovaciones tecnológicas que superen los estándares actuales.</p>
      
      <div class="bg-primary/5 p-8 rounded-3xl border border-primary/10 my-10">
        <h4 class="text-primary font-bold mb-4">La regla del 10/10</h4>
        <p class="text-sm leading-relaxed mb-6">
          Un electrodoméstico eficiente Clase A suele costar un 20% más, pero reduce el consumo operativo en un 40%. En una familia media, esto supone recuperar la inversión en menos de **2 años**.
        </p>
        <div class="flex gap-4">
          <div class="px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100 dark:border-slate-700">Inversión Inteligente</div>
          <div class="px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100 dark:border-slate-700">Ahorro Largo Plazo</div>
        </div>
      </div>

      <h3>Dato curioso: El Código QR</h3>
      <p>Todas las nuevas etiquetas incluyen un **Código QR**. Al escanearlo, accedes directamente a la base de datos europea (EPREL) con detalles técnicos exhaustivos que no caben en el cartón, como el ruido exacto o el consumo por cada 100 ciclos.</p>
    `,
    date: "2026-03-10",
    author: "Consultoría de Consumo",
    category: "Ahorro",
    image: "/guides/energy_label.webp",
    imageAlt: "Nueva etiqueta de eficiencia energética A-G para electrodomésticos",
    readTime: "6 min"
  },
  {
    id: "optimizacion-potencia-ahorro",
    slug: "como-reducir-potencia-contratada-luz-ahorrar",
    title: "Optimización de Potencia: El ahorro oculto que el 90% ignora",
    excerpt: "No pagues por una capacidad que no utilizas. Te enseñamos a ajustar tu potencia contratada para ahorrar hasta 150€ anuales sin riesgos.",
    content: `
      <h2>Paga solo por lo que necesitas conectar</h2>
      <p>En España, el exceso de potencia contratada es el "impuesto silencioso" más común. La mayoría de hogares mantienen una potencia sobredimensionada por miedo a cortes inoportunos, ignorando que los contadores inteligentes actuales permiten una gestión mucho más fina.</p>
      
      <div class="bg-slate-900 text-white p-10 rounded-[2.5rem] my-12 relative overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div class="relative z-10">
          <h4 class="text-primary font-900 uppercase tracking-widest text-xs mb-6">Metodología de Ajuste</h4>
          <div class="grid sm:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">🔍</div>
              <p class="font-bold">Análisis de Picos</p>
              <p class="text-xs text-slate-400 leading-relaxed">Accede al área de cliente de tu distribuidora y descarga el histórico de <strong>picos máximos</strong> de los últimos 12 meses.</p>
            </div>
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">📉</div>
              <p class="font-bold">Ajuste Dinámico</p>
              <p class="text-xs text-slate-400 leading-relaxed">Si tu pico máximo fue de 3.4kW y tienes contratados 4.6kW, estás regalando dinero cada mes. Baja a 3.5kW con total seguridad.</p>
            </div>
          </div>
        </div>
      </div>

      <h3>Doble potencia: Estrategia para vehículos eléctricos</h3>
      <p>Es vital recordar que puedes configurar potencias distintas para los tramos **Punta y Valle**. Esto es crucial si cargas un coche eléctrico: puedes tener una potencia baja de día (3.3kW) y subirla a 7.4kW de noche para cargar rápido y barato.</p>
      
      <div class="p-8 bg-primary/5 rounded-3xl border border-primary/10 my-10 flex gap-6 italic leading-relaxed text-slate-600 dark:text-slate-400">
        <span class="text-3xl text-primary opacity-30 select-none">"</span>
        El coste de bajar la potencia es mínimo (aprox. 11€), mientras que el ahorro en el término fijo se refleja desde el primer mes. Es la acción con mejor ROI del ahorro energético.
      </div>
    `,
    date: "2026-02-20",
    author: "Equipo Técnico",
    category: "Ahorro",
    image: "/guides/energy_efficiency.webp",
    imageAlt: "Dashboard de optimización de potencia y eficiencia energética",
    readTime: "6 min"
  },
  {
    id: "discriminacion-horaria-estrategias",
    slug: "discriminacion-horaria-horas-valle-llano-punta-como-ahorrar",
    title: "Ingeniería de Hábitos: Estrategias de Discriminación Horaria",
    excerpt: "No se trata de vivir a oscuras, sino de saber cuándo pulsar el botón. Te damos las claves para desplazar consumos sin perder confort.",
    content: `
      <h2>Domina el reloj biológico de tu casa</h2>
      <p>La discriminación horaria es la herramienta más potente para usuarios activos. Pequeños cambios en la programación de tus electrodomésticos pueden traducirse en una reducción del 40% en el término de energía.</p>
      
      <div class="grid gap-6 my-12">
        <div class="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-6 group hover:border-primary/30 transition-all">
          <span class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">🚿</span>
          <div>
            <p class="font-bold text-slate-900 dark:text-white mb-2">Termos Eléctricos Inteligentes</p>
            <p class="text-sm opacity-70 leading-relaxed">Usa un temporizador para que el agua se caliente exclusivamente de 00:00 a 08:00. El aislamiento del termo la mantendrá caliente todo el día.</p>
          </div>
        </div>
        <div class="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-6 group hover:border-primary/30 transition-all">
          <span class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">🧺</span>
          <div>
            <p class="font-bold text-slate-900 dark:text-white mb-2">Programación Diferida</p>
            <p class="text-sm opacity-70 leading-relaxed">Configura la lavadora y el lavavajillas para que terminen su ciclo justo antes de que empiece la hora punta de la mañana (08:00 AM).</p>
          </div>
        </div>
      </div>

      <h3>El Mapa de los Tres Tramos</h3>
      <p>Es vital tener interiorizado el semáforo energético:</p>
      <ul class="space-y-4 my-8">
        <li class="flex items-center gap-3 text-sm"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>Valle:</strong> 00:00 - 08:00h y fines de semana. Barra libre de ahorro.</li>
        <li class="flex items-center gap-3 text-sm"><span class="w-2 h-2 rounded-full bg-amber-500"></span> <strong>Llano:</strong> Tramos intermedios durante el día. Coste moderado.</li>
        <li class="flex items-center gap-3 text-sm"><span class="w-2 h-2 rounded-full bg-rose-500"></span> <strong>Punta:</strong> 10-14h y 18-22h. Evita consumos pesados a toda costa.</li>
      </ul>
    `,
    date: "2026-02-15",
    author: "Estratega Energético",
    category: "Estrategia",
    image: "/guides/electricity_clock.webp",
    imageAlt: "Estrategias visuales para el uso de energía en horas económicas",
    readTime: "5 min"
  },
  {
    id: "autoconsumo-solar-pisos",
    slug: "autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad",
    title: "Energía Solar en Comunidades: El Despegue del Autoconsumo Colectivo",
    excerpt: "Ya no necesitas una casa unifamiliar para producir tu propia energía. Resolvemos el enigma de las instalaciones en bloques de pisos.",
    content: `
      <h2>Tu tejado comunitario: Una mina de oro energética</h2>
      <p>España ha pasado de las trabas al sol a ser el paraíso del **autoconsumo compartido**. En 2026, los coeficientes de reparto dinámicos permiten que una comunidad de vecinos amortice su instalación en tiempo récord.</p>
      
      <div class="grid sm:grid-cols-2 gap-8 my-12">
        <div class="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30">
          <h4 class="text-emerald-900 dark:text-emerald-400 font-900 uppercase tracking-widest text-[10px] mb-4">Ventajas de Grupo</h4>
          <ul class="space-y-3 text-sm font-medium">
            <li class="flex items-center gap-3">🌟 Reducción del IBI (Hasta 50%)</li>
            <li class="flex items-center gap-3">🌟 Mantenimiento compartido</li>
            <li class="flex items-center gap-3">🌟 Independencia de la red</li>
          </ul>
        </div>
        <div class="p-8 bg-sky-50 dark:bg-sky-900/10 rounded-[2rem] border border-sky-100 dark:border-sky-900/30 flex flex-col justify-center">
          <p class="text-[10px] font-900 uppercase tracking-widest text-sky-800 dark:text-sky-400 mb-2">Retorno Estimado</p>
          <p class="text-4xl font-900 text-sky-600 mb-2">~4.5 años</p>
          <p class="text-xs opacity-70 italic leading-relaxed text-sky-900 dark:text-sky-500">Calculado bajo el actual sistema de subvenciones europeas NextGen 2026.</p>
        </div>
      </div>

      <h3>¿Cómo se reparte la luz generada?</h3>
      <p>La energía se distribuye a través de la red de la distribuidora mediante un contrato de autoconsumo colectivo. No necesitas cables adicionales desde el tejado a tu casa; todo se gestiona virtualmente en tu contador inteligente.</p>
    `,
    date: "2026-02-10",
    author: "Consultoría Solar",
    category: "Solar",
    image: "/guides/solar_panels.webp",
    imageAlt: "Instalación de paneles solares fotovoltaicos en azotea comunitaria",
    readTime: "9 min"
  },
  {
    id: "guia-carga-coche-electrico",
    slug: "mejor-tarifa-luz-coche-electrico-recarga-nocturna",
    title: "Movilidad Eléctrica: Guía de Carga y Optimización en el Hogar",
    excerpt: "Cargar tu vehículo por menos de 2€ es posible. Analizamos las tarifas especiales de VE y la configuración ideal de tu Wallbox.",
    content: `
      <h2>Tu garaje: La gasolinera más barata del mundo</h2>
      <p>El coche eléctrico es el mejor ahorrador si conoces las reglas del juego. Cargar en casa durante la noche no es solo cómodo, es hasta **diez veces más económico** que usar la infraestructura de carga pública.</p>
      
      <div class="bg-primary p-10 rounded-[2.5rem] text-white my-12 shadow-2xl bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        <h4 class="text-white font-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-3">
          <span class="text-xl">⚡</span>
          KPIs del Ahorro en Movilidad
        </h4>
        <div class="grid sm:grid-cols-2 gap-8">
          <div class="p-6 bg-white/10 rounded-3xl border border-white/20">
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Coste 100km</p>
            <p class="text-2xl font-900 text-white">1.35€ (aprox)</p>
          </div>
          <div class="p-6 bg-white/10 rounded-3xl border border-white/20">
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Ahorro vs Diesel</p>
            <p class="text-2xl font-900 text-white">~1.400€/año</p>
          </div>
        </div>
      </div>

      <h3>La importancia de una tarifa específica para VE</h3>
      <p>Muchas comercializadoras ofrecen una **"Cero Horas"** (0.00€/kWh de 01:00 a 07:00). Si tus desplazamientos son predecibles, estas tarifas permiten que el coste de tu movilidad sea prácticamente anecdótico comparado con el combustible convencional.</p>
    `,
    date: "2026-03-05",
    author: "Movilidad Sostenible",
    category: "Movilidad",
    image: "/guides/ev_charging.webp",
    imageAlt: "Carga doméstica inteligente de coche eléctrico conectada a smartphone",
    readTime: "7 min"
  },
  {
    id: "preguntas-frecuentes-tarifa-de-luz",
    slug: "preguntas-frecuentes-tarifa-de-luz",
    title: "FAQs: Dudas resueltas sobre tu factura y ahorro de luz",
    excerpt: "¿Tienes dudas sobre el PVPC o el CUPS? Respondemos a todas las preguntas frecuentes para que domines tu recibo en 2026.",
    content: `
      <h2>Resolvemos las dudas que tu compañía no te aclara</h2>
      <p>En el sector eléctrico, la transparencia es el mejor ahorro. Aquí tienes las respuestas directas a las dudas más comunes de nuestros usuarios.</p>
      
      <div class="space-y-6 my-10">
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h4 class="font-bold text-slate-900 dark:text-white mb-2 italic">¿Qué es el PVPC y por qué es tan polémico?</h4>
          <p class="text-sm">Es la tarifa regulada. Su precio cambia cada hora. Es transparente pero volátil. Solo con ella puedes pedir el **Bono Social**.</p>
        </div>
        
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h4 class="font-bold text-slate-900 dark:text-white mb-2 italic">¿Puedo cambiar de compañía si tengo permanencia?</h4>
          <p class="text-sm">La mayoría de tarifas domésticas no tienen permanencia. Si la tienes, la ley establece límites. No dejes de ahorrar por miedo a una penalización pequeña.</p>
        </div>

        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h4 class="font-bold text-slate-900 dark:text-white mb-2 italic">¿Qué es el código CUPS?</h4>
          <p class="text-sm">Es el identificador único de tu contador. Lo necesitarás para cualquier cambio de tarifa o de compañía.</p>
        </div>
      </div>

      <div class="p-8 bg-primary rounded-3xl text-white text-center my-12 shadow-xl shadow-primary/20">
        <h3 class="text-white mb-4">¿Sigues con dudas?</h3>
        <p class="mb-6 opacity-90">Nuestro equipo analiza miles de facturas cada mes. Deja que la tecnología trabaje por ti.</p>
        <a href="/comparador" class="inline-block bg-white text-primary font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">Probar Comparador Gratis</a>
      </div>
    `,
    date: "2026-03-08",
    author: "TuMejorTarifaLuz Team",
    category: "Educación",
    image: "/guides/faq_energy.webp",
    imageAlt: "Usuario resolviendo dudas técnicas sobre su contrato de luz con soporte visual",
    readTime: "10 min"
  },
  {
    id: "horas-baratas-luz-horarios-valle-llano-punta",
    slug: "horas-baratas-luz-horarios-valle-llano-punta",
    title: "Horas más baratas de la luz: Horarios Valle, Llano y Punta en 2026",
    excerpt: "Consulta los horarios actualizados para ahorrar hoy mismo. Descubre cuándo es más barato usar tus electrodomésticos.",
    content: `
      <h2>Planifica tu jornada y ahorra sin esfuerzo</h2>
      <p>Saber cuándo poner la lavadora ya no es una manía, es una estrategia financiera de alto impacto. Los tramos horarios siguen siendo, en 2026, la brújula del ahorro doméstico.</p>
      
      <div class="grid gap-6 my-10">
        <div class="flex items-center gap-6 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
          <div class="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
            💰
          </div>
          <div>
            <h4 class="text-emerald-900 dark:text-emerald-400 font-bold mb-1">Tramo Valle (Económico)</h4>
            <p class="text-sm">De 00:00 a 08:00 y fines de semana completos. <strong>Ahorro máximo</strong>.</p>
          </div>
        </div>
        
        <div class="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div class="w-16 h-16 rounded-2xl bg-slate-400 flex items-center justify-center text-white shrink-0">
            🕒
          </div>
          <div>
            <h4 class="text-slate-900 dark:text-slate-200 font-bold mb-1">Tramo Llano (Precio Medio)</h4>
            <p class="text-sm">08:00-10:00, 14:00-18:00 y 22:00-00:00. **Uso moderado**.</p>
          </div>
        </div>

        <div class="flex items-center gap-6 p-6 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/30">
          <div class="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center text-white shrink-0">
            ⚠️
          </div>
          <div>
            <h4 class="text-rose-900 dark:text-rose-400 font-bold mb-1">Tramo Punta (Caro)</h4>
            <p class="text-sm">10:00-14:00 y 18:00-22:00. **Evita grandes consumos**.</p>
          </div>
        </div>
      </div>

      <h3>Consejos prácticos para el día a día</h3>
      <p>Organizar tus tareas intensivas siguiendo este semáforo energético puede reducir tu factura en más de un <strong>20% mensual</strong>:</p>
      
      <ul class="list-disc pl-6 space-y-3 my-6">
        <li><strong>Cocina:</strong> Si usas horno o placa inducción, mejor en fin de semana.</li>
        <li><strong>Lavado:</strong> Programa lavadoras para que terminen a las 07:30 de la mañana.</li>
        <li><strong>Clima:</strong> Precalienta o refresca la vivienda justo antes de entrar en hora punta.</li>
      </ul>
    `,
    date: "2026-03-08",
    author: "Análisis de Datos",
    category: "Ahorro",
    image: "/guides/electricity_clock.webp",
    imageAlt: "Guía visual de horarios valle llano y punta para 2026",
    readTime: "8 min"
  },
  {
    id: "aerotermia-ahorro-calefaccion",
    slug: "aerotermia-que-es-ahorro-calefaccion-rentabilidad",
    title: "Aerotermia: ¿Es realmente la clave del ahorro total en 2026?",
    excerpt: "Analizamos el sistema de climatización que está jubilando al gas. Descubre su rentabilidad, coste de instalación y cómo reduce tu factura un 70%.",
    content: `
      <h2>Adiós a los combustibles fósiles: La era de la aerotermia</h2>
      <p>La aerotermia se ha consolidado en 2026 como la tecnología reina de la eficiencia doméstica. Extrae hasta el **75% de la energía del aire exterior** (incluso bajo cero) para calentar o refrigerar tu hogar y producir agua caliente.</p>
      
      <div class="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10 my-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <h4 class="text-primary font-900 uppercase tracking-widest text-[10px] mb-6">Rendimiento Técnico (COP)</h4>
        <div class="grid sm:grid-cols-2 gap-8">
          <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p class="text-3xl font-900 text-slate-900 dark:text-white mb-2">1:4</p>
            <p class="text-[10px] opacity-70 leading-relaxed">Por cada 1kW eléctrico consumido, la aerotermia entrega 4kW de calor. Un 400% de eficiencia frente al 95% de una caldera de gas.</p>
          </div>
          <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p class="text-3xl font-900 text-emerald-600 mb-2">-70%</p>
            <p class="text-[10px] opacity-70 leading-relaxed">Ahorro medio en la factura de calefacción comparado con sistemas de gasóleo o gas natural.</p>
          </div>
        </div>
      </div>

      <h3>¿Cuándo es rentable la inversión?</h3>
      <p>Aunque el coste inicial es superior al de una caldera convencional, las subvenciones europeas vigentes en 2026 y el ahorro operativo mensual permiten amortizar la instalación en un periodo de **4 a 6 años**. Si además cuentas con placas solares, el coste de climatización puede llegar a ser virtualmente cero.</p>
      
      <div class="p-8 bg-slate-900 text-white rounded-3xl my-10">
        <h4 class="text-primary-light font-bold mb-4">Integración con Suelo Radiante</h4>
        <p class="text-sm opacity-80 leading-relaxed">La aerotermia trabaja de forma óptima a baja temperatura, lo que la convierte en la pareja perfecta del suelo radiante o los radiadores de baja temperatura. Menos calor desperdiciado, más confort táctil.</p>
      </div>
    `,
    date: "2026-03-14",
    author: "Ingeniería Térmica",
    category: "Climatización",
    image: "/guides/aerotermia.webp",
    imageAlt: "Unidad de aerotermia moderna instalada en vivienda eficiente",
    readTime: "8 min"
  },
  {
    id: "auditoria-energetica-casera",
    slug: "como-hacer-auditoria-energetica-casera-deteccion-fugas",
    title: "Auditoría Energética Casera: 5 Pasos para Detectar Fugas de Dinero",
    excerpt: "No necesitas un experto para empezar a ahorrar. Te enseñamos a identificar los puntos críticos de pérdida de energía en tu vivienda.",
    content: `
      <h2>Tu casa bajo el microscopio energético</h2>
      <p>A menudo buscamos la tarifa más barata pero ignoramos que nuestra vivienda está "perdiendo" energía por rincones invisibles. Una auditoría casera puede reducir tu demanda de energía hasta en un 20% con cambios de bajo coste.</p>
      
      <div class="space-y-6 my-12">
        <div class="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200 dark:border-amber-900/30">
          <h4 class="font-bold text-amber-900 dark:text-amber-400 mb-2">1. El Test de la Vela (Estanqueidad)</h4>
          <p class="text-sm opacity-80">Pasa una vela encendida cerca de marcos de puertas y ventanas. Si la llama oscila, tienes un puente térmico. Solución: Burletes de silicona (Inversión: 10€).</p>
        </div>
        
        <div class="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h4 class="font-bold text-slate-900 dark:text-white mb-2">2. El Misterio del Stand-by</h4>
          <p class="text-sm opacity-80">Los "vampiros energéticos" (luces rojas de la TV, cargadores, routers) pueden suponer el 10% de tu recibo. Usa regletas con interruptor para el "apagado total" nocturno.</p>
        </div>

        <div class="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h4 class="font-bold text-slate-900 dark:text-white mb-2">3. Aislamiento de Persianas</h4>
          <p class="text-sm opacity-80">El cajón de la persiana es el gran olvidado. Instalar un panel aislante dentro del cajón puede subir 2 grados la temperatura de la habitación en invierno.</p>
        </div>
      </div>

      <h3>La Regla de los 21 Grados</h3>
      <p>Cada grado adicional en el termostato incrementa el consumo un **7%**. Mantener tu casa a 21°C en invierno y 26°C en verano es el punto de equilibrio perfecto entre salud, confort y ahorro financiero.</p>
    `,
    date: "2026-03-15",
    author: "Especialista en Eficiencia",
    category: "Ahorro",
    image: "/guides/home_audit.webp",
    imageAlt: "Inspección térmica de vivienda para detección de fugas de calor",
    readTime: "6 min"
  }
];
