import mongoose from "mongoose";

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
      ],
      required: true,
    },

    location: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Forum", forumSchema);