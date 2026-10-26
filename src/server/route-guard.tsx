import "server-only";
import { redirect } from "next/navigation";
import { authenticate, authorize } from "./auth";
import { ApiError } from "./api/errors";
import type { Role } from "@/types/domain";
export async function protect(allowed: readonly Role[]) { try { await authorize(await authenticate(), allowed); } catch (e) { if (e instanceof ApiError && e.status === 401) redirect("/login"); if (e instanceof ApiError && e.status === 403) redirect("/sin-acceso"); throw e; } }
