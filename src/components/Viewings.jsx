"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, Button, Input, Modal, Segmented, Skeleton } from "antd";
import toast from "react-hot-toast";
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";
import url from "@/redux/api/baseUrl";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { useGetViewingsQuery, useUpdateViewingMutation } from "@/redux/fetures/engagement/viewings";
import { useCreatChatMutation } from "@/redux/fetures/messaging/createChat";

const SLOT = { morning: "Morning · 9am–12pm", afternoon: "Afternoon · 12pm–4pm", evening: "Evening · 4pm–8pm" };
const STATUS = {
  pending: { label: "Waiting for reply", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-secondary text-primaryDark ring-primary/30" },
  declined: { label: "Declined", className: "bg-red-50 text-red-600 ring-red-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 ring-gray-200" },
};

const formatDay = (value) =>
  new Date(value).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const isPast = (value) => {
  const end = new Date(value);
  end.setHours(23, 59, 59, 999);
  return end < new Date();
};

const ViewingCard = ({ viewing, received, onAction, onMessage, busy }) => {
  const property = viewing.propertyId;
  const person = received ? viewing.requesterId : viewing.landlordId;
  const status = STATUS[viewing.status] || STATUS.pending;
  const past = isPast(viewing.date);
  const canRespond = received && viewing.status === "pending" && !past;
  const canCancel = !past && (viewing.status === "confirmed" || (!received && viewing.status === "pending"));

  return (
    <article className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ${past ? "opacity-75" : ""}`}>
      <div className="flex flex-col gap-4 p-4 md:flex-row md:p-5">
        <Link href={property ? `/detailsHome/${property.id}` : "#"} className="shrink-0">
          <img
            src={property?.images?.[0]?.url ? url + property.images[0].url : "/images/luxury_apartments.jpg"}
            alt={property?.houseName || "Property"}
            className="h-40 w-full rounded-xl object-cover md:h-28 md:w-40"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <Link href={property ? `/detailsHome/${property.id}` : "#"} className="min-w-0">
              <h3 className="line-clamp-1 font-semibold text-navy hover:text-primaryDark">{property?.houseName || "Listing removed"}</h3>
            </Link>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${status.className}`}>
              {past && viewing.status === "pending" ? "Expired" : status.label}
            </span>
          </div>
          {property && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
              <HiOutlineMapPin size={14} className="shrink-0" />
              <span className="line-clamp-1">{[property.subState, property.state].filter(Boolean).join(", ") || property.place}</span>
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-700">
            <span className="flex items-center gap-1.5"><HiOutlineCalendarDays size={16} className="text-primaryDark" /> {formatDay(viewing.date)}</span>
            <span className="flex items-center gap-1.5"><HiOutlineClock size={16} className="text-primaryDark" /> {SLOT[viewing.timeSlot]}</span>
          </div>

          {viewing.message && (
            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{received ? "Their message: " : "Your message: "}</span>
              {viewing.message}
            </p>
          )}
          {viewing.responseNote && (
            <p className="mt-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium">{received ? "Your reply: " : "Owner's reply: "}</span>
              {viewing.responseNote}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar size={30} src={person?.image?.url ? url + person.image.url : undefined} className="!bg-primary !text-xs">
            {person?.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <span className="truncate text-sm text-gray-700">
            <span className="text-gray-400">{received ? "Requested by " : "Owner: "}</span>
            <span className="font-medium">{person?.fullName || "Unknown"}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {person?.id && (
            <Button size="small" icon={<HiOutlineChatBubbleLeftRight size={14} />} onClick={() => onMessage(person.id)} className="!flex !items-center">
              Message
            </Button>
          )}
          {canRespond && (
            <>
              <Button size="small" danger icon={<HiOutlineXMark size={14} />} disabled={busy} onClick={() => onAction(viewing, "declined")} className="!flex !items-center">
                Decline
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<HiOutlineCheck size={14} />}
                disabled={busy}
                onClick={() => onAction(viewing, "confirmed")}
                className="!flex !items-center !bg-primary hover:!bg-primaryDark"
              >
                Confirm
              </Button>
            </>
          )}
          {canCancel && (
            <Button size="small" disabled={busy} onClick={() => onAction(viewing, "cancelled")}>
              Cancel visit
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

const Viewings = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: me } = useLogedUserQuery();
  const isLandlord = me?.data?.attributes?.user?.role === "landlord";

  const [tab, setTab] = useState(searchParams.get("tab") === "received" ? "received" : "sent");
  const { data, isLoading, isError } = useGetViewingsQuery(tab);
  const [updateViewing, { isLoading: busy }] = useUpdateViewingMutation();
  const [createChat] = useCreatChatMutation();
  const [responding, setResponding] = useState(null); // { viewing, status }
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/auth/login");
  }, [router]);

  const viewings = data?.data?.attributes || [];
  const { upcoming, past } = useMemo(() => {
    const up = viewings.filter((v) => !isPast(v.date)).sort((a, b) => new Date(a.date) - new Date(b.date));
    const old = viewings.filter((v) => isPast(v.date));
    return { upcoming: up, past: old };
  }, [viewings]);

  const changeTab = (value) => {
    setTab(value);
    router.replace(`/viewings?tab=${value}`, { scroll: false });
  };

  const submit = async (viewing, status, responseNote) => {
    try {
      await updateViewing({ id: viewing.id, status, note: responseNote }).unwrap();
      toast.success(status === "confirmed" ? "Viewing confirmed" : status === "declined" ? "Viewing declined" : "Viewing cancelled");
      setResponding(null);
      setNote("");
    } catch (error) {
      toast.error(error?.data?.message || "Could not update the viewing");
    }
  };

  const onAction = (viewing, status) => {
    if (status === "cancelled") {
      Modal.confirm({
        title: "Cancel this visit?",
        content: "The other person will be notified.",
        okText: "Cancel visit",
        cancelText: "Keep it",
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => submit(viewing, "cancelled"),
      });
      return;
    }
    setNote("");
    setResponding({ viewing, status });
  };

  const onMessage = async (userId) => {
    try {
      const res = await createChat({ senderId: userId }).unwrap();
      router.push(`/messages?chatId=${res?.data?.attributes?.id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Could not open the conversation");
    }
  };

  const renderList = (list) => (
    <div className="space-y-4">
      {list.map((v) => (
        <ViewingCard key={v.id} viewing={v} received={tab === "received"} onAction={onAction} onMessage={onMessage} busy={busy} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <h1 className="text-2xl font-bold text-navy md:text-3xl">Viewings</h1>
        <p className="mt-1 text-gray-500">Arrange visits to properties and keep track of every appointment.</p>

        <Segmented
          className="!mt-6"
          value={tab}
          onChange={changeTab}
          options={[
            { value: "sent", label: "My requests" },
            ...(isLandlord || tab === "received" ? [{ value: "received", label: "Requests for my properties" }] : []),
          ]}
        />

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-white p-5 shadow-sm"><Skeleton active avatar paragraph={{ rows: 3 }} /></div>
              ))}
            </div>
          ) : isError ? (
            <p className="rounded-2xl bg-white p-10 text-center text-red-500 shadow-sm">Could not load viewings. Please try again.</p>
          ) : viewings.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primaryDark">
                <HiOutlineCalendarDays size={30} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-navy">
                {tab === "received" ? "No viewing requests yet" : "You haven't requested any viewings"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {tab === "received"
                  ? "When someone wants to visit one of your properties, the request will appear here."
                  : "Open a property you like and tap “Request a viewing” to arrange a visit."}
              </p>
              {tab === "sent" && (
                <Link href="/property" className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primaryDark">
                  Browse properties
                </Link>
              )}
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Upcoming</h2>
                  {renderList(upcoming)}
                </>
              )}
              {past.length > 0 && (
                <>
                  <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-gray-400">Past</h2>
                  {renderList(past)}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        open={!!responding}
        onCancel={() => setResponding(null)}
        centered
        title={responding?.status === "confirmed" ? "Confirm this visit" : "Decline this visit"}
        okText={responding?.status === "confirmed" ? "Confirm visit" : "Decline"}
        okButtonProps={{ danger: responding?.status === "declined", loading: busy, className: responding?.status === "confirmed" ? "!bg-primary hover:!bg-primaryDark" : "" }}
        onOk={() => submit(responding.viewing, responding.status, note.trim() || undefined)}
      >
        {responding && (
          <>
            <p className="text-sm text-gray-600">
              {formatDay(responding.viewing.date)} · {SLOT[responding.viewing.timeSlot]}
            </p>
            <Input.TextArea
              className="!mt-4 !rounded-lg"
              rows={3}
              maxLength={300}
              showCount
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                responding.status === "confirmed"
                  ? "Optional note, e.g. “Please call when you arrive at the gate.”"
                  : "Optional reason, e.g. “Already rented” or “Please pick another day.”"
              }
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default Viewings;
