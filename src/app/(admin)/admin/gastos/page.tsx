import { CrmGastos } from "@/features/crm/CrmFinanzas";
import { LiveData } from "@/features/data/LiveData";
import { protect } from "@/server/route-guard";
export default async function Page(){await protect(["owner", "admin"]);return <LiveData resources={["EXPENSES"]} publicView={false}><CrmGastos/></LiveData>;}
