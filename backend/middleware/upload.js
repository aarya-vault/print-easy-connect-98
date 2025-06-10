
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for COMPLETELY UNRESTRICTED file uploads
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

// REMOVED ALL FILE RESTRICTIONS - Accept EVERYTHING
const fileFilter = (req, file, cb) => {
  console.log(`📁 File upload: ${file.originalname} (${file.mimetype}) - NO RESTRICTIONS`);
  // Accept ALL file types - ABSOLUTELY NO RESTRICTIONS
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    // COMPLETELY UNLIMITED - as explicitly requested
    fileSize: Infinity, // No file size limit whatsoever
    files: Infinity, // No file count limit
    fieldSize: Infinity, // No field size limit
    headerPairs: Infinity, // No header pairs limit
    fieldNameSize: Infinity, // No field name size limit
    fields: Infinity, // No fields limit
    parts: Infinity // No parts limit
  },
  fileFilter: fileFilter
});

console.log('✅ File upload middleware: ZERO RESTRICTIONS - ALL FILE TYPES AND SIZES ACCEPTED');

module.exports = upload;
