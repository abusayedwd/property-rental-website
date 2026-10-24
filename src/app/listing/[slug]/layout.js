import { API_URL, PUBLIC_API_URL, SITE_URL } from "@/utils/site";
import { idFromSlug, listingPath } from "@/utils/listing";

const STATUS = { rent: "For rent", sell: "For sale", rented: "Rented", sold: "Sold" };

const formatTaka = (price) => {
  const n = Number(String(price ?? "").replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? `৳${n.toLocaleString("en-IN")}` : null;
};

const absoluteImage = (path) => (!path ? null : /^https?:\/\//.test(path) ? path : `${PUBLIC_API_URL}${path}`);

async function getProperty(slug) {
  const id = idFromSlug(slug);
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
  const { slug } = await params;
  const property = await getProperty(slug);

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
  const image = absoluteImage(property.images?.[0]?.url) || "/images/Hero.jpg";
  const title = property.houseName || "Property details";
  const path = listingPath(property);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${title} | MyNextHome`,
      description,
      url: path,
      images: [{ url: image, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// Structured data so search engines can show price and location in results
export default async function Layout({ children, params }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  const jsonLd = property && {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.houseName,
    description: property.textArea?.slice(0, 500),
    url: `${SITE_URL}${listingPath(property)}`,
    image: (property.images || []).map((img) => absoluteImage(img.url)).filter(Boolean),
    datePosted: property.createdAt,
    offers: {
      "@type": "Offer",
      price: Number(property.price) || undefined,
      priceCurrency: "BDT",
      businessFunction: property.propertyType === "rent" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
      availability: ["sold", "rented"].includes(property.propertyType) ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.place,
      addressLocality: property.subState,
      addressRegion: property.state,
      addressCountry: "BD",
    },
    ...(property.location?.coordinates?.length === 2 && {
      geo: { "@type": "GeoCoordinates", latitude: property.location.coordinates[1], longitude: property.location.coordinates[0] },
    }),
  };

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      {children}
    </>
  );
}
