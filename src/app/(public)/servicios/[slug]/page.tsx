import { ServiceDetailPage } from "@/features/public/Services";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["SERVICES","STYLISTS","REVIEWS"]} publicView={true}><ServiceDetailPage/></LiveData>;}
