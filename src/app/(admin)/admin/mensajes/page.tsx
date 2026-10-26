import { CrmMensajes } from "@/features/crm/CrmComunicacion";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["CONVERSATIONS"]} publicView={false}><CrmMensajes/></LiveData>;}
