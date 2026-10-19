"use client";
import PropertyListing from "@/components/property/PropertyListing";

// Property search results: used on /property and for the home page search
const AllProperty = ({ searchCriteria }) => (
  <PropertyListing
    key={JSON.stringify(searchCriteria || {})}
    initialFilters={{
      state: searchCriteria?.selectedState,
      subState: searchCriteria?.selectedSubState,
      propertyType: searchCriteria?.transactionType,
    }}
    title={searchCriteria ? "Search results" : "Find your next home"}
    subtitle="Filter by area, price, bedrooms and property type."
  />
);

export default AllProperty;
