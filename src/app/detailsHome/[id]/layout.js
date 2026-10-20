import { API_URL } from "@/utils/site";

const STATUS = { rent: "For rent", sell: "For sale", rented: "Rented", sold: "Sold" };

const formatTaka = (price) => {
  const n = Number(String(price ?? "").replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? `৳${n.toLocaleString("en-IN")}` : null;
};

async function getProperty(id) {
  if (!API_URL || !/^[a-f0-9]{24}$/i.test(id)) return null;
  try {
    const res = await fetch(`${API_URL}/v1/property/${id}`, {
      next: { revalidate: 300 }, // refresh the preview at most every 5 minutes
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json())?.data?.attributes || null;
  } catch {
    return null; // API unreachable: fall back to generic metadata
  }
}

// Title, description and share image built from the listing itself
export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return { title: "Property details", description: "View photos, price and details for this property on MyNextHome." };
  }

  const location = [property.subState, property.state].filter(Boolean).join(", ");
  const price = formatTaka(property.price);
  const status = STATUS[property.propertyType] || "Property";
  const facts = [
    status,
    price && `${price}${property.propertyType === "rent" ? "/month" : ""}`,
    property.rooms && `${property.rooms} bed`,
    property.baths && `${property.baths} bath`,
    location,
  ].filter(Boolean).join(" · ");
  const description = [facts, property.textArea].filter(Boolean).join(". ").slice(0, 160);
  const image = property.images?.[0]?.url ? `${API_URL}${property.images[0].url}` : "/images/Hero.jpg";
  const title = property.houseName || "Property details";

  return {
    title,
    description,
    alternates: { canonical: `/detailsHome/${id}` },
    openGraph: {
      type: "article",
      title: `${title} | MyNextHome`,
      description,
      url: `/detailsHome/${id}`,
      images: [{ url: image, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function Layout({ children }) {
  return children;
}
