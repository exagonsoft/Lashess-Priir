import { CrmMarketing } from "@/features/crm/CrmComunicacion";
import { fixturesEnabled } from "@/lib/fixtures";
import Unavailable from "@/features/Unavailable";
import Profile from "@/features/auth/Profile";
import Shell from "@/features/crm/CrmShell";
import { protect } from "@/server/route-guard";
export default async function Page() { await protect(["owner", "admin"]); if (fixturesEnabled) return <CrmMarketing/>; return <Shell><Unavailable title="marketing"/></Shell>; }
