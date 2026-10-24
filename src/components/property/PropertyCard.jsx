"use client";
import Link from "next/link";
import { Skeleton } from "antd";
import { MdOutlineBed } from "react-icons/md";
import { LuBath } from "react-icons/lu";
import { HiOutlineMapPin, HiOutlineHomeModern, HiOutlinePhoto, HiOutlineBolt } from "react-icons/hi2";
import { formatPrice } from "@/utils/formatPrice";
import FavoriteButton from "@/components/FavoriteButton";
import { mediaUrl } from "@/utils/media";
import { useT } from "@/i18n/LanguageProvider";
import { listingPath, labelOf, PROPERTY_TYPES } from "@/utils/listing";

const STATUS = {
  rent: { label: "For Rent", className: "bg-primary text-white" },
  "for rent": { label: "For Rent", className: "bg-primary text-white" },
  sell: { label: "For Sale", className: "bg-blue-600 text-white" },
  "for sell": { label: "For Sale", className: "bg-blue-600 text-white" },
  sale: { label: "For Sale", className: "bg-blue-600 text-white" }, // sample data
  rented: { label: "Rented", className: "bg-gray-800/80 text-white" },
  sold: { label: "Sold", className: "bg-gray-800/80 text-white" },
};

export const propertyStatus = (type) => STATUS[type] || { label: "Property", className: "bg-gray-700 text-white" };

const imageSrc = (property) =>
  mediaUrl(property?.images?.[0]?.url) || "/images/luxury_apartments.jpg";

/**
 * Shared listing card.
 * - `actions`: optional footer (e.g. owner buttons on My Property)
 * - `topRight`: replaces the favorite heart (e.g. an owner menu)
 */
const STATUS_KEYS = { rent: "card.forRent", "for rent": "card.forRent", sell: "card.forSale", "for sell": "card.forSale", sale: "card.forSale", rented: "card.rented", sold: "card.sold" };

const PropertyCard = ({ property, actions, topRight, showFavorite = true, className = "" }) => {
  const t = useT();
  const status = propertyStatus(property.propertyType);
  const statusLabel = STATUS_KEYS[property.propertyType] ? t(STATUS_KEYS[property.propertyType]) : status.label;
  const isClosed = ["sold", "rented"].includes(property.propertyType);
  const isRent = ["rent", "for rent", "rented"].includes(property.propertyType);
  const location = [property.subState, property.state].filter(Boolean).join(", ") || property.place;
  const photoCount = property.images?.length || 0;
  // Sample cards (shown when there are no listings yet) have no details page
  const href = listingPath(property);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/70 ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={href} aria-label={property.houseName} className="block h-full">
          <img
            src={imageSrc(property)}
            alt={property.houseName || "Property"}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isClosed ? "grayscale-[40%]" : ""}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10" />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm ${status.className}`}>{statusLabel}</span>
          {property.isPromotion && !isClosed && (
            <span className="flex items-center gap-1 rounded-md bg-amber-400 px-2 py-1 text-xs font-semibold text-amber-950 shadow-sm">
              <HiOutlineBolt size={12} /> {t("card.featured")}
            </span>
          )}
          {isRent && !isClosed && ["family", "bachelor"].includes(property.tenantType) && (
            <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-navy shadow-sm">
              {property.tenantType === "family" ? t("card.family") : t("card.bachelor")}
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 z-10">
          {topRight ?? (showFavorite && <FavoriteButton propertyId={property.id} />)}
        </div>

        {photoCount > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <HiOutlinePhoto size={14} /> {photoCount}
          </span>
        )}
      </div>

      {/* Body */}
      <Link href={href} className="flex flex-1 flex-col p-4">
        <p className="text-xl font-bold text-navy">
          {formatPrice(property.price)}
          {isRent && <span className="text-sm font-medium text-gray-400"> {t("card.perMonth")}</span>}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold text-gray-800 transition-colors group-hover:text-primaryDark">
          {property.houseName || "Unnamed property"}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <HiOutlineMapPin size={15} className="shrink-0 text-primaryDark" />
          <span className="line-clamp-1">{location || t("card.noLocation")}</span>
        </p>

        <div className="flex-1" />
        <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1.5" title="Bedrooms">
            <MdOutlineBed size={18} className="text-gray-400" /> {property.rooms ?? 0} <span className="hidden xl:inline">{t("card.beds")}</span>
          </span>
          <span className="flex items-center gap-1.5" title="Bathrooms">
            <LuBath size={16} className="text-gray-400" /> {property.baths ?? 0} <span className="hidden xl:inline">{t("card.baths")}</span>
          </span>
          <span className="ml-auto flex min-w-0 items-center gap-1.5 capitalize" title="Property type">
            <HiOutlineHomeModern size={16} className="shrink-0 text-gray-400" />
            <span className="truncate">{labelOf(PROPERTY_TYPES, property.type) || "—"}</span>
          </span>
        </div>
      </Link>

      {actions && <div className="border-t border-gray-100 bg-gray-50/60 p-3">{actions}</div>}
    </article>
  );
};

export const PropertyCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <Skeleton.Image active className="!aspect-[4/3] !h-auto !w-full" />
    <div className="p-4">
      <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 2, width: ["80%", "60%"] }} />
    </div>
  </div>
);

export default PropertyCard;
