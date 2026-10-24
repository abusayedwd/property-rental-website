import { SITE_URL, API_URL } from "@/utils/site";
import { listingPath } from "@/utils/listing";

export const revalidate = 3600; // rebuild the sitemap at most once an hour

const STATIC_ROUTES = ["", "/property", "/seeAllRentHome", "/seeAllSell", "/aboutus", "/blog", "/contact-us", "/privacy", "/terms", "/auth/login", "/auth/singup"];

async function getPropertyIds() {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/v1/property/getAllProperties?limit=1000`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    return ((await res.json())?.data?.attributes?.results || []).map((p) => ({ path: listingPath(p), updatedAt: p.updatedAt }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();
  const properties = await getPropertyIds();
  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: route === "" || route === "/property" ? "daily" : "monthly",
      priority: route === "" ? 1 : 0.7,
    })),
    ...properties.map((p) => ({
      url: `${SITE_URL}${p.path}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
