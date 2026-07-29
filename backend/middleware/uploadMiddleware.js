import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let folder = "military-family/profile";

    if (req.originalUrl.includes("resource")) {
      folder = "military-family/resources";
    }

    return {
      folder,
      resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP and PDF allowed"));
  }
};

export default multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB Limit
  },
  fileFilter,
});