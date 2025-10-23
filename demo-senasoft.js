/**
 * DEMO SCRIPT PARA CONCURSO SENASOFT 2024
 * FermentaIA - Integración con n8n para Agentes de IA
 * 
 * Este script demuestra la integración completa entre el backend de FermentaIA
 * y los flujos de n8n para proporcionar asistencia de IA en fermentación de café.
 */

const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:3000';
const N8N_URL = 'http://localhost:5678';

// Credenciales de demostración
const DEMO_CREDENTIALS = [
    { email: 'juliana.ramos@gmail.com', password: '123456', name: 'Juliana Ramos' },
    { email: 'mario.velasco@gmail.com', password: '123456', name: 'Mario Velasco' }
];

// Datos de ejemplo para pruebas
const SAMPLE_DATA = {
    chat_messages: [
        "Hola, necesito ayuda con mi proceso de fermentación de café",
        "¿Cuál es la temperatura ideal para fermentar café Geisha?",
        "Mi café tiene un pH de 4.2, ¿está bien?",
        "¿Cómo puedo mejorar la calidad de mi fermentación?"
    ],
    fermentation_data: [
        {
            variedad: "Geisha",
            proceso: "Lavado",
            estado: "inicio",
            ph: 4.5,
            temperatura: 18,
            material_tanque: "Acero inoxidable",
            timestamp: new Date().toISOString()
        },
        {
            variedad: "Caturra",
            proceso: "Natural",
            estado: "medio",
            ph: 4.2,
            temperatura: 22,
            material_tanque: "Plástico grado alimentario",
            timestamp: new Date().toISOString()
        },
        {
            variedad: "Bourbon",
            proceso: "Honey",
            estado: "final",
            ph: 3.8,
            temperatura: 20,
            material_tanque: "Acero inoxidable",
            timestamp: new Date().toISOString()
        }
    ]
};

class FermentaIADemo {
    constructor() {
        this.token = null;
        this.currentUser = null;
    }

