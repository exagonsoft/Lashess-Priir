import Home from "@/features/public/Home";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["SERVICES","STYLISTS","REVIEWS"]} publicView={true}><Home/></LiveData>;}
