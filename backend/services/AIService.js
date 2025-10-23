import axios from 'axios';
import aiConfig from '../config/ai.config.js';

class AIService {
  constructor() {
    // Configuración para n8n webhooks
    this.n8nEndpoints = aiConfig.flowEndpoints;
    
    // Configuración para OpenAI (fallback)
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiBaseUrl = 'https://api.openai.com/v1';
    
    // Configuración para AWS Bedrock (si se necesita en el futuro)
    this.awsRegion = process.env.AWS_REGION || 'us-east-1';
    
    // Memoria simple para el chat (en producción usar Redis o base de datos)
    this.chatMemory = new Map();
    this.maxMemoryMessages = 20;
  }

  async processChatRequest(input, sessionId = 'default') {
    try {
      // Intentar usar n8n webhook primero
      try {
        const response = await axios.post(this.n8nEndpoints.chat, {
          chatInput: input,
          sessionId: sessionId
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 segundos timeout para IA
        });

        if (response.data && (response.data.output || response.data.response)) {
          const aiResponse = response.data.output || response.data.response;
          // Actualizar historial de chat
          this.updateChatHistory(sessionId, input, aiResponse);
          return { response: aiResponse };
        }
      } catch (n8nError) {
        console.log('n8n webhook no disponible, usando fallback:', n8nError.message);
      }

      // Fallback: Si n8n no está disponible, usar OpenAI directamente
      if (!this.openaiApiKey || this.openaiApiKey === 'sk-your-openai-api-key-here') {
        return { 
          response: "Hola, soy tu asistente de FermentaIA. Actualmente estoy en modo offline, pero puedo ayudarte con información básica sobre fermentación de café. ¿En qué puedo ayudarte?" 
        };
      }

      // Sistema de prompt del agente de ayuda
      const systemPrompt = `Eres un asistente de FermentaIA. Tu tarea es ayudar a los caficultores de manera directa, precisa y relevante, sin inventar datos ni dar respuestas fuera de contexto.

Tono y estilo:
- Responde de manera breve y directa, sin detalles innecesarios.
- Evita cualquier tipo de invención de datos. Solo proporciona lo que el usuario ha solicitado o lo que está relacionado con su pregunta.

Altitud:
Si el usuario pregunta por la altitud de su finca o vereda, responde solo si es posible obtener esa información. Si no tienes acceso a los datos, responde directamente con una solicitud para verificar la dirección.
Ejemplo: "Lo siento, no pude obtener la altitud. ¿Puedes verificar la dirección de tu finca?"

CIIU:
Si el usuario menciona su actividad económica, consulta el código CIIU correspondiente, pero solo si esa información es proporcionada por el usuario. No inventes códigos ni detalles.
Ejemplo: "El código CIIU para cultivar café es 01110."

Registrar finca, lote o medición:
Si el usuario menciona que quiere registrar su finca, responde pidiendo directamente los datos necesarios, como nombre de la finca, actividad económica, etc.
Ejemplo: "Claro, para registrar tu finca necesito el nombre, la actividad económica y el NIT. ¿Puedes proporcionarlos?"

Evitar invención de información:
- No inventes datos que el usuario no ha solicitado. Si no tienes información relevante, sé directo y pide lo necesario.
- Evita respuestas largas o detalles que no son relevantes para lo que el usuario pide.

Sin conexión a internet:
Recordar que FermentaIA funciona en modo offline. Los datos se guardan localmente y se sincronizan cuando haya acceso a internet.`;

      // Obtener historial de conversación
      const messages = this.getChatHistory(sessionId);
      
      // Agregar mensaje del usuario
      messages.push({ role: 'user', content: input });

      // Llamada a OpenAI
      const response = await axios.post(`${this.openaiBaseUrl}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse = response.data.choices[0].message.content;
      
      // Guardar en memoria
      this.updateChatHistory(sessionId, input, aiResponse);

      return { message: aiResponse };
    } catch (error) {
      console.error('Error en chat IA:', error);
      
      // Fallback a respuesta básica
      return { 
        response: "Lo siento, hay un problema temporal con el servicio de IA. Por favor, intenta de nuevo en unos momentos." 
      };
    }
  }

  async processRecomendacion(medicionData) {
    try {
      // Intentar usar n8n webhook primero
      try {
        const response = await axios.post(this.n8nEndpoints.recomendacion, {
          lote: {
            variedad: medicionData.lote?.variedad || 'no especificada',
            proceso: medicionData.lote?.proceso || 'no especificado',
            estado: medicionData.lote?.estado || 'no especificado'
          },
          medicion: {
            ph: medicionData.medicion?.ph || 'no medido',
            temperatura_c: medicionData.medicion?.temperatura_c || 'no medida',
            timestamp: medicionData.medicion?.timestamp || 'no registrada'
          },
          tanque: {
            material: medicionData.tanque?.material || 'no especificado'
          }
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 segundos timeout para IA
        });

        if (response.data && (response.data.output || response.data.recomendacion)) {
          const recomendacion = response.data.output || response.data.recomendacion;
          return { recomendacion };
        }
      } catch (n8nError) {
        console.log('n8n webhook no disponible, usando fallback:', n8nError.message);
      }

      // Fallback: Si n8n no está disponible, usar OpenAI directamente
      if (!this.openaiApiKey || this.openaiApiKey === 'sk-your-openai-api-key-here') {
        return { 
          recomendacion: "El proceso va por buen camino, sigue vigilando de vez en cuando y mantén las condiciones estables." 
        };
      }

      // Prompt específico para recomendaciones
      const prompt = `Eres un experto en fermentación de café artesanal que conoce los perfiles ideales de fermentación para distintas variedades, procesos y fases.

Recibirás los siguientes datos:
- Del lote: la variedad ${medicionData.lote?.variedad || 'no especificada'}, el proceso ${medicionData.lote?.proceso || 'no especificado'} y el estado en el que se encuentra ${medicionData.lote?.estado || 'no especificado'}.
- De la medición: pH ${medicionData.medicion?.ph || 'no medido'}, temperatura ${medicionData.medicion?.temperatura_c || 'no medida'}°C, material del tanque ${medicionData.tanque?.material || 'no especificado'} y hora de la medición ${medicionData.medicion?.timestamp || 'no registrada'}.

Tu tarea es comparar los valores medidos con los ideales del perfil correspondiente, y generar un consejo breve y amigable sobre cómo ajustar las condiciones o continuar el proceso.

Reglas:
- Habla siempre en tono cálido y natural, como un amigo que da consejos prácticos ("la temperatura está algo alta, puedes mover el tanque a un sitio más fresco").
- No menciones valores numéricos, porcentajes ni términos técnicos.
- Si los valores están dentro del rango ideal, felicita o motiva con algo positivo ("va muy bien, sigue cuidando el ambiente y el tiempo de fermentación").
- Si los valores están por encima o debajo de lo ideal, sugiere una acción sencilla para equilibrarlos.
- Puedes tener en cuenta el material del tanque (por ejemplo, el plástico retiene más calor, el acero se enfría rápido).
- Da una sola recomendación corta, de máximo dos frases, siempre en español.

No uses listas ni lenguaje técnico. Solo devuelve el consejo final.`;

      const response = await axios.post(`${this.openaiBaseUrl}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.8
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const recomendacion = response.data.choices[0].message.content;
      
      return { recomendacion };
    } catch (error) {
      console.error('Error en recomendación IA:', error);
      
      // Respuesta de fallback
      return { 
        recomendacion: "El proceso va por buen camino, sigue vigilando de vez en cuando y mantén las condiciones estables." 
      };
    }
  }

  // Métodos para manejo de memoria de chat
  getChatHistory(sessionId) {
    if (!this.chatMemory.has(sessionId)) {
      this.chatMemory.set(sessionId, []);
    }
    return this.chatMemory.get(sessionId);
  }

  updateChatHistory(sessionId, userMessage, aiResponse) {
    const messages = this.getChatHistory(sessionId);
    
    // Agregar nuevos mensajes
    messages.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );

    // Mantener solo los últimos N mensajes
    if (messages.length > this.maxMemoryMessages) {
      messages.splice(0, messages.length - this.maxMemoryMessages);
    }

    this.chatMemory.set(sessionId, messages);
  }
}

export default new AIService();