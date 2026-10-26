import BookingFlow from "@/features/booking/BookingFlow";
import { LiveData } from "@/features/data/LiveData";
export default function Page() {
  return (
    <LiveData resources={["SERVICES", "STYLISTS"]} publicView={true}>
      <BookingFlow />
    </LiveData>
  );
}
