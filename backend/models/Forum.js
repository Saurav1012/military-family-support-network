import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      default: "Member",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const forumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      enum: [
        "Deployment",
        "Family",
        "Education",
        "Counselling",
        "Relocation",
        "General",
        "Housing",
        "Medical",
        "Career",
      ],
      default: "General",
    },
    location: {
      type: String,
      default: "General",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // 🟢 Comments Array Added
    comments: [commentSchema],

    // 🟢 Admin Pin Feature Added
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Forum", forumSchema);