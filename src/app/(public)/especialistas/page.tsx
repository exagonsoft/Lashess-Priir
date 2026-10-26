import { StylistsPage } from "@/features/public/Stylists";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["STYLISTS"]} publicView={true}><StylistsPage/></LiveData>;}
