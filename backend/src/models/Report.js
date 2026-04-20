const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema(
  {
    key: String,
    value: Number,
    unit: String,
    status: String,
    range: String,
    explanation: String,
    explanationHinglish: String,
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    originalFileName: { type: String, required: true },
    extractedText: { type: String, required: true },
    parameters: [parameterSchema],
    finalExplanation: { type: String, required: true },
    finalExplanationHinglish: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
