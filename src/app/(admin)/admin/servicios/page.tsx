import { CrmServicios } from "@/features/crm/CrmPersonal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["SERVICES","STYLISTS","PRODUCTS"]} publicView={false}><CrmServicios/></LiveData>;}
