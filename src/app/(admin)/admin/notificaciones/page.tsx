import { CrmNotificaciones } from "@/features/crm/CrmComunicacion";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["NOTIFICATIONS"]} publicView={false}><CrmNotificaciones/></LiveData>;}
