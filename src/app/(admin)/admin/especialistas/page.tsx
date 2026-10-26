import { CrmEspecialistas } from "@/features/crm/CrmPersonal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["STYLISTS"]} publicView={false}><CrmEspecialistas/></LiveData>;}
