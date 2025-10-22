export default {
  flowEndpoints: {
    chat: process.env.N8N_CHAT_ENDPOINT || 'http://localhost:5678/webhook/chat-ayuda',
    recomendacion: process.env.N8N_RECOMENDACION_ENDPOINT || 'http://localhost:5678/webhook/recomendaciones'
  }
};