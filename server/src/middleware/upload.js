import fs from 'fs';
import path from 'path';
import multer from 'multer';

const UPLOAD_DIR = path.resolve('uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    const safe = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    cb(null, `${safe || 'image'}-${stamp}${rand}${path.extname(file.originalname).toLowerCase()}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter: (req, file, cb) =>
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Upload a JPG, PNG, WebP, AVIF or GIF image.')),
});

export const UPLOADS_PATH = UPLOAD_DIR;
