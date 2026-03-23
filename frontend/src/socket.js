import { io } from "socket.io-client";

export const socket = io("https://chat-app-server-rsgf.onrender.com", {
  autoConnect: false, // 🔥 important
  //path: "/socket.io",
});

//https://chat-app-server-rsgf.onrender.com