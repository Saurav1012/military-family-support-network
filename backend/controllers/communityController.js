import Community from "../models/Community.js";

/* ==========================
   Create Community
========================== */

export const createCommunity = async (req, res) => {
  try {
    const { title, description, location, category } = req.body;

    const community = await Community.create({
      title,
      description,
      location,
      category,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: "Community created successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Get All Communities
========================== */

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: communities.length,
      communities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Join Community
========================== */

export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    if (community.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Already joined",
      });
    }

    community.members.push(req.user._id);

    await community.save();

    res.status(200).json({
      success: true,
      message: "Joined successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};