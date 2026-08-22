# Google Search Console Review — TuMejorTarifaLuz — 2026-08-21

Reviewed directly in the browser (jukk4p@gmail.com account, property `tumejortarifaluz.es`, domain property). No GSC API credentials configured for `claude-seo` — this was a manual UI review, not a scripted pull. Same methodology as the parallel review done the same day for `laabaceriayolandadelgado.es`.

**Period covered:** last 3 months (19 may 2026 – 18 ago 2026).

## Headline numbers

| Metric | Value |
|---|---|
| Clicks | 7 |
| Impressions | 7,700 |
| Average CTR | 0.1% |
| Average position | 65 |
| Indexed pages | 30 |
| Known-but-not-indexed pages | 106 |

Much lower conversion than the other site reviewed the same day, despite far higher impression volume. The story here isn't "nobody sees the site" — 7,700 impressions is real visibility — it's "the site shows up for the wrong things, or too far down the results, for people to click."

## Finding 1: the money pages rank worst; the long-tail pages rank best

| Page | Impressions | Clicks | Position |
|---|---|---|---|
| `/companias/visalia` | 726 | 3 | **15.7** |
| `/` (homepage) | 1,622 | 2 | 78.5 |
| `/comparador` | 1,495 | 1 | 79.1 |
| `/companias/niba` | 704 | 1 | 43.2 |
| `/companias` (hub) | 1,725 | 0 | 83.4 |
| `/companias/naturgy` | 580 | 0 | 47.2 |
| `/companias/repsol` | 273 | 0 | 49.9 |
| `/companias/total-energies` | 165 | 0 | 42.8 |
| `/precio-luz-hoy` | 140 | 0 | 70.0 |
| `/companias/octopus-energy` | 65 | 0 | 15.7 |

