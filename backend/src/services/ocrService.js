const Tesseract = require('tesseract.js');
const fs = require('fs');

exports.extractText = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    // Delete file after extraction to save space
    fs.unlinkSync(filePath); 
    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};