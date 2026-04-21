const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalFileName: String,
  extractedText: String,
  // Back-compat fields (older UI)
  simpleExplanation: String,
  parameters: [{
    name: String,
    value: String,
    status: String,
    meaning: String
  }],
  // New structured analysis output (store everything Gemini returns)
  analysis: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });
module.exports = mongoose.model('Report', reportSchema);