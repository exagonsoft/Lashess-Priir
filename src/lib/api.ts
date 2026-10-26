export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
 const response = await fetch("/api/v1" + path, { ...options, credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json", ...options.headers } });
 const body = await response.json();
 if (!response.ok) throw new Error(body.error?.message ?? "No se pudo conectar con el servidor");
 return body.data as T;
}
