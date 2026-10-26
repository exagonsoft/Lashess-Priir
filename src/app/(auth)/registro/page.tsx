import { Suspense } from "react";
import { RegisterPage } from "@/features/auth/Auth";
export default function Page() { return <Suspense fallback={<p className="p-6 text-muted">Cargando…</p>}><RegisterPage /></Suspense>; }
