"use client";

import url from "@/redux/api/baseUrl";
import { useChangPasswordMutation } from "@/redux/fetures/auth/changePassword";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { useGetFavoriteIdsQuery } from "@/redux/fetures/favorite/favorite";
import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
import { apiSlice } from "@/redux/api/apiSlice";
import { getSocket, disconnectSocket } from "@/utils/socket";
import NotificationBell from "@/components/NotificationBell";
import { useDispatch } from "react-redux";
import { LockOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Form, Input, Modal } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineHomeModern,
  HiOutlinePlusCircle,
  HiOutlineKey,
  HiOutlineArrowRightOnRectangle,
  HiChevronDown,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

const NAV_HEIGHT = 72;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/property", label: "Properties", match: ["/property", "/seeAllRentHome", "/seeAllSell", "/detailsHome"] },
  { href: "/aboutus", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
];

const isActive = (pathname, link) =>
  link.href === "/" ? pathname === "/" : (link.match || [link.href]).some((p) => pathname.startsWith(p));

// Hide the bar while scrolling down, bring it back as soon as the user scrolls up
const useHideOnScroll = (paused) => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        setScrolled(y > 10);
        if (y < NAV_HEIGHT * 2) setHidden(false);
        else if (Math.abs(delta) > 6) setHidden(delta > 0);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { hidden: hidden && !paused, scrolled };
};

