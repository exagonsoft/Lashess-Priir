import { CustomerPayments } from "@/features/customer/CustomerPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["PAYMENTS"]} publicView={false}><CustomerPayments/></LiveData>;}
