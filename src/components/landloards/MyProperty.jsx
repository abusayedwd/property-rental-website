"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Dropdown, Modal, Pagination, Segmented, Tooltip } from "antd";
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
} from "react-icons/hi2";
import { useGetMypropertyQuery } from "@/redux/fetures/property/getMyproperty";
import { usePaymentMutation } from "@/redux/fetures/payment/payment";
import { usePropertyStatusMutation } from "@/redux/fetures/property/propertyStatus";
import { useDeletePropertyMutation } from "@/redux/fetures/property/deleteProperty";
import PropertyCard, { PropertyCardSkeleton } from "@/components/property/PropertyCard";

const PAGE_SIZE = 8;
const PROMOTION_PRICE = "$10";
const isClosed = (p) => ["sold", "rented"].includes(p.propertyType);

// Views, saves and waiting viewing requests for one listing
const ListingStats = ({ property }) => (
  <div className="mb-3 space-y-2">
    {property.moderation?.status === "hidden" && (
      <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
        <HiOutlineEyeSlash size={16} className="mt-0.5 shrink-0" />
        <span>
          <span className="font-semibold">Hidden by admin.</span> {property.moderation.reason || "This listing isn't visible to the public."}
        </span>
      </div>
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

const OwnerActions = ({ property, onPromote, onStatus, onDelete, promoting }) => {
  const closed = isClosed(property);
  const closeLabel = property.propertyType === "sell" ? "Mark as sold" : "Mark as rented";

  const menuItems = [
    {
      key: "status",
      icon: <HiOutlineCheckCircle size={16} />,
      // The server only allows this for promoted listings
      disabled: closed || !property.isPromotion,
      label: (
        <Tooltip
          placement="left"
          title={!closed && !property.isPromotion ? "Only featured listings can be marked as closed" : undefined}
        >
          <span>{closeLabel}</span>
        </Tooltip>
      ),
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
      ) : property.isPromotion ? (
        <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-50 text-sm font-semibold text-amber-700">
          <HiOutlineBolt size={16} /> Featured
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onPromote(property)}
          disabled={promoting}
          title={`Feature this listing for ${PROMOTION_PRICE}`}
          className="flex h-9 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-navy px-2 text-sm font-semibold text-white transition-colors hover:bg-navyDark disabled:opacity-60"
        >
          <HiOutlineSparkles size={15} className="shrink-0" /> Promote {PROMOTION_PRICE}
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

const TABS = [
  { value: "all", label: "All" },
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

  const [payment, { isLoading: promoting }] = usePaymentMutation();
  const [updateStatus] = usePropertyStatusMutation();
  const [deleteProperty] = useDeletePropertyMutation();

  const counts = useMemo(
    () => ({
      all: all.length,
      active: all.filter((p) => !isClosed(p)).length,
      featured: all.filter((p) => p.isPromotion && !isClosed(p)).length,
      closed: all.filter(isClosed).length,
    }),
    [all]
  );

  const filtered = all.filter((p) =>
    tab === "active" ? !isClosed(p) : tab === "featured" ? p.isPromotion && !isClosed(p) : tab === "closed" ? isClosed(p) : true
  );
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePromote = async (property) => {
    try {
      const res = await payment({ propertyId: property.id }).unwrap();
      if (res?.status === 200 && res?.url) {
        window.location.href = res.url; // Stripe checkout
      }
    } catch (error) {
      toast.error(error?.data?.message || "Could not start the payment. Please try again.");
    }
  };

  const handleStatus = (property, propertyType) => {
    Modal.confirm({
      title: propertyType === "sold" ? "Mark this property as sold?" : "Mark this property as rented?",
      content: "It will show as closed and be removed from the site after one week.",
      okText: propertyType === "sold" ? "Mark as sold" : "Mark as rented",
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
          <StatTile icon={HiOutlineEye} label="Active" value={counts.active} accent="bg-blue-50 text-blue-600" />
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
                      promoting={promoting}
                    />
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>

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
