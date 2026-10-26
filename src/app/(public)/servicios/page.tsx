import { ServicesPage } from "@/features/public/Services";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["SERVICES"]} publicView={true}><ServicesPage/></LiveData>;}
