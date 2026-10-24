"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { HiXMark } from "react-icons/hi2";
import baseUrl from "@/redux/api/baseUrl";
import { formatPrice } from "@/utils/formatPrice";
import { mediaUrl } from "@/utils/media";
import { listingPath } from "@/utils/listing";
import { DHAKA, BANGLADESH_BOUNDS, TILE_URL, TILE_ATTRIBUTION, priceIcon } from "./leafletBase";

const toQuery = (params) =>
  new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")).toString();

// Reload pins whenever the visible area changes
const BoundsWatcher = ({ onBounds }) => {
  const map = useMapEvents({
    moveend: () => onBounds(map.getBounds()),
  });
  useEffect(() => {
    onBounds(map.getBounds());
  }, [map, onBounds]);
  return null;
};

const SearchResultsMap = ({ filters = {}, height = 560 }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const boundsRef = useRef(null);
  const timer = useRef(null);
  const filterKey = JSON.stringify(filters);

  const load = useCallback(
    (bounds) => {
      if (!bounds) return;
      boundsRef.current = bounds;
      clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].map((n) => n.toFixed(5)).join(",");
        setLoading(true);
        try {
          const res = await fetch(`${baseUrl}/v1/property/map?${toQuery({ ...JSON.parse(filterKey), bbox })}`);
          const json = await res.json();
          setPins(json?.data?.attributes || []);
        } catch {
          setPins([]);
        } finally {
          setLoading(false);
        }
      }, 250);
    },
    [filterKey]
  );

  // Filters changed: reload the current area
  useEffect(() => {
    if (boundsRef.current) load(boundsRef.current);
  }, [load]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height }}>
      <MapContainer center={DHAKA} zoom={12} minZoom={7} maxBounds={BANGLADESH_BOUNDS} maxBoundsViscosity={0.8} style={{ height: "100%", width: "100%" }} className="z-0">
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <BoundsWatcher onBounds={load} />
        {pins.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={priceIcon(p.price, { featured: p.isPromotion, active: selected?.id === p.id })}
            eventHandlers={{ click: () => setSelected(p) }}
          />
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute left-3 top-3 z-[400] rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-700 shadow">
        {loading ? "Loading…" : pins.length ? `${pins.length} ${pins.length === 1 ? "home" : "homes"} in this area` : "No homes with a map pin here. Try zooming out."}
      </div>

      {selected && (
        <div className="absolute inset-x-3 bottom-3 z-[400] mx-auto flex max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
          <Link href={listingPath(selected)} className="flex min-w-0 flex-1">
            <img src={mediaUrl(selected.image, "/images/luxury_apartments.jpg")} alt="" className="h-24 w-28 shrink-0 object-cover" />
            <div className="min-w-0 p-3">
              <p className="font-bold text-navy">
                {formatPrice(selected.price)}
                {selected.propertyType === "rent" && <span className="text-xs font-medium text-gray-500"> /month</span>}
              </p>
              <p className="truncate text-sm font-medium text-gray-800">{selected.houseName}</p>
              <p className="truncate text-xs text-gray-500">
                {[selected.subState, selected.state].filter(Boolean).join(", ")} · {selected.rooms} bed · {selected.baths} bath
              </p>
            </div>
          </Link>
          <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="self-start p-2 text-gray-400 hover:text-gray-700">
            <HiXMark size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsMap;
