import { CrmProveedores } from "@/features/crm/CrmInventario";
import { LiveData } from "@/features/data/LiveData";
import { protect } from "@/server/route-guard";
export default async function Page(){await protect(["owner", "admin"]);return <LiveData resources={["SUPPLIERS","PURCHASES"]} publicView={false}><CrmProveedores/></LiveData>;}
