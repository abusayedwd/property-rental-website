"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input, InputNumber, Pagination, Select, Segmented } from "antd";
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineAdjustmentsHorizontal, HiOutlineHomeModern } from "react-icons/hi2";
import { useGetAllpropertyQuery } from "@/redux/fetures/property/getAllProperty";
import { districtOptions, getAreaOptions, filterLocationOption } from "@/components/statesData";
import PropertyCard, { PropertyCardSkeleton } from "./PropertyCard";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "isPromotion:desc,createdAt:desc", label: "Recommended" },
  { value: "createdAt:desc", label: "Newest first" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
];

// Same values the Add Property form uses
const TYPE_OPTIONS = ["duplex", "bungalow", "studio", "flat", "self-con", "warehouse", "other"].map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

const BED_OPTIONS = [
  { value: "", label: "Any beds" },
  ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+ beds` })),
];

const takaFormatter = (v) => (v ? `৳ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "");
const takaParser = (v) => (v ? v.replace(/[৳,\s]/g, "") : "");

const EMPTY_FILTERS = { search: "", state: undefined, subState: undefined, propertyType: "", type: undefined, minPrice: null, maxPrice: null, minRooms: "" };

const useDebounced = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

/**
 * Searchable, filterable property grid.
 * - `initialFilters`: e.g. { state, subState, propertyType } from the home search
 * - `lockedType`: "rent" | "sell" to fix the listing type (See all pages)
 */
const PropertyListing = ({ initialFilters = {}, lockedType, title = "Browse properties", subtitle }) => {
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    ...Object.fromEntries(Object.entries(initialFilters).filter(([, v]) => v)),
    ...(lockedType ? { propertyType: lockedType } : {}),
  }));
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const topRef = useRef(null);

  const search = useDebounced(filters.search);
  const minPrice = useDebounced(filters.minPrice);
  const maxPrice = useDebounced(filters.maxPrice);

  const params = useMemo(
    () => ({
      search,
      state: filters.state,
      subState: filters.subState,
      propertyType: filters.propertyType,
      type: filters.type,
      minPrice,
      maxPrice,
      minRooms: filters.minRooms,
      sortBy,
      page,
      limit: PAGE_SIZE,
    }),
    [search, filters.state, filters.subState, filters.propertyType, filters.type, minPrice, maxPrice, filters.minRooms, sortBy, page]
  );

  const { data, isLoading, isFetching, isError } = useGetAllpropertyQuery(params);
  const result = data?.data?.attributes;
  const properties = result?.results || [];
  const total = result?.totalResults || 0;

  const update = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const clearAll = () => {
    setFilters({ ...EMPTY_FILTERS, ...(lockedType ? { propertyType: lockedType } : {}) });
    setPage(1);
  };

  const changePage = (p) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Chips for every active filter, each removable on its own
  const chips = [
    filters.search && { key: "search", label: `"${filters.search}"`, clear: { search: "" } },
    filters.state && { key: "state", label: filters.state, clear: { state: undefined, subState: undefined } },
    filters.subState && { key: "subState", label: filters.subState, clear: { subState: undefined } },
    !lockedType && filters.propertyType && { key: "pt", label: filters.propertyType === "sell" ? "For sale" : "For rent", clear: { propertyType: "" } },
    filters.type && { key: "type", label: filters.type, clear: { type: undefined } },
    filters.minRooms && { key: "beds", label: `${filters.minRooms}+ beds`, clear: { minRooms: "" } },
    filters.minPrice != null && { key: "min", label: `Min ${takaFormatter(filters.minPrice)}`, clear: { minPrice: null } },
    filters.maxPrice != null && { key: "max", label: `Max ${takaFormatter(filters.maxPrice)}`, clear: { maxPrice: null } },
  ].filter(Boolean);

  const showSkeleton = isLoading || (isFetching && !properties.length);

  return (
    <section className="bg-gray-50 pb-16" ref={topRef}>
      <div className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              size="large"
              allowClear
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              prefix={<HiOutlineMagnifyingGlass className="mr-1 text-gray-400" size={18} />}
              placeholder="Search by name, area or address"
              className="!rounded-lg md:flex-1"
            />
            {!lockedType && (
              <Segmented
                size="large"
                value={filters.propertyType}
                onChange={(v) => update({ propertyType: v })}
                options={[
                  { label: "All", value: "" },
                  { label: "Rent", value: "rent" },
                  { label: "Buy", value: "sell" },
                ]}
                className="self-start md:self-auto"
              />
            )}
            <button
              type="button"
              onClick={() => setShowMore((s) => !s)}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 md:hidden"
            >
              <HiOutlineAdjustmentsHorizontal size={18} /> {showMore ? "Hide filters" : "More filters"}
            </button>
          </div>

          <div className={`mt-3 grid-cols-2 gap-3 md:grid lg:grid-cols-6 ${showMore ? "grid" : "hidden"}`}>
            <Select
              size="large"
              className="col-span-2 md:col-span-1 lg:col-span-1"
              placeholder="District"
              value={filters.state}
              onChange={(v) => update({ state: v, subState: undefined })}
              options={districtOptions}
              showSearch
              allowClear
              filterOption={filterLocationOption}
            />
            <Select
              size="large"
              className="col-span-2 md:col-span-1 lg:col-span-1"
              placeholder={filters.state ? "Area" : "Area (pick district)"}
              value={filters.subState}
              onChange={(v) => update({ subState: v })}
              options={getAreaOptions(filters.state)}
              disabled={!filters.state}
              showSearch
              allowClear
              filterOption={filterLocationOption}
            />
            <Select
              size="large"
              placeholder="Property type"
              value={filters.type}
              onChange={(v) => update({ type: v })}
              options={TYPE_OPTIONS}
              allowClear
            />
            <Select size="large" value={filters.minRooms} onChange={(v) => update({ minRooms: v })} options={BED_OPTIONS} />
            <InputNumber
              size="large"
              className="!w-full"
              min={0}
              step={5000}
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(v) => update({ minPrice: v })}
              formatter={takaFormatter}
              parser={takaParser}
            />
            <InputNumber
              size="large"
              className="!w-full"
              min={0}
              step={5000}
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(v) => update({ maxPrice: v })}
              formatter={takaFormatter}
              parser={takaParser}
            />
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => update(chip.clear)}
                  className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-medium capitalize text-primaryDark transition-colors hover:bg-primary/20"
                >
                  {chip.label} <HiOutlineXMark size={14} />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="ml-1 text-sm font-medium text-gray-500 underline-offset-2 hover:text-red-500 hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results header */}
        <div className="mb-4 mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-gray-600">
            {showSkeleton ? (
              "Searching..."
            ) : (
              <>
                <span className="font-semibold text-navy">{total}</span> {total === 1 ? "property" : "properties"} found
              </>
            )}
          </p>
          <Select value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} options={SORT_OPTIONS} className="w-52" />
        </div>

        {/* Grid */}
        {isError ? (
          <p className="rounded-2xl bg-white p-10 text-center text-red-500 shadow-sm">Could not load properties. Please try again.</p>
        ) : showSkeleton ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primaryDark">
              <HiOutlineHomeModern size={30} />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-navy">No properties match your filters</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">Try a different area, widen your price range, or clear some filters.</p>
            {chips.length > 0 && (
              <button type="button" onClick={clearAll} className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primaryDark">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 transition-opacity md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="mt-10 flex justify-center">
            <Pagination current={page} pageSize={PAGE_SIZE} total={total} onChange={changePage} showSizeChanger={false} />
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyListing;
