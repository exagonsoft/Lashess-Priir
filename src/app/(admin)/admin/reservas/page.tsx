import { CrmReservas } from "@/features/crm/CrmAgendaReservas";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["APPOINTMENTS","SERVICES","PRODUCTS"]} publicView={false}><CrmReservas/></LiveData>;}
