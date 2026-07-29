import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const hashedPassword = await bcrypt.hash("Saurav@123", 10);

await User.updateOne(
  { email: "saurav@example.com" },
  { $set: { password: hashedPassword } }
);

console.log("Password Reset Successfully");

process.exit();