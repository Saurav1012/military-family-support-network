import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


const app = express();

/* ===========================
   Middlewares & Security
=========================== */

app.use(helmet());

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use(limiter);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/* ===========================
   Test Route
=========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Military Family Support API Running Successfully 🚀",
  });
});

/* ===========================
   Health Check
=========================== */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    server: "Running",
    environment: process.env.NODE_ENV,
  });
});

/* ===========================
   API Routes
=========================== */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ===========================
   404 Handler
=========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* ===========================
   Global Error Handler
=========================== */

app.use(errorHandler);

export default app;