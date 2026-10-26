import { ReviewsPage } from "@/features/public/MorePages";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["REVIEWS","SERVICES","STYLISTS"]} publicView={true}><ReviewsPage/></LiveData>;}
