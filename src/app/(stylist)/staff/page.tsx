import { StylistOverview } from "@/features/stylist/StylistPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["APPOINTMENTS"]} publicView={false}><StylistOverview/></LiveData>;}
