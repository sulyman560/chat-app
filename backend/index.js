import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import User from "./models/User.js";
dotenv.config();

await connectDB();

const app = express();
app.use(cors({
  origin: "https://chat-app-1-3bs4.onrender.com", // তোমার Vercel frontend
  methods: ["GET", "POST"],
}));
app.use(express.json());

// routes
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// test api
app.get("/", (req, res) => res.send("Server running"));

// http server + socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://chat-app-1-3bs4.onrender.com", methods: ["GET", "POST"] },
  path: "/socket.io", 
});

let onlineUsers = {}; // { userId: [socketId1, socketId2] }

// 🔹 Emit all users status
const sendAllUsersStatus = async () => {
  const allUsers = await User.find({}, "_id online lastSeen username");
  io.emit("allUsersStatus", allUsers);
};

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  // USER ONLINE
  socket.on("addUser", async (userId) => {
    socket.userId = userId;

    if (!onlineUsers[userId]) onlineUsers[userId] = [];
    onlineUsers[userId].push(socket.id);

    await User.findByIdAndUpdate(userId, { online: true, lastSeen: null });

    sendAllUsersStatus();
  });

  // SEND MESSAGE
  socket.on("sendMessage", (data) => {
    // send to receiver sockets only
    const receiverSockets = onlineUsers[data.receiverId] || [];
    receiverSockets.forEach(sid => io.to(sid).emit("getMessage", data));

    // optionally send to sender too
    socket.emit("getMessage", data);
  });

  // USER OFFLINE
  socket.on("disconnect", async () => {
    if (socket.userId && onlineUsers[socket.userId]) {
      onlineUsers[socket.userId] = onlineUsers[socket.userId].filter(id => id !== socket.id);

      if (onlineUsers[socket.userId].length === 0) {
        delete onlineUsers[socket.userId];
        await User.findByIdAndUpdate(socket.userId, { online: false, lastSeen: new Date() });
      }
    }
    sendAllUsersStatus();
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));