const Navbar = () => {
  const [form] = Form.useForm();
  const pathname = usePathname();
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Change Password Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Logout Confirmation Modal
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: user } = useLogedUserQuery();
  const profile = user?.data?.attributes?.user;
  const isLandlord = profile?.role === "landlord";
  const { data: favoriteIds } = useGetFavoriteIdsQuery(undefined, { skip: !profile });
  const favoriteCount = favoriteIds?.data?.attributes?.length || 0;
  const dispatch = useDispatch();
  const { data: chatList } = useGetChatlistQuery(undefined, { skip: !profile });
  const unreadMessages = (chatList?.data?.attributes || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Realtime: keep the unread badge fresh and show a notice for new messages
  // received while the user is on another page
  useEffect(() => {
    if (!profile?.id) return;
    const socket = getSocket();
    if (!socket) return;
    const onNewMessage = (message) => {
      const senderId = String(message.sender?.id || message.sender?._id || message.sender);
      if (senderId === String(profile.id)) return;
      if (window.location.pathname.startsWith("/messages")) return; // the messages page handles it
      dispatch(apiSlice.util.invalidateTags([{ type: "Chat", id: "LIST" }]));
      toast(`💬 New message from ${message.sender?.fullName || "someone"}`, { id: `msg-${message.chatId}` });
    };
    socket.on("message:new", onNewMessage);
    return () => socket.off("message:new", onNewMessage);
  }, [profile?.id, dispatch]);
  const [changePasswordd, { isLoading }] = useChangPasswordMutation();

  const { hidden, scrolled } = useHideOnScroll(isMobileMenuOpen || isUserMenuOpen);

  // Close the mobile drawer on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const closePasswordModal = () => {
    setIsModalOpen(false);
    setError("");
    form.resetFields();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    disconnectSocket();
    setIsLogoutModalOpen(false);
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  };

  const changePassword = async (values) => {
    const { confirmPassword, ...ChangePassword } = values;
    setError("");
    try {
      const res = await changePasswordd(ChangePassword).unwrap();
      if (res?.code === 200) {
        toast.success(res?.message);
        closePasswordModal();
      }
    } catch (error) {
      setError(error?.data?.message || "Could not change password. Please try again.");
    }
  };

  const avatarSrc = profile?.image?.url ? url + profile.image.url : undefined;
  const initial = profile?.fullName?.[0]?.toUpperCase();

  const userMenuItems = [
    {
      key: "header",
      disabled: true,
      className: "!cursor-default",
      label: (
        <div className="py-1">
          <p className="text-sm font-semibold text-gray-900">{profile?.fullName}</p>
          <p className="text-xs text-gray-500">{profile?.email}</p>
        </div>
      ),
    },
    { type: "divider" },
    { key: "profile", icon: <HiOutlineUser size={16} />, label: <Link href="/profile">My Profile</Link> },
    {
      key: "favorites",
      icon: <HiOutlineHeart size={16} />,
      label: (
        <Link href="/favorites" className="flex items-center justify-between gap-6">
          Favorites
          {favoriteCount > 0 && (
            <span className="rounded-full bg-red-50 px-2 text-xs font-semibold text-red-500">{favoriteCount}</span>
          )}
        </Link>
      ),
    },
    ...(isLandlord
      ? [
          { key: "myproperty", icon: <HiOutlineHomeModern size={16} />, label: <Link href="/myproperty">My Properties</Link> },
          { key: "addproperty", icon: <HiOutlinePlusCircle size={16} />, label: <Link href="/addproperty">Add Property</Link> },
        ]
      : []),
    { key: "viewings", icon: <HiOutlineCalendarDays size={16} />, label: <Link href="/viewings">My viewings</Link> },
    { key: "messages", icon: <HiOutlineChatBubbleLeftRight size={16} />, label: <Link href="/messages">Messages</Link> },
    { key: "password", icon: <HiOutlineKey size={16} />, label: "Change Password", onClick: () => setIsModalOpen(true) },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      icon: <HiOutlineArrowRightOnRectangle size={16} />,
      label: "Log out",
      onClick: () => setIsLogoutModalOpen(true),
    },
  ];

  const iconButton =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <>
      <Toaster />
      {/* Keeps page content below the fixed bar */}
      <div style={{ height: NAV_HEIGHT }} aria-hidden="true" />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-[#171F3D]/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] backdrop-blur-md"
            : "bg-[#222F55]"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" style={{ height: NAV_HEIGHT }}>
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img className="h-5 w-auto md:h-7" src="/images/logo.png" alt="MyNextHome" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(pathname, link);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                      active ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                        active ? "w-5" : "w-0 group-hover:w-5"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {profile ? (
              <>
                <NotificationBell userId={profile.id} />
                <Link href="/favorites" aria-label="Favorites" title="Favorites" className={`${iconButton} hidden md:flex`}>
                  <HiOutlineHeart size={21} />
                  {favoriteCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#222F55]">
                      {favoriteCount > 99 ? "99+" : favoriteCount}
                    </span>
                  )}
                </Link>
                <Link href="/messages" aria-label="Messages" title="Messages" className={`${iconButton} hidden md:flex`}>
                  <HiOutlineChatBubbleLeftRight size={21} />
                  {unreadMessages > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-[#222F55]">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )}
                </Link>

                {isLandlord && (
                  <Link
                    href="/addproperty"
                    className="ml-1 hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primaryDark xl:flex"
                  >
                    <HiOutlinePlusCircle size={18} /> List Property
                  </Link>
                )}

                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                  onOpenChange={setIsUserMenuOpen}
                  overlayClassName="min-w-[220px]"
                >
                  <button
                    type="button"
                    className="ml-1 flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-1 ring-1 ring-white/15 transition-colors hover:bg-white/20 md:pr-3"
                  >
                    <Avatar size={34} src={avatarSrc} className="!bg-primary !font-semibold">
                      {initial}
                    </Avatar>
                    <span className="hidden max-w-[120px] truncate text-sm font-medium text-white md:block">
                      {profile?.fullName?.split(" ")[0]}
                    </span>
                    <HiChevronDown size={14} className="hidden text-white/70 md:block" />
                  </button>
                </Dropdown>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/auth/login" className="rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:text-white">
                  Log in
                </Link>
                <Link
                  href="/auth/singup"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primaryDark"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className={`${iconButton} lg:hidden`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <HiOutlineBars3 size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-[300px] max-w-[85vw] flex-col bg-[#171F3D] text-white shadow-2xl transition-[transform,visibility] duration-300 lg:hidden ${
          isMobileMenuOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <img className="h-5 w-auto" src="/images/logo.png" alt="MyNextHome" />
          <button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className={iconButton}>
            <HiOutlineXMark size={22} />
          </button>
        </div>

        {profile && (
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <Avatar size={42} src={avatarSrc} className="!bg-primary !font-semibold">{initial}</Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile.fullName}</p>
              <p className="truncate text-xs capitalize text-white/50">{profile.role}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
                    isActive(pathname, link) ? "bg-primary/15 text-primary" : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {profile && (
            <>
              <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">My account</p>
              <ul className="space-y-1">
                {[
                  { href: "/profile", label: "My Profile", icon: HiOutlineUser },
                  { href: "/favorites", label: "Favorites", icon: HiOutlineHeart, badge: favoriteCount },
                  ...(isLandlord
                    ? [
                        { href: "/myproperty", label: "My Properties", icon: HiOutlineHomeModern },
                        { href: "/addproperty", label: "Add Property", icon: HiOutlinePlusCircle },
                      ]
                    : []),
                  { href: "/viewings", label: "My viewings", icon: HiOutlineCalendarDays },
                  { href: "/messages", label: "Messages", icon: HiOutlineChatBubbleLeftRight, badge: unreadMessages },
                ].map(({ href, label, icon: Icon, badge }) => (
                  <li key={href}>
                    <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white">
                      <Icon size={18} /> {label}
                      {badge > 0 && <span className="ml-auto rounded-full bg-red-500 px-2 text-xs font-semibold">{badge}</span>}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <HiOutlineKey size={18} /> Change Password
                  </button>
                </li>
              </ul>
            </>
          )}
        </nav>

        <div className="border-t border-white/10 p-4">
          {profile ? (
            <button
              type="button"
              onClick={() => { setIsMobileMenuOpen(false); setIsLogoutModalOpen(true); }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <HiOutlineArrowRightOnRectangle size={18} /> Log out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/auth/login" className="rounded-lg border border-white/20 py-2.5 text-center text-sm font-medium">Log in</Link>
              <Link href="/auth/singup" className="rounded-lg bg-primary py-2.5 text-center text-sm font-semibold">Sign up</Link>
            </div>
          )}
        </div>
      </aside>

      {/* Change Password Modal */}
      <Modal open={isModalOpen} onCancel={closePasswordModal} footer={null} width={460} centered>
        <div className="pt-2">
          <h2 className="text-xl font-semibold text-gray-900">Change password</h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">Use at least 8 characters, including a letter and a number.</p>
          <Form form={form} name="changePassword" layout="vertical" requiredMark={false} onFinish={changePassword}>
            <Form.Item name="oldPassword" label="Current password" rules={[{ required: true, message: "Please enter your current password" }]}>
              <Input.Password className="!h-11 !rounded-lg" placeholder="Current password" prefix={<LockOutlined className="text-gray-400" />} />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New password"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 8, message: "Password must be at least 8 characters" },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: "Password must contain at least 1 letter and 1 number" },
              ]}
            >
              <Input.Password className="!h-11 !rounded-lg" placeholder="New password" prefix={<LockOutlined className="text-gray-400" />} />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm new password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password className="!h-11 !rounded-lg" placeholder="Confirm new password" prefix={<LockOutlined className="text-gray-400" />} />
            </Form.Item>

            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <div className="flex justify-end gap-3">
              <Button onClick={closePasswordModal} className="!h-10">Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isLoading} className="!h-10 !bg-primary hover:!bg-primaryDark !font-medium">
                Update password
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal open={isLogoutModalOpen} onCancel={() => setIsLogoutModalOpen(false)} footer={null} width={400} centered>
        <div className="py-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <HiOutlineArrowRightOnRectangle size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Log out?</h2>
          <p className="mt-1 text-sm text-gray-500">You&apos;ll need to sign in again to see your favorites and messages.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button className="!h-10" onClick={() => setIsLogoutModalOpen(false)}>Cancel</Button>
            <Button danger type="primary" className="!h-10" onClick={handleLogout}>Log out</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
