
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads with NO LIMITS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(uploadsDir, 'orders');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

// Remove all file type restrictions - accept ANY file type
const fileFilter = (req, file, cb) => {
  // Accept ALL file types - no restrictions
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    // Remove all limits as requested
    fileSize: Infinity, // No file size limit
    files: Infinity, // No file count limit
    fieldSize: Infinity, // No field size limit
    headerPairs: Infinity // No header pairs limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
