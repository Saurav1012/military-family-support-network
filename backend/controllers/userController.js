import User from "../models/User.js";
import bcrypt from "bcrypt";

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, bio } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;

    if (req.file && req.file.buffer) {
      const base64 = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype || "image/png";
      updateData.profileImage = `data:${mimeType};base64,${base64}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id || req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};