The homepage, `/comparador` (the core tool — this site's entire value proposition), and `/companias` (the hub page) all rank in the high-70s/80s — essentially invisible, since almost nobody scrolls past page 1 (~position 10) of Google. Meanwhile individual company pages rank far better (15.7–50), some quite well.

Query data confirms the same split: the exact head terms this site is built to win — "comparador tarifas luz" (255 impr, pos 80.3), "mejor tarifa luz" (151 impr, pos 73.3), "comparativa tarifas luz" (155 impr, pos 82.7), "comparador de luz" (109 impr, pos 82.6) — are nowhere near page 1. These are also **extremely competitive commercial terms** (dominated by long-established comparison sites and the utilities' own SEO budgets), so some of this gap is simply new-domain authority — not fixable by a code change alone.

**But there's a concrete, fixable technical factor too**: `/comparador/page.tsx` ships **zero static body content** — only a `<title>` and meta description, delegating the entire page to `ComparadorMain.tsx`, a 3,345-line `"use client"` component (an interactive bill-upload/comparison tool). There's no on-page prose explaining what the tool does, how it works, trust signals, or an FAQ — nothing for Google to match against competitive queries beyond the title tag. Company pages likely rank better in relative terms because they carry more structured, keyword-relevant text (tariff details, provider descriptions) alongside the tool.

**Recommendation**: add real static SEO copy to `/comparador` and `/` — an explainer section (how the comparison works, why trust it, methodology), an FAQ block, maybe testimonials/trust signals — rendered server-side, not gated behind interaction with the tool. This is the single highest-leverage content fix available given `/comparador` is the site's actual product page and currently has the weakest on-page signal of any major page.

**Fixed 2026-08-21**: added a short, distinct (non-duplicate-of-home) static "¿Qué hace este comparador?" section to `ComparadorMain.tsx` — a 3-step recap, trust-signal chips, and a link to the homepage FAQ — plus a `BreadcrumbList` JSON-LD (using an import that already existed in the file but was never wired up).

**A much bigger, pre-existing bug was found and fixed along the way**: `ComparadorMain.tsx` had `if (!mounted) return null;` before its entire render — meaning the *whole* `/comparador` page (title, breadcrumbs, everything, not just the new content) was rendering as an empty `null` in the HTML sent to Google. Confirmed both of the component's actual `mounted`-dependent expressions (`mounted && resolvedTheme === 'dark'`, used to pick a light/dark logo variant) are already self-guarding and didn't need the blanket early return — so it was safe to delete. Verified via `npm run build` that the page prerenders as static output (`○` in the build's route list) with a single consistent HTML artifact (`.next/server/app/comparador.html`) containing the real page content; a hydration-mismatch console warning seen in the dev server during active file edits did not reproduce in the clean production build output, and is attributed to Turbopack dev-mode HMR churn, not a real issue. This fix alone (independent of the new content) should matter far more for `/comparador`'s indexability than the content addition — Google previously had literally nothing to index on this page.

## Finding 2: indexation coverage is worse than the sibling site — only 22% of known pages indexed

| Reason | Pages |
|---|---|
| Crawled — currently not indexed | 38 |
| Page with redirect | 27 |
| Not found (404) | 16 |
| Soft 404 | 12 |
| Alternate page with proper canonical tag | 7 |
| Blocked by robots.txt | 4 |
| Duplicate, Google chose a different canonical than the user | 1 |
| Redirect error | 1 |

Two of these buckets are **not real problems** and can be ignored:
- **"Page with redirect" (27)** and **"Alternate page with proper canonical" (7)** are Google correctly recognizing redirects/canonicals — expected, healthy behavior, not something to fix.
- **"Blocked by robots.txt" (4)** are all `.woff2` font files under `/_next/static/media/` — irrelevant to indexing, no action needed.

The other buckets are worth attention:

### Soft 404 (12) — 100% are blog posts, many are www/non-www duplicate pairs

Every single soft-404 URL is a `/blog/*` post. Several appear **twice** — once as `https://www.tumejortarifaluz.es/blog/X` and once as `https://tumejortarifaluz.es/blog/X` (no `www`) — e.g. `preguntas-frecuentes-tarifa-de-luz`, `tarifas-coche-electrico-casa-2026`, `discriminacion-horaria-luz-como-ahorrar`. This is the same class of duplicate-domain-variant bug as the HTTP/HTTPS issue found on the other site reviewed today, but here it's **www vs. non-www**.

**Good news: this looks largely already fixed in code, pending Google catching up.** `next.config.ts` already has a host-based 301 (`has: [{ type: 'host', value: 'tumejortarifaluz.es' }]` → `https://www.tumejortarifaluz.es/:path*`), added in the 2026-08-10 commit range alongside a batch of other SEO redirect fixes (`fix(seo): fechas reales en el sitemap y redirects que faltaban`, `fix(seo): redirigir /faq...`). Most of the specific 404'd URLs in this review (`/politica-de-privacidad`, `/terminos-de-uso`, `/pro`, several renamed blog slugs) already have matching redirect rules in `next.config.ts`, and their GSC "último rastreo" dates are mostly from **April 2026** — before these fixes shipped. Recommend re-checking this bucket in 2-3 weeks rather than assuming it's still broken; if the same URLs still show as unindexed by then, the redirects aren't actually reaching Googlebot and need live verification (`curl -I` against production, not just the config file).

### Two literal broken URLs, actively re-crawled very recently (not stale)

Unlike the April-dated 404s above, these two were crawled in the last few days:
- `https://www.tumejortarifaluz.es/$` — last crawled 18 ago 2026
- `https://www.tumejortarifaluz.es/año` — last crawled 16 ago 2026

Neither matches anything in `sitemap.ts` (checked — it's clean, no template-string bugs) or the current `JsonLd.tsx` SearchAction (`/blog?q={search_term_string}`, not these). Something — an external backlink, a stray internal `<a>` with an unescaped template literal, or a leftover from before the recent redirect cleanup — is still generating or linking to these. Worth a quick `grep` for `href.*\$\{` patterns and checking Search Console's "Página de referencia" field for each (found via Inspección de URLs) to identify the actual source before it accumulates more crawl budget waste.

**Update 2026-08-21 (later same day)**: GSC already has an active validation running for "No se ha encontrado (404)" (started 10 ago 2026, right after the redirect-fix commits — the site owner had already clicked "Validar corrección"). Checked its **Error** tab (still failing as of the last recrawl, not just "pending") — 5 URLs: `/$` and `/año` (the two above, still unresolved, source still not identified) plus **3 real blog posts with no matching redirect**: `/blog/aerotermia-ventajas-desventajas-ahorro-calefaccion-climatizacion-2026`, `/blog/como-reclamar-factura-luz-excesiva`, `/blog/cuanto-cuesta-cargar-coche-electrico-en-casa-2026` — each an old slug missing the `-guia-completa-.../−errores/−rentabilidad-ahorro` suffix its current post has in `blogData.ts`. **Fixed**: added all 5 as redirects in `next.config.ts` (the 3 blog posts to their real current slugs; `/$` and `/año` defensively to `/`, same pattern as the existing `/5` rule). Verified live against a clean production build (`next build` + standalone server, not just the dev server): all 5 return a real 308 to the right destination, and the actual full-slug blog post still resolves 200 (no over-broad match). Not yet committed/deployed as of this writing.

### "Crawled — currently not indexed" (38) — same story as the sibling site

Largest bucket. This is Google's crawl-budget/quality-prioritization decision, not a discovery gap — don't chase it with sitemap changes. The real levers are the same as the other project: internal linking depth to these pages, and (once `/comparador` has real static content) overall domain authority improving indexation odds sitewide.

## Finding 3: sitemap coverage looks legitimate, unlike the sibling site's initial misdiagnosis

Only one sitemap submitted (`https://www.tumejortarifaluz.es/sitemap.xml`, status Correcto, 35 pages discovered, last read 18 ago 2026). This covers 8 static routes + 13 blog posts + 14 company pages. Cross-checked against `sitemap.ts` in code — it dynamically pulls from `blogPosts` and `providers` data, so it should stay in sync automatically as content is added. The 35-vs-136 gap versus total known URLs is explained by legacy/renamed URLs and their redirect targets still lingering in Google's crawl history, not missing sitemap entries — **don't repeat the "add more to the sitemap" fix here**, it isn't the actual problem.

## Seguimiento 2026-08-22

- Verificados en producción (curl) los 5 redirects del fix anterior (`/$`, `/año`, y los 3 slugs de blog): los 5 devuelven 308 al destino correcto.
- La validación GSC de "No se ha encontrado (404)" seguía en estado *error* desde el 15/8 (antes del deploy del fix). Se reinició manualmente ("Iniciar nueva validación") ya que el fix está confirmado en vivo.
- `/blog` y `/comparador` seguían **sin indexar** en GSC con último rastreo muy anterior a sus respectivos fixes (17 abr y 11 ago). Probados en vivo (ambos "disponibles para Google") y se solicitó indexación manual para ambos.
- Código muerto eliminado: el ternario `company === "Neolux Energy" ? "neolux-energy" : ...` en `Footer.tsx` y `Navbar.tsx` (2 sitios) — "Neolux Energy" ya no existe en ninguno de los arrays `COMPANIES` de esos ficheros, rama inalcanzable.
- Revisados `sitemap.ts` y `robots.ts`: correctos, sin cambios necesarios.
- Home (`/`) ya tiene contenido estático sustancial (FAQ + schema, sección "cómo funciona", enlaces a /blog y a las 14 fichas de compañía) — no necesitaba el refuerzo que sí hizo falta en /comparador.
- Pendiente real, no abordado: contenido de código de descuento para `/companias/niba` (496-582 impresiones/trimestre en posición ~46) — requiere datos reales de promociones, no debe inventarse.

## Not actionable right now

- **Core Web Vitals**: no data for mobile or desktop — insufficient real-user (CrUX) traffic in the last 90 days, expected given the low click volume.
- **`código descuento niba` (582 impressions, position 46.2)**: a company-specific discount-code query with real search volume but poor position. Not investigated in depth this pass — worth a follow-up if `/companias/niba` is a priority page, since 582 impressions/quarter for one query is meaningful volume being left on the table.
