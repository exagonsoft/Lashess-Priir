import CrmDashboard from "@/features/crm/CrmDashboard";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["APPOINTMENTS","REVIEWS","PRODUCTS","CONVERSATIONS"]} publicView={false}><CrmDashboard/></LiveData>;}
