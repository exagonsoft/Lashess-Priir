import { CustomerMessages } from "@/features/customer/CustomerPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["CONVERSATIONS"]} publicView={false}><CustomerMessages/></LiveData>;}
