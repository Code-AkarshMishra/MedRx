const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { analyzeReport } = require("../controllers/analysisController");

const router = express.Router();

router.post("/", authMiddleware, upload.single("report"), analyzeReport);

module.exports = router;
