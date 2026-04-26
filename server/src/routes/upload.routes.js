import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);

    // ❌ No file
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please send file with key 'file'"
      });
    }

    // ✅ Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "certificates",
          resource_type: "auto"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer); // 👈 IMPORTANT
    });

    // ✅ Success
    res.json({
      message: "File uploaded successfully",
      fileUrl: result.secure_url
    });

  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      message: "Upload failed",
      error: error.message
    });
  }
});

export default router;