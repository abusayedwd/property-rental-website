"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Popover, Empty, Skeleton } from "antd";
import toast from "react-hot-toast";
import {
  HiOutlineBell,
  HiOutlineCalendarDays,
  HiOutlineHeart,
  HiOutlineEyeSlash,
  HiOutlineEye,
  HiOutlineFlag,
  HiOutlineInformationCircle,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineBellAlert,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";
import notificationsApi, {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/redux/fetures/engagement/notifications";
import { apiSlice } from "@/redux/api/apiSlice";
import { getSocket } from "@/utils/socket";

const TYPE_STYLE = {
  viewing_request: { icon: HiOutlineCalendarDays, className: "bg-blue-50 text-blue-600" },
  viewing_update: { icon: HiOutlineCalendarDays, className: "bg-secondary text-primaryDark" },
  listing_saved: { icon: HiOutlineHeart, className: "bg-red-50 text-red-500" },
  listing_hidden: { icon: HiOutlineEyeSlash, className: "bg-amber-50 text-amber-600" },
  listing_restored: { icon: HiOutlineEye, className: "bg-secondary text-primaryDark" },
  report_update: { icon: HiOutlineFlag, className: "bg-gray-100 text-gray-600" },
  listing_pending: { icon: HiOutlineClock, className: "bg-amber-50 text-amber-600" },
  listing_approved: { icon: HiOutlineCheckCircle, className: "bg-secondary text-primaryDark" },
  listing_rejected: { icon: HiOutlineExclamationTriangle, className: "bg-red-50 text-red-500" },
  saved_search: { icon: HiOutlineBellAlert, className: "bg-blue-50 text-blue-600" },
  verification_update: { icon: HiOutlineShieldCheck, className: "bg-secondary text-primaryDark" },
  payment: { icon: HiOutlineSparkles, className: "bg-amber-50 text-amber-600" },
  system: { icon: HiOutlineInformationCircle, className: "bg-gray-100 text-gray-600" },
};

const timeAgo = (value) => {
  const seconds = Math.max(1, Math.round((Date.now() - new Date(value)) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

// Bell with unread count and a dropdown list; updates live over the socket
const NotificationBell = ({ userId, className = "" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetNotificationsQuery(undefined, { skip: !userId });
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();

  const items = data?.data?.attributes?.items || [];
  const unread = data?.data?.attributes?.unreadCount || 0;

  useEffect(() => {
    if (!userId) return;
    const socket = getSocket();
    if (!socket) return;
    const onNew = (notification) => {
      dispatch(
        notificationsApi.util.updateQueryData("getNotifications", undefined, (draft) => {
          const list = draft?.data?.attributes;
          if (!list || list.items.some((n) => n.id === notification.id)) return;
          list.items.unshift(notification);
          list.unreadCount += 1;
        })
      );
      // Keep related pages fresh (viewing lists, listing stats)
      if (notification.type?.startsWith("viewing")) dispatch(apiSlice.util.invalidateTags([{ type: "Viewing", id: "sent" }, { type: "Viewing", id: "received" }]));
      if (notification.type?.startsWith("listing") || notification.type === "payment") dispatch(apiSlice.util.invalidateTags([{ type: "Property" }]));
      if (notification.type === "verification_update") dispatch(apiSlice.util.invalidateTags(["Verification", "Profile"]));
      if (notification.type === "saved_search") dispatch(apiSlice.util.invalidateTags(["SavedSearch"]));
      toast(notification.title, { icon: "🔔", id: `notif-${notification.id}` });
    };
    socket.on("notification:new", onNew);
    return () => socket.off("notification:new", onNew);
  }, [userId, dispatch]);

  const openNotification = (n) => {
    if (!n.isRead) markRead(n.id);
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const content = (
    <div className="w-[min(92vw,380px)]">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <p className="font-semibold text-gray-900">Notifications</p>
        {unread > 0 && (
          <button type="button" onClick={() => markAllRead()} className="text-xs font-semibold text-primaryDark hover:underline">
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="p-4"><Skeleton active avatar paragraph={{ rows: 2 }} /></div>
        ) : items.length === 0 ? (
          <Empty className="!my-8" image={Empty.PRESENTED_IMAGE_SIMPLE} description="You're all caught up" />
        ) : (
          <ul>
            {items.map((n) => {
              const style = TYPE_STYLE[n.type] || TYPE_STYLE.system;
              const Icon = style.icon;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(n)}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${n.isRead ? "" : "bg-secondary/40"}`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.className}`}>
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className={`text-sm ${n.isRead ? "font-medium text-gray-700" : "font-semibold text-gray-900"}`}>{n.title}</span>
                        {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </span>
                      {n.body && <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-gray-500">{n.body}</span>}
                      <span className="mt-1 block text-[11px] text-gray-400">{timeAgo(n.createdAt)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      content={content}
      arrow={false}
      styles={{ body: { padding: 0 } }}
    >
      <button
        type="button"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        title="Notifications"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white ${className}`}
      >
        <HiOutlineBell size={21} />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#222F55]">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
    </Popover>
  );
};

export default NotificationBell;
