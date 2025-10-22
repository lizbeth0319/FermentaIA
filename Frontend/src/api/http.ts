import { authToken } from "./auth";

export type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  // Hook para actuar sobre la respuesta parseada
  after?: (json: any) => void;
};

// Lee base URL desde variable de entorno si existe
function getBaseUrl() {
  return import.meta.env.VITE_API_URL?.toString() || "http://localhost:3000";
}

export async function apiFetch<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...opts.headers,
  };

  // Adjunta token si existe
  const token = authToken.get();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(url, {
    method: opts.method || (opts.body ? "POST" : "GET"),
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const error = new Error(text || `HTTP ${resp.status}`);
    // @ts-ignore
    error.status = resp.status;
    throw error;
  }

  const json = (await resp.json().catch(() => ({}))) as T;
  opts.after?.(json);
  return json;
}