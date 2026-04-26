import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/apiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadRoot, { recursive: true });

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safeBase = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBase}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) return cb(new ApiError(400, 'Only JPG, PNG, and PDF files are allowed'));
    cb(null, true);
  }
});
