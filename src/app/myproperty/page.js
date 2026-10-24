import { Suspense } from "react";
import MyProperty from "@/components/landloards/MyProperty";

export default function MyPropertyPage() {
  return (
    <Suspense fallback={null}>
      <MyProperty />
    </Suspense>
  );
}
