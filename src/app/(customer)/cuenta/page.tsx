import { CustomerOverview } from "@/features/customer/CustomerPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["APPOINTMENTS","STYLISTS"]} publicView={false}><CustomerOverview/></LiveData>;}
