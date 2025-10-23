import { N8N_ENDPOINTS, getN8nHeaders } from '../config/n8n';

/**
 * Interfaz para los datos de entrada de recomendaciones
 */
export interface RecomendacionesInput {
  temperatura?: number;
  ph?: number;
  tiempoFermentacion?: number;
  variedad?: string;
  altitud?: number;
  [key: string]: any; // Para campos adicionales
}

/**
 * Interfaz para la respuesta de recomendaciones
 */
export interface RecomendacionesResponse {
  recomendaciones: string[];
  sugerencias?: string[];
  error?: string;
  [key: string]: any; // Para campos adicionales
}

/**
 * Interfaz para la respuesta del chat de ayuda
 */
export interface ChatAyudaResponse {
  respuesta: string;
  sugerencias?: string[];
  error?: string;
  [key: string]: any; // Para campos adicionales
}

/**
 * Servicio para interactuar con los flujos de trabajo de n8n
 */
export const n8nService = {
  /**
   * Obtiene recomendaciones para el proceso de fermentación
   * @param data Datos para generar recomendaciones
   * @returns Respuesta con las recomendaciones
   */
  async getRecomendaciones(data: RecomendacionesInput): Promise<RecomendacionesResponse> {
    try {
      const response = await fetch(N8N_ENDPOINTS.RECOMENDACIONES, {
        method: 'POST',
        headers: getN8nHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener recomendaciones: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en servicio de recomendaciones:', error);
      throw error;
    }
  },
  
  /**
   * Envía una consulta al chat de ayuda
   * @param mensaje Mensaje del usuario
   * @returns Respuesta del asistente
   */
  async chatAyuda(mensaje: string): Promise<ChatAyudaResponse> {
    try {
      const response = await fetch(N8N_ENDPOINTS.CHAT_AYUDA, {
        method: 'POST',
        headers: getN8nHeaders(),
        body: JSON.stringify({ mensaje }),
      });
      
      if (!response.ok) {
        throw new Error(`Error en chat de ayuda: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en servicio de chat de ayuda:', error);
      throw error;
    }
  },
};