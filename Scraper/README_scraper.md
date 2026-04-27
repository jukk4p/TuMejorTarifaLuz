# 🔌 SCRAPER PRO — Tarifas Eléctricas Mercado Libre Español

Actualiza automáticamente el archivo `data.json` con los precios reales
scrapeados de las webs de cada comercializadora.

---

## 📦 Instalación

```bash
# 1. Instalar dependencias Python
pip install requests beautifulsoup4 playwright lxml httpx

# 2. Instalar el navegador Chromium (para webs con JavaScript)
playwright install chromium
```

---

## 🚀 Uso

### Actualizar TODAS las tarifas
```bash
python scraper_tarifas_web.py data.json
```

### Actualizar solo algunas comercializadoras
```bash
python scraper_tarifas_web.py data.json --only Octopus Niba Visalia
```

### Guardar resultado en archivo diferente (sin sobreescribir el original)
```bash
python scraper_tarifas_web.py data.json --output data_actualizado.json
```

### Ver cambios sin guardar (prueba)
```bash
python scraper_tarifas_web.py data.json --dry-run
```

### Combinaciones
```bash
python scraper_tarifas_web.py data.json --only Iberdrola Endesa --output test.json --dry-run
```

---

## 📋 Salidas generadas

| Archivo | Descripción |
|---|---|
| `data.json` | JSON original actualizado con los nuevos precios |
| `changelog_tarifas.jsonl` | Historial de todos los cambios detectados |

---

## ⏰ Automatización (ejecución periódica)

### Linux / Mac — Cron (cada día a las 8:00)
```bash
crontab -e
# Añadir esta línea:
0 8 * * * cd /ruta/al/proyecto && python scraper_tarifas_web.py data.json >> logs/scraper.log 2>&1
```

### Windows — Task Scheduler
1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Acción: `python C:\ruta\scraper_tarifas_web.py data.json`
4. Frecuencia: diaria

### GitHub Actions (nube, gratuito)
```yaml
# .github/workflows/scraper.yml
name: Actualizar tarifas
on:
  schedule:
    - cron: '0 7 * * *'   # cada día a las 7:00 UTC
  workflow_dispatch:        # también manual desde GitHub

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with: { python-version: '3.11' }
      - run: pip install requests beautifulsoup4 playwright lxml
      - run: playwright install chromium
      - run: python scraper_tarifas_web.py data.json
      - uses: actions/upload-artifact@v4
        with:
          name: data-actualizado
          path: data.json
```

---

## 🏗️ Estructura del scraper

```
scraper_tarifas_web.py
├── Parsers por comercializadora
│   ├── parse_octopus()      → requests (web ligera)
│   ├── parse_visalia()      → requests (web ligera)
│   ├── parse_niba()         → requests (web ligera)
│   ├── parse_esluz()        → requests (web ligera)
│   ├── parse_imagina()      → Playwright (JS)
│   ├── parse_nufri()        → Playwright (JS)
│   ├── parse_energyavm()    → Playwright (JS)
│   ├── parse_totalenergies()→ Playwright (JS)
│   ├── parse_iberdrola()    → Playwright (JS)
│   ├── parse_endesa()       → Playwright (JS)
│   ├── parse_naturgy()      → Playwright (JS)
│   ├── parse_repsol()       → Playwright (JS)
│   └── parse_neolux()       → Playwright (JS)
├── apply_taxes()            → Recalcula precios con IVA (10%)
├── update_tariff()          → Compara precios y detecta cambios
└── main()                   → CLI con argumentos
```

---

## ⚠️ Notas importantes

- **Respeta los servidores**: el scraper incluye pausa de 1.5s entre peticiones
- **Webs con protección**: algunas webs pueden bloquear el scraper; en ese caso
  los precios de esa tarifa se mantienen sin cambio
- **IVA aplicado**: se usa el IVA reducido para electricidad (10%)
- **PVPC**: los precios del mercado regulado varían cada hora, no se actualizan aquí
- **Cambios de estructura web**: si una comercializadora rediseña su web,
  puede ser necesario ajustar su parser

---

## 🔧 Personalizar un parser

Si una comercializadora cambia su web, edita su función `parse_X()`:

```python
def parse_ejemplo(url: str) -> dict:
    html = get_html_playwright(url, wait_seconds=5)
    s = soup(html)

    # Opción 1: buscar por selector CSS específico
    precio_elem = s.select_one(".precio-energia .valor")
    e1 = parse_price(precio_elem.text) if precio_elem else None

    # Opción 2: buscar todos los precios en el texto
    prices = find_prices_in_text(s.get_text())

    return {
        "e1_kwh": e1,
        "e2_kwh": e1,   # tarifa plana
        "e3_kwh": e1,
        "p1_kw_day": 0.095,
        "p2_kw_day": 0.047,
    }
```
