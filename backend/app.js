import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // Added adminRoutes import

const app = express();

/* ===========================
   Middlewares
=========================== */

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(helmet());

app.use(morgan("dev"));

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
app.use("/api/admin", adminRoutes); // Mounted admin routes

/* ===========================
   404 Handler
=========================== */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});

/* ===========================
   Global Error Handler
=========================== */

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;