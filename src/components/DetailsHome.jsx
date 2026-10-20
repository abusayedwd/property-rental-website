"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Avatar, Button, Image, Skeleton } from "antd";
import toast from "react-hot-toast";
import {
  HiOutlineMapPin,
  HiOutlineHomeModern,
  HiOutlineCalendarDays,
  HiOutlineShare,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhoto,
  HiOutlineArrowLeft,
  HiOutlineCheckBadge,
  HiChevronRight,
  HiOutlineFlag,
  HiOutlineEye,
} from "react-icons/hi2";
import { MdOutlineBed } from "react-icons/md";
import { LuBath } from "react-icons/lu";
import { useGetSinglepropertyQuery } from "@/redux/fetures/property/getPropertyById";
import { useGetAllpropertyQuery } from "@/redux/fetures/property/getAllProperty";
import url from "@/redux/api/baseUrl";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { useCreatChatMutation } from "@/redux/fetures/messaging/createChat";
import { formatPrice } from "@/utils/formatPrice";
import FavoriteButton from "@/components/FavoriteButton";
import PropertyCard from "@/components/property/PropertyCard";
import ViewingRequestModal from "@/components/property/ViewingRequestModal";
import ReportListingModal from "@/components/property/ReportListingModal";
import { useGetViewingsQuery } from "@/redux/fetures/engagement/viewings";

const statusInfo = (type) =>
  ({
    rent: { label: "For Rent", className: "bg-primary text-white" },
    sell: { label: "For Sale", className: "bg-blue-600 text-white" },
    rented: { label: "Rented", className: "bg-gray-500 text-white" },
    sold: { label: "Sold", className: "bg-gray-500 text-white" },
  })[type] || { label: "Property", className: "bg-gray-500 text-white" };

const imageSrc = (image) => (image?.url ? `${url}${image.url}` : "/images/luxury_apartments.jpg");

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const Fact = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 md:p-4">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primaryDark shadow-sm md:h-11 md:w-11">
      <Icon size={22} />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="truncate font-semibold capitalize text-navy">{value}</p>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 py-3 text-sm last:border-0">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium capitalize text-gray-800">{value || "—"}</span>
  </div>
);

const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-lg font-semibold text-navy">{title}</h2>
    {children}
  </section>
);

