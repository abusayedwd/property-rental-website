"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Dropdown, Modal, Pagination, Segmented } from "antd";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineEye,
  HiOutlineEllipsisVertical,
  HiOutlineBolt,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineHomeModern,
  HiOutlineSparkles,
  HiOutlineArchiveBox,
  HiOutlineHeart,
  HiOutlineCalendarDays,
  HiOutlineEyeSlash,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { useGetMypropertyQuery } from "@/redux/fetures/property/getMyproperty";
import { usePaymentMutation, useGetPromotionPlansQuery } from "@/redux/fetures/payment/payment";
import { track } from "@/components/Analytics";
import { usePropertyStatusMutation } from "@/redux/fetures/property/propertyStatus";
import { useDeletePropertyMutation } from "@/redux/fetures/property/deleteProperty";
import PropertyCard, { PropertyCardSkeleton } from "@/components/property/PropertyCard";

const PAGE_SIZE = 8;
const isClosed = (p) => ["sold", "rented"].includes(p.propertyType);
const reviewStatus = (p) => (["pending", "rejected", "hidden"].includes(p.moderation?.status) ? p.moderation.status : null);
const formatDay = (d) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

// Views, saves and waiting viewing requests for one listing
const ReviewBanner = ({ property }) => {
  const status = reviewStatus(property);
  if (!status) return null;
  const config = {
    pending: { icon: HiOutlineClock, tone: "bg-amber-50 text-amber-800", title: "Waiting for review.", text: "It goes live once our team approves it, usually within a few hours." },
    rejected: { icon: HiOutlineExclamationTriangle, tone: "bg-red-50 text-red-700", title: "Needs changes.", text: property.moderation.reason || "Edit the listing to send it for review again." },
    hidden: { icon: HiOutlineEyeSlash, tone: "bg-red-50 text-red-700", title: "Hidden by admin.", text: property.moderation.reason || "This listing isn't visible to the public." },
  }[status];
  const Icon = config.icon;
  return (
    <div className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${config.tone}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>
        <span className="font-semibold">{config.title}</span> {config.text}
      </span>
    </div>
  );
};

const ListingStats = ({ property }) => (
  <div className="mb-3 space-y-2">
    <ReviewBanner property={property} />
    {property.isPromotion && property.promotedUntil && !isClosed(property) && (
      <p className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
        <HiOutlineBolt size={14} /> Featured until {formatDay(property.promotedUntil)}
      </p>
    )}
    <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-lg bg-white text-center ring-1 ring-gray-100">
      <span className="flex flex-col items-center py-2" title="Page views">
        <span className="flex items-center gap-1 text-sm font-semibold text-navy"><HiOutlineEye size={14} className="text-gray-400" />{property.views ?? 0}</span>
        <span className="text-[11px] text-gray-500">Views</span>
      </span>
      <span className="flex flex-col items-center py-2" title="Saved to favorites">
        <span className="flex items-center gap-1 text-sm font-semibold text-navy"><HiOutlineHeart size={14} className="text-gray-400" />{property.saves ?? 0}</span>
        <span className="text-[11px] text-gray-500">Saves</span>
      </span>
      <Link href="/viewings?tab=received" className="flex flex-col items-center py-2 transition-colors hover:bg-gray-50" title="Viewing requests waiting for your reply">
        <span className={`flex items-center gap-1 text-sm font-semibold ${property.pendingViewings ? "text-amber-600" : "text-navy"}`}>
          <HiOutlineCalendarDays size={14} className={property.pendingViewings ? "text-amber-500" : "text-gray-400"} />
          {property.pendingViewings ?? 0}
        </span>
        <span className="text-[11px] text-gray-500">Requests</span>
      </Link>
    </div>
  </div>
);

