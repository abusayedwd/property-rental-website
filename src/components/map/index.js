"use client";
// Leaflet needs the browser, so every map is loaded on the client only
import dynamic from "next/dynamic";

const placeholder = (height) => {
  const Placeholder = () => <div className="animate-pulse rounded-xl bg-gray-100" style={{ height }} />;
  return Placeholder;
};

export const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), { ssr: false, loading: placeholder(320) });
export const ListingLocationMap = dynamic(() => import("./ListingLocationMap"), { ssr: false, loading: placeholder(320) });
export const SearchResultsMap = dynamic(() => import("./SearchResultsMap"), { ssr: false, loading: placeholder(560) });
