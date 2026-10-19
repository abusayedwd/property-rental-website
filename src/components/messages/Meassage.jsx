"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, Input, Skeleton } from "antd";
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePaperAirplane,
  HiOutlineArrowLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiCheck,
  HiChevronDown,
} from "react-icons/hi2";
import url from "@/redux/api/baseUrl";
import { apiSlice } from "@/redux/api/apiSlice";
import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
import { useGetMessageQuery } from "@/redux/fetures/messaging/getMessage";
import { useSendMessageMutation } from "@/redux/fetures/messaging/sendMessage";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { getSocket } from "@/utils/socket";

const MAX_LENGTH = 2000;
const ROLE_LABEL = { user: "Tenant / Buyer", landlord: "Landlord", admin: "Support" };

const idOf = (value) => (value && typeof value === "object" ? String(value.id || value._id) : String(value || ""));
const avatarSrc = (person) => (person?.image?.url ? url + person.image.url : undefined);

const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

const dayLabel = (value) => {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: date.getFullYear() === today.getFullYear() ? undefined : "numeric" });
};

const timeLabel = (value) => new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Short time for the chat list: "10:42", "Yesterday", "Mon", "12 Oct"
const listTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  if (sameDay(date, now)) return timeLabel(date);
  const days = (now - date) / 86400000;
  if (days < 2) return "Yesterday";
  if (days < 7) return date.toLocaleDateString(undefined, { weekday: "short" });
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const PresenceAvatar = ({ person, online, size = 44 }) => (
  <span className="relative inline-block shrink-0">
    <Avatar size={size} src={avatarSrc(person)} className="!bg-primary !font-semibold">
      {person?.fullName?.[0]?.toUpperCase() || "?"}
    </Avatar>
    {online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-white" title="Online" />}
  </span>
);

const TypingBubble = () => (
  <div className="flex justify-start">
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-3 shadow-sm">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  </div>
);

const MessageStatus = ({ message }) => {
  if (message.pending) return <HiOutlineClock size={13} className="opacity-70" title="Sending" />;
  if (message.isRead)
    return (
      <span className="flex -space-x-1.5 text-sky-200" title="Read">
        <HiCheck size={14} />
        <HiCheck size={14} />
      </span>
    );
  return <HiCheck size={14} className="opacity-70" title="Sent" />;
};

const MessagesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: me } = useLogedUserQuery();
  const myId = me?.data?.attributes?.user?.id;

  const { data: chatListData, isLoading: chatsLoading } = useGetChatlistQuery(undefined, { skip: !myId });
  const chats = useMemo(() => chatListData?.data?.attributes || [], [chatListData]);

  const [activeChatId, setActiveChatId] = useState(searchParams.get("chatId"));
  const { data: messagesData, isFetching: messagesLoading, isError: messagesError } = useGetMessageQuery(activeChatId, {
    skip: !activeChatId || !myId,
    refetchOnMountOrArgChange: true,
  });

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [online, setOnline] = useState(() => new Set());
  const [typingChats, setTypingChats] = useState({});
  const [showJump, setShowJump] = useState(false);
  const [sendMessage] = useSendMessageMutation();

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const activeChatRef = useRef(activeChatId);
  const typingTimers = useRef({});
  const lastTypingSent = useRef(0);
  activeChatRef.current = activeChatId;

  // Redirect to login when signed out
  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/auth/login");
  }, [router]);

  // The other person in each chat
  const conversations = useMemo(
    () =>
      chats.map((chat) => {
        const partner = chat.participants?.find((p) => idOf(p) !== myId) || chat.receiver;
        return { ...chat, chatId: idOf(chat), partner, partnerId: idOf(partner) };
      }),
    [chats, myId]
  );

  const activeConversation = conversations.find((c) => c.chatId === activeChatId);
  const partner = activeConversation?.partner;
  const partnerOnline = activeConversation && online.has(activeConversation.partnerId);
  const partnerTyping = !!typingChats[activeChatId];

  const filtered = conversations.filter((c) => !search.trim() || c.partner?.fullName?.toLowerCase().includes(search.trim().toLowerCase()));
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Load messages for the selected chat
  useEffect(() => {
    if (messagesData?.data?.attributes && activeChatId) setMessages(messagesData.data.attributes);
  }, [messagesData, activeChatId]);

  // Update one conversation in the cached chat list (and move it to the top)
  const patchChatList = useCallback(
    (chatId, patch) => {
      let found = false;
      dispatch(
        apiSlice.util.updateQueryData("getChatlist", undefined, (draftList) => {
          const list = draftList?.data?.attributes;
          if (!Array.isArray(list)) return;
          const index = list.findIndex((c) => idOf(c) === chatId);
          if (index === -1) return;
          found = true;
          const [chat] = list.splice(index, 1);
          patch(chat);
          list.unshift(chat);
        })
      );
      if (!found) dispatch(apiSlice.util.invalidateTags([{ type: "Chat", id: "LIST" }]));
    },
    [dispatch]
  );

  const isNearBottom = () => {
    const el = scrollRef.current;
    return !el || el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    setShowJump(false);
  };

  // Jump to the newest message when a chat opens
  useEffect(() => {
    if (!messagesLoading) requestAnimationFrame(() => scrollToBottom(false));
  }, [activeChatId, messagesLoading]);

  // ---- Realtime ----
  useEffect(() => {
    if (!myId) return;
    const socket = getSocket();
    if (!socket) return;

    const queryPresence = () => socket.emit("presence:query", (ids) => setOnline(new Set(ids || [])));
    if (socket.connected) queryPresence();

    const onNewMessage = (message) => {
      const chatId = String(message.chatId);
      const fromMe = idOf(message.sender) === myId;
      const isActive = chatId === activeChatRef.current;

      if (isActive) {
        const stickToBottom = fromMe || isNearBottom();
        setMessages((prev) => {
          if (prev.some((m) => idOf(m) === idOf(message))) return prev;
          if (message.clientId && prev.some((m) => m.clientId === message.clientId)) {
            return prev.map((m) => (m.clientId === message.clientId ? { ...message, pending: false } : m));
          }
          return [...prev, message];
        });
        if (stickToBottom) requestAnimationFrame(() => scrollToBottom());
        else setShowJump(true);
        if (!fromMe) socket.emit("messages:read", { chatId });
        setTypingChats((t) => ({ ...t, [chatId]: false }));
      }

      patchChatList(chatId, (chat) => {
        chat.lastMessage = { id: idOf(message), text: message.text, sender: idOf(message.sender), isRead: isActive && !fromMe, createdAt: message.createdAt };
        chat.updatedAt = message.createdAt;
        if (!fromMe && !isActive) chat.unreadCount = (chat.unreadCount || 0) + 1;
      });
    };

    const onRead = ({ chatId, readerId }) => {
      if (readerId === myId) return;
      if (chatId === activeChatRef.current) {
        setMessages((prev) => prev.map((m) => (idOf(m.sender) === myId ? { ...m, isRead: true } : m)));
      }
      patchChatList(chatId, (chat) => {
        if (chat.lastMessage) chat.lastMessage.isRead = true;
      });
    };

    const onTyping = ({ chatId, isTyping }) => {
      clearTimeout(typingTimers.current[chatId]);
      setTypingChats((t) => ({ ...t, [chatId]: isTyping }));
      // Fallback in case the "stopped typing" event is missed
      if (isTyping) typingTimers.current[chatId] = setTimeout(() => setTypingChats((t) => ({ ...t, [chatId]: false })), 5000);
    };

    const onPresence = ({ userId, online: isOnline }) =>
      setOnline((prev) => {
        const next = new Set(prev);
        isOnline ? next.add(userId) : next.delete(userId);
        return next;
      });

    socket.on("connect", queryPresence);
    socket.on("message:new", onNewMessage);
    socket.on("messages:read", onRead);
    socket.on("typing", onTyping);
    socket.on("presence:update", onPresence);
    return () => {
      socket.off("connect", queryPresence);
      socket.off("message:new", onNewMessage);
      socket.off("messages:read", onRead);
      socket.off("typing", onTyping);
      socket.off("presence:update", onPresence);
    };
  }, [myId, patchChatList]);

  // Re-check presence when the list of partners changes (e.g. a new chat)
  useEffect(() => {
    const socket = getSocket();
    if (socket?.connected) socket.emit("presence:query", (ids) => setOnline(new Set(ids || [])));
  }, [conversations.length]);

  const openChat = (chatId) => {
    if (chatId === activeChatId) return;
    setMessages([]);
    setDraft("");
    setActiveChatId(chatId);
    router.replace(`/messages?chatId=${chatId}`, { scroll: false });
    patchChatListUnread(chatId);
  };

  const patchChatListUnread = (chatId) =>
    dispatch(
      apiSlice.util.updateQueryData("getChatlist", undefined, (draftList) => {
        const chat = draftList?.data?.attributes?.find((c) => idOf(c) === chatId);
        if (chat) chat.unreadCount = 0;
      })
    );

  const closeChat = () => {
    setActiveChatId(null);
    router.replace("/messages", { scroll: false });
  };

  const emitTyping = (isTyping) => {
    const socket = getSocket();
    if (!socket || !activeChatId) return;
    socket.emit("typing", { chatId: activeChatId, isTyping });
  };

  const handleDraftChange = (e) => {
    setDraft(e.target.value.slice(0, MAX_LENGTH));
    const now = Date.now();
    if (now - lastTypingSent.current > 2000) {
      lastTypingSent.current = now;
      emitTyping(true);
    }
    clearTimeout(typingTimers.current.self);
    typingTimers.current.self = setTimeout(() => {
      emitTyping(false);
      lastTypingSent.current = 0;
    }, 2500);
  };

  const deliver = async (text, clientId) => {
    try {
      const res = await sendMessage({ chatId: activeChatId, text, clientId }).unwrap();
      const saved = res?.data?.attributes;
      // The socket usually delivers first; this covers a slow or missing socket
      if (saved) {
        setMessages((prev) => prev.map((m) => (m.clientId === clientId && m.pending ? { ...saved, pending: false } : m)));
      }
    } catch {
      setMessages((prev) => prev.map((m) => (m.clientId === clientId ? { ...m, pending: false, failed: true } : m)));
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeChatId) return;
    const clientId = `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [
      ...prev,
      { _id: clientId, clientId, text, sender: { id: myId }, createdAt: new Date().toISOString(), pending: true },
    ]);
    setDraft("");
    clearTimeout(typingTimers.current.self);
    emitTyping(false);
    lastTypingSent.current = 0;
    requestAnimationFrame(() => scrollToBottom());
    textareaRef.current?.focus();
    deliver(text, clientId);
  };

  const retry = (message) => {
    setMessages((prev) => prev.map((m) => (m.clientId === message.clientId ? { ...m, failed: false, pending: true } : m)));
    deliver(message.text, message.clientId);
  };

  // ---- Render helpers ----
  const renderMessages = () => {
    let lastDay = null;
    return messages.map((message, index) => {
      const mine = idOf(message.sender) === myId;
      const prev = messages[index - 1];
      const next = messages[index + 1];
      const showDay = !lastDay || !sameDay(lastDay, message.createdAt);
      lastDay = message.createdAt;
      const groupedWithPrev = prev && !showDay && idOf(prev.sender) === idOf(message.sender);
      const groupedWithNext = next && sameDay(next.createdAt, message.createdAt) && idOf(next.sender) === idOf(message.sender);

      return (
        <React.Fragment key={message.clientId || idOf(message)}>
          {showDay && (
            <div className="my-4 flex items-center justify-center">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">{dayLabel(message.createdAt)}</span>
            </div>
          )}
          <div className={`flex ${mine ? "justify-end" : "justify-start"} ${groupedWithPrev ? "mt-0.5" : "mt-3"}`}>
            <div className={`max-w-[80%] md:max-w-[65%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
              <div
                className={`whitespace-pre-wrap break-words px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                  mine
                    ? `bg-primary text-white ${message.failed ? "opacity-70" : ""} rounded-2xl ${groupedWithNext ? "rounded-br-md" : "rounded-br-sm"}`
                    : `border border-gray-100 bg-white text-gray-800 rounded-2xl ${groupedWithNext ? "rounded-bl-md" : "rounded-bl-sm"}`
                }`}
              >
                {message.text}
                <span className={`ml-3 inline-flex translate-y-0.5 items-center gap-1 align-bottom text-[11px] ${mine ? "text-white/75" : "text-gray-400"}`}>
                  {timeLabel(message.createdAt)}
                  {mine && <MessageStatus message={message} />}
                </span>
              </div>
              {message.failed && (
                <button type="button" onClick={() => retry(message)} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500 hover:underline">
                  <HiOutlineExclamationCircle size={14} /> Not sent · Tap to retry
                </button>
              )}
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  const conversationList = (
    <aside className={`${activeChatId ? "hidden md:flex" : "flex"} w-full flex-col border-r border-gray-100 bg-white md:w-[340px] md:shrink-0`}>
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy">Messages</h1>
          {totalUnread > 0 && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">{totalUnread} new</span>}
        </div>
        <Input
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<HiOutlineMagnifyingGlass className="text-gray-400" />}
          placeholder="Search conversations"
          className="!mt-3 !rounded-lg !bg-gray-50"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatsLoading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} avatar active paragraph={{ rows: 1 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primaryDark">
              <HiOutlineChatBubbleLeftRight size={26} />
            </span>
            <p className="mt-4 font-semibold text-navy">{search ? "No matching conversations" : "No conversations yet"}</p>
            {!search && (
              <>
                <p className="mt-1 text-sm text-gray-500">Find a property you like and message the landlord from its page.</p>
                <Link href="/property" className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryDark">
                  Browse properties
                </Link>
              </>
            )}
          </div>
        ) : (
          <ul>
            {filtered.map((c) => {
              const active = c.chatId === activeChatId;
              const typing = typingChats[c.chatId];
              const lastFromMe = c.lastMessage && c.lastMessage.sender === myId;
              return (
                <li key={c.chatId}>
                  <button
                    type="button"
                    onClick={() => openChat(c.chatId)}
                    className={`flex w-full items-center gap-3 border-l-[3px] px-4 py-3 text-left transition-colors ${
                      active ? "border-primary bg-secondary/60" : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <PresenceAvatar person={c.partner} online={online.has(c.partnerId)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`truncate ${c.unreadCount ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                          {c.partner?.fullName || "Unknown user"}
                        </p>
                        <span className={`shrink-0 text-xs ${c.unreadCount ? "font-semibold text-primaryDark" : "text-gray-400"}`}>
                          {listTime(c.lastMessage?.createdAt || c.updatedAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${typing ? "italic text-primaryDark" : c.unreadCount ? "font-medium text-gray-800" : "text-gray-500"}`}>
                          {typing ? "typing…" : c.lastMessage ? `${lastFromMe ? "You: " : ""}${c.lastMessage.text}` : ROLE_LABEL[c.partner?.role] || "Start the conversation"}
                        </p>
                        {c.unreadCount > 0 && (
                          <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                            {c.unreadCount > 99 ? "99+" : c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );

  const chatPanel = activeChatId ? (
    <section className="flex min-w-0 flex-1 flex-col bg-[#F5F7FB]">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <button type="button" onClick={closeChat} aria-label="Back to conversations" className="-ml-1 rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden">
          <HiOutlineArrowLeft size={20} />
        </button>
        {activeConversation ? (
          <>
            <PresenceAvatar person={partner} online={partnerOnline} size={42} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">{partner?.fullName || "Unknown user"}</p>
              <p className={`text-xs ${partnerTyping ? "text-primaryDark" : partnerOnline ? "text-primaryDark" : "text-gray-500"}`}>
                {partnerTyping ? "typing…" : partnerOnline ? "Online" : ROLE_LABEL[partner?.role] || "Offline"}
              </p>
            </div>
          </>
        ) : (
          <Skeleton.Input active size="small" />
        )}
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={() => isNearBottom() && setShowJump(false)}
        className="relative flex-1 overflow-y-auto px-4 py-2 md:px-8"
      >
        {messagesLoading && messages.length === 0 ? (
          <div className="space-y-4 py-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 ? "justify-start" : "justify-end"}`}>
                <Skeleton.Input active className={`!h-10 ${i % 2 ? "!w-56" : "!w-40"}`} />
              </div>
            ))}
          </div>
        ) : messagesError ? (
          <p className="py-16 text-center text-sm text-red-500">This conversation couldn&apos;t be loaded.</p>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <PresenceAvatar person={partner} size={64} />
            <p className="mt-3 font-semibold text-navy">Say hello to {partner?.fullName?.split(" ")[0] || "them"} 👋</p>
            <p className="mt-1 text-sm text-gray-500">Ask about availability, price or a viewing time.</p>
          </div>
        ) : (
          <div className="pb-2">{renderMessages()}</div>
        )}
        {partnerTyping && (
          <div className="mt-3">
            <TypingBubble />
          </div>
        )}
      </div>

      {showJump && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white shadow-lg md:left-[calc(50%+170px)]"
        >
          New messages <HiChevronDown size={14} />
        </button>
      )}

      {/* Composer */}
      <div className="border-t border-gray-100 bg-white p-3 md:p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-primary focus-within:bg-white">
          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            onChange={handleDraftChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message…"
            className="max-h-36 min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[15px] outline-none [field-sizing:content]"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primaryDark disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <HiOutlinePaperAirplane size={18} />
          </button>
        </div>
        <p className="mt-1.5 hidden px-1 text-[11px] text-gray-400 md:block">
          Enter to send · Shift + Enter for a new line
          {draft.length > MAX_LENGTH - 200 && <span className="float-right">{draft.length}/{MAX_LENGTH}</span>}
        </p>
      </div>
    </section>
  ) : (
    <section className="hidden flex-1 flex-col items-center justify-center bg-[#F5F7FB] text-center md:flex">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-primaryDark shadow-sm">
        <HiOutlineChatBubbleLeftRight size={36} />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-navy">Your messages</h2>
      <p className="mt-1 max-w-xs text-sm text-gray-500">Pick a conversation on the left to read and reply in real time.</p>
    </section>
  );

  return (
    <div className="bg-gray-50 md:px-6 md:py-6">
      <div className="relative mx-auto flex h-[calc(100dvh-72px)] max-w-7xl overflow-hidden border-gray-100 bg-white md:h-[calc(100dvh-72px-48px)] md:rounded-2xl md:border md:shadow-sm">
        {conversationList}
        {chatPanel}
      </div>
    </div>
  );
};

export default MessagesPage;
