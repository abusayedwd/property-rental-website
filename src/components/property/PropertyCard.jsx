"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Skeleton } from "antd";
import { MdOutlineBed } from "react-icons/md";
import { LuBath } from "react-icons/lu";
import {
  HiOutlineMapPin,
  HiOutlineBolt,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineSquare3Stack3D,
  HiOutlineClock,
  HiOutlineHomeModern,
} from "react-icons/hi2";
import { formatPrice } from "@/utils/formatPrice";
import FavoriteButton from "@/components/FavoriteButton";
import { mediaUrl } from "@/utils/media";
import { listingPath, labelOf, PROPERTY_TYPES } from "@/utils/listing";
import { useLanguage } from "@/i18n/LanguageProvider";

const STATUS = {
  rent: { key: "card.forRent", label: "For Rent", className: "bg-primary text-white" },
  "for rent": { key: "card.forRent", label: "For Rent", className: "bg-primary text-white" },
  sell: { key: "card.forSale", label: "For Sale", className: "bg-blue-600 text-white" },
  "for sell": { key: "card.forSale", label: "For Sale", className: "bg-blue-600 text-white" },
  sale: { key: "card.forSale", label: "For Sale", className: "bg-blue-600 text-white" }, // sample data
  rented: { key: "card.rented", label: "Rented", className: "bg-gray-800/80 text-white" },
  sold: { key: "card.sold", label: "Sold", className: "bg-gray-800/80 text-white" },
};

export const propertyStatus = (type) => STATUS[type] || { label: "Property", className: "bg-gray-700 text-white" };

const FALLBACK_IMAGE = "/images/luxury_apartments.jpg";
const DAY = 24 * 60 * 60 * 1000;

