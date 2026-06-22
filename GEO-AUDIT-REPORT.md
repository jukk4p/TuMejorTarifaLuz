# Auditoría GEO-SEO: TuMejorTarifaLuz_Web

Esta auditoría analiza la preparación del proyecto **TuMejorTarifaLuz** para la era de la búsqueda generativa (LLMs como ChatGPT, Perplexity, Claude y Google AI Overviews) sin descuidar los cimientos del SEO técnico tradicional.

---

## 1. Resumen Ejecutivo y Puntaje GEO (GEO Score)

Calculamos un **GEO Score estimado de 82/100**. La base técnica del proyecto es sólida, pero tenés áreas críticas de mejora para maximizar la citabilidad y descubrimiento por parte de agentes de IA.

```
[████████████████████████████████░░░░░░] 82/100 (Muy Bueno)
```

| Categoría | Peso | Puntaje | Estado |
|---|---|---|---|
| **Acceso de Crawlers de IA** | 25% | 18/25 | ⚠️ Faltan directivas explícitas y `llms.txt` |
| **Calidad de Contenido y E-E-A-T** | 20% | 18/20 | 🟢 Excelente profundidad y autoría clara |
| **Datos Estructurados (Schema)** | 10% | 9/10 | 🟢 Implementación muy completa de JSON-LD |
| **Optimización de Plataformas** | 10% | 8/10 | 🟢 Buen renderizado del lado del servidor (SSR) |
| **SEO Técnico y Performance** | 15% | 14/15 | 🟢 Diferimiento de scripts pesados |
| **Señales de Marca** | 20% | 15/20 | ⚠️ Falta de integración de redes en Schema |

---

## 2. Análisis Detallado por Apartado

### 🤖 Apartado A: Acceso de Crawlers de IA y Robots.txt
El archivo [robots.ts](file:///c:/Users/jukkaP/Desktop/skill/TuMejorTarifaLuz_Web/src/app/robots.ts) maneja reglas generales pero carece de optimizaciones para la era de la IA.

* **Estado Actual:** Permite de forma genérica (`*`) el acceso a toda la web excepto rutas privadas (`/api/`, `/_next/`, etc.). Esto permite que rastreadores de IA accedan a la web.
* **Brecha de Optimización:**
  1. No tenés directivas explícitas para rastreadores de LLMs como `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Applebot-Extended` o `Google-Extended`.
  2. No tenés un archivo `llms.txt` en la raíz de tu proyecto. Este nuevo estándar es leído prioritariamente por agentes de IA para entender rápidamente de qué trata el sitio web y sus secciones clave.

---

### 📄 Apartado B: Citabilidad y Calidad de Contenido (E-E-A-T)
Analizando el archivo de datos del blog [blogData.ts](file:///c:/Users/jukkaP/Desktop/skill/TuMejorTarifaLuz_Web/src/lib/blogData.ts):

* **Fortalezas:**
  - **Estructura semántica:** Las guías usan índices (`TableOfContents`), títulos jerárquicos estructurados (`h2`, `h3`), listas y tablas comparativas. Esto facilita enormemente el "parsing" y la extracción de datos por parte de LLMs.
  - **Frecuencia y extensión:** Los artículos tienen una extensión óptima (1400 - 1600 palabras), son ricos en datos reales del mercado eléctrico español de 2026, y responden preguntas concretas ("¿Es seguro subir mi factura?").
  - **Señales E-E-A-T claras:** Los posts incluyen el autor `Iván González` con biografía detallada de experiencia, avatar y enlaces.
* **Oportunidades de Mejora:**
  - El autor tiene su red social Twitter configurada en la data, pero no está mapeada en el JSON-LD dinámico del artículo para heredar el `sameAs` a nivel de Schema.

---

### 🌐 Apartado C: Datos Estructurados (Schema Markup)
La configuración en [JsonLd.tsx](file:///c:/Users/jukkaP/Desktop/skill/TuMejorTarifaLuz_Web/src/components/seo/JsonLd.tsx) y [layout.tsx](file:///c:/Users/jukkaP/Desktop/skill/TuMejorTarifaLuz_Web/src/app/layout.tsx) es de nivel profesional:

* **Esquemas detectados:** `Organization`, `WebSite` (con `SearchAction`), `WebApplication` (para la app del comparador), `FAQPage` y `Article` / `BlogPosting`.
* **Detalle técnico:**
  - El esquema `WebApplication` en `/comparador` es ideal para que ChatGPT y Perplexity reconozcan la herramienta interactiva como una entidad de utilidad.
  - El marcado de `FAQPage` ayuda directamente a aparecer en los recuadros de respuesta de Google y respuestas rápidas de IA.

---

### ⚡ Apartado D: Optimización de Plataformas e Infraestructura Técnica
* **Server-Side Rendering (SSR):** Next.js App Router renderiza el contenido del lado del servidor de forma estática o híbrida (usando `revalidate = 60` en [page.tsx](file:///c:/Users/jukkaP/Desktop/skill/TuMejorTarifaLuz_Web/src/app/page.tsx)), lo cual es excelente porque la mayoría de los bots de IA no ejecutan JavaScript pesado al scrapear.
* **Performance e INP/LCP:** La optimización de retrasar Google Tag Manager (GTM) 5 segundos (`setTimeout` en [layout.tsx](file:///c:/Users/jukkaP/Desktop/skill/TuMejorTarifaLuz_Web/src/app/layout.tsx#L112-L118)) es una práctica brillante que libera el hilo principal durante la carga, garantizando una excelente métrica Core Web Vitals (muy valorada por Google AI Overviews).

---

## 3. Plan de Acción Recomendado (Quick Wins)

### 1. Implementar `llms.txt` y `llms-full.txt`
Crear un archivo `llms.txt` en la carpeta `public` para guiar a los agentes de IA.

### 2. Actualizar `robots.ts`
Especificar las directivas para los bots de IA más importantes de forma explícita.

### 3. Fortalecer el Schema del Autor en BlogPosts
Asegurarse de que el JSON-LD inyecte los enlaces de redes sociales (`sameAs`) del autor.

---
