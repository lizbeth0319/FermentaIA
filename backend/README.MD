# Backend — FermentaIA

README del backend: estructura, instalación y flujo básico.

## Resumen
Servicio REST en Node.js (Express) + MongoDB encargado de:
- Recepción y almacenamiento de mediciones (temperatura, pH, humedad).
- Gestión de recursos: fincas, lotes, tanques, productores.
- Autenticación JWT.
- Lógica de recomendaciones y sincronización offline/online.

## Estructura del proyecto
/backend
- .env                      # variables de entorno
- app.js                    # punto de entrada (Express)
- package.json
- installs.txt              # dependencias recomendadas / comandos
- /config
  - db.js                   # conexión a MongoDB
- /routers                  # define rutas por recurso
  - Autenticacion.js
  - Finca.js
  - Lote.js
  - Medicion.js
  - PerfilIdeal.js
  - Productor.js
  - Recomendacion.js
  - Sincronizacion.js
  - Tanque.js
- /controllers              # lógica de cada endpoint (orquestación)
- /models                   # esquemas Mongoose
- /helpers                  # utilidades y transformaciones
- /middlewares              # validaciones y auth (validar-jwt, generar-jwt, validar-campo)

## Dependencias recomendadas
- express
- express-validator
- dotenv
- bcrypt
- cors
- jsonwebtoken
- axios
- mongoose
- nodemon (dev)

Instalación rápida (desde la carpeta backend):
```powershell
cd c:\Users\Adminsena\Documents\Code\FermentaIA\backend
npm install
# para desarrollo
npm run dev
# para producción
npm start
```

## Variables de entorno (ejemplo)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/fermentaia
JWT_SECRET=tu_clave_secreta
```

## Flujo de una petición (simplificado)
Cliente -> Router (/api/mediciones, /api/finca, /auth, ...) -> Middlewares (validación, auth) -> Controller -> Helpers/Services (recomendaciones, sincronización) -> Modelos Mongoose -> DB -> Respuesta al cliente

## Flujo offline / sincronización
1. Dispositivo sin conexión guarda datos localmente.  
2. Al reconectarse, cliente envía lotes a `/api/sincronizacion`.  
3. Controller procesa, resuelve conflictos y persiste en MongoDB.  
4. Respuesta incluye estado y posibles actualizaciones/reglas.

## Componentes clave (prioridad)
- app.js: registrar routers y middlewares globales.  
- config/db.js: conexión y manejo de reconexiones.  
- middlewares: seguridad (validar-jwt) y validaciones (validar-campo).  
- controllers: separar orquestación de acceso a datos.  
- helpers/services: lógica del agente de recomendaciones y sincronización.  
- models: definir esquemas y validaciones de datos.

## Buenas prácticas / recomendaciones
- Mantener controllers ligeros; mover lógica compleja a services/helpers.  
- Versionar endpoints (ej.: /api/v1/mediciones) para futuros cambios.  
- Añadir pruebas unitarias para controllers y helpers críticos.  
- Registrar eventos importantes (errores, sincronizaciones) para diagnóstico.

## Contacto
Para cambios en rutas o lógica del agente, editar controllers y helpers correspondientes y documentar en este README.