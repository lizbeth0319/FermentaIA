import { apiFetch } from '@/api/http';
import { API } from '@/api/endpoints';

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
      const body = {
        lote: {
          variedad: data.variedad,
          proceso: data.proceso,
          estado: data.fase || 'inicio'
        },
        medicion: {
          ph: data.ph,
          temperatura_c: data.temperatura,
          timestamp: new Date().toISOString()
        }
      } as any;
      const resp = await apiFetch<{ recomendacion?: string; output?: string }>(API.ai.recomendacion(), {
        method: 'POST',
        body
      });
      return { recomendaciones: [resp.recomendacion || resp.output || ''], sugerencias: [] } as RecomendacionesResponse;
    } catch (error) {
      console.error('Error en servicio de recomendaciones:', error);
      return { recomendaciones: [], error: (error as any)?.message || 'Error' };
    }
  },
  
  /**
   * Envía una consulta al chat de ayuda
   * @param mensaje Mensaje del usuario
   * @returns Respuesta del asistente
   */
  async chatAyuda(mensaje: string): Promise<ChatAyudaResponse> {
    try {
      const resp = await apiFetch<{ response?: string; message?: string }>(API.ai.chat(), {
        method: 'POST',
        body: { mensaje }
      });
      return { respuesta: resp.response || resp.message || '' } as ChatAyudaResponse;
    } catch (error) {
      console.error('Error en servicio de chat de ayuda:', error);
      return { respuesta: '', error: (error as any)?.message || 'Error' };
    }
  },
};
