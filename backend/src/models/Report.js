const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalFileName: String,
  extractedText: String,
  simpleExplanation: String,
  parameters: [{
    name: String,
    value: String,
    status: String,
    meaning: String
  }]
}, { timestamps: true });
module.exports = mongoose.model('Report', reportSchema);