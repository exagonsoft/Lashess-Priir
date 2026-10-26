import { StylistServices } from "@/features/stylist/StylistPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["SERVICES"]} publicView={false}><StylistServices/></LiveData>;}
