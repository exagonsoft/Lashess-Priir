import { CustomerReviews } from "@/features/customer/CustomerPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["REVIEWS"]} publicView={false}><CustomerReviews/></LiveData>;}
