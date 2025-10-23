// Configuración para conectar con n8n desplegado en Render

// URL base de la instancia de n8n desplegada en Render
export const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://n8n-fermentaia.onrender.com';

// API Key para autenticación con n8n (si es necesario)
export const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY || '';

// Endpoints de los flujos de trabajo de n8n
export const N8N_ENDPOINTS = {
  // Endpoint para obtener recomendaciones
  RECOMENDACIONES: `${N8N_BASE_URL}/webhook/recomendaciones`,
  
  // Endpoint para el chat de ayuda
  CHAT_AYUDA: `${N8N_BASE_URL}/webhook/chat-ayuda`,
  
  // Añade más endpoints según sea necesario
};

// Función para construir headers de autenticación para n8n
export const getN8nHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Añadir API Key si está configurada
  if (N8N_API_KEY) {
    headers['X-N8N-API-KEY'] = N8N_API_KEY;
  }
  
  return headers;
};