@echo off
TITLE Asistente Manual de Tarifas - TuMejorTarifaLuz
echo ====================================================
echo    INICIANDO ASISTENTE DE ACTUALIZACION MANUAL
echo ====================================================
echo.
echo Este asistente abrira las webs una a una por ti.
echo Solo tienes que copiar los precios que veas en la web.
echo.
cd %~dp0
node update-tariffs.js
pause