// "Today", "3 days ago", "2 weeks ago" (English) or the Bangla equivalent
const listedAgo = (date, lang) => {
  if (!date) return null;
  const days = Math.floor((Date.now() - new Date(date).getTime()) / DAY);
  if (Number.isNaN(days) || days < 0) return null;
  const bn = lang === "bn";
  const n = (v) => (bn ? String(v).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : v);
  if (days === 0) return bn ? "আজ" : "Today";
  if (days === 1) return bn ? "গতকাল" : "Yesterday";
  if (days < 7) return bn ? `${n(days)} দিন আগে` : `${days} days ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return bn ? `${n(w)} সপ্তাহ আগে` : `${w} ${w === 1 ? "week" : "weeks"} ago`;
  }
  const m = Math.floor(days / 30);
  if (m < 12) return bn ? `${n(m)} মাস আগে` : `${m} ${m === 1 ? "month" : "months"} ago`;
  return bn ? "এক বছরের বেশি" : "Over a year ago";
};

// Photos inside the card: arrows on hover (desktop), swipe on touch screens
const PhotoSlider = ({ images, alt, href, dimmed }) => {
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);
  const count = images.length;
  const go = (e, step) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + step + count) % count);
  };

  return (
    <div
      className="relative h-full w-full"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) setIndex((i) => (i + (dx < 0 ? 1 : -1) + count) % count);
        touchX.current = null;
      }}
    >
      <Link href={href} aria-label={alt} className="block h-full">
        <img
          src={mediaUrl(images[index]?.url) || FALLBACK_IMAGE}
          alt={alt}
          loading="lazy"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${dimmed ? "grayscale-[50%]" : ""}`}
        />
      </Link>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(e, -1)}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
          >
            <HiChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(e, 1)}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
          >
            <HiChevronRight size={18} />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-14 z-10 flex justify-center gap-1">
            {images.slice(0, 5).map((img, i) => (
              <span
                key={img._id || i}
                className={`h-1.5 rounded-full bg-white shadow transition-all ${i === Math.min(index, 4) ? "w-4 opacity-100" : "w-1.5 opacity-60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Shared listing card.
 * - `actions`: optional footer (e.g. owner buttons on My Property)
 * - `topRight`: replaces the favorite heart (e.g. an owner menu)
 */
const PropertyCard = ({ property, actions, topRight, showFavorite = true, className = "" }) => {
  const { t, lang } = useLanguage();
  const status = propertyStatus(property.propertyType);
  const statusLabel = status.key ? t(status.key) : status.label;
  const isClosed = ["sold", "rented"].includes(property.propertyType);
  const isRent = ["rent", "for rent", "rented"].includes(property.propertyType);
  const location = [property.subState, property.state].filter(Boolean).join(", ") || property.place;
  const href = listingPath(property);
  const images = property.images?.length ? property.images : [{ url: "" }];
  const isNew = property.createdAt && Date.now() - new Date(property.createdAt).getTime() < 7 * DAY;
  const ago = listedAgo(property.createdAt, lang);
  const tenant = isRent && ["family", "bachelor"].includes(property.tenantType) ? t(`card.${property.tenantType}`) : null;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(34,47,85,0.35)] ${className}`}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <PhotoSlider images={images} alt={property.houseName || "Property"} href={href} dimmed={isClosed} />

        {/* Darkens the bottom so the price reads on any photo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {!isClosed && (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${status.className}`}>{statusLabel}</span>
          )}
          {property.isPromotion && !isClosed && (
            <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-950 shadow-sm">
              <HiOutlineBolt size={12} /> {t("card.featured")}
            </span>
          )}
          {isNew && !isClosed && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy shadow-sm">
              {lang === "bn" ? "নতুন" : "New"}
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 z-10">
          {topRight ?? (showFavorite && <FavoriteButton propertyId={property.id} />)}
        </div>

        {isClosed && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="rotate-[-8deg] rounded-lg border-2 border-white/90 px-4 py-1 text-lg font-bold uppercase tracking-widest text-white">
              {statusLabel}
            </span>
          </div>
        )}

        {/* Price on the photo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 px-4 pb-3">
          <p className="text-xl font-bold leading-tight text-white drop-shadow md:text-[22px]">
            {formatPrice(property.price)}
            {isRent && <span className="text-sm font-medium text-white/80"> {t("card.perMonth")}</span>}
          </p>
          {property.negotiable && !isClosed && (
            <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {lang === "bn" ? "আলোচনা সাপেক্ষ" : "Negotiable"}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <Link href={href} className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3 className="line-clamp-1 text-[17px] font-semibold text-navy transition-colors group-hover:text-primaryDark">
          {property.houseName || "Unnamed property"}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <HiOutlineMapPin size={15} className="shrink-0 text-primary" />
          <span className="line-clamp-1">{location || t("card.noLocation")}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5 text-[13px] text-gray-700">
          <span className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 ring-1 ring-gray-100" title="Bedrooms">
            <MdOutlineBed size={16} className="text-gray-400" /> {property.rooms ?? 0} {t("card.beds")}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 ring-1 ring-gray-100" title="Bathrooms">
            <LuBath size={14} className="text-gray-400" /> {property.baths ?? 0} {t("card.baths")}
          </span>
          {property.sizeSqft > 0 && (
            <span className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 ring-1 ring-gray-100" title="Size">
              <HiOutlineSquare3Stack3D size={14} className="text-gray-400" /> {Number(property.sizeSqft).toLocaleString("en-IN")} {lang === "bn" ? "বর্গফুট" : "sq ft"}
            </span>
          )}
        </div>

        <div className="flex-1" />
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span className="flex min-w-0 items-center gap-1.5">
            <HiOutlineHomeModern size={15} className="shrink-0 text-gray-400" />
            <span className="truncate">{labelOf(PROPERTY_TYPES, property.type) || "—"}</span>
            {tenant && <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-medium text-primaryDark">{tenant}</span>}
          </span>
          {ago && (
            <span className="flex shrink-0 items-center gap-1">
              <HiOutlineClock size={14} className="text-gray-400" /> {ago}
            </span>
          )}
        </div>
      </Link>

      {actions && <div className="border-t border-gray-100 bg-gray-50/60 p-3">{actions}</div>}
    </article>
  );
};

export const PropertyCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
    <Skeleton.Image active className="!aspect-[4/3] !h-auto !w-full" />
    <div className="p-4">
      <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 2, width: ["80%", "50%"] }} />
    </div>
  </div>
);

export default PropertyCard;
