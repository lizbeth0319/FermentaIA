import PerfilIdeal from '../models/PerfilIdeal.js';

class AIService {
  constructor() {
    // Memoria simple para el chat (en producción usar Redis o base de datos)
    this.chatMemory = new Map();
    this.maxMemoryMessages = 20;

    // Base de conocimiento simple para preguntas frecuentes del sitio y fermentación
    this.faq = [
      {
        keywords: ['registrar finca', 'registro finca', 'crear finca', 'agregar finca', 'como registro una finca'],
        answer: `Para registrar una finca ve a "Fincas" > "Nueva Finca" y completa nombre, ubicación y productor. Luego podrás crear tanques y lotes vinculados a esa finca.`
      },
      {
        keywords: ['registrar lote', 'registro lote', 'crear lote', 'como registro un lote'],
        answer: `En "Lotes" selecciona el tanque y crea un nuevo lote indicando variedad y proceso (Lavado, Honey, Natural).`
      },
      {
        keywords: ['registrar medicion', 'registro medicion', 'agregar medicion', 'medición', 'como registro una medicion'],
        answer: `Desde "Mediciones" elige el lote, fase (inicio, medio, fin) y registra pH y temperatura con observaciones.`
      },
      {
        keywords: ['ph ideal', 'pH ideal', 'cual es el ph ideal'],
        answer: `En fermentación de café el pH suele bajar con el tiempo. Un rango comúnmente aceptado es entre 3.8 y 4.5 según variedad, proceso y fase.`
      },
      {
        keywords: ['temperatura ideal', 'temperatura fermentacion', 'cual es la temperatura ideal'],
        answer: `La temperatura estable favorece una fermentación pareja. Rango general recomendado 18–25 °C; consulta el perfil ideal de tu variedad y proceso.`
      },
      {
        keywords: ['comparativas', 'rangos ideales', 'perfil ideal', 'donde veo comparativas'],
        answer: `En la página "Comparativas" se muestran los rangos ideales del perfil (pH y °C) versus tus mediciones actuales.`
      },
      {
        keywords: ['ayuda', 'como usar', 'navegar', 'hola'],
        answer: `Usa el menú lateral para acceder a Fincas, Tanques, Lotes y Mediciones. Crea primero la finca, luego tanques, después lotes y por último registra las mediciones.`
      }
    ];
  }

  async processChatRequest(input, sessionId = 'default') {
    try {
      const sanitize = (t) => String(t ?? '')
        .replace(/undefined/gi, '')
        .replace(/\s+\./g, '. ')
        .replace(/\s{2,}/g, ' ')
        .replace(/\bPedo\b/gi, 'Puedo')
        .replace(/\bPra\b/gi, 'Para')
        .trim();
      const normalize = (s) => String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const text = normalize(input);
      const containsAll = (kw) => {
        const normKw = normalize(kw);
        const tokens = normKw.split(' ').filter(Boolean);
        return tokens.every(t => text.includes(t));
      };
      const match = this.faq.find(f => f.keywords.some(containsAll));
      const aiResponse = sanitize(match
        ? match.answer
        : 'Puedo ayudarte con el uso de la página (fincas, lotes, mediciones) y dudas básicas de fermentación (pH y temperatura). ¿Qué necesitas hacer ahora?');

      this.updateChatHistory(sessionId, input, aiResponse);
      return { response: aiResponse };
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
      const variedad = medicionData?.lote?.variedad;
      const proceso = medicionData?.lote?.proceso;
      const fase = medicionData?.lote?.estado || medicionData?.fase;
      const ph = Number(medicionData?.medicion?.ph ?? medicionData?.ph ?? NaN);
      const temperatura = Number(
        medicionData?.medicion?.temperatura_c ?? medicionData?.temperatura_c ?? medicionData?.temperatura ?? NaN
      );

      let consejo = 'El proceso va por buen camino; mantén condiciones estables y mide con regularidad.';

      if (variedad && proceso && fase) {
        const perfil = await PerfilIdeal.findOne({ variedad, proceso, fase });
        const ranges = perfil
          ? { ph_min: perfil.ph_min, ph_max: perfil.ph_max, temp_min_c: perfil.temp_min_c, temp_max_c: perfil.temp_max_c }
          : { ph_min: 3.8, ph_max: 4.5, temp_min_c: 18, temp_max_c: 25 };

        const enRangoPh = !isNaN(ph) && ph >= ranges.ph_min && ph <= ranges.ph_max;
        const enRangoTemp = !isNaN(temperatura) && temperatura >= ranges.temp_min_c && temperatura <= ranges.temp_max_c;

        if (enRangoPh && enRangoTemp) {
          consejo = 'Vas bien, sigue cuidando el ambiente y mantén las mediciones periódicas.';
        } else if (!enRangoTemp && enRangoPh) {
          consejo = 'La temperatura está algo fuera del ideal; ubica el tanque en un sitio más fresco o ventilado para estabilizar.';
        } else if (!enRangoPh && enRangoTemp) {
          consejo = 'El pH se está saliendo del ideal; revisa la ventilación y evita cambios bruscos para que el proceso se equilibre.';
        } else {
          consejo = 'Ajusta el ambiente: busca un lugar más fresco y estable y sigue midiendo; el proceso se irá acomodando.';
        }
      }

      return { recomendacion: consejo };
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
