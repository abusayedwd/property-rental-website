import { Suspense } from "react";
import Viewings from "@/components/Viewings";

export default function ViewingsPage() {
  return (
    <Suspense>
      <Viewings />
    </Suspense>
  );
}
