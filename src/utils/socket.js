// utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://sayed3040.sobhoy.com", {
  withCredentials: true,
  autoConnect: false,
});

export default socket;