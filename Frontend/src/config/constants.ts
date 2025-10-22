// Constantes de la aplicación Fermenta IA

export const APP_NAME = "Fermenta IA";
export const APP_DESCRIPTION = "Gestión inteligente de fermentación de café";

// Rangos ideales de pH por variedad
export const PH_RANGES = {
  Castillo: { min: 4.0, ideal: 4.2, max: 4.5 },
  Caturra: { min: 4.3, ideal: 4.5, max: 4.7 },
  Bourbon: { min: 4.1, ideal: 4.3, max: 4.6 },
  Típica: { min: 4.2, ideal: 4.4, max: 4.6 },
  Colombia: { min: 4.0, ideal: 4.2, max: 4.5 },
} as const;

// Rangos ideales de temperatura por variedad (°C)
export const TEMP_RANGES = {
  Castillo: { min: 26, ideal: 28, max: 30 },
  Caturra: { min: 23, ideal: 25, max: 27 },
  Bourbon: { min: 25, ideal: 27, max: 29 },
  Típica: { min: 24, ideal: 26, max: 28 },
  Colombia: { min: 26, ideal: 28, max: 30 },
} as const;

// Estados de lotes
export const ESTADOS_LOTE = [
  "En fermentación",
  "Listo para lavado",
  "Lavado",
  "Secado",
  "Completado",
  "Descarte",
] as const;

// Fases de fermentación
export const FASES_FERMENTACION = ["Inicio", "Media", "Fin"] as const;

// Tipos de proceso
export const TIPOS_PROCESO = ["Lavado", "Honey", "Natural"] as const;

// Variedades de café
export const VARIEDADES = ["Castillo", "Caturra", "Bourbon", "Típica", "Colombia"] as const;

export type Variedad = (typeof VARIEDADES)[number];
export type EstadoLote = (typeof ESTADOS_LOTE)[number];
export type FaseFermentacion = (typeof FASES_FERMENTACION)[number];
export type TipoProceso = (typeof TIPOS_PROCESO)[number];
