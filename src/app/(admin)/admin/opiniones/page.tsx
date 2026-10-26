import { CrmOpiniones } from "@/features/crm/CrmComunicacion";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["REVIEWS"]} publicView={false}><CrmOpiniones/></LiveData>;}
