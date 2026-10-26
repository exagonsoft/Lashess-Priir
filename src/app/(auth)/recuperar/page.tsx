import { Suspense } from "react";
import { ForgotPasswordPage } from "@/features/auth/Auth";
export default function Page() { return <Suspense fallback={<p className="p-6 text-muted">Cargando…</p>}><ForgotPasswordPage /></Suspense>; }
