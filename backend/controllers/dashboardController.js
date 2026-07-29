import User from "../models/User.js";
import Community from "../models/Community.js";
import Forum from "../models/Forum.js";
import Resource from "../models/Resource.js";
import EmergencyAlert from "../models/EmergencyAlert.js";

export const getDashboardStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const approvedUsers = await User.countDocuments({
            approvalStatus: "approved",
        });

        const pendingUsers = await User.countDocuments({
            approvalStatus: "pending",
        });

        const totalCommunities = await Community.countDocuments();

        const totalForums = await Forum.countDocuments();

        const totalResources = await Resource.countDocuments();

        const activeAlerts = await EmergencyAlert.countDocuments({
            isActive: true,
        });

        res.json({
            success: true,

            stats: {

                totalUsers,

                approvedUsers,

                pendingUsers,

                totalCommunities,

                totalForums,

                totalResources,

                activeAlerts,

            },

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};