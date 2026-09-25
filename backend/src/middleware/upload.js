const multer = require('multer');
const path = require('path');
const fs = require('fs');

const os = require('os');

// Ensure uploads directory exists (use os.tmpdir() on Vercel serverless)
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.error('[UploadDir Init Error]:', err.message);
  }
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists at upload time as well
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (err) {
        return cb(err);
      }
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `crop-${uniqueSuffix}${ext}`);
  },
});

// File filter for supported image formats (JPG, JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Please upload a clear JPG, JPEG, PNG, or WEBP photo of the crop leaf or pest.'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum
  },
});

module.exports = upload;
