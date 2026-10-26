import { protect } from "@/server/route-guard";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function Layout({children}: {children: React.ReactNode}) { await protect(["stylist"]); return children; }
