"""
#        SCRAPER PRO - TARIFAS ELECTRICAS MERCADO LIBRE ESPANOL
#        Actualiza automaticamente el archivo data.json
#
#  Uso:  python scraper_tarifas_web.py
#        python scraper_tarifas_web.py --headless
#        python scraper_tarifas_web.py --only Octopus Niba

Dependencias:
    pip install requests beautifulsoup4 playwright lxml
    playwright install chromium

Estrategia por comercializadora:
  - Webs con JS pesado (Iberdrola, Endesa, Naturgy, Repsol): Playwright
  - Webs ligeras (Visalia, Esluz, Niba, Octopus, etc.): requests + BS4
"""

import re
import json
import time
import logging
import argparse
from copy import deepcopy
from datetime import date, datetime
from pathlib import Path
from typing import Optional

import requests
from bs4 import BeautifulSoup

# ─── LOGGING ────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("scraper")

# ─── CONSTANTES ──────────────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)


# ─── UTILIDADES ──────────────────────────────────────────────────────────────

def parse_price(text: str) -> Optional[float]:
    """Convierte '0,1234' o '0.1234' o '12,34 ct' a float en €/kWh."""
    if not text:
        return None
    text = text.strip().replace("\xa0", "").replace(" ", "")
    # Detectar céntimos → dividir entre 100
    is_cents = "ct" in text.lower() or "¢" in text
    # Limpiar símbolos
    text = re.sub(r"[€$ct¢€/kWhdíakw\s]", "", text, flags=re.IGNORECASE)
    text = text.replace(",", ".")
    try:
        val = float(text)
        return round(val / 100, 6) if is_cents else round(val, 6)
    except ValueError:
        return None


def find_prices_in_text(text: str, pattern: str = r"\b0[.,]\d{3,5}\b") -> list[float]:
    """Extrae todos los precios con formato 0.XXXX del texto."""
    found = re.findall(pattern, text)
    prices = []
    for f in found:
        val = parse_price(f)
        if val and 0.001 < val < 1.5:   # rango razonable €/kWh
            prices.append(val)
    return sorted(set(prices))


def get_html_requests(url: str, timeout: int = 15) -> Optional[str]:
    """Descarga HTML con requests."""
    try:
        r = SESSION.get(url, timeout=timeout, verify=False)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text
    except Exception as e:
        log.warning(f"requests falló en {url}: {e}")
        return None


