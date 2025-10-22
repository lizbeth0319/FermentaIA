# FermentaIA

FermentaIA es una solución agéntica, rural, offline-first e inclusiva para asistir técnicamente al caficultor durante la fermentación del café. Combina una interfaz ligera optimizada para baja conectividad con un agente de IA que interpreta datos (voz/texto) y emite diagnósticos y recomendaciones prácticas, empáticas y accionables.

## Visión general

FermentaIA busca reducir la dependencia de la intuición empírica y promover procesos estandarizados, trazables y de alta calidad sensorial. Se alinea con niveles de autonomía L1–L3 (Operador, Colaborador, Consultor) del marco de la Universidad de Washington (2025), garantizando control humano, confianza y seguridad ética.

### Problema que resuelve
- Falta de instrumentos accesibles (termómetros, medidores de pH, sensores digitales) en zonas rurales.
- Baja alfabetización digital y dificultad para interpretar registros técnicos.
- Conectividad limitada: necesidad de operar sin internet y sincronizar luego.
- Ausencia de trazabilidad técnica (registros físicos dispersos y pérdida de histórico).
- Variabilidad climática que afecta pH/temperatura y resultados sensoriales.

### Impacto esperado
- Aumentar ~30% la calidad promedio de lotes fermentados.
- Reducir pérdidas por procesos defectuosos y mejorar trazabilidad.
- Crear cultura de análisis técnico accesible en comunidades rurales.

## Características clave
- Agentic y contextual: asistente IA que interpreta datos del productor (voz/texto), diagnóstico comprensible y recomendaciones accionables.
- Offline-first: funcionamiento local y sincronización automática cuando retorna la conectividad.
- Inclusiva: UI minimalista, alto contraste, multilingüe, optimizada para dispositivos de bajo costo.
- Autenticación JWT y seguridad: rutas protegidas y filtrado por productor.
- Gestión técnica del proceso: registro de pH/°C, comparativas vs perfiles ideales, histórico y recomendaciones.

## Arquitectura

- Monorepo con dos aplicaciones:
  - `Frontend/` (React + TypeScript + Vite)
  - `backend/` (Node.js + Express + MongoDB)
- Comunicación vía REST, endpoints versionados bajo `/api/*`.
- Autenticación JWT; el middleware extrae `productorId` del token y habilita filtrado por usuario.
- Sincronización: endpoints y controladores para registrar eventos y estado de sincronización.

### Flujo de datos
1. Login: backend (`controllers/Autenticacion.js`) devuelve JWT y `productor.id`.
2. Frontend guarda el token en `localStorage` (`fermenta.token`).
3. Cliente HTTP (`src/api/http.ts`) envía `Authorization: Bearer <token>` y `x-token: <token>`.
4. Filtrado por usuario: pantallas de Fincas, Tanques y Lotes cargan solo datos del productor autenticado usando endpoints específicos.
5. Registro de mediciones: se envían pH/°C y metadatos; se generan diagnósticos y comparativas contra perfiles ideales.

## Estructura del proyecto

```
FermentaIA/
├─ Frontend/
│  ├─ src/
│  │  ├─ api/              # cliente de API, endpoints y auth/token
│  │  │  ├─ endpoints.ts   # helpers de rutas (type-safe)
│  │  │  ├─ http.ts        # fetch con headers y manejo de errores
│  │  │  └─ auth.ts        # gestión de token (localStorage)
│  │  ├─ pages/            # pantallas: Login, Fincas, Tanques, Lotes, etc.
│  │  ├─ components/       # UI y layout
│  │  └─ App.tsx           # ruteo y shell
│  ├─ vite.config.ts       # Vite y alias `@`
│  └─ README.md            # guía completa del frontend
└─ backend/
   ├─ routers/             # rutas por recurso (Finca, Tanque, Lote, etc.)
   ├─ controllers/         # lógica de endpoints
   ├─ models/              # esquemas Mongoose
   ├─ middlewares/         # validar-jwt, validar-campo, generar-jwt
   └─ README.MD            # guía del backend
```

## Integración y endpoints
- Centralizados en `Frontend/src/api/endpoints.ts` (por ejemplo):
  - `API.fincas.byProductor(productorId)`
  - `API.tanques.byFinca(fincaId)`
  - `API.lotes.byTanque(tanqueId)`
  - `API.mediciones.byLote(loteId)` y `API.mediciones.create()`
- Cliente HTTP: `Frontend/src/api/http.ts` resuelve base URL (`VITE_API_URL`) y adjunta encabezados.
- Autenticación: `Frontend/src/api/auth.ts` gestiona `fermenta.token` (get/set/clear).
- Backend JWT: `backend/middlewares/validar-jwt.js` adjunta `req.productorId`.

## Autenticación y filtrado por usuario
- Login: `POST /api/auth/login` devuelve `{ token, productor }`.
- Token: se almacena en `localStorage` y se envía en `Authorization` y `x-token`.
- Filtrado:
  - Fincas: `GET /api/fincas/productor/:id`
  - Tanques: `GET /api/tanques/finca/:fincaId`
  - Lotes: `GET /api/lotes/tanque/:tanqueId`
