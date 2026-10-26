import { NextResponse } from "next/server";
import { ZodError } from "zod";
export type ErrorCode = "UNAUTHENTICATED" | "FORBIDDEN" | "VALIDATION_ERROR" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR";
export class ApiError extends Error { constructor(public code: ErrorCode, public status: number, message: string) { super(message); } }
export function ok(data: unknown, status = 200) { return NextResponse.json({ data }, { status, headers: { "Cache-Control": "no-store" } }); }
export function handler(fn: (req: Request) => Promise<Response>) { return async (req: Request) => { const requestId = crypto.randomUUID(); try { const response = await fn(req); response.headers.set("X-Request-Id", requestId); return response; } catch (e) { const error = e instanceof ZodError ? new ApiError("VALIDATION_ERROR", 400, "Datos inválidos") : e instanceof ApiError ? e : new ApiError("INTERNAL_ERROR", 500, "No se pudo procesar la solicitud"); if (error.status === 500) console.error(JSON.stringify({ requestId, code: error.code })); return NextResponse.json({ error: { code: error.code, message: error.message, requestId } }, { status: error.status, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } }); } }; }
export async function jsonBody(req: Request) {
 if (!req.headers.get("content-type")?.startsWith("application/json")) throw new ApiError("VALIDATION_ERROR",415,"Se requiere JSON");
 const reader = req.body?.getReader(); if (!reader) throw new ApiError("VALIDATION_ERROR",400,"Se requiere JSON");
 const chunks: Uint8Array[] = []; let size = 0;
 while (true) { const {done,value} = await reader.read(); if (done) break; size += value.byteLength; if (size > 16384) { await reader.cancel(); throw new ApiError("VALIDATION_ERROR",413,"Solicitud demasiado grande"); } chunks.push(value); }
 const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) {bytes.set(chunk,offset);offset += chunk.byteLength;}
 try { return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes)) as unknown; } catch { throw new ApiError("VALIDATION_ERROR",400,"JSON inválido"); }
}
