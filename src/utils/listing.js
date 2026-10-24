// Readable listing address, e.g. /listing/3-bed-flat-dhanmondi-dhaka-66f1c0...
// Keep in sync with the API's src/utils/listingUrl.js.
export const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .slice(0, 70)
    .replace(/-+$/, "");

export const listingPath = (property) => {
  if (!property) return "/property";
  const id = String(property.id || property._id || "");
  if (!id || id.startsWith("demo-")) return "/property";
  const words = slugify([property.houseName, property.subState, property.state].filter(Boolean).join(" "));
  return `/listing/${words ? `${words}-` : ""}${id}`;
};

export const idFromSlug = (slugOrId = "") => {
  const match = String(slugOrId).match(/([a-f0-9]{24})$/i);
  return match ? match[1] : String(slugOrId);
};

export const TENANT_TYPES = [
  { value: "any", label: "Anyone" },
  { value: "family", label: "Family" },
  { value: "bachelor", label: "Bachelor" },
  { value: "office", label: "Office / commercial" },
];

export const FURNISHING = [
  { value: "furnished", label: "Furnished" },
  { value: "semi", label: "Semi-furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

export const AMENITIES = [
  { value: "gas", label: "Gas line" },
  { value: "lift", label: "Lift" },
  { value: "generator", label: "Generator" },
  { value: "parking", label: "Parking" },
  { value: "security", label: "Security guard" },
  { value: "cctv", label: "CCTV" },
  { value: "wifi", label: "Wi-Fi ready" },
  { value: "balcony", label: "Balcony" },
  { value: "water", label: "24h water" },
  { value: "rooftop", label: "Rooftop access" },
  { value: "gym", label: "Gym" },
  { value: "pool", label: "Swimming pool" },
];

export const PROPERTY_TYPES = [
  { value: "flat", label: "Flat / Apartment" },
  { value: "duplex", label: "Duplex" },
  { value: "house", label: "House" },
  { value: "bungalow", label: "Bungalow" },
  { value: "studio", label: "Studio" },
  { value: "room", label: "Room / Sublet" },
  { value: "seat", label: "Seat (mess / hostel)" },
  { value: "office", label: "Office space" },
  { value: "shop", label: "Shop" },
  { value: "plot", label: "Land / Plot" },
  { value: "warehouse", label: "Warehouse" },
  { value: "other", label: "Other" },
];

export const labelOf = (list, value) => list.find((x) => x.value === value)?.label || value;

// Moderation state shown to the owner on My Properties
export const MODERATION_LABELS = {
  pending: { label: "Waiting for review", tone: "amber" },
  rejected: { label: "Needs changes", tone: "red" },
  hidden: { label: "Hidden by admin", tone: "red" },
};
