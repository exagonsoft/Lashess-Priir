import { CrmAgenda } from "@/features/crm/CrmAgendaReservas";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["APPOINTMENTS","STYLISTS","SERVICES","CUSTOMERS","PRODUCTS"]} publicView={false}><CrmAgenda/></LiveData>;}
