import { StylistProfile } from "@/features/stylist/StylistPortal";
import { fixturesEnabled } from "@/lib/fixtures";
import Unavailable from "@/features/Unavailable";
import Profile from "@/features/auth/Profile";
import { Shell } from "@/features/stylist/StylistPortal";

export default function Page() {  if (fixturesEnabled) return <StylistProfile/>; return <Shell><Profile/></Shell>; }
