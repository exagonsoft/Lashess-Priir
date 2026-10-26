import { StylistDetailPage } from "@/features/public/Stylists";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["STYLISTS","SERVICES","REVIEWS"]} publicView={true}><StylistDetailPage/></LiveData>;}
