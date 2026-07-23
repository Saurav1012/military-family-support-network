import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";

import connectDB from "./config/db.js";
import User from "./models/User.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@militarysupport.com",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "System Administrator",
      email: "admin@militarysupport.com",
      password: hashedPassword,

      role: "admin",

      relationship: "Administrator",

      city: "New Delhi",

      state: "Delhi",

      militaryIdNumber: "ADMIN001",

      approvalStatus: "approved",

      isVerified: true,
    });

    console.log("🎉 Admin Created Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();