const Gallery = ({ images, title }) => {
  const [preview, setPreview] = useState({ open: false, current: 0 });
  const open = (current) => setPreview({ open: true, current });
  const shown = images.slice(0, 5);
  const extra = images.length - shown.length;

  return (
    <>
      <div
        className={`grid h-[260px] gap-2 overflow-hidden rounded-2xl md:h-[420px] lg:h-[480px] ${
          shown.length > 1 ? "grid-cols-4 grid-rows-2" : "grid-cols-1"
        }`}
      >
        {shown.map((image, index) => (
          <button
            key={image._id || index}
            type="button"
            onClick={() => open(index)}
            className={`group relative overflow-hidden bg-gray-100 ${
              index === 0 ? (shown.length > 1 ? "col-span-4 row-span-2 md:col-span-2" : "") : "hidden md:block"
            } ${index > 0 && shown.length === 2 ? "md:col-span-2 md:row-span-2" : ""} ${
              index > 0 && shown.length === 3 ? "md:col-span-2" : ""
            } ${index === 3 && shown.length === 4 ? "md:col-span-2" : ""}`}
          >
            <img
              src={imageSrc(image)}
              alt={`${title} photo ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {index === shown.length - 1 && extra > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{extra} more
              </span>
            )}
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-lg transition-colors hover:bg-gray-50"
        >
          <HiOutlinePhoto size={18} /> View all {images.length} photos
        </button>
      )}

      <Image.PreviewGroup
        items={images.map(imageSrc)}
        preview={{
          visible: preview.open,
          current: preview.current,
          onVisibleChange: (visible) => setPreview((p) => ({ ...p, open: visible })),
          onChange: (current) => setPreview((p) => ({ ...p, current })),
        }}
      />
    </>
  );
};

const SimilarProperties = ({ property }) => {
  const router = useRouter();
  const { data } = useGetAllpropertyQuery(
    { state: property.state || "", subState: "", propertyType: "" },
    { skip: !property.state }
  );
  const similar = (data?.data?.attributes?.results || [])
    .filter((p) => p.id !== property.id && !["sold", "rented"].includes(p.propertyType))
    .slice(0, 3);

  if (!similar.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Similar properties</h2>
          <p className="mt-1 text-gray-500">More homes in {property.state}</p>
        </div>
        <Link href="/property" className="hidden text-sm font-medium text-primaryDark hover:underline md:block">
          View all →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {similar.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
};

const DetailsSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <Skeleton active paragraph={{ rows: 1 }} />
    <Skeleton.Image active className="!mt-6 !h-[420px] !w-full" />
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2"><Skeleton active paragraph={{ rows: 8 }} /></div>
      <Skeleton active paragraph={{ rows: 5 }} />
    </div>
  </div>
);

const DetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: user } = useLogedUserQuery();
  const viewer = user?.data?.attributes?.user;
  const [chatcreat, { isLoading: isStartingChat }] = useCreatChatMutation();

  const { data: propertys, isLoading } = useGetSinglepropertyQuery(id, { skip: !id });
  const property = propertys?.data?.attributes;

  const [viewingOpen, setViewingOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const { data: myViewings } = useGetViewingsQuery("sent", { skip: !viewer });

  if (isLoading) return <DetailsSkeleton />;

  if (!property) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <img src="/images/notfound.png" alt="" className="w-48" />
        <h1 className="mt-6 text-2xl font-bold text-navy">Property not found</h1>
        <p className="mt-2 text-gray-500">This listing may have been removed by the owner.</p>
        <Link href="/property" className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primaryDark">
          Browse properties
        </Link>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [{ url: "" }];
  const status = statusInfo(property.propertyType);
  const owner = property.landlordId;
  const location = [property.subState, property.state].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent([property.place, property.subState, property.state, "Bangladesh"].filter(Boolean).join(", "));
  const isClosed = ["sold", "rented"].includes(property.propertyType);
  const isOwner = viewer && owner?.id && viewer.id === owner.id;
  const canRequestViewing = !isClosed && !isOwner && owner?.id && viewer?.role !== "landlord";

  // The viewer's upcoming request for this property, if any
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeViewing = (myViewings?.data?.attributes || []).find(
    (v) => (v.propertyId?.id || v.propertyId) === property.id && ["pending", "confirmed"].includes(v.status) && new Date(v.date) >= today
  );

  // Viewings and reports need an account
  const requireLogin = (message) => {
    if (viewer) return true;
    toast.error(message);
    router.push("/auth/login");
    return false;
  };
  const openViewing = () => requireLogin("Please log in to request a viewing") && setViewingOpen(true);
  const openReport = () => requireLogin("Please log in to report a listing") && setReportOpen(true);

  const contactLandlord = async () => {
    if (!viewer) {
      toast.error("Please log in to message the landlord");
      router.push("/auth/login");
      return;
    }
    try {
      const res = await chatcreat({ senderId: owner?.id }).unwrap();
      if (res?.code === 201) {
        router.push(`/messages?chatId=${res?.data?.attributes?.id}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Could not start a conversation");
    }
  };

  const share = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: property.houseName, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user closed the share sheet */
    }
  };

  return (
    <div className="bg-gray-50 pb-28 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <Link href="/" className="hover:text-primaryDark">Home</Link>
          <HiChevronRight size={14} />
          <Link href="/property" className="hover:text-primaryDark">Properties</Link>
          <HiChevronRight size={14} />
          <span className="line-clamp-1 text-gray-800">{property.houseName}</span>
        </nav>

        {/* Title row */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
              {property.isPromotion && (
                <span className="flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <HiOutlineCheckBadge size={14} /> Featured
                </span>
              )}
              <span className="rounded-md bg-gray-200/70 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">{property.type}</span>
              {property.views > 0 && (
                <span className="flex items-center gap-1 rounded-md bg-gray-200/70 px-2.5 py-1 text-xs font-medium text-gray-700">
                  <HiOutlineEye size={13} /> {property.views.toLocaleString()} {property.views === 1 ? "view" : "views"}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold text-navy md:text-3xl">{property.houseName}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-gray-500">
              <HiOutlineMapPin size={18} className="shrink-0 text-primaryDark" />
              {[property.place, location].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={share}
              className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <HiOutlineShare size={17} /> Share
            </button>
            <FavoriteButton propertyId={property.id || id} className="border border-gray-200" />
          </div>
        </div>

        {/* Gallery */}
        <div className="relative mt-6">
          <Gallery images={images} title={property.houseName} />
        </div>

        {/* Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <Fact icon={MdOutlineBed} label="Bedrooms" value={property.rooms ?? 0} />
              <Fact icon={LuBath} label="Bathrooms" value={property.baths ?? 0} />
              <Fact icon={HiOutlineHomeModern} label="Property type" value={property.type || "—"} />
              <Fact icon={HiOutlineCalendarDays} label="Available from" value={formatDate(property.date)} />
            </div>

            <Section title="About this property">
              <p className="whitespace-pre-line leading-relaxed text-gray-600">
                {property.textArea || "The owner hasn't added a description yet."}
              </p>
            </Section>

            <Section title="Property details">
              <div className="grid gap-x-10 md:grid-cols-2">
                <div>
                  <DetailRow label="Price" value={formatPrice(property.price)} />
                  <DetailRow label="Status" value={status.label} />
                  <DetailRow label="Property type" value={property.type} />
                  <DetailRow label="Bedrooms" value={property.rooms} />
                </div>
                <div>
                  <DetailRow label="Bathrooms" value={property.baths} />
                  <DetailRow label="District" value={property.state} />
                  <DetailRow label="Area" value={property.subState} />
                  <DetailRow label="Listed on" value={formatDate(property.createdAt)} />
                </div>
              </div>
            </Section>

            <Section title="Location">
              <p className="mb-4 flex items-center gap-1.5 text-sm text-gray-600">
                <HiOutlineMapPin className="shrink-0 text-primaryDark" /> {[property.place, location].filter(Boolean).join(", ")}
              </p>
              <div className="h-[320px] overflow-hidden rounded-xl border border-gray-100">
                <iframe
                  title="Property location"
                  src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Section>
          </div>

          {/* Sticky contact card */}
          <aside className="lg:col-span-1">
            {/* top-24 clears the navbar when it slides back in */}
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/60">
                <p className="text-sm text-gray-500">{property.propertyType === "rent" ? "Monthly rent" : "Price"}</p>
                <p className="mt-1 text-3xl font-bold text-navy">
                  {formatPrice(property.price)}
                  {property.propertyType === "rent" && <span className="text-base font-medium text-gray-500"> /month</span>}
                </p>

                <div className="my-5 h-px bg-gray-100" />

                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Listed by</p>
                <div className="flex items-center gap-3">
                  <Avatar size={48} src={owner?.image?.url ? url + owner.image.url : undefined} className="!bg-primary !font-semibold">
                    {owner?.fullName?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{owner?.fullName || "Owner unavailable"}</p>
                    <p className="text-sm text-gray-500">{owner?.company || "Property owner"}</p>
                  </div>
                </div>

                {isClosed ? (
                  <p className="mt-6 rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-500">
                    This property is no longer available.
                  </p>
                ) : isOwner ? (
                  <Link
                    href={`/editpost/${property.id}`}
                    className="mt-6 flex h-12 items-center justify-center rounded-lg border border-primary font-semibold text-primaryDark transition-colors hover:bg-secondary"
                  >
                    Edit your listing
                  </Link>
                ) : owner?.id && viewer?.role !== "landlord" ? (
                  <Button
                    onClick={contactLandlord}
                    loading={isStartingChat}
                    className="!mt-6 !flex !h-12 w-full items-center justify-center !rounded-lg !border-none !bg-primary !font-semibold !text-white hover:!bg-primaryDark"
                    icon={<HiOutlineChatBubbleLeftRight size={18} />}
                  >
                    {viewer ? "Message landlord" : "Log in to contact"}
                  </Button>
                ) : null}

                {canRequestViewing &&
                  (activeViewing ? (
                    <Link
                      href="/viewings"
                      className={`mt-3 flex items-start gap-3 rounded-lg p-3 text-sm ${activeViewing.status === "confirmed" ? "bg-secondary text-primaryDark" : "bg-amber-50 text-amber-800"}`}
                    >
                      <HiOutlineCalendarDays size={20} className="mt-0.5 shrink-0" />
                      <span>
                        <span className="block font-semibold">
                          {activeViewing.status === "confirmed" ? "Viewing confirmed" : "Viewing requested · waiting for reply"}
                        </span>
                        <span className="block text-xs opacity-80">
                          {new Date(activeViewing.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} ·{" "}
                          {activeViewing.timeSlot}
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={openViewing}
                      className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary font-semibold text-primaryDark transition-colors hover:bg-secondary"
                    >
                      <HiOutlineCalendarDays size={18} /> Request a viewing
                    </button>
                  ))}

                <div className="mt-3 flex items-center justify-center">
                  <FavoriteButton propertyId={property.id || id} className="!shadow-none" />
                  <span className="text-sm text-gray-500">Save to favorites</span>
                </div>
              </div>

              {!isOwner && (
                <button
                  type="button"
                  onClick={openReport}
                  className="flex w-full items-center justify-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-red-500"
                >
                  <HiOutlineFlag size={14} /> Report this listing
                </button>
              )}

              <button
                type="button"
                onClick={() => router.back()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <HiOutlineArrowLeft size={16} /> Back to results
              </button>
            </div>
          </aside>
        </div>

        <SimilarProperties property={property} />
      </div>

      {/* Mobile: price + contact pinned to the bottom of the screen */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-navy">
            {formatPrice(property.price)}
            {property.propertyType === "rent" && <span className="text-xs font-medium text-gray-500"> /month</span>}
          </p>
          <p className="text-xs text-gray-500">{status.label}</p>
        </div>
        {canRequestViewing && !activeViewing && (
          <button
            type="button"
            onClick={openViewing}
            aria-label="Request a viewing"
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary text-primaryDark"
          >
            <HiOutlineCalendarDays size={20} />
          </button>
        )}
        {!isClosed && !isOwner && owner?.id && viewer?.role !== "landlord" && (
          <Button
            onClick={contactLandlord}
            loading={isStartingChat}
            icon={<HiOutlineChatBubbleLeftRight size={16} />}
            className="!flex !h-11 shrink-0 items-center !rounded-lg !border-none !bg-primary !px-5 !font-semibold !text-white hover:!bg-primaryDark"
          >
            {viewer ? "Message" : "Contact"}
          </Button>
        )}
      </div>

      <ViewingRequestModal open={viewingOpen} onClose={() => setViewingOpen(false)} property={property} />
      <ReportListingModal open={reportOpen} onClose={() => setReportOpen(false)} propertyId={property.id} />
    </div>
  );
};

export default DetailsPage;
