// Shared site settings for metadata, sitemap and social previews
export const SITE_NAME = "MyNextHome";
export const SITE_TAGLINE = "Find homes to rent or buy in Bangladesh";
export const SITE_DESCRIPTION =
  "Search flats, apartments, duplexes and plots for rent or sale across all 64 districts of Bangladesh. Compare prices in Taka and message owners directly.";

// Public address of the website. Set NEXT_PUBLIC_SITE_URL in production
// (e.g. https://mynexthome.vercel.app); Vercel's own URL is used as a fallback.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3004";

const PUBLIC_API = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");

// Backend address for server-side fetches (metadata, sitemap). Prefers the
// direct BACKEND_URL; a relative NEXT_PUBLIC_BASE_URL ("/backend") is resolved
// against the site address.
export const API_URL =
  process.env.BACKEND_URL?.replace(/\/+$/, "") || (PUBLIC_API.startsWith("/") ? `${SITE_URL}${PUBLIC_API}` : PUBLIC_API);

// Public, absolute address for backend files (e.g. property photos in share previews)
export const PUBLIC_API_URL = PUBLIC_API.startsWith("/") ? `${SITE_URL}${PUBLIC_API}` : PUBLIC_API;

// For pages that belong to a logged-in user and shouldn't appear in search results
export const PRIVATE_PAGE = { robots: { index: false, follow: false } };
