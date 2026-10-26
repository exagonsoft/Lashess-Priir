import { StylistReviews } from "@/features/stylist/StylistPortal";
import { LiveData } from "@/features/data/LiveData";
export default function Page(){return <LiveData resources={["REVIEWS"]} publicView={false}><StylistReviews/></LiveData>;}
