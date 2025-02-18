// utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://10.0.60.203:3040", {
  autoConnect: true, // Ensure socket auto-connects
  transports: ["websocket"], // Use WebSocket transport for better reliability
  reconnection: true, // Allow reconnection attempts
  // reconnectionAttempts: Infinity, // Keep trying indefinitely
  reconnectionDelay: 1000, // Start with 1-second delay
  reconnectionDelayMax: 5000, // Max delay between reconnects
  timeout: 20000, // 20 seconds timeout for connection
});

export default socket;
