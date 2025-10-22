API de FermentaIA (Frontend)

- Base URL: definir en `VITE_API_URL` (crear `.env.local` copiando `.env.local.example`).
- Token: se guarda/lee de `localStorage` bajo la clave `fermenta.token`.
- Endpoints: ver `src/api/endpoints.ts` (generado desde EndPoints.txt).
- Cliente: usar `apiFetch` para llamadas con JSON y `Authorization` automático si hay token.

Uso básico

```ts
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";

async function cargarFincas() {
  const data = await apiFetch(API.fincas.list());
  return data;
}
```

Login sin romper la UI actual

```ts
import { login, authToken } from "@/api/auth";

// Opcional: autenticar y guardar token
await login({ email: "user@mail.com", password: "secret" });
// authToken.get() devuelve el token actual
```

Notas

- No modifiqué pantallas. Cuando quieras, reemplazamos los datos simulados por llamadas reales, pantalla por pantalla.
- Si el backend usa cookies en lugar de Bearer, avísame para habilitar `credentials: "include"` en `apiFetch`.