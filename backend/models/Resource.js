import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Government Scheme",
        "Relocation",
        "Education",
        "Housing",
        "Counselling",
        "Emergency",
      ],
      required: true,
    },

    contactName: {
      type: String,
      default: "",
    },

    contactEmail: {
      type: String,
      default: "",
    },

    contactPhone: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    resourceImage: {
      type: String,
      default: "",
    },

    resourcePdf: {
      type: String,
      default: "",
    },

    document: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resourceSchema);