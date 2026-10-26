import CrmClientes from "@/features/crm/CrmClientes";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["CUSTOMERS","APPOINTMENTS","REVIEWS"]} publicView={false}><CrmClientes/></LiveData>;}
