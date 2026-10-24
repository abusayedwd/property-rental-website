"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PropertyListing from "@/components/property/PropertyListing";
import { useT } from "@/i18n/LanguageProvider";

const FILTER_KEYS = ["search", "state", "subState", "propertyType", "type", "minPrice", "maxPrice", "minRooms", "tenantType", "furnishing"];
const NUMERIC = ["minPrice", "maxPrice"];

// Filters can come from the address bar, e.g. /property?state=Dhaka&propertyType=rent (saved searches, shared links)
const Results = () => {
  const params = useSearchParams();
  const t = useT();
  const initialFilters = Object.fromEntries(
    FILTER_KEYS.filter((k) => params.get(k)).map((k) => [k, NUMERIC.includes(k) ? Number(params.get(k)) : params.get(k)])
  );
  return (
    <PropertyListing
      key={params.toString()}
      initialFilters={initialFilters}
      title={Object.keys(initialFilters).length ? t("search.results") : t("search.title")}
      subtitle={t("search.subtitle")}
    />
  );
};

export default function PropertyPage() {
  return (
    <Suspense fallback={null}>
      <Results />
    </Suspense>
  );
}
