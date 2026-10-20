import { io } from "socket.io-client";
import baseUrl from "@/redux/api/baseUrl";

// One shared, authenticated socket per logged-in user (same token as the API)
let socket = null;
let socketToken = null;

export const getSocket = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (socket && socketToken === token) return socket;

  socket?.disconnect();
  socketToken = token;

  const proxied = baseUrl.startsWith("/");
  socket = proxied
    ? // Through the site's /backend proxy: same origin, custom path, and HTTP
      // long-polling because the proxy can't carry websocket connections
      io(window.location.origin, { path: `${baseUrl}/socket.io`, auth: { token }, transports: ["polling"] })
    : io(baseUrl, { auth: { token }, transports: ["websocket", "polling"], reconnectionDelay: 1000, reconnectionDelayMax: 10000 });
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
  socketToken = null;
};
