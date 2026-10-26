import { Suspense } from "react";
import { ContactPage } from "@/features/public/MorePages";
export default function Page() { return <Suspense fallback={<p className="p-6 text-muted">Cargando…</p>}><ContactPage /></Suspense>; }
