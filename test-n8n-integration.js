const axios = require('axios');

// Configuración de prueba
const BACKEND_URL = 'http://localhost:3000';
const N8N_RECOMENDACION_URL = 'http://localhost:5678/webhook/consejos_fermentaIA';

console.log('🧪 Iniciando pruebas de integración n8n...\n');

// Prueba 1: Webhook de recomendaciones directamente
async function testRecomendacionWebhook() {
  console.log('📋 Prueba 1: Webhook de recomendaciones (directo)');
  try {
    const testData = {
      lote: {
        variedad: 'Caturra',
        proceso: 'Lavado',
        estado: 'Fermentación'
      },
      medicion: {
        ph: 4.2,
        temperatura_c: 22,
        timestamp: new Date().toISOString()
      },
      tanque: {
        material: 'Plástico'
      }
    };

    const response = await axios.post(N8N_RECOMENDACION_URL, testData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });

    console.log('✅ Respuesta del webhook:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Error en webhook directo:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
    return false;
  }
}

// Prueba 2: Endpoint del backend para recomendaciones
async function testBackendRecomendacion() {
  console.log('\n📋 Prueba 2: Backend - endpoint de recomendaciones');
  try {
    const testData = {
      lote: {
        variedad: 'Caturra',
        proceso: 'Lavado',
        estado: 'Fermentación'
      },
      medicion: {
        ph: 4.2,
        temperatura_c: 22,
        timestamp: new Date().toISOString()
      },
      tanque: {
        material: 'Plástico'
      }
    };

    const response = await axios.post(`${BACKEND_URL}/api/ai/recomendacion`, testData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });

    console.log('✅ Respuesta del backend:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Error en backend:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
    return false;
  }
}

// Prueba 3: Endpoint del backend para chat
async function testBackendChat() {
  console.log('\n💬 Prueba 3: Backend - endpoint de chat');
  try {
    const response = await axios.post(`${BACKEND_URL}/api/ai/chat`, {
      message: 'Hola, quiero registrar mi finca'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });

    console.log('✅ Respuesta del chat:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Error en chat:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
    return false;
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  const results = [];
  
  results.push(await testRecomendacionWebhook());
  results.push(await testBackendRecomendacion());
  results.push(await testBackendChat());
  
  console.log('\n📊 Resumen de pruebas:');
  console.log(`✅ Exitosas: ${results.filter(r => r).length}`);
  console.log(`❌ Fallidas: ${results.filter(r => !r).length}`);
  
  if (results.every(r => r)) {
    console.log('\n🎉 ¡Todas las pruebas pasaron! La integración n8n está funcionando correctamente.');
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisa la configuración de n8n y las credenciales.');
  }
}

runAllTests().catch(console.error);