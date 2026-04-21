const Report = require('../models/Report');

exports.getHistory = async (req, res) => {
  try {
    const history = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};