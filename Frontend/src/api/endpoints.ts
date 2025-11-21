// Centraliza los endpoints del backend a partir de EndPoints.txt
// No hace llamadas; solo define rutas y helpers seguros.

export const API = {
  // Autenticación
  auth: {
    register: () => `/api/auth/register`,
    login: () => `/api/auth/login`,
  },
  // Productores
  productores: {
    list: () => `/api/productores`,
    byId: (id: string | number) => `/api/productores/${id}`,
    create: () => `/api/productores`,
    update: (id: string | number) => `/api/productores/${id}`,
    remove: (id: string | number) => `/api/productores/${id}`,
  },
  // Fincas
  fincas: {
    list: () => `/api/fincas`,
    byId: (id: string | number) => `/api/fincas/${id}`,
    byProductor: (productorId: string | number) => `/api/fincas/productor/${productorId}`,
    create: () => `/api/fincas`,
    update: (id: string | number) => `/api/fincas/${id}`,
    remove: (id: string | number) => `/api/fincas/${id}`,
  },
  // Tanques
  tanques: {
    list: () => `/api/tanques`,
    byId: (id: string | number) => `/api/tanques/${id}`,
    byFinca: (fincaId: string | number) => `/api/tanques/finca/${fincaId}`,
    create: () => `/api/tanques`,
    update: (id: string | number) => `/api/tanques/${id}`,
    remove: (id: string | number) => `/api/tanques/${id}`,
  },
  // Lotes
  lotes: {
    list: () => `/api/lotes`,
    byId: (id: string | number) => `/api/lotes/${id}`,
    byTanque: (tanqueId: string | number) => `/api/lotes/tanque/${tanqueId}`,
    create: () => `/api/lotes`,
    update: (id: string | number) => `/api/lotes/${id}`,
    remove: (id: string | number) => `/api/lotes/${id}`,
  },
  // Mediciones
  mediciones: {
    list: () => `/api/mediciones`,
    byId: (id: string | number) => `/api/mediciones/${id}`,
    byLote: (loteId: string | number) => `/api/mediciones/lote/${loteId}`,
    create: () => `/api/mediciones`,
    update: (id: string | number) => `/api/mediciones/${id}`,
    remove: (id: string | number) => `/api/mediciones/${id}`,
  },
  // Recomendaciones
  recomendaciones: {
    list: () => `/api/recomendaciones`,
    byId: (id: string | number) => `/api/recomendaciones/${id}`,
    byLote: (loteId: string | number) => `/api/recomendaciones/lote/${loteId}`,
    byMedicion: (medicionId: string | number) => `/api/recomendaciones/medicion/${medicionId}`,
    create: () => `/api/recomendaciones`,
    update: (id: string | number) => `/api/recomendaciones/${id}`,
    remove: (id: string | number) => `/api/recomendaciones/${id}`,
  },
  // Sincronizaciones
  sincronizaciones: {
    list: () => `/api/sincronizaciones`,
    byId: (id: string | number) => `/api/sincronizaciones/${id}`,
    byLote: (loteId: string | number) => `/api/sincronizaciones/lote/${loteId}`,
    byMedicion: (medicionId: string | number) => `/api/sincronizaciones/medicion/${medicionId}`,
    create: () => `/api/sincronizaciones`,
    update: (id: string | number) => `/api/sincronizaciones/${id}`,
    remove: (id: string | number) => `/api/sincronizaciones/${id}`,
  },
  // Perfiles ideales
  perfiles: {
    list: () => `/api/perfiles`,
    byId: (id: string | number) => `/api/perfiles/${id}`,
    buscar: (query: { variedad?: string; proceso?: string; fase?: string }) => {
      const params = new URLSearchParams();
      if (query.variedad) params.set("variedad", query.variedad);
      if (query.proceso) params.set("proceso", query.proceso);
      if (query.fase) params.set("fase", query.fase);
      const qs = params.toString();
      return `/api/perfiles/buscar${qs ? `?${qs}` : ""}`;
    },
    create: () => `/api/perfiles`,
    update: (id: string | number) => `/api/perfiles/${id}`,
    remove: (id: string | number) => `/api/perfiles/${id}`,
  },
  // IA
  ai: {
    chat: () => '/api/ai/chat',
    recomendacion: () => '/api/ai/recomendacion',
    chatTest: () => '/api/ai/test/chat',
    recoTest: () => '/api/ai/test/recomendacion'
  }
} as const;

export type ApiMap = typeof API;
