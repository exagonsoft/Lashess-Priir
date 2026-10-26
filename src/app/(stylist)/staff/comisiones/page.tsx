import { StylistCommissions } from "@/features/stylist/StylistPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["COMMISSIONS"]} publicView={false}><StylistCommissions/></LiveData>;}