const StatTile = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
      <Icon size={24} />
    </span>
    <div>
      <p className="text-2xl font-bold text-navy">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const OwnerActions = ({ property, onPromote, onStatus, onDelete }) => {
  const closed = isClosed(property);
  const review = reviewStatus(property);
  const closeLabel = property.propertyType === "sell" ? "Mark as sold" : "Mark as rented";
  const reopenTo = property.propertyType === "sold" ? "sell" : "rent";

  const menuItems = [
    closed
      ? { key: "reopen", icon: <HiOutlineArrowPath size={16} />, label: "Mark as available again", onClick: () => onStatus(property, reopenTo) }
      : {
          key: "status",
          icon: <HiOutlineCheckCircle size={16} />,
          label: closeLabel,
          disabled: Boolean(review),
          onClick: () => onStatus(property, property.propertyType === "sell" ? "sold" : "rented"),
        },
    { type: "divider" },
    { key: "delete", icon: <HiOutlineTrash size={16} />, label: "Delete listing", danger: true, onClick: () => onDelete(property) },
  ];

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/editpost/${property.id}`}
        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primaryDark"
      >
        <HiOutlinePencilSquare size={16} /> Edit
      </Link>

      {closed ? (
        <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-500">
          <HiOutlineArchiveBox size={16} /> Closed
        </span>
      ) : review ? (
        <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-500">
          <HiOutlineClock size={16} /> {review === "pending" ? "In review" : "Not live"}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onPromote(property)}
          title="Show this listing first in search results"
          className={`flex h-9 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 text-sm font-semibold transition-colors ${
            property.isPromotion ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-navy text-white hover:bg-navyDark"
          }`}
        >
          {property.isPromotion ? (
            <>
              <HiOutlineBolt size={15} className="shrink-0" /> Extend
            </>
          ) : (
            <>
              <HiOutlineSparkles size={15} className="shrink-0" /> Promote
            </>
          )}
        </button>
      )}

      <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="topRight">
        <button
          type="button"
          aria-label="More actions"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50"
        >
          <HiOutlineEllipsisVertical size={18} />
        </button>
      </Dropdown>
    </div>
  );
};

// Pick a Featured plan, then go to the payment page (bKash, Nagad, cards)
const PromoteModal = ({ property, onClose }) => {
  const { data } = useGetPromotionPlansQuery(undefined, { skip: !property });
  const plans = data?.data?.attributes?.plans || [];
  const provider = data?.data?.attributes?.provider;
  const [planId, setPlanId] = useState(null);
  const [payment, { isLoading }] = usePaymentMutation();
  const selected = plans.find((p) => p.id === planId) || plans[1] || plans[0];

  const pay = async () => {
    try {
      track("begin_checkout", { value: selected.price, currency: "BDT" });
      const res = await payment({ propertyId: property.id, plan: selected.id }).unwrap();
      if (res?.url) window.location.href = res.url;
    } catch (error) {
      toast.error(error?.data?.message || "Could not start the payment. Please try again.");
    }
  };

  return (
    <Modal open={Boolean(property)} onCancel={onClose} footer={null} centered width={520} destroyOnClose>
      {property && (
        <div className="pt-1">
          <h2 className="text-xl font-semibold text-navy">{property.isPromotion ? "Extend Featured" : "Feature your listing"}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Featured listings appear first in search and on the home page with a Featured badge.
            {property.isPromotion && property.promotedUntil && ` Extra days are added after ${formatDay(property.promotedUntil)}.`}
          </p>
          <p className="mt-3 line-clamp-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">{property.houseName}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {plans.map((plan) => {
              const active = selected?.id === plan.id;
              const perDay = Math.round(plan.price / plan.days);
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPlanId(plan.id)}
                  className={`relative rounded-xl border-2 p-4 text-left transition-colors ${active ? "border-primary bg-secondary" : "border-gray-200 hover:border-gray-300"}`}
                >
                  {plan === plans[1] && <span className="absolute -top-2.5 left-3 rounded-full bg-amber-400 px-2 text-[11px] font-semibold text-amber-950">Popular</span>}
                  <p className="text-sm font-medium text-gray-600">{plan.days} days</p>
                  <p className="mt-1 text-2xl font-bold text-navy">৳{plan.price.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-500">৳{perDay} per day</p>
                </button>
              );
            })}
          </div>

          {!provider && plans.length > 0 && (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Online payment isn't set up yet. Please contact support to feature this listing.</p>
          )}

          <button
            type="button"
            onClick={pay}
            disabled={!selected || !provider || isLoading}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white transition-colors hover:bg-primaryDark disabled:opacity-60"
          >
            {isLoading ? "Opening payment…" : selected ? `Pay ৳${selected.price.toLocaleString("en-IN")}` : "Loading plans…"}
          </button>
          <p className="mt-3 text-center text-xs text-gray-400">
            {provider === "sslcommerz" ? "Secure payment by SSLCommerz · bKash, Nagad, Rocket, Visa, Mastercard" : "Secure card payment"}
          </p>
        </div>
      )}
    </Modal>
  );
};

const TABS = [
  { value: "all", label: "All" },
  { value: "review", label: "In review" },
  { value: "active", label: "Active" },
  { value: "featured", label: "Featured" },
  { value: "closed", label: "Rented / Sold" },
];

const MyProperty = () => {
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);

  // Landlords have a handful of listings: load them all once, then filter and page locally
  const { data: myProperty, isLoading, isError } = useGetMypropertyQuery({ limit: 200, sortBy: "createdAt:desc" });
  const all = myProperty?.data?.attributes?.results || [];

  const [promoteTarget, setPromoteTarget] = useState(null);
  const [updateStatus] = usePropertyStatusMutation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Coming back from the payment page
  useEffect(() => {
    const result = searchParams.get("payment");
    if (!result) return;
    if (result === "success") toast.success("Payment received. Your listing is now Featured!", { duration: 6000 });
    else if (result === "cancelled") toast("Payment cancelled. Nothing was charged.");
    else toast.error("The payment didn't go through. Please try again.");
    router.replace("/myproperty");
  }, [searchParams, router]);
  const [deleteProperty] = useDeletePropertyMutation();

  const counts = useMemo(
    () => ({
      all: all.length,
      review: all.filter(reviewStatus).length,
      active: all.filter((p) => !isClosed(p) && !reviewStatus(p)).length,
      featured: all.filter((p) => p.isPromotion && !isClosed(p)).length,
      closed: all.filter(isClosed).length,
    }),
    [all]
  );

  const filtered = all.filter((p) =>
    tab === "review" ? reviewStatus(p) : tab === "active" ? !isClosed(p) && !reviewStatus(p) : tab === "featured" ? p.isPromotion && !isClosed(p) : tab === "closed" ? isClosed(p) : true
  );
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePromote = (property) => setPromoteTarget(property);

  const handleStatus = (property, propertyType) => {
    Modal.confirm({
      title: { sold: "Mark this property as sold?", rented: "Mark this property as rented?" }[propertyType] || "Make this listing available again?",
      content: ["sold", "rented"].includes(propertyType)
        ? "It will show as closed, and people can no longer request viewings."
        : "It will show as available again in search.",
      okText: { sold: "Mark as sold", rented: "Mark as rented" }[propertyType] || "Make available",
      centered: true,
      onOk: async () => {
        try {
          const res = await updateStatus({ id: property.id, propertyType }).unwrap();
          toast.success(res?.message || "Status updated");
        } catch (error) {
          toast.error(error?.data?.message || "Could not update the status");
        }
      },
    });
  };

  const handleDelete = (property) => {
    Modal.confirm({
      title: "Delete this listing?",
      content: `"${property.houseName}" will be removed permanently. This can't be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          await deleteProperty(property.id).unwrap();
          toast.success("Listing deleted");
        } catch (error) {
          toast.error(error?.data?.message || "Could not delete the listing");
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">My properties</h1>
            <p className="mt-1 text-gray-500">Manage your listings, promote them, and keep their status up to date.</p>
          </div>
          <Link
            href="/addproperty"
            className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primaryDark"
          >
            <HiOutlinePlus size={18} /> Add property
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatTile icon={HiOutlineHomeModern} label="Total listings" value={counts.all} accent="bg-secondary text-primaryDark" />
          <StatTile icon={HiOutlineEye} label="Live" value={counts.active} accent="bg-blue-50 text-blue-600" />
          <StatTile icon={HiOutlineBolt} label="Featured" value={counts.featured} accent="bg-amber-50 text-amber-600" />
          <StatTile icon={HiOutlineArchiveBox} label="Rented / Sold" value={counts.closed} accent="bg-gray-100 text-gray-600" />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Segmented
            value={tab}
            onChange={(v) => {
              setTab(v);
              setPage(1);
            }}
            options={TABS.map((t) => ({ value: t.value, label: `${t.label} (${counts[t.value]})` }))}
          />
          {counts.active > counts.featured && (
            <p className="text-sm text-gray-500">
              <HiOutlineSparkles className="mr-1 inline text-amber-500" />
              Featured listings show first in search results.
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => <PropertyCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <p className="rounded-2xl bg-white p-10 text-center text-red-500 shadow-sm">Could not load your properties. Please try again.</p>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primaryDark">
                <HiOutlineHomeModern size={30} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-navy">
                {all.length === 0 ? "You haven't listed a property yet" : "Nothing in this tab"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {all.length === 0
                  ? "Add your first listing and start getting messages from tenants and buyers."
                  : "Try another tab to see the rest of your listings."}
              </p>
              {all.length === 0 && (
                <Link href="/addproperty" className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primaryDark">
                  List a property
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showFavorite={false}
                  actions={
                    <>
                    <ListingStats property={property} />
                    <OwnerActions
                      property={property}
                      onPromote={handlePromote}
                      onStatus={handleStatus}
                      onDelete={handleDelete}
                    />
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>

        <PromoteModal property={promoteTarget} onClose={() => setPromoteTarget(null)} />

        {filtered.length > PAGE_SIZE && (
          <div className="mt-10 flex justify-center">
            <Pagination current={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} showSizeChanger={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperty;
