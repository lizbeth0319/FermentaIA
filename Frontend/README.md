# Fermenta IA — Frontend (React + TypeScript + Vite)

Aplicación web para productores de café que registra mediciones de fermentación (pH y temperatura), gestiona fincas/tanques/lotes y compara valores contra rangos ideales. Este documento describe el frontend para evaluación en Senasoft.

## Resumen
- Stack: React 18, TypeScript, Vite, Tailwind (via plugin), Radix Primitives, Lucide Icons.
- Arquitectura: rutas con React Router, componentes reutilizables, cliente API tipado, alias `@` para imports.
- Autenticación: JWT almacenado en `localStorage` (`fermenta.token`). Las peticiones adjuntan `Authorization: Bearer` y `x-token`.
- Integración: Endpoints centralizados en `src/api/endpoints.ts`; cliente HTTP en `src/api/http.ts`.
- DX: Vitest, ESLint, `pnpm`/`npm` scripts; Vite server en `http://localhost:8080` (puede usar 8081 si 8080 está ocupado).

---

## Requisitos
- Node.js >= 18 (recomendado 20+)
- npm o pnpm
- Backend en ejecución en `http://localhost:3000` (o establece `VITE_API_URL`).

## Instalación y ejecución
```bash
# 1) Instalar dependencias
npm install

# 2) Crear variables de entorno
cp .env.local.example .env.local
# Edita VITE_API_URL si tu backend no usa http://localhost:3000

# 3) Ejecutar en desarrollo (Vite)
npm run dev
# Abre http://localhost:8080 (si el 8080 está ocupado, Vite usará 8081)
```

## Variables de entorno
Crea `.env.local` con:
```env
# URL base del backend
VITE_API_URL=http://localhost:3000
```
Notas:
- El cliente API toma la URL de `VITE_API_URL`. Si no existe, usa `http://localhost:3000`.
- CORS del backend permite `http://localhost:8080` y `http://localhost:8081`.

## Scripts disponibles
- `npm run dev`: servidor de desarrollo con Vite.
- `npm run build`: compila TypeScript y genera el bundle de producción.
- `npm run preview`: sirve el build para revisión local.
- `npm run test`, `npm run test:ui`, `npm run test:coverage`: pruebas con Vitest.
- `npm run lint`: revisión de estilo con ESLint.

---

## Estructura del proyecto
```
Frontend/
├─ public/                  # estáticos
├─ src/
│  ├─ api/                  # Integración con backend
│  │  ├─ auth.ts            # login/register y manejo de token
│  │  ├─ endpoints.ts       # rutas de API centralizadas
│  │  ├─ http.ts            # cliente HTTP (fetch + headers + errores)
│  │  └─ README.md          # guía rápida de consumo de API
│  ├─ components/
│  │  ├─ layout/            # SideMenu, contenedores y layout
│  │  └─ ui/                # componentes UI (Radix + Tailwind)
│  ├─ pages/                # pantallas
│  │  ├─ Login.tsx          # inicio de sesión
│  │  ├─ Registro.tsx       # registro de productor
│  │  ├─ Fincas.tsx         # CRUD de fincas
│  │  ├─ Tanques.tsx        # CRUD de tanques
│  │  ├─ Lotes.tsx          # CRUD de lotes
│  │  ├─ Mediciones.tsx     # registro de pH/°C y envío a backend
│  │  ├─ Historial.tsx      # lista de mediciones por lote
│  │  ├─ Comparativas.tsx   # compara valores vs. perfil ideal
│  │  ├─ Variedades.tsx, Guia.tsx, Glosario.tsx, MiCuenta.tsx, MisDatos.tsx
│  │  └─ NotFound.tsx       # 404
│  ├─ App.tsx               # rutas y Shell de la app
│  ├─ config/               # constantes/configuración (alias `@` apunta a src)
│  └─ main.tsx              # bootstrap de React
├─ vite.config.ts           # Vite (puerto 8080)
└─ package.json
```

## Ruteo principal (App.tsx)
- Rutas públicas: `/` (Login), `/registro`.
- Rutas autenticadas: `/home`, `/fincas`, `/tanques`, `/lotes`, `/mediciones`, `/historial`, `/comparativas`, `/variedades`, `/guia`, `/glosario`, `/mi-cuenta`, `/mis-datos`.
- Menú lateral (`components/layout/SideMenu.tsx`) y controles flotantes.

## Integración con API
- `src/api/http.ts`: wrapper de `fetch` que:
  - Resuelve la URL base con `VITE_API_URL`.
  - Adjunta JSON headers y token, si existe:
    - `Authorization: Bearer <token>` y `x-token: <token>` (compatibles con el backend actual).
  - Lanza errores con cuerpo legible si la respuesta no es `ok`.
- `src/api/endpoints.ts`: helpers type-safe para construir rutas (`API.fincas.list()`, `API.mediciones.create()`, etc.).
- `src/api/auth.ts`:
  - Guarda/lee el token en `localStorage` clave `fermenta.token`.
  - `login()` y `register()` usan `apiFetch` y actualizan el token.

### Autenticación y protección de rutas
- El backend protege endpoints como `/api/mediciones` y `/api/perfiles` con JWT.
- Tras login, el token se adjunta automáticamente desde `http.ts`.

### Flujo “Medición → Comparativas”
1. En `Mediciones.tsx`, el usuario selecciona lote y fase, captura pH/°C y envía a `/api/mediciones`.
2. La pantalla redirige a `/comparativas?variedad=&proceso=&fase=&ph=&temp=` usando los datos del lote y la medición.
3. `Comparativas.tsx` llama a `/api/perfiles/buscar` con esos parámetros y pinta el estado “Óptimo/Bueno/Atención”.

---

## UI/UX
- Base visual con Tailwind (plugin oficial) y componentes accesibles construidos sobre Radix.
- Iconografía: `lucide-react`.
- Diseño responsive y claro para campo y planta.

## Calidad y pruebas
- Pruebas unitarias con Vitest (`test`, `test:ui`, `test:coverage`).
- ESLint con reglas estrictas de TypeScript.
- Alias `@` para imports absolutos y estructura consistente.

## Seguridad
- JWT solo en memoria/localStorage para este prototipo; en producción considerar cookies HttpOnly.
- Peticiones incluyen `x-token` y `Authorization` por compatibilidad con el middleware backend actual.
- Sanitización y validaciones de entrada en backend; el frontend respeta contratos y tipados.

## Despliegue
- Construcción: `npm run build` genera `dist/` listo para servir con Nginx/Node.
- Preview local de producción: `npm run preview`.
- Configura `VITE_API_URL` en el entorno de despliegue.

## Troubleshooting
- 401 en endpoints protegidos: vuelve a iniciar sesión; verifica que la petición envía `x-token`.
- “Fase: N/D” en Comparativas: falta `variedad`, `proceso` o `fase` en la URL; entra desde Historial/Mediciones.
- CORS: usa el frontend en `http://localhost:8080` u `8081`; ambos están permitidos por el backend.

## Cómo extender
- Nuevo endpoint: define ruta en `src/api/endpoints.ts` y consúmelo con `apiFetch`.
- Nueva pantalla: crea archivo en `src/pages/`, agrega `<Route />` en `App.tsx` y enlaza en el SideMenu.

—

Este README cubre el frontend para evaluación técnica en Senasoft. Para ver contratos y middlewares, consulta el backend (repositorio/ carpeta `backend/`).
