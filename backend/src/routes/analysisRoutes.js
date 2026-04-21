const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');
const { analyzeReport, chatBot } = require('../controllers/analysisController');

// Expects field name 'report' from frontend
router.post('/analyze', verifyToken, upload.single('report'), analyzeReport);
router.post('/chat', chatBot);
module.exports = router;