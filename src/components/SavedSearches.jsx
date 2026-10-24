"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal, Skeleton, Switch } from "antd";
import toast from "react-hot-toast";
import { HiOutlineBellAlert, HiOutlineMagnifyingGlass, HiOutlineTrash, HiOutlineMapPin, HiArrowRight } from "react-icons/hi2";
import {
  useGetSavedSearchesQuery,
  useUpdateSavedSearchMutation,
  useDeleteSavedSearchMutation,
} from "@/redux/fetures/engagement/savedSearches";
import { PROPERTY_TYPES, TENANT_TYPES, labelOf } from "@/utils/listing";

const taka = (n) => `৳${Number(n).toLocaleString("en-IN")}`;

// Short chips describing a saved search's filters
const describe = (f = {}) =>
  [
    f.propertyType && (f.propertyType === "rent" ? "For rent" : "For sale"),
    f.type && labelOf(PROPERTY_TYPES, f.type),
    f.minRooms && `${f.minRooms}+ beds`,
    f.minPrice != null && f.maxPrice != null ? `${taka(f.minPrice)} – ${taka(f.maxPrice)}` : f.minPrice != null ? `From ${taka(f.minPrice)}` : f.maxPrice != null ? `Up to ${taka(f.maxPrice)}` : null,
    f.tenantType && labelOf(TENANT_TYPES, f.tenantType),
  ].filter(Boolean);

const resultsLink = (f = {}) => {
  const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => [k, String(v)]));
  return `/property?${q.toString()}`;
};

const SavedSearches = () => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/auth/login");
    else setReady(true);
  }, [router]);

  const { data, isLoading } = useGetSavedSearchesQuery(undefined, { skip: !ready });
  const [updateSearch] = useUpdateSavedSearchMutation();
  const [deleteSearch] = useDeleteSavedSearchMutation();
  const searches = data?.data?.attributes || [];

  const toggleAlerts = async (search, emailAlerts) => {
    try {
      await updateSearch({ id: search.id, emailAlerts }).unwrap();
      toast.success(emailAlerts ? "Email alerts on" : "Email alerts off. You'll still see matches in the bell.");
    } catch (error) {
      toast.error(error?.data?.message || "Could not update");
    }
  };

  const remove = (search) =>
    Modal.confirm({
      title: "Delete this saved search?",
      content: "You'll stop getting alerts for it.",
      okText: "Delete",
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          await deleteSearch(search.id).unwrap();
          toast.success("Saved search deleted");
        } catch (error) {
          toast.error(error?.data?.message || "Could not delete");
        }
      },
    });

  return (
    <section className="min-h-[70vh] bg-gray-50 px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-navy">
              <HiOutlineBellAlert className="text-primary" /> Saved searches
            </h1>
            <p className="mt-2 text-gray-500">We'll tell you as soon as a new home matches. Alerts arrive in the bell and by email.</p>
          </div>
          <Link href="/property" className="font-medium text-primaryDark hover:underline">
            New search →
          </Link>
        </div>

        {!ready || isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        ) : searches.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primaryDark">
              <HiOutlineMagnifyingGlass size={28} />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-gray-800">No saved searches yet</h2>
            <p className="mt-2 max-w-sm text-gray-500">
              Search for homes, pick a district, price or type, then tap <b>Save search</b>. We'll do the checking for you.
            </p>
            <Link href="/property" className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primaryDark">
              Start searching
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {searches.map((search) => (
              <li key={search.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-navy">{search.name}</h2>
                    {(search.filters?.subState || search.filters?.state) && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <HiOutlineMapPin className="text-primaryDark" /> {[search.filters.subState, search.filters.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {describe(search.filters).map((chip) => (
                        <span key={chip} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={resultsLink(search.filters)}
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primaryDark"
                  >
                    See homes <HiArrowRight size={16} />
                  </Link>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-gray-700">
                    <Switch size="small" checked={search.emailAlerts} onChange={(v) => toggleAlerts(search, v)} /> Email alerts
                  </label>
                  <span className="text-gray-400">
                    {search.matchCount ? `${search.matchCount} new ${search.matchCount === 1 ? "match" : "matches"} so far` : "No new matches yet"}
                    {search.lastAlertAt && ` · last ${new Date(search.lastAlertAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`}
                  </span>
                  <button type="button" onClick={() => remove(search)} className="flex items-center gap-1 text-gray-400 hover:text-red-500">
                    <HiOutlineTrash size={16} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default SavedSearches;
