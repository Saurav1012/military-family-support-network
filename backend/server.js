import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import socketAuth from "./socket/socketAuth.js";
import "./config/validateEnv.js";

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;

// Dynamic Allowed Origins for Express & Socket.io
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://military-family-support.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean); // Filters out undefined values if CLIENT_URL isn't set yet

// Apply CORS to Express app
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to allow connection
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const server = http.createServer(app);

// Setup Socket.io with dynamic CORS origins
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
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
  console.log(`Server Running on port ${PORT}`);
});