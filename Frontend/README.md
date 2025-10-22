# Frontend - FermentaIA

Interfaz cliente desarrollada con React + TypeScript + Vite. Provee UI para gestionar fincas, lotes, tanques, mediciones, autenticación y visualizar recomendaciones del agente.

## Requisitos
- Node.js >= 16
- npm (o pnpm/yarn)
- Entorno Windows (comandos indicados abajo)

## Instalación rápida (Windows)
```powershell
cd c:\Users\Adminsena\Documents\Code\FermentaIA\Frontend
npm install
npm run dev
# abrir http://localhost:5173 (o el puerto que indique Vite)
```

## Scripts útiles (package.json)
- npm run dev — inicia servidor de desarrollo (Vite, HMR)
- npm run build — crea build de producción
- npm run preview — sirve el build localmente
- npm test — ejecuta tests con Vitest (si está configurado)
- npm run lint — ejecuta linters (si está configurado)

## Variables de entorno
Copia `.env.local.example` a `.env.local` y ajusta las rutas/ENDPOINTS. El archivo EndPoints.txt y la carpeta api/ contienen la configuración y helpers para consumir la API del backend.

## Estructura principal (resumen)
- index.html, vite.config.ts, tsconfig*.json — configuración Vite/TS
- src/
  - main.tsx, App.tsx — punto de entrada
  - pages/ — vistas (Home, Login, Mediciones, Fincas, Lotes, Tanques, Chat, etc.)
  - components/ — componentes reutilizables
  - layout/ — elementos de layout (SideMenu, FloatingAIWidget, controles)
  - ui/ — primitives y componentes de la biblioteca de UI
  - api/ — wrappers HTTP, endpoints y auth
  - services/ — datos simulados / utilidades
  - styles/ — CSS global y Tailwind (tailwind.config.ts)
  - __tests__/ — tests unitarios (Vitest + Testing Library)
- public/ — assets públicos (favicon, robots, etc.)

## Integración con Backend
- Revisa `src/api/endpoints.ts` y `EndPoints.txt` para las rutas de la API.
- Autenticación: `src/api/auth.ts` y middlewares de cliente manejan tokens JWT.

## Principales convenciones
- TypeScript estricto para tipos y componentes.
- Componentes UI en src/ui/ para reutilización.
- Páginas en src/pages/ mapeadas por el router (React Router u otra solución).
- Hooks en src/hooks/ para lógica compartida (ej. use-mobile, use-toast).

## Testing y calidad
- Tests en `src/__tests__/` (Vitest). Ejecuta `npm test`.
- ESLint/format: configurar según `eslint.config.js`.

## Producción
1. Generar build: npm run build
2. Servir con un servidor estático (nginx, serve, etc.) o usar `npm run preview` para verificar localmente.

## Notas
- Revisa `instrucciones.txt` y `api/README.md` para detalles específicos del proyecto.
- Para cambios en endpoints, actualiza `EndPoints.txt` y `src/api/endpoints.ts`.

