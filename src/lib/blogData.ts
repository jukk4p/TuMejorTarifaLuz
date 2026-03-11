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
      
      <div class="bg-primary/5 p-6 rounded-3xl border border-primary/10 my-10">
        <h4 class="text-primary flex items-center gap-2 mb-3">
          📊
          Conceptos Clave para el Ahorro
        </h4>
        <ul class="space-y-4">
          <li class="flex gap-4">
            <span class="font-900 text-primary">01.</span>
            <span><strong>Término de Potencia (Fijo):</strong> Es el precio que pagas por la capacidad de conectar aparatos simultáneamente. Se mide en <strong>kW</strong> y representa el coste fijo de tu recibo.</span>
          </li>
          <li class="flex gap-4">
            <span class="font-900 text-primary">02.</span>
            <span><strong>Término de Energía (Variable):</strong> El coste del consumo real medido en <strong>kWh</strong>. Aquí es donde la <strong>discriminación horaria</strong> juega su papel fundamental.</span>
          </li>
          <li class="flex gap-4">
            <span class="font-900 text-primary">03.</span>
            <span><strong>Peajes e Impuestos:</strong> Los costes regulados que suponen casi el <strong>50% del total</strong> de lo que pagas cada mes.</span>
          </li>
        </ul>
      </div>

      <h3>Cómo optimizar según el tramo horario</h3>
      <p>En el sistema actual, puedes optimizar tu gasto contratando potencias distintas para los diferentes tramos del día:</p>
      
      <div class="grid sm:grid-cols-2 gap-4 my-8">
        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p class="font-bold mb-1">Horas Punta ☀️</p>
          <p class="text-sm">Menor potencia recomendada para ahorrar en el fijo.</p>
        </div>
        <div class="p-4 bg-primary/10 rounded-2xl border border-primary/20">
          <p class="font-bold text-primary mb-1">Horas Valle 🌙</p>
          <p class="text-sm">Mayor potencia si necesitas cargar tu coche eléctrico.</p>
        </div>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/30 my-8">
        <p class="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
          💡
          Consejo de Experto
        </p>
        <p class="text-sm">No pierdas tiempo con cálculos manuales. Nuestro <strong>comparador inteligente</strong> procesa estos datos automáticamente al subir tu PDF, analizando más de 50 tarifas en segundos.</p>
      </div>
    `,
    date: "2026-03-01",
    author: "Comité Experto",
    category: "Educación",
    image: "/guides/bill_expert_analysis.webp",
    imageAlt: "Análisis experto de una factura de luz con desglose visual",
    readTime: "7 min"
  },
  {
    id: "mercado-libre-vs-regulado",
    slug: "mercado-libre-vs-pvpc-cual-es-mejor-para-ti",
    title: "Mercado Libre vs Regulado (PVPC): ¿Cuál es más rentable en 2026?",
    excerpt: "Analizamos el nuevo sistema de cálculo del PVPC frente a las tarifas fijas del mercado libre tras la reforma energética.",
    content: `
      <h2>¿Dónde está el ahorro real: Mercado Libre o PVPC?</h2>
      <p>La elección entre el mercado regulado y el libre ya no es una cuestión de azar, sino de **perfil de consumo**. Tras la reforma del 2026, las reglas han cambiado.</p>
      
      <div class="overflow-x-auto my-10">
        <table class="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-4 font-bold">Característica</th>
              <th class="p-4 font-bold">Regulado (PVPC)</th>
              <th class="p-4 font-bold">Mercado Libre</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr>
              <td class="p-4 font-bold">Precio</td>
              <td class="p-4 text-sm">Cambia cada hora (Variable)</td>
              <td class="p-4 text-sm">Acordado con la Cía (Fijo o Var)</td>
            </tr>
            <tr>
              <td class="p-4 font-bold">Bono Social</td>
              <td class="p-4 text-sm">✅ Sí (Única opción)</td>
              <td class="p-4 text-sm">❌ No disponible</td>
            </tr>
            <tr>
              <td class="p-4 font-bold">Transparencia</td>
              <td class="p-4 text-sm">Máxima (Precios BOE)</td>
              <td class="p-4 text-sm">Variable (Según contrato)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>¿Cuándo interesa el Mercado Regulado?</h3>
      <p>Es la opción ideal si eres beneficiario del <strong>Bono Social</strong> o si tienes gran flexibilidad para desplazar tus consumos intensivos a las horas de madrugada y fines de semana. La transparencia es total, pero te expones a la volatilidad del mercado mayorista.</p>
      
      <h3>¿Cuándo elegir el Mercado Libre?</h3>
      <p>Si buscas <strong>tranquilidad y estabilidad</strong>. Con una tarifa fija 24h, pagas lo mismo sin importar la hora. En 2026, muchas comercializadoras ofrecen promociones agresivas que pueden incluso batir al PVPC si no eres un "expert" desplazando consumos.</p>

      <div class="border-l-4 border-primary pl-6 py-2 my-8 italic text-slate-500">
        "El ahorro no depende de quién te venda la luz, sino de cómo y cuándo la utilizas. Analizamos más de 50 tarifas diarias para encontrar tu match perfecto."
      </div>
    `,
    date: "2026-02-26",
    author: "Dpto. de Análisis",
    category: "Comparativa",
    image: "/guides/market_comparison.webp",
    imageAlt: "Tabla comparativa de mercados eléctricos para el ahorro",
    readTime: "8 min"
  },
  {
    id: "optimizacion-potencia-ahorro",
    slug: "como-reducir-potencia-contratada-luz-ahorrar",
    title: "Optimización de Potencia: El ahorro que el 90% de los usuarios ignora",
    excerpt: "Te enseñamos a identificar si tienes contratada más potencia de la necesaria y cómo ajustarla para ahorrar hasta 150€ al año.",
    content: `
      <h2>Paga solo por la potencia que realmente utilizas</h2>
      <p>Casi el 70% de los hogares españoles tienen contratada una potencia superior a la que necesitan "por si acaso". Este miedo a que "salten los plomos" cuesta de media <strong>50€ anuales por cada kW de exceso</strong>.</p>
      
      <div class="bg-slate-900 text-white p-8 rounded-3xl my-10 relative overflow-hidden">
        <div class="relative z-10">
          <h4 class="text-primary font-bold mb-4">¿Cómo saber si te sobra potencia?</h4>
          <p class="text-sm text-slate-300 leading-relaxed mb-6">
            Si nunca han saltado las protecciones de tu cuadro eléctrico al encender simultáneamente el horno, la lavadora y el aire acondicionado, tienes margen de mejora.
          </p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
              ⚡
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Paso 1</p>
              <p class="text-sm">Consulta tu <strong>pico máximo</strong> en la web de tu distribuidora.</p>
            </div>
            <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
              📝
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Paso 2</p>
              <p class="text-sm">Ajusta tu potencia a ese máximo + un pequeño margen.</p>
            </div>
          </div>
        </div>
      </div>

      <h3>Doble potencia: Una oportunidad de ahorro</h3>
      <p>Recuerda que puedes contratar potencias distintas en los tramos <strong>Punta y Valle</strong>. Si cargas un coche eléctrico de noche, podrías subir la potencia en el tramo valle (más barato) y mantener una potencia mínima en el tramo punta.</p>
      
      <div class="flex items-start gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10 my-8">
        ℹ️
        <div>
          <p class="text-sm">Tu comercializadora puede cobrarte un pequeño trámite por el cambio (aprox. 10€), pero lo amortizarás en apenas dos meses con el ahorro generado.</p>
        </div>
      </div>
    `,
    date: "2026-02-20",
    author: "Equipo Técnico",
    category: "Ahorro",
    image: "/guides/energy_efficiency.webp",
    imageAlt: "Optimización de potencia eléctrica con guía de pasos",
    readTime: "6 min"
  },
  {
    id: "discriminacion-horaria-estrategias",
    slug: "discriminacion-horaria-horas-valle-llano-punta-como-ahorrar",
    title: "Discriminación Horaria: Estrategias para reducir un 40% tu gasto",
    excerpt: "Domina los tramos Punta, Llano y Valle. Estrategias prácticas para desplazar consumos críticos a las horas más económicas en 2026.",
    content: `
      <h2>Domina el reloj para dominar tu factura</h2>
      <p>La discriminación horaria no significa cambiar tu estilo de vida, sino aplicar <strong>inteligencia energética</strong>. Pequeños ajustes en el horario de tus electrodomésticos pueden suponer una diferencia abismal.</p>
      
      <div class="grid gap-4 my-10">
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          ✅
          <div>
            <p class="font-bold">Ciclos de lavado programados</p>
            <p class="text-sm opacity-70">Usa el inicio diferido para que terminen a las 08:00 AM.</p>
          </div>
        </div>
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          ✅
          <div>
            <p class="font-bold">Termos eléctricos con temporizador</p>
            <p class="text-sm opacity-70">Calienta el agua solo durante el tramo Valle.</p>
          </div>
        </div>
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          ✅
          <div>
            <p class="font-bold">Cocina por lotes (Batch Cooking)</p>
            <p class="text-sm opacity-70">Usa el horno y la vitro en bloque durante el fin de semana.</p>
          </div>
        </div>
      </div>

      <h3>Los tres tramos que debes conocer</h3>
      <p>Consulta nuestro gráfico de precios en tiempo real para planificar tu jornada y maximizar el ahorro diario.</p>

      <div class="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-900/30 my-8 flex gap-4">
        ⚠️
        <p class="text-sm"><strong>Evita las horas Punta (10-14h y 18-22h)</strong> para actividades de alto consumo. Es cuando la red está más saturada y el precio se dispara.</p>
      </div>
    `,
    date: "2026-02-15",
    author: "Estratega Energético",
    category: "Estrategia",
    image: "/guides/electricity_clock.webp",
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
      <p>El <strong>autoconsumo colectivo</strong> ha revolucionado el panorama energético en España. Ya no necesitas un chalet para disfrutar de la energía solar; ahora puedes compartir una instalación en tu comunidad de vecinos.</p>
      
      <div class="grid sm:grid-cols-2 gap-6 my-10">
        <div class="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
          <h4 class="text-emerald-900 dark:text-emerald-400 font-bold mb-3">Beneficios Directos</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2 font-medium">✨ Rebaja en IBI y Tasas</li>
            <li class="flex items-center gap-2 font-medium">🛠️ Bajo coste de mantenimiento</li>
            <li class="flex items-center gap-2 font-medium">📈 Revalorización del edificio</li>
          </ul>
        </div>
        <div class="p-6 bg-sky-50 dark:bg-sky-900/10 rounded-3xl border border-sky-100 dark:border-sky-900/30">
          <h4 class="text-sky-900 dark:text-sky-400 font-bold mb-3">Retorno de Inversión</h4>
          <p class="text-2xl font-900 text-sky-600 mb-1">4-6 años</p>
          <p class="text-xs opacity-70 italic text-sky-800 dark:text-sky-500">Plazo medio de amortización incluyendo ayudas públicas.</p>
        </div>
      </div>

      <h3>¿Cómo funciona el reparto de energía?</h3>
      <p>La energía generada por las placas se reparte entre los vecinos según coeficientes acordados (normalmente por cuota de participación o consumo). Esto permite reducir la dependencia de la red eléctrica de forma solidaria.</p>
    `,
    date: "2026-02-10",
    author: "Consultoría Solar",
    category: "Solar",
    image: "/guides/solar_panels.webp",
    imageAlt: "Paneles solares en edificio residencial con indicadores de ahorro",
    readTime: "9 min"
  },
  {
    id: "guia-carga-coche-electrico",
    slug: "mejor-tarifa-luz-coche-electrico-recarga-nocturna",
    title: "Cargar el Coche Eléctrico en Casa: Guía definitiva para ahorrar",
    excerpt: "Analizamos las mejores tarifas para VE y cómo aprovechar la potencia en horas valle para cargar por menos de 2€.",
    content: `
      <h2>Convierte tu garaje en tu propia estación de servicio low-cost</h2>
      <p>Tener un vehículo eléctrico solo es verdaderamente rentable si optimizas la carga en casa. Cargar la batería durante las <strong>horas valle (00:00 a 08:00)</strong> puede costar hasta diez veces menos que en la vía pública.</p>
      
      <div class="bg-primary p-8 rounded-[2rem] text-white my-10 shadow-lg shadow-primary/20 bg-gradient-to-br from-primary to-primary-dark">
        <h4 class="text-white font-bold mb-4 flex items-center gap-2">
          🚗🔋
          La Regla de Oro del VE
        </h4>
        <p class="text-sm opacity-90 leading-relaxed mb-6">
          No siempre necesitas la máxima potencia de carga. Una carga lenta a <strong>3.7kW</strong> durante 8 horas es suficiente para la mayoría de desplazamientos diarios.
        </p>
        <div class="p-4 bg-white/10 rounded-2xl border border-white/20">
          <p class="text-xs font-bold uppercase tracking-widest text-primary-light mb-1">Dato Clave</p>
          <p class="text-lg font-bold">Ahorro de hasta 1.200€ al año</p>
          <p class="text-[10px] opacity-70">Comparado con el gasto en combustible fósil convencional.</p>
        </div>
      </div>

      <h3>Encuentra tu tarifa ideal</h3>
      <p>Utiliza nuestra herramienta para encontrar la <strong>tarifa especial VE</strong> que mejor se adapte a tus kilómetros anuales y potencia necesaria.</p>
    `,
    date: "2026-03-05",
    author: "Movilidad Sostenible",
    category: "Movilidad",
    image: "/guides/ev_charging.webp",
    imageAlt: "Carga de vehículo eléctrico optimizada con gráfico de ahorro nocturno",
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
  }
];
