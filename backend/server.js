import dotenv from "dotenv";
import express from "express";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/* ===========================
    Database Connection
=========================== */

// Ye apka database connect kar dega (config/db.js se)
connectDB();

/* ===========================
    Start Server
=========================== */

app.listen(PORT, () => {
    console.log("======================================");
    console.log(`Server Running Successfully`);
    console.log(`http://localhost:${PORT}`);
    console.log(`Environment : ${process.env.NODE_ENV}`);
    console.log("======================================");
});