import axios from 'axios';
import config from '../config/ai.config.js';

class AIService {
  constructor() {
    this.chatEndpoint = config.flowEndpoints.chat;
    this.recomendacionEndpoint = config.flowEndpoints.recomendacion;
  }

  async processChatRequest(input) {
    try {
      const response = await axios.post(this.chatEndpoint, {
        message: input
      });
      return response.data;
    } catch (error) {
      console.error('Error en chat IA:', error);
      throw new Error('Error al procesar la solicitud de chat');
    }
  }

  async processRecomendacion(medicionData) {
    try {
      const response = await axios.post(this.recomendacionEndpoint, {
        medicion: medicionData
      });
      return response.data;
    } catch (error) {
      console.error('Error en recomendación IA:', error);
      throw new Error('Error al procesar la recomendación');
    }
  }
}

export default new AIService();