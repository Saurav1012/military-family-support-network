import dotenv from "dotenv";
dotenv.config();

import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";

import { Server } from "socket.io";
import socketAuth from "./socket/socketAuth.js";
import "./config/validateEnv.js";

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Middleware for Socket Authentication
io.use(socketAuth);

// Expose io instance to Express app
app.set("io", io);

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User Connected :", socket.id);

  socket.on("join", () => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);
    console.log("Online Users :", onlineUsers.size);
  });

  // Typing event
  socket.on("typing", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("user-typing", {
        senderId: data.senderId,
      });
    }
  });

  // Stop typing event
  socket.on("stop-typing", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("stop-typing", {
        senderId: data.senderId,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected :", socket.id);

    for (const [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server Running http://localhost:${PORT}`);
});