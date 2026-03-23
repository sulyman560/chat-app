import { io } from "socket.io-client";

export const socket = io("https://chat-server-5zt5.onrender.com", {
  autoConnect: false, // 🔥 important
  path: "/socket.io",
});

//https://chat-server-5zt5.onrender.com