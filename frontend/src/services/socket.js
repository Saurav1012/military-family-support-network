import { io } from "socket.io-client";

// /api ko hata kar base backend URL nikalne ke liye
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5000";

const socket = io(BASE_URL, {
  transports: ["websocket", "polling"],
});

export default socket;