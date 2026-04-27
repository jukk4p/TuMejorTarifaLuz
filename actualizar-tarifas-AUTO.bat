@echo off
TITLE Scraper Pro - Actualizacion Automatica de Tarifas
SETLOCAL EnableDelayedExpansion

echo ====================================================
echo    SCRAPER PRO — ACTUALIZACION AUTOMATICA
echo ====================================================
echo.

:: 1. Verificar si Python existe
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No se encontro Python en el sistema.
    echo Por favor, instala Python y asegurate de agregarlo al PATH.
    pause
    exit /b
)

:: 2. Definir rutas
set "SCRIPTPATH=Scraper\scraper_tarifas_web.py"
set "DATAPATH=src\lib\data.json"

set "OUTPATH=src\lib\data_NUEVO.json"

:: 3. Ejecutar Scraper
echo [*] Iniciando el robot de scraping...
echo [*] Esto puede tardar unos minutos si usa Playwright...
echo.

python "%SCRIPTPATH%" "%DATAPATH%" --output "%OUTPATH%"

if %errorlevel% neq 0 (
    echo.
    echo [!] Hubo un problema al ejecutar el scraper.
    echo [!] Asegurate de haber instalado las dependencias:
    echo     pip install requests beautifulsoup4 playwright lxml
    echo     playwright install chromium
) else (
    echo.
    echo [OK] Proceso terminado correctamente.
    echo [OK] Los precios en %DATAPATH% han sido actualizados.
)

echo.
echo ====================================================
echo Presiona cualquier tecla para salir...
pause >nul
