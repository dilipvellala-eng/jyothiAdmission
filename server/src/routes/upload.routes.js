import express from "express";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  try {
    // 🔍 Debug (you can remove later)
    console.log("Uploaded file:", req.file);

    // ❌ No file case
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please send file with key 'file'"
      });
    }

    // ✅ Handle both cases (Cloudinary OR local)
    const fileUrl =
      req.file.path ||          // Cloudinary (most setups)
      req.file.secure_url ||    // Cloudinary alternative
      req.file.url ||           // fallback
      null;

    if (!fileUrl) {
      return res.status(500).json({
        message: "File uploaded but URL not found"
      });
    }

    // ✅ Success response
    res.json({
      message: "File uploaded successfully",
      fileUrl
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