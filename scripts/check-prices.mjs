import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;
const DATA_PATH = 'src/lib/data.json';

if (!WEBHOOK_URL) {
  console.error('❌ Error: MAKE_WEBHOOK_URL no está configurada.');
  process.exit(0); // Salimos sin error para no romper la build de GH Actions
}

function getPreviousData() {
  try {
    const data = execSync(`git show HEAD^:${DATA_PATH}`).toString();
    return JSON.parse(data);
  } catch (e) {
    console.log('⚠️ No se pudo obtener la versión anterior de data.json. Es posible que sea el primer commit o el archivo sea nuevo.');
    return [];
  }
}

function getCurrentData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf8'));
}

async function notify() {
  const oldData = getPreviousData();
  const newData = getCurrentData();

  let updates = [];

  newData.forEach(newTariff => {
    const oldTariff = oldData.find(t => t.company === newTariff.company && t.name === newTariff.name);

    if (oldTariff) {
      // Comparar precio de energía principal (e1_kwh_with_taxes)
      // Usamos el precio con impuestos porque es el que le importa al usuario
      const oldPrice = oldTariff.e1_kwh_with_taxes || oldTariff.e1_kwh;
      const newPrice = newTariff.e1_kwh_with_taxes || newTariff.e1_kwh;

      if (newPrice < oldPrice && newPrice > 0) {
        const ahorro = (((oldPrice - newPrice) / oldPrice) * 100).toFixed(0);
        updates.push(`📉 ¡BAJADA DE PRECIO! ${newTariff.company} (${newTariff.name}) baja un ${ahorro}% hasta los ${newPrice}€/kWh. ⚡`);
      }
    } else {
      // Nueva tarifa
      const price = newTariff.e1_kwh_with_taxes || newTariff.e1_kwh;
      updates.push(`🆕 ¡NUEVA TARIFA! ${newTariff.company} lanza "${newTariff.name}" a ${price}€/kWh. 🚀`);
    }
  });

  if (updates.length > 0) {
    const header = `📢 ¡ACTUALIZACIÓN DE TARIFAS! 📢\n\n`;
    const footer = `\n\n¡Compara ya: https://www.tumejortarifaluz.es/comparador !`;
    
    // Construir el mensaje de forma incremental para no pasarnos de 280
    let message = header;
    let addedCount = 0;
    const MAX_LENGTH = 270; // Margen de seguridad

    for (const update of updates) {
      if ((message + update + footer + "...").length < MAX_LENGTH) {
        message += update + "\n";
        addedCount++;
      } else {
        message += `...y ${updates.length - addedCount} cambios más. ⚡\n`;
        break;
      }
    }
    
    message += footer;
    
    console.log('📤 Enviando notificación a Make (versión optimizada para Twitter)...');
    console.log(`Longitud del mensaje: ${message.length} caracteres.`);
    console.log(message);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          updates, // Enviamos el array completo por si Make quiere procesarlos uno a uno
          count: updates.length,
          timestamp: new Date().toISOString() 
        })
      });
      
      if (response.ok) {
        console.log('✅ Notificación enviada con éxito.');
      } else {
        console.error('❌ Error al enviar a Make:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error en la petición fetch:', error.message);
    }
  } else {
    console.log('✨ No hay cambios significativos en los precios para notificar.');
  }
}

notify();
