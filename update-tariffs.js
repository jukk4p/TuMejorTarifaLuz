
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

const DATA_PATH = path.join(__dirname, 'src', 'lib', 'data.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log("====================================================");
    console.log("   ASISTENTE DE ACTUALIZACIÓN MANUAL DE TARIFAS");
    console.log("====================================================");
    console.log("Instrucciones:");
    console.log("- Se abrirá la web de la tarifa automáticamente.");
    console.log("- Introduce el nuevo valor (SIN IVA) o pulsa ENTER para mantener.");
    console.log("====================================================\n");

    if (!fs.existsSync(DATA_PATH)) {
        console.error("No se encontró el archivo data.json");
        process.exit(1);
    }

    const tariffs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const updatedTariffs = [];

    for (let i = 0; i < tariffs.length; i++) {
        const t = tariffs[i];
        const updated = { ...t };

        console.log(`\n\x1b[36m[${i + 1}/${tariffs.length}] COMPAÑÍA: ${t.company}\x1b[0m`);

        // 1. Abrir la URL en el navegador
        console.log(`> Abriendo: ${t.url}`);
        exec(`start "" "${t.url}"`);

        // 2. Preguntar por Nombre y URL
        const newName = await question(`   Nombre Tarifa [Actual: ${t.name}]: `);
        if (newName.trim() !== "") updated.name = newName.trim();

        const newUrl = await question(`   URL Contratación [Actual: ${t.url}]: `);
        if (newUrl.trim() !== "") updated.url = newUrl.trim();

        const is3P = t.type === '3 Periodos';

        // 3. Función para preguntar por campos de precio
        const askField = async (key, label, unit) => {
            const current = t[key] || 0;
            const res = await question(`   ${label} [Actual: ${current} ${unit}]: `);
            if (res.trim() !== "") {
                updated[key] = parseFloat(res.replace(',', '.'));
            }
        };

        // 4. Preguntas de Precios (SOLO SIN IVA)
        await askField('p1_kw_day', 'Potencia Punta (P1) €/kW/día', 'SIN IVA');
        await askField('p2_kw_day', 'Potencia Valle (P2) €/kW/día', 'SIN IVA');

        await askField('e1_kwh', is3P ? 'Energía Punta (P1) €/kWh' : 'Energía (24h) €/kWh', 'SIN IVA');

        if (is3P) {
            await askField('e2_kwh', 'Energía Llano (P2) €/kWh', 'SIN IVA');
            await askField('e3_kwh', 'Energía Valle (P3) €/kWh', 'SIN IVA');
        } else {
            updated.e2_kwh = updated.e1_kwh;
            updated.e3_kwh = updated.e1_kwh;
        }

        updatedTariffs.push(updated);

        // Guardar progresivamente para no perder datos
        fs.writeFileSync(DATA_PATH, JSON.stringify(updatedTariffs.concat(tariffs.slice(i + 1)), null, 2));

        const next = await question('\n¿Siguiente tarifa? (ENTER para continuar, "q" para salir): ');
        if (next.toLowerCase() === 'q') break;
    }

    console.log("\n✅ Proceso finalizado. Cambios guardados en data.json");
    process.exit(0);
}

main();
