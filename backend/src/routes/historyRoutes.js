const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getHistory } = require('../controllers/historyController');

router.get('/', verifyToken, getHistory);
module.exports = router;