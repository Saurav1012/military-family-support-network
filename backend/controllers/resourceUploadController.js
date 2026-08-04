import Resource from "../models/Resource.js";

export const uploadResourceFiles = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    if (req.files?.image?.[0]?.buffer) {
      const base64 = req.files.image[0].buffer.toString("base64");
      const mimeType = req.files.image[0].mimetype || "image/png";
      resource.resourceImage = `data:${mimeType};base64,${base64}`;
    }

    if (req.files?.pdf?.[0]?.buffer) {
      const base64 = req.files.pdf[0].buffer.toString("base64");
      const mimeType = req.files.pdf[0].mimetype || "application/pdf";
      resource.resourcePdf = `data:${mimeType};base64,${base64}`;
    }

    await resource.save();

    return res.json({
      success: true,
      message: "Files uploaded",
      resource,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};