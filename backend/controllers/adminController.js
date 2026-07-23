import User from "../models/User.js";

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      approvalStatus: "pending",
    }).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.approvalStatus = "approved";
    user.isVerified = true;

    await user.save();

    res.json({
      success: true,
      message: "User approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.approvalStatus = "rejected";

    await user.save();

    res.json({
      success: true,
      message: "User rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};