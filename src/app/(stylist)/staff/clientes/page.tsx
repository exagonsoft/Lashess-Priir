import { StylistClients } from "@/features/stylist/StylistPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["CUSTOMERS"]} publicView={false}><StylistClients/></LiveData>;}
