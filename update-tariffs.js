const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ruta relativa desde la raíz del proyecto
const DATA_PATH = path.join(__dirname, 'src', 'lib', 'data.json');

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    process.stdout.write('\x1Bc'); // Limpiar consola
    console.log("====================================================");
    console.log("   INICIANDO ASISTENTE DE ACTUALIZACION MANUAL");
    console.log("====================================================");
    console.log("");
    console.log("Este asistente abrirá las webs una a una por ti.");
    console.log("Solo tienes que copiar los precios que veas en la web.");
    console.log("Presiona ENTER para mantener el valor actual o escribe el nuevo.");
    console.log("----------------------------------------------------");

    if (!fs.existsSync(DATA_PATH)) {
        console.error("Error: No se encuentra data.json en " + DATA_PATH);
        rl.close();
        return;
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch (e) {
        console.error("Error al leer data.json:", e.message);
        rl.close();
        return;
    }

    for (let i = 0; i < data.length; i++) {
        const tariff = data[i];
        console.log(`\n\x1b[36m[${i + 1}/${data.length}]\x1b[0m \x1b[1m${tariff.company} - ${tariff.name}\x1b[0m`);
        console.log(`\x1b[90mTipo: ${tariff.type} | URL: ${tariff.url}\x1b[0m`);
        
        // Abrir la URL en el navegador por defecto
        try {
            const parsedUrl = new URL(tariff.url);
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
                const escapedUrl = parsedUrl.href.replace(/"/g, '\\"');
                exec(`start "" "${escapedUrl}"`);
            } else {
                console.warn(`URL inválida o no soportada: ${tariff.url}`);
            }
        } catch (e) {
            console.warn("No se pudo abrir la URL automáticamente.");
        }
        
        let changed = false;
        
        console.log(`\n  --- BLOQUE 1: PRECIOS BASE (SIN IVA) ---`);
        const p1 = await ask(`  Potencia Punta P1  [${tariff.p1_kw_day}]: `);
        if (p1.trim()) { tariff.p1_kw_day = parseFloat(p1.replace(',', '.')); changed = true; }

        const p2 = await ask(`  Potencia Valle P2  [${tariff.p2_kw_day}]: `);
        if (p2.trim()) { tariff.p2_kw_day = parseFloat(p2.replace(',', '.')); changed = true; }

        const e1 = await ask(`  Energía Punta   E1 [${tariff.e1_kwh}]: `);
        if (e1.trim()) { tariff.e1_kwh = parseFloat(e1.replace(',', '.')); changed = true; }

        const e2 = await ask(`  Energía Llano   E2 [${tariff.e2_kwh}]: `);
        if (e2.trim()) { tariff.e2_kwh = parseFloat(e2.replace(',', '.')); changed = true; }

        const e3 = await ask(`  Energía Valle   E3 [${tariff.e3_kwh}]: `);
        if (e3.trim()) { tariff.e3_kwh = parseFloat(e3.replace(',', '.')); changed = true; }

        const surplus = await ask(`  Excedentes      EX [${tariff.surplus_kwh || 0}]: `);
        if (surplus.trim()) { tariff.surplus_kwh = parseFloat(surplus.replace(',', '.')); changed = true; }

        console.log(`\n  --- BLOQUE 2: PRECIOS FINALES (CON IVA) ---`);
        const p1_tax = await ask(`  Potencia P1 IVA    [${tariff.p1_kw_day_with_taxes || 0}]: `);
        if (p1_tax.trim()) { tariff.p1_kw_day_with_taxes = parseFloat(p1_tax.replace(',', '.')); changed = true; }

        const p2_tax = await ask(`  Potencia P2 IVA    [${tariff.p2_kw_day_with_taxes || 0}]: `);
        if (p2_tax.trim()) { tariff.p2_kw_day_with_taxes = parseFloat(p2_tax.replace(',', '.')); changed = true; }

        const e1_tax = await ask(`  Energía  E1 IVA    [${tariff.e1_kwh_with_taxes || 0}]: `);
        if (e1_tax.trim()) { tariff.e1_kwh_with_taxes = parseFloat(e1_tax.replace(',', '.')); changed = true; }

        const e2_tax = await ask(`  Energía  E2 IVA    [${tariff.e2_kwh_with_taxes || 0}]: `);
        if (e2_tax.trim()) { tariff.e2_kwh_with_taxes = parseFloat(e2_tax.replace(',', '.')); changed = true; }

        const e3_tax = await ask(`  Energía  E3 IVA    [${tariff.e3_kwh_with_taxes || 0}]: `);
        if (e3_tax.trim()) { tariff.e3_kwh_with_taxes = parseFloat(e3_tax.replace(',', '.')); changed = true; }

        if (changed) {
            tariff.updatedAt = new Date().toISOString().split('T')[0];
        }

        // Guardar progreso tras cada tarifa por seguridad
        try {
            fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
            console.log("  \x1b[32m✓ Progreso guardado" + (changed ? " (Fecha act.)" : "") + "\x1b[0m");
        } catch (e) {
            console.error("  \x1b[31m✗ Error al guardar:\x1b[0m", e.message);
        }
    }

    console.log("\n\x1b[32m====================================================");
    console.log("   ACTUALIZACION COMPLETADA CON EXITO");
    console.log("====================================================\x1b[0m");
    console.log("Presiona cualquier tecla para salir...");
    rl.close();
}

main();
