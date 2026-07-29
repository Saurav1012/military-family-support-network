import EmergencyAlert from "../models/EmergencyAlert.js";

/* Create Alert */
export const createAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // Populate user info before emitting so clients get the creator details immediately
    await alert.populate("createdBy", "name");

    // 🚀 Real-time broadcast to all connected clients
    const io = req.app.get("io");
    if (io) {
      io.emit("emergency-alert", alert);
    }

    res.status(201).json({
      success: true,
      message: "Emergency Alert Created",
      alert,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* Get All Alerts */
export const getAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json({
      success: true,
      alerts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* Deactivate Alert */
export const deactivateAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Alert Deactivated",
      alert,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};