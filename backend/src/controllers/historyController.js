const Report = require("../models/Report");

const getHistory = async (req, res) => {
  try {
    if (!req.user?.id) return res.json([]);
    const reports = await Report.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("originalFileName parameters finalExplanation createdAt");
    return res.json(reports);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getHistory };