def get_html_playwright(url: str, wait_selector: str = None,
                        wait_seconds: int = 4) -> Optional[str]:
    """Descarga HTML renderizado con Playwright (JS)."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        log.error("Playwright no instalado. Ejecuta: playwright install chromium")
        return None

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            ctx = browser.new_context(
                user_agent=HEADERS["User-Agent"],
                locale="es-ES",
                extra_http_headers={"Accept-Language": "es-ES,es;q=0.9"},
            )
            page = ctx.new_page()
            page.goto(url, wait_until="domcontentloaded", timeout=30_000)
            # Esperar elemento específico si se indica
            if wait_selector:
                try:
                    page.wait_for_selector(wait_selector, timeout=8_000)
                except Exception:
                    pass
            # Espera adicional para JS asíncrono
            page.wait_for_timeout(wait_seconds * 1000)
            html = page.content()
            browser.close()
            return html
    except Exception as e:
        log.warning(f"Playwright falló en {url}: {e}")
        return None


def soup(html: str) -> BeautifulSoup:
    return BeautifulSoup(html, "lxml")


# ─── PARSERS POR COMERCIALIZADORA ────────────────────────────────────────────

def parse_octopus(url: str) -> dict:
    """
    octopusenergy.es/precios
    Los precios están en la página como texto plano.
    Tarifa Relax: precio único fijo.
    """
    html = get_html_requests(url) or get_html_playwright(url)
    if not html:
        return {}

    s = soup(html)
    text = s.get_text(" ", strip=True)

    # Buscar "X,XXXX €/kWh" o similar
    prices = find_prices_in_text(text)

    # Octopus Relax tiene 1 solo precio de energía + potencia
    result = {}
    if prices:
        energia = [p for p in prices if 0.05 < p < 0.4]
        potencia = [p for p in prices if 0.04 < p < 0.15]
        if energia:
            result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]
        if len(potencia) >= 1:
            result["p1_kw_day"] = result["p2_kw_day"] = potencia[0]

    # Excedentes: buscar "compensación" o "surplus"
    surplus_m = re.search(r"excedente[s]?\D{0,20}(0[.,]\d{2,4})", text, re.IGNORECASE)
    if surplus_m:
        result["surplus_kwh"] = parse_price(surplus_m.group(1))

    log.info(f"Octopus → {result}")
    return result


def parse_visalia(url: str) -> dict:
    """
    visalia.es — precios en tablas HTML visibles.
    """
    html = get_html_requests(url) or get_html_playwright(url)
    if not html:
        return {}

    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)

    result = {}
    # Detectar si es tarifa 3P o 1P por la URL
    is_3p = "3-periodos" in url or "tres" in url.lower()

    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.001 < p < 0.15])

    if is_3p:
        if len(energia) >= 3:
            result["e1_kwh"] = energia[-1]   # punta (más caro)
            result["e2_kwh"] = energia[-2]
            result["e3_kwh"] = energia[-3]   # valle (más barato)
        if len(potencia) >= 2:
            result["p1_kw_day"] = potencia[-1]
            result["p2_kw_day"] = potencia[0]
    else:
        if energia:
            result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]
        if potencia:
            result["p1_kw_day"] = result["p2_kw_day"] = potencia[0]

    # Excedentes
    surplus_m = re.search(r"excedente[s]?\D{0,20}(0[.,]\d{2,4})", text, re.IGNORECASE)
    if surplus_m:
        result["surplus_kwh"] = parse_price(surplus_m.group(1))

    log.info(f"Visalia ({url.split('/')[-2]}) → {result}")
    return result


def parse_niba(url: str) -> dict:
    """
    niba.es/luz-y-gas — Tarifa Zen (1P) y Tres (3P).
    """
    html = get_html_requests(url) or get_html_playwright(url)
    if not html:
        return {}

    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)

    result = {}
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.03 < p < 0.15])

    # Retornar todos los precios encontrados, el llamador selecciona
    result["_all_prices"] = prices
    result["_energia"] = energia
    result["_potencia"] = potencia

    log.info(f"Niba → precios raw: {prices}")
    return result


def _niba_zen(url: str) -> dict:
    raw = parse_niba(url)
    e = raw.get("_energia", [])
    p = raw.get("_potencia", [])
    result = {}
    if e:
        result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = e[0]
    if p:
        result["p1_kw_day"] = p[0]
        result["p2_kw_day"] = p[1] if len(p) > 1 else p[0]
    return result


def _niba_tres(url: str) -> dict:
    raw = parse_niba(url)
    e = raw.get("_energia", [])
    p = raw.get("_potencia", [])
    result = {}
    if len(e) >= 3:
        result["e1_kwh"] = e[-1]
        result["e2_kwh"] = e[-2]
        result["e3_kwh"] = e[-3]
    elif e:
        result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = e[0]
    if p:
        result["p1_kw_day"] = p[0]
        result["p2_kw_day"] = p[1] if len(p) > 1 else p[0]
    return result


def parse_esluz(url: str) -> dict:
    """esluz.es — tarifa solar 2.0 (3 periodos)."""
    html = get_html_requests(url) or get_html_playwright(url)
    if not html:
        return {}

    s = soup(html)
    # Buscar tabla de precios
    tables = s.find_all("table")
    prices_text = ""
    for t in tables:
        prices_text += t.get_text(" ")

    if not prices_text:
        prices_text = s.get_text(" ", strip=True)

    prices = find_prices_in_text(prices_text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.001 < p < 0.15])

    result = {}
    if len(energia) >= 3:
        result["e1_kwh"] = energia[-1]
        result["e2_kwh"] = energia[-2]
        result["e3_kwh"] = energia[-3]

    if len(potencia) >= 2:
        result["p1_kw_day"] = potencia[-1]
        result["p2_kw_day"] = potencia[0]

    surplus_m = re.search(r"excedente[s]?\D{0,20}(0[.,]\d{2,4})", prices_text, re.IGNORECASE)
    if surplus_m:
        result["surplus_kwh"] = parse_price(surplus_m.group(1))

    log.info(f"Esluz → {result}")
    return result


def parse_imagina(url: str) -> dict:
    """ofertas.imaginaenergia.com — landing con precios."""
    html = get_html_playwright(url, wait_seconds=5)
    if not html:
        html = get_html_requests(url)
    if not html:
        return {}

    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.03 < p < 0.15])

    result = {}
    if energia:
        result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]
    if potencia:
        result["p1_kw_day"] = potencia[-1]
        result["p2_kw_day"] = potencia[0]

    log.info(f"Imagina → {result}")
    return result


def parse_nufri(url: str) -> dict:
    """energianufri.com — varias tarifas en misma página."""
    html = get_html_playwright(url, wait_seconds=5) or get_html_requests(url)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    log.info(f"Nufri raw prices: {prices}")
    return {"_all": prices}


def parse_energyavm(url: str) -> dict:
    """energyavm.es — tarifa fija."""
    html = get_html_playwright(url, wait_seconds=4) or get_html_requests(url)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.001 < p < 0.15])

    result = {}
    is_3p = "3-periodos" in url or "tres" in url.lower()
    if is_3p:
        if len(energia) >= 3:
            result["e1_kwh"] = energia[-1]
            result["e2_kwh"] = energia[-2]
            result["e3_kwh"] = energia[-3]
    else:
        if energia:
            result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]

    if len(potencia) >= 2:
        result["p1_kw_day"] = potencia[-1]
        result["p2_kw_day"] = potencia[0]

    log.info(f"EnergyaVM ({url.split('/')[-2]}) → {result}")
    return result


def parse_totalenergies(url: str) -> dict:
    """totalenergies.es — precios en página."""
    html = get_html_playwright(url, wait_seconds=5) or get_html_requests(url)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.03 < p < 0.15])

    result = {}
    is_3p = "ahorro" in url.lower()
    if is_3p and len(energia) >= 3:
        result["e1_kwh"] = energia[-1]
        result["e2_kwh"] = energia[-2]
        result["e3_kwh"] = energia[-3]
    elif energia:
        result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]

    if len(potencia) >= 2:
        result["p1_kw_day"] = potencia[-1]
        result["p2_kw_day"] = potencia[0]

    log.info(f"TotalEnergies → {result}")
    return result


def parse_iberdrola(url: str) -> dict:
    """iberdrola.es — requiere JS obligatorio."""
    html = get_html_playwright(url, wait_selector=".precio, .tarifa, [class*='price']",
                               wait_seconds=6)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.03 < p < 0.2])

    result = {}
    is_3p = "tres-periodos" in url or "3-periodos" in url
    if is_3p and len(energia) >= 3:
        result["e1_kwh"] = energia[-1]
        result["e2_kwh"] = energia[-2]
        result["e3_kwh"] = energia[-3]
    elif energia:
        result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]

    if len(potencia) >= 2:
        result["p1_kw_day"] = potencia[-1]
        result["p2_kw_day"] = potencia[0]

    surplus_m = re.search(r"excedente[s]?\D{0,20}(0[.,]\d{2,4})", text, re.IGNORECASE)
    if surplus_m:
        result["surplus_kwh"] = parse_price(surplus_m.group(1))

    log.info(f"Iberdrola → {result}")
    return result


def parse_endesa(url: str) -> dict:
    """endesa.com — requiere JS."""
    html = get_html_playwright(url, wait_seconds=6)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.03 < p < 0.15])

    result = {}
    is_3p = "3periodos" in url or "3-periodos" in url
    if is_3p and len(energia) >= 3:
        result["e1_kwh"] = energia[-1]
        result["e2_kwh"] = energia[-2]
        result["e3_kwh"] = energia[-3]
    elif energia:
        result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]

    if potencia:
        result["p1_kw_day"] = result["p2_kw_day"] = potencia[0]

    log.info(f"Endesa → {result}")
    return result


def parse_naturgy(url: str) -> dict:
    """naturgy.es — requiere JS."""
    html = get_html_playwright(url, wait_seconds=6)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.03 < p < 0.2])

    result = {}
    if len(energia) >= 3:
        result["e1_kwh"] = energia[-1]
        result["e2_kwh"] = energia[-2]
        result["e3_kwh"] = energia[-3]

    if len(potencia) >= 2:
        result["p1_kw_day"] = potencia[-1]
        result["p2_kw_day"] = potencia[0]

    surplus_m = re.search(r"excedente[s]?\D{0,20}(0[.,]\d{2,4})", text, re.IGNORECASE)
    if surplus_m:
        result["surplus_kwh"] = parse_price(surplus_m.group(1))

    log.info(f"Naturgy → {result}")
    return result


def parse_repsol(url: str) -> dict:
    """repsol.es — requiere JS."""
    html = get_html_playwright(url, wait_seconds=7)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    energia = sorted([p for p in prices if 0.05 < p < 0.5])
    potencia = sorted([p for p in prices if 0.03 < p < 0.2])

    result = {}
    if energia:
        result["e1_kwh"] = result["e2_kwh"] = result["e3_kwh"] = energia[0]
    if len(potencia) >= 2:
        result["p1_kw_day"] = potencia[-1]
        result["p2_kw_day"] = potencia[0]

    surplus_m = re.search(r"excedente[s]?\D{0,30}(0[.,]\d{2,4})", text, re.IGNORECASE)
    if surplus_m:
        result["surplus_kwh"] = parse_price(surplus_m.group(1))

    log.info(f"Repsol → {result}")
    return result


def parse_neolux(url: str) -> dict:
    """neoluxenergy.com — varias tarifas en misma página."""
    html = get_html_playwright(url, wait_seconds=5) or get_html_requests(url)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    log.info(f"Neolux raw prices: {prices}")
    return {"_all": prices}


def parse_cnmc(url: str) -> dict:
    """PVPC regulado - CNMC. Precios aproximados (varían hora a hora)."""
    # Los precios PVPC varían cada hora, aquí sacamos las potencias fijas
    html = get_html_playwright(url, wait_seconds=6) or get_html_requests(url)
    if not html:
        return {}
    s = soup(html)
    text = s.get_text(" ", strip=True)
    prices = find_prices_in_text(text)
    log.info(f"CNMC raw prices: {prices}")
    # El PVPC no tiene precio fijo de energía, mantener valores actuales
    return {}


# ─── MAPA COMERCIALIZADORA → PARSER ──────────────────────────────────────────

def get_scraper(company: str, name: str, url: str):
    """
    Retorna la función de scraping y la URL correspondiente.
    Algunas comercializadoras comparten URL entre tarifas.
    """
    c = company.lower()
    n = name.lower()

    if "octopus" in c:
        return lambda: parse_octopus(url)

    if "visalia" in c:
        return lambda: parse_visalia(url)

    if "niba" in c:
        if "zen" in n:
            return lambda: _niba_zen(url)
        else:
            return lambda: _niba_tres(url)

    if "esluz" in c:
        return lambda: parse_esluz(url)

    if "imagina" in c:
        return lambda: parse_imagina(url)

    if "nufri" in c:
        return lambda: parse_nufri(url)

    if "energya" in c:
        return lambda: parse_energyavm(url)

    if "total" in c:
        return lambda: parse_totalenergies(url)

    if "iberdrola" in c:
        return lambda: parse_iberdrola(url)

    if "endesa" in c:
        return lambda: parse_endesa(url)

    if "naturgy" in c:
        return lambda: parse_naturgy(url)

    if "repsol" in c:
        return lambda: parse_repsol(url)

    if "neolux" in c:
        return lambda: parse_neolux(url)

    if "referencia" in c or "cnmc" in c or "pvpc" in url.lower():
        return lambda: parse_cnmc(url)

    return None


# ─── APLICAR IMPUESTOS ────────────────────────────────────────────────────────

IVA_ELECTRICA = 0.10   # IVA reducido electricidad España 2024-2026

def apply_taxes(record: dict, scraped: dict) -> dict:
    """Recalcula precios con impuestos a partir de scraped."""
    campos_energia  = ["e1_kwh", "e2_kwh", "e3_kwh"]
    campos_potencia = ["p1_kw_day", "p2_kw_day"]

    for campo in campos_energia + campos_potencia:
        if campo in scraped:
            base = scraped[campo]
            with_tax = round(base * (1 + IVA_ELECTRICA), 6)
            record[campo] = base
            record[campo + "_with_taxes"] = with_tax

    return record


# ─── MOTOR PRINCIPAL ──────────────────────────────────────────────────────────

def update_tariff(record: dict, only: list[str] = None) -> tuple[dict, bool, str]:
    """
    Intenta actualizar una tarifa.
    Retorna (record_actualizado, cambio_detectado, mensaje).
    """
    company = record["company"]
    name    = record["name"]
    url     = record["url"]

    if only and not any(o.lower() in company.lower() for o in only):
        return record, False, "SKIP"

    log.info(f"--- Scrapeando: {company} - {name}")
    scraper_fn = get_scraper(company, name, url)

    if scraper_fn is None:
        return record, False, "SIN_PARSER"

    try:
        scraped = scraper_fn()
    except Exception as e:
        log.error(f"└── ERROR en {company}/{name}: {e}")
        return record, False, f"ERROR: {e}"

    if not scraped or all(k.startswith("_") for k in scraped):
        log.warning(f"--- Sin precios extraidos para {company}/{name}")
        return record, False, "SIN_PRECIOS"

    # Detectar cambios
    old = deepcopy(record)
    new = apply_taxes(deepcopy(record), scraped)

    if "surplus_kwh" in scraped:
        new["surplus_kwh"] = scraped["surplus_kwh"]

    changed = False
    diffs = []
    campos_check = ["e1_kwh", "e2_kwh", "e3_kwh", "p1_kw_day", "p2_kw_day", "surplus_kwh"]
    for campo in campos_check:
        old_v = old.get(campo, 0)
        new_v = new.get(campo, 0)
        if old_v and new_v and abs(old_v - new_v) > 0.0001:
            pct = (new_v - old_v) / old_v * 100
            diffs.append(f"{campo}: {old_v:.4f}->{new_v:.4f} ({pct:+.1f}%)")
            changed = True

    if changed:
        new["updatedAt"] = str(date.today())
        log.info(f"--- OK ACTUALIZADO: {', '.join(diffs)}")
    else:
        log.info(f"--- Sin cambios")

    return new if changed else old, changed, ", ".join(diffs) if diffs else "OK"


# ─── GUARDAR RESULTADOS ───────────────────────────────────────────────────────

def save_json(data: list[dict], path: str):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    log.info(f"JSON guardado -> {path}")


def save_changelog(changes: list[dict], path: str):
    """Guarda un histórico de cambios en formato JSON Lines."""
    with open(path, "a", encoding="utf-8") as f:
        for c in changes:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    log.info(f"Changelog actualizado -> {path}")


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Scraper de tarifas eléctricas — actualiza data.json"
    )
    parser.add_argument(
        "input", nargs="?", default="data.json",
        help="Archivo JSON de entrada (default: data.json)"
    )
    parser.add_argument(
        "--output", default=None,
        help="Archivo JSON de salida (default: sobreescribe input)"
    )
    parser.add_argument(
        "--only", nargs="+", default=None,
        help="Filtrar solo estas comercializadoras (ej: --only Octopus Niba)"
    )
    parser.add_argument(
        "--changelog", default="changelog_tarifas.jsonl",
        help="Archivo donde guardar historial de cambios"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Solo muestra cambios sin guardar"
    )
    args = parser.parse_args()

    output_path = args.output or args.input

    # Cargar datos
    input_path = Path(args.input)
    if not input_path.exists():
        log.error(f"Archivo no encontrado: {args.input}")
        return

    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    log.info(f"📂 Cargadas {len(data)} tarifas de {input_path}")
    log.info(f"🎯 Objetivo: {'todas las comercializadoras' if not args.only else ', '.join(args.only)}")
    print()

    updated_data = []
    changes_log  = []
    total_changed = 0
    total_errors  = 0

    start = datetime.now()

    for i, record in enumerate(data, 1):
        company = record["company"]
        name    = record["name"]
        log.info(f"[{i:02d}/{len(data)}] {company} — {name}")

        new_record, changed, status = update_tariff(record, only=args.only)
        updated_data.append(new_record)

        if changed:
            total_changed += 1
            changes_log.append({
                "timestamp": datetime.now().isoformat(),
                "company": company,
                "name": name,
                "changes": status
            })
        elif "ERROR" in status:
            total_errors += 1

        time.sleep(1.5)  # pausa entre peticiones (respeta servidores)
        print()

    elapsed = (datetime.now() - start).seconds

    # Guardar
    if not args.dry_run:
        save_json(updated_data, output_path)
        if changes_log:
            save_changelog(changes_log, args.changelog)
    else:
        log.info("🔍 DRY-RUN: no se guardaron cambios")

    # Resumen final
    print("\n" + "=" * 60)
    print("  RESUMEN FINAL")
    print("=" * 60)
    print(f"  Tarifas procesadas : {len(data)}")
    print(f"  Tarifas actualizadas: {total_changed}")
    print(f"  Errores/Sin datos  : {total_errors}")
    print(f"  Tiempo total       : {elapsed}s")
    if changes_log:
        print("\n  CAMBIOS DETECTADOS:")
        for c in changes_log:
            print(f"    - {c['company']:20} {c['name']:30} {c['changes']}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
