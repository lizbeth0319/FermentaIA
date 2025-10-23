const fs = require('fs');
const path = require('path');
const axios = require('../backend/node_modules/axios');

const N8N_BASE_URL = 'http://localhost:5678';

async function importFlow(flowPath, flowName) {
    try {
        console.log(`Importando flujo: ${flowName}`);
        
        // Leer el archivo JSON del flujo
        const flowData = JSON.parse(fs.readFileSync(flowPath, 'utf8'));
        
        // Importar el flujo a n8n
        const response = await axios.post(`${N8N_BASE_URL}/api/v1/workflows/import`, {
            workflow: flowData
        });
        
        console.log(`✅ Flujo "${flowName}" importado exitosamente`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error importando flujo "${flowName}":`, error.message);
        return null;
    }
}

async function importAllFlows() {
    console.log('🚀 Iniciando importación de flujos...\n');
    
    const flowsDir = path.join(__dirname, 'flows');
    const flows = [
        { file: 'chat de ayuda.json', name: 'Chat de Ayuda' },
        { file: 'Recomendaciones.json', name: 'Recomendaciones' }
    ];
    
    for (const flow of flows) {
        const flowPath = path.join(flowsDir, flow.file);
        if (fs.existsSync(flowPath)) {
            await importFlow(flowPath, flow.name);
        } else {
            console.log(`⚠️  Archivo no encontrado: ${flow.file}`);
        }
    }
    
    console.log('\n✨ Importación completada');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    importAllFlows().catch(console.error);
}

module.exports = { importFlow, importAllFlows };