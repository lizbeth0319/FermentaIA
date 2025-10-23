export default {
  flowEndpoints: {
    // El chat de ayuda usa chatTrigger, necesita configuración especial
    chat: process.env.N8N_CHAT_ENDPOINT || 'http://localhost:5678/webhook/f3e6aca6-d21b-4424-b865-c0664ef27587/chat',
    // Recomendaciones usa webhook HTTP estándar
    recomendacion: process.env.N8N_RECOMENDACION_ENDPOINT || 'http://localhost:5678/webhook/consejos_fermentaIA'
  }
};