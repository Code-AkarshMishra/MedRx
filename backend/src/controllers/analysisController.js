const ocrService = require('../services/ocrService');
const medicalAnalyzer = require('../services/medicalAnalyzer');
const Report = require('../models/Report');
const User = require("../models/User");
const { PDFParse } = require("pdf-parse");
const fs = require("fs");
const { generateContentWithRetry, getGeminiModelName } = require("../services/geminiClient");

exports.analyzeReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // 1. Extract Text (PDF via pdf-parse, images via OCR)
    let text = "";
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parser = new PDFParse({ data: dataBuffer });
      const pdfData = await parser.getText();
      await parser.destroy();
      text = pdfData?.text || "";
      fs.unlinkSync(req.file.path);
    } else {
      text = await ocrService.extractText(req.file.path);
    }
    
    // 2. Analyze via AI
    let patientContext = null;
    if (req.user?.id) {
      const u = await User.findById(req.user.id).select("dob gender patientId name").lean();
      if (u) {
        patientContext = {
          patientId: u.patientId,
          name: u.name,
          gender: u.gender,
          age: (() => {
            const d = new Date(u.dob);
            if (Number.isNaN(d.getTime())) return null;
            const today = new Date();
            let age = today.getFullYear() - d.getFullYear();
            const m = today.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
            return age;
          })(),
        };
      }
    }

    const analysis = await medicalAnalyzer.analyzeMedicalText(text, patientContext);
    
    const resultData = {
      originalFileName: req.file.originalname,
      extractedText: text,
      ...analysis,
      // Store the full structured output under a stable key for the UI/history.
      analysis
    };

    // 3. Save to History if logged in
    if (req.user) {
      const savedReport = await Report.create({
        userId: req.user.id,
        ...resultData
      });
      resultData._id = savedReport._id;
    }

    res.status(200).json(resultData);
  } catch (error) {
    console.error("Error in analyzeReport:", error);
    const status = error?.status || error?.cause?.status;
    const message =
      status === 403
        ? "Gemini rejected the API key (403). This usually means the key is invalid/disabled or was flagged as leaked. Create a NEW key and update backend/.env (AI_API_KEY or GEMINI_API_KEY), then restart the backend."
        : status === 429
          ? "Gemini rate-limited the request (429). Please wait a bit and retry."
          : status === 503
            ? "Gemini is temporarily overloaded (503). Please retry in a minute."
            : "Analysis failed. Please check the server logs.";
    res.status(500).json({ message });
  }
};

exports.chatBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    const prompt = `
      You are MedRx AI, a highly intelligent and empathetic medical assistant. 
      Answer the following user question in simple, easy-to-understand plain English. 
      Keep the response concise (2-3 short paragraphs maximum).
      
      User Question: "${message}"
    `;

    const result = await generateContentWithRetry(prompt, { retries: 2 });
    const aiResponse = result.response.text();

    res.status(200).json({ reply: aiResponse });

  } catch (error) {
    console.error("Error in chatBot:", error);
    // Keep reply user-friendly; include minimal debug hint for local development.
    const hint =
      process.env.NODE_ENV === "production"
        ? ""
        : ` (model: ${getGeminiModelName()})`;
    res
      .status(500)
      .json({ reply: `AI request failed. Please try again later.${hint}` });
  }
};