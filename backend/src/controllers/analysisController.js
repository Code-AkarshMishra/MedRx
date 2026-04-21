// const ocrService = require('../services/ocrService');
// const medicalAnalyzer = require('../services/medicalAnalyzer');
// const Report = require('../models/Report');
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// exports.analyzeReport = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });


//     if (req.file.mimetype === 'application/pdf') {
//       return res.status(400).json({ message: "PDF reading is not currently supported by the OCR engine. Please upload a JPG or PNG image." });
//     }

//     // 1. Extract Text
//     const text = await ocrService.extractText(req.file.path);
    
//     // 2. Analyze via AI
//     const analysis = await medicalAnalyzer.analyzeMedicalText(text);

    
//     // // 1. Extract Text
//     // const text = await ocrService.extractText(req.file.path);
    
//     // // 2. Analyze via AI
//     // const analysis = await medicalAnalyzer.analyzeMedicalText(text);
    
//     const resultData = {
//       originalFileName: req.file.originalname,
//       extractedText: text,
//       ...analysis
//     };

//     // 3. Save to History if logged in
//     if (req.user) {
//       const savedReport = await Report.create({
//         userId: req.user.id,
//         ...resultData
//       });
//       resultData._id = savedReport._id;
//     }

//     res.status(200).json(resultData);
//   } catch (error) {
//     console.error("Error in analyzeReport:", error); // Helpful for debugging
//     res.status(500).json({ message: "Analysis failed. Please check the server logs." });
//   }
// };

// exports.chatBot = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ reply: "Please provide a message." });
//     }
// console.log("🔑 THE KEY NODE IS USING:", process.env.GEMINI_API_KEY); // Add this line!
//     // Initialize Gemini AI
//     // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const genAI = new GoogleGenerativeAI("AIzaSyBQp3V46eNHZHb7E_s8LJBFcxBrs_dgWqU");

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // The prompt instructs the AI on how to behave
//     const prompt = `
//       You are MedRx AI, a highly intelligent and empathetic medical assistant. 
//       Answer the following user question in simple, easy-to-understand plain English. 
//       Keep the response concise (2-3 short paragraphs maximum).
      
//       User Question: "${message}"
//     `;

//     // Fetch the real response from the AI
//     const result = await model.generateContent(prompt);
//     const aiResponse = result.response.text();

//     res.status(200).json({ reply: aiResponse });

//   } catch (error) {
//     console.error("Error in chatBot:", error);
//     res.status(500).json({ reply: "I am having trouble connecting to my AI network right now. Please try again later." });
//   }
// };

const ocrService = require('../services/ocrService');
const medicalAnalyzer = require('../services/medicalAnalyzer');
const Report = require('../models/Report');
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
    const analysis = await medicalAnalyzer.analyzeMedicalText(text);
    
    const resultData = {
      originalFileName: req.file.originalname,
      extractedText: text,
      ...analysis
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
    res.status(500).json({ message: "Analysis failed. Please check the server logs." });
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