import { StylistMessages } from "@/features/stylist/StylistPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["CONVERSATIONS"]} publicView={false}><StylistMessages/></LiveData>;}