- Las pantallas consumen estos endpoints para mostrar únicamente los datos del productor autenticado.

## Pruebas

### Estado actual
- Frontend: configurado con Vitest (`Frontend/package.json`), pruebas unitarias básicas añadidas en `src/api/__tests__/`:
  - `endpoints.test.ts`: valida generadores de rutas.
  - `auth.test.ts`: prueba almacenamiento de token (`get/set/clear`).
  - `http.test.ts`: verifica encabezados `Authorization` y `x-token`.
- Backend: sin framework de testing configurado aún (script placeholder en `backend/package.json`).

### Cómo ejecutarlas
- Todas (frontend): `npm run test` (en `Frontend/`).
- Solo nuestras pruebas: `npx vitest run src/api/__tests__`.
- Cobertura: `npm run test:coverage` (requiere `@vitest/coverage-v8`).

Nota: existe un test previo que puede fallar (`src/__tests__/App.test.tsx`) por un import con alias `@/components/ui/toaster`. Se puede resolver ajustando el alias o corrigiendo el import.

## Cómo ejecutar el proyecto

### Backend
```powershell
cd backend
npm install
node app.js
# Por defecto en http://localhost:3000
```

### Frontend
```powershell
cd Frontend
npm install
npm run dev
# Vite en http://localhost:8080 (usa otro puerto si 8080 está ocupado)
# Base URL configurable con VITE_API_URL en .env.local
```

## Referencias internas
- Frontend: `Frontend/README.md` — arquitectura, ruteo y guías de API.
- Backend: `backend/README.MD` — estructura, endpoints y dependencias.

## Agentes (resumen y pendientes)
- Agente de diagnóstico y recomendaciones: interpreta pH/°C y contexto, emite diagnóstico y sugerencias.
- Agente de guía conversacional: asistencia empática y contextual al productor durante el flujo de fermentación.
- Pendiente: agente de transcripción de voz (no incluido por tiempo y consideraciones estadísticas). Se propone incorporar transcripción local robusta y fallback a servicios externos con control de privacidad.

## Espacio para ampliación (narrativa y objetivo)

> FermentaIA es una solución agéntica, rural, offline-first e inclusiva, desarrollada para revolucionar el proceso de fermentación del café en las zonas rurales de Colombia mediante el uso responsable y accesible de la inteligencia artificial. Su propósito es claro: asistir al caficultor en la toma de decisiones técnicas durante la fermentación, reduciendo la dependencia de la intuición empírica y garantizando procesos más estandarizados, trazables y de alta calidad sensorial. Durante décadas, los productores rurales han enfrentado un desafío constante: la falta de herramientas tecnológicas y científicas que les permitan monitorear y controlar las variables críticas del proceso de fermentación —como la temperatura, el pH y las condiciones ambientales. Estas limitaciones generan pérdidas económicas significativas, disminuyen la calidad exportable del café y perpetúan la desigualdad tecnológica entre el campo y la ciudad. FermentaIA surge como respuesta a esta problemática, integrando tres pilares estratégicos: Accesibilidad tecnológica rural (plataforma ligera y funcional sin conexión, con sincronización automática), Asistencia inteligente contextual (agente IA colaborativo que interpreta datos capturados y emite diagnósticos comprensibles con recomendaciones accionables) y Diseño humano y sostenible (interfaz minimalista, multilingüe y de alto contraste, optimizada para móviles de bajo costo y entornos con baja alfabetización digital). FermentaIA se define como asistente de apoyo técnico (no sustituye el conocimiento del caficultor) y promueve una relación colaborativa (la IA guía/analiza; el productor decide). Este enfoque se alinea con niveles L1–L3 del marco de la Universidad de Washington (2025). Inicialmente, permite: registrar mediciones de temperatura y pH por voz o texto; analizar los datos frente a rangos ideales por variedad y etapa; generar diagnóstico y recomendaciones visuales/auditivas; guardar registros localmente y sincronizar al recuperar conectividad; consultar históricos y comparar resultados. El impacto esperado: aumentar la calidad promedio de los lotes, reducir pérdidas y generar una cultura de análisis técnico accesible. FermentaIA representa una estrategia de transformación rural donde la tecnología conecta ciencia, tradición cafetera y sostenibilidad; busca consolidarse como un modelo de innovación social replicable, fortaleciendo la competitividad del café colombiano, mejorando trazabilidad y empoderando comunidades rurales con conocimiento, tecnología y autonomía.

> Problema a resolver: La fermentación del café es determinante en el perfil sensorial, acidez, dulzura y calidad exportable. En zonas rurales, el proceso sigue siendo empírico y sin apoyo tecnológico, dependiendo del olfato/experiencia/intución. Causas: falta de instrumentos accesibles; baja alfabetización digital; conectividad limitada; trazabilidad técnica inexistente; variabilidad climática con resultados impredecibles. FermentaIA aborda estas causas con medición, análisis y apoyo IA offline-first.

— Aquí puedes ampliar con estudios de campo, métricas de impacto, referencias científicas y detalle de pruebas piloto.

## Licencia
Proyecto educativo y de innovación social; la licencia puede definirse según necesidades institucionales o comunitarias.