import express from 'express';
import cloudinary from '../config/cloudinary.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please send file with key 'file'"
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'certificates',
            resource_type: 'auto',
            use_filename: false,
            unique_filename: true,
            context: {
              uploaded_by: String(req.user._id),
              purpose: 'admission_document'
            }
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        )
        .end(req.file.buffer);
    });

    res.json({
      message: 'File uploaded successfully',
      fileUrl: result.secure_url
    });
  } catch {
    res.status(500).json({
      message: 'Upload failed'
    });
  }
});

export default router;
