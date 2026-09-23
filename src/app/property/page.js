"use client";

import CustomBanner from "@/components/customComponent/customBanner";
import AllProperty from "@/components/AllProperty";

export default function PropertyPage() {
  return (
    <div>
      <CustomBanner
        title="Browse Properties"
        subtitle="Explore homes for rent and sale across every neighborhood"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Property" }]}
      />
      <AllProperty searchCriteria={null} />
    </div>
  );
}
