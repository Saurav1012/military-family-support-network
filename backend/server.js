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

// Dynamic CORS check function (Allows localhost, main Vercel domain, and all Vercel Preview domains)
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow non-browser requests (Postman, mobile apps)
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".vercel.app")) return true; // Matches all *.vercel.app URLs
  if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return true;
  return false;
};

// Apply CORS to Express app
app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const server = http.createServer(app);

// Setup Socket.io with dynamic origin check
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
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