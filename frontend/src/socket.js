import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false, // 🔥 important
  path: "/socket.io",
});

//https://chat-server-5zt5.onrender.com