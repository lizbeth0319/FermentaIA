// Gestión de token simple y helpers de autenticación.
// Mantiene login de la UI "fácil" mientras definimos el flujo real.

const TOKEN_KEY = "fermenta.token";

export type AuthToken = string;

export const authToken = {
  get(): AuthToken | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: AuthToken) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // noop
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // noop
    }
  },
};

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

// Estas funciones DELEGAN en apiFetch; no se usan aún por la UI
// para no romper el login mientras trabajas el diseño.
import { apiFetch } from "./http";
import { API } from "./endpoints";

export async function login(data: LoginPayload) {
  // Backend espera { email, contrasena }
  const body = { email: data.email, contrasena: data.password } as const;
  return apiFetch<{ token: string }>(API.auth.login(), {
    method: "POST",
    body,
    // onSuccess: guarda token
    after: (res) => {
      if (res?.token) authToken.set(res.token);
    },
  });
}

export async function register(data: RegisterPayload) {
  return apiFetch(API.auth.register(), { method: "POST", body: data });
}

// Obtiene el id del usuario autenticado desde el JWT almacenado
export function currentUserId(): string | null {
  const token = authToken.get();
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const json = JSON.parse(atob(payloadBase64));
    const maybe =
      (json?.id as string) ||
      (json?._id as string) ||
      (json?.uid as string) ||
      (json?.userId as string) ||
      (json?.sub as string) ||
      (json?.productorId as string) ||
      null;
    return typeof maybe === "string" && maybe.length > 0 ? maybe : null;
  } catch {
    return null;
  }
}
