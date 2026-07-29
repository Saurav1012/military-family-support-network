import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

/* ===========================================
   Create Conversation
=========================================== */

export const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const existingConversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, receiverId],
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        conversation: existingConversation,
      });
    }

    const conversation = await Conversation.create({
      participants: [req.user._id, receiverId],
    });

    res.status(201).json({
      success: true,
      message: "Conversation Created",
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Send Message
=========================================== */

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const conversation = await Conversation.findById(
      req.params.conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation Not Found",
      });
    }

    const newMessage = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      message,
    });

    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();
    // Increment unread count for the receiver
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;

    await conversation.save();

    // Find the receiver's socket and emit real-time message
    const receiverId = conversation.participants.find(
      (id) => id.toString() !== req.user._id.toString()
    );

    if (receiverId && global.onlineUsers) {
      const receiverSocket = global.onlineUsers.get(receiverId.toString());
      if (receiverSocket) {
        req.app.get("io").to(receiverSocket).emit("receive-message", newMessage);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message Sent",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Get Conversations
=========================================== */

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate(
        "participants",
        "name email profileImage role"
      )
      .sort({
        updatedAt: -1,
      });

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Get Messages (Resets unreadCount on open)
=========================================== */

export const getMessages = async (req, res) => {
  try {
    // 🚀 Option 1: Direct fast update to reset unreadCount when user opens chat
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      unreadCount: 0,
    });

    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate(
        "sender",
        "name profileImage"
      )
      .sort({
        createdAt: 1,
      });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Mark Messages Seen
========================================== */

export const markSeen = async (req, res) => {
  try {
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      unreadCount: 0,
    });

    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: {
          $ne: req.user._id,
        },
      },
      {
        seen: true,
        delivered: true,
        seenAt: new Date(),
      }
    );

    res.json({
      success: true,
      message: "Messages Seen",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};