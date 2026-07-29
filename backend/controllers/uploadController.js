import User from "../models/User.js";

/* ==========================================
   Upload Profile Image
========================================== */
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: req.file.path,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Upload Verification Document
========================================== */
export const uploadVerificationDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No document uploaded",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        verificationDocument: req.file.path,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Verification document uploaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};