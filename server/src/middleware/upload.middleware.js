import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf'
]);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'certificates',
    resource_type: 'auto'
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new ApiError(400, 'Only JPG, PNG, and PDF files are allowed'));
    }
    cb(null, true);
  }
});