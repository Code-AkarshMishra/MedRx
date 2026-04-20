const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getHistory } = require("../controllers/historyController");

const router = express.Router();

router.get("/", authMiddleware, getHistory);

module.exports = router;
