import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

/* ==========================================
   Generate JWT Token
========================================== */
const generateToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* ==========================================
   Register User
========================================== */
export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      name,
      email,
      password,
      role,
      relationship,
      city,
      state,
      militaryIdNumber,
    } = req.body;

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      relationship,
      city,
      state,
      militaryIdNumber,
      approvalStatus: "approved", // Set to "pending" for admin approval workflow
      isVerified: true,
    });

    // Remove password from response for security
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      // message: "Registration successful. Waiting for admin approval.",
      message: "Registration Successful",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   Login User
========================================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Check Approval
    // if (user.approvalStatus !== "approved") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Your account is waiting for admin approval.",
    //   });
    // }

    // Generate Token
    const token = generateToken(user._id, user.role);

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        profileImage: user.profileImage,
        verificationDocument: user.verificationDocument,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   Get User Profile
========================================== */
export const getProfile = async (req, res) => {
  try {
    // req.user comes from your authentication middleware (protect/authMiddleware)
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};