    // Función para mostrar mensajes con formato
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
            info: '\x1b[36m',    // Cyan
            success: '\x1b[32m', // Green
            error: '\x1b[31m',   // Red
            warning: '\x1b[33m', // Yellow
            reset: '\x1b[0m'     // Reset
        };
        
        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    // Autenticación
    async authenticate(credentials) {
        try {
            this.log(`🔐 Autenticando usuario: ${credentials.name}`, 'info');
            
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: credentials.email,
                contrasena: credentials.password
            });

            if (response.data.success) {
                this.token = response.data.token;
                this.currentUser = response.data.productor;
                this.log(`✅ Autenticación exitosa para ${this.currentUser.nombre}`, 'success');
                return true;
            }
        } catch (error) {
            this.log(`❌ Error en autenticación: ${error.message}`, 'error');
            return false;
        }
    }

    // Probar endpoint de chat
    async testChatEndpoint(message) {
        try {
            this.log(`💬 Enviando mensaje al chat: "${message}"`, 'info');
            
            const response = await axios.post(`${BASE_URL}/api/ai/chat`, 
                { message }, 
                { headers: { 'x-token': this.token } }
            );

            this.log(`🤖 Respuesta del chat: "${response.data.message}"`, 'success');
            return response.data;
        } catch (error) {
            this.log(`❌ Error en chat: ${error.message}`, 'error');
            return null;
        }
    }

    // Probar endpoint de recomendaciones
    async testRecommendationEndpoint(data) {
        try {
            this.log(`📊 Solicitando recomendación para ${data.variedad} (${data.proceso})`, 'info');
            
            const response = await axios.post(`${BASE_URL}/api/ai/recomendacion`, 
                { 
                    loteId: `demo_${Date.now()}`,
                    medicionData: data
                }, 
                { headers: { 'x-token': this.token } }
            );

            this.log(`🎯 Recomendación: "${response.data.recomendacion}"`, 'success');
            return response.data;
        } catch (error) {
            this.log(`❌ Error en recomendación: ${error.message}`, 'error');
            return null;
        }
    }

    // Probar webhooks de n8n directamente
    async testN8NWebhooks() {
        this.log(`🔗 Probando webhooks de n8n directamente`, 'info');
        
        try {
            // Probar webhook de recomendaciones
            const recomResponse = await axios.post(`${N8N_URL}/webhook/consejos_fermentaIA`, {
                lote: { variedad: "Geisha", proceso: "Lavado" },
                medicion: { ph: 4.5, temperatura: 18, estado: "inicio" },
                tanque: { material: "Acero inoxidable" }
            });

            this.log(`✅ Webhook de recomendaciones funcionando`, 'success');
            this.log(`📝 Respuesta: "${recomResponse.data}"`, 'info');
            
        } catch (error) {
            this.log(`⚠️  Webhook de recomendaciones no disponible: ${error.message}`, 'warning');
        }
    }

    // Verificar estado de servicios
    async checkServices() {
        this.log(`🔍 Verificando estado de servicios`, 'info');
        
        // Verificar backend
        try {
            // Hacer una request POST que sabemos que va a fallar pero confirma que el servidor está funcionando
            await axios.post(`${BASE_URL}/api/auth/login`, {
                email: 'test',
                contrasena: 'test'
            });
        } catch (error) {
            // Si obtenemos un error 400 con validación, significa que el servidor está funcionando
            if (error.response && error.response.status === 400) {
                this.log(`✅ Backend funcionando en ${BASE_URL}`, 'success');
            } else {
                this.log(`❌ Backend no disponible en ${BASE_URL}`, 'error');
                return false;
            }
        }

        // Verificar n8n
        try {
            await axios.get(`${N8N_URL}`);
            this.log(`✅ n8n funcionando en ${N8N_URL}`, 'success');
        } catch (error) {
            this.log(`⚠️  n8n no disponible en ${N8N_URL}`, 'warning');
        }

        return true;
    }

    // Ejecutar demostración completa
    async runDemo() {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 DEMO FERMENTAIA - INTEGRACIÓN N8N PARA SENASOFT 2024');
        console.log('='.repeat(60) + '\n');

        // Verificar servicios
        const servicesOk = await this.checkServices();
        if (!servicesOk) {
            this.log('❌ No se pueden ejecutar las pruebas sin el backend', 'error');
            return;
        }

        // Probar con cada usuario
        for (const credentials of DEMO_CREDENTIALS) {
            console.log('\n' + '-'.repeat(50));
            
            // Autenticar
            const authSuccess = await this.authenticate(credentials);
            if (!authSuccess) continue;

            // Probar chat
            console.log('\n📱 PRUEBAS DE CHAT:');
            for (const message of SAMPLE_DATA.chat_messages.slice(0, 2)) {
                await this.testChatEndpoint(message);
                await this.sleep(1000); // Pausa entre requests
            }

            // Probar recomendaciones
            console.log('\n🧪 PRUEBAS DE RECOMENDACIONES:');
            for (const data of SAMPLE_DATA.fermentation_data.slice(0, 2)) {
                await this.testRecommendationEndpoint(data);
                await this.sleep(1000); // Pausa entre requests
            }

            break; // Solo usar el primer usuario para la demo
        }

        // Probar webhooks directamente
        console.log('\n🔗 PRUEBAS DIRECTAS DE N8N:');
        await this.testN8NWebhooks();

        console.log('\n' + '='.repeat(60));
        console.log('✅ DEMO COMPLETADA - FERMENTAIA LISTO PARA SENASOFT 2024');
        console.log('='.repeat(60) + '\n');

        // Resumen de funcionalidades
        this.showSummary();
    }

    // Mostrar resumen de funcionalidades
    showSummary() {
        console.log('📋 FUNCIONALIDADES DEMOSTRADAS:\n');
        console.log('🔐 Autenticación JWT con usuarios de prueba');
        console.log('💬 Chat de ayuda con IA especializada en fermentación');
        console.log('🎯 Recomendaciones personalizadas basadas en datos de fermentación');
        console.log('🔗 Integración completa con n8n para flujos de IA');
        console.log('⚡ Fallback automático a OpenAI si n8n no está disponible');
        console.log('📊 Procesamiento de datos de pH, temperatura y variedades de café');
        console.log('🛡️  Middleware de seguridad y validación de tokens');
        console.log('\n🏆 TECNOLOGÍAS UTILIZADAS:');
        console.log('• Node.js + Express (Backend)');
        console.log('• n8n (Automatización y flujos de IA)');
        console.log('• JWT (Autenticación)');
        console.log('• MongoDB (Base de datos)');
        console.log('• OpenAI API (Fallback de IA)');
        console.log('• Axios (Cliente HTTP)');
    }

    // Función auxiliar para pausas
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Ejecutar demo si se llama directamente
if (require.main === module) {
    const demo = new FermentaIADemo();
    demo.runDemo().catch(console.error);
}

module.exports = FermentaIADemo;