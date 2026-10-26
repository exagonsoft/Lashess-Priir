import { CustomerProfile } from "@/features/customer/CustomerPortal";
import { fixturesEnabled } from "@/lib/fixtures";
import Unavailable from "@/features/Unavailable";
import Profile from "@/features/auth/Profile";
import { Shell } from "@/features/customer/CustomerPortal";

export default function Page() {  if (fixturesEnabled) return <CustomerProfile/>; return <Shell><Profile/></Shell>; }
