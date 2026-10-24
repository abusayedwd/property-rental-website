"use client";
// Shared Leaflet setup. Only imported by client-only map components (loaded with ssr: false).
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const DHAKA = [23.8103, 90.4125];
export const BANGLADESH_BOUNDS = [
  [20.5, 88.0],
  [26.7, 92.7],
];

// Free OpenStreetMap tiles (no API key). Attribution is required by their policy.
export const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Round green pin, drawn with CSS so no marker image files are needed
export const pinIcon = L.divIcon({
  className: "",
  html: '<span style="display:block;width:28px;height:28px;border-radius:50% 50% 50% 0;background:#00BF63;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.35)"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const shortPrice = (price) => {
  const n = Number(price) || 0;
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(n % 10000000 ? 1 : 0)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L`;
  if (n >= 1000) return `৳${Math.round(n / 1000)}k`;
  return `৳${n}`;
};

// Price tag marker for the search map
export const priceIcon = (price, { featured = false, active = false } = {}) =>
  L.divIcon({
    className: "",
    html: `<span style="display:inline-block;transform:translate(-50%,-100%);white-space:nowrap;padding:4px 9px;border-radius:999px;font:600 12px/1.2 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25);border:2px solid #fff;background:${
      active ? "#222F55" : featured ? "#f59e0b" : "#00BF63"
    };color:#fff">${shortPrice(price)}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

export { L };
