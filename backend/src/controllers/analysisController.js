const fs = require("fs");
const Report = require("../models/Report");
const { extractText } = require("../services/ocrService");
const { analyzeMedicalText } = require("../services/medicalAnalyzer");

const analyzeReport = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please upload a file" });

  try {
    const extractedText = await extractText(req.file);
    if (!extractedText || extractedText.trim().length < 5) {
      return res.status(422).json({ message: "OCR could not read clear text from this file" });
    }

    const analysis = analyzeMedicalText(extractedText);

    const saved = await Report.create({
      user: req.user?.id || null,
      originalFileName: req.file.originalname,
      extractedText: analysis.cleanedText,
      parameters: analysis.parameters,
      finalExplanation: analysis.finalExplanation,
      finalExplanationHinglish: analysis.finalExplanationHinglish,
    });

    return res.json({
      reportId: saved._id,
      originalFileName: saved.originalFileName,
      extractedText: saved.extractedText,
      parameters: saved.parameters,
      explanation: saved.finalExplanation,
      explanationHinglish: saved.finalExplanationHinglish,
    });
  } catch (error) {
    return res.status(500).json({ message: `Analysis failed: ${error.message}` });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
};

module.exports = { analyzeReport };
