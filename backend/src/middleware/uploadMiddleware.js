const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});

const fileFilter = (_req, file, cb) => {
  const accepted = ["image/jpeg", "image/png", "application/pdf"];
  if (!accepted.includes(file.mimetype)) {
    cb(new Error("Only JPG, PNG, and PDF files are allowed"));
  } else {
    cb(null, true);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});
