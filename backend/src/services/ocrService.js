const fs = require("fs");
const Tesseract = require("tesseract.js");
const { PDFParse } = require("pdf-parse");

const extractText = async (file) => {
  if (file.mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(file.path);
    const parser = new PDFParse({ data: dataBuffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed?.text || "";
  }

  const result = await Tesseract.recognize(file.path, "eng");
  return result.data.text || "";
};

module.exports = { extractText };
