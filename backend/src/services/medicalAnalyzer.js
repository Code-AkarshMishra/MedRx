// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Initialize Gemini with your API Key
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const genAI = new GoogleGenerativeAI("AIzaSyBQp3V46eNHZHb7E_s8LJBFcxBrs_dgWqU");
// exports.analyzeMedicalText = async (extractedText) => {
//   try {
//     // Using gemini-1.5-flash as it is fast and excellent for text processing
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // This prompt forces the AI to fix OCR errors and return ONLY a strict JSON object
//     const prompt = `
//       You are an expert medical AI assistant.
//       I am providing you with text extracted from a medical report via OCR. The OCR might have errors or messy formatting.
//       Your job is to read it, infer the correct medical parameters, and summarize the report.

//       Extracted Text:
//       """
//       ${extractedText}
//       """

//       Analyze the text and return the result STRICTLY in the following JSON format. Do not add any markdown formatting like \`\`\`json or any other text outside the JSON object.

//       {
//         "simpleExplanation": "A 2-3 sentence summary in simple, non-medical language for a patient explaining what this report indicates overall.",
//         "parameters": [
//           {
//             "name": "Name of the test (e.g., Hemoglobin, TLC, Platelets)",
//             "value": "The exact value with its unit (e.g., 14.2 g/dL)",
//             "status": "Normal, High, Low, or Abnormal (figure this out based on standard medical ranges if possible)",
//             "meaning": "1 short sentence explaining what this specific parameter means in simple terms."
//           }
//         ]
//       }
//     `;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     // Clean up the response in case Gemini adds markdown code blocks accidentally
//     const cleanedJsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
//     // Parse the genuine AI response into a JavaScript object
//     const parsedData = JSON.parse(cleanedJsonString);

//     return parsedData;

//   } catch (error) {
//     console.error("Gemini AI API Error:", error);
//     // Fallback error so your frontend doesn't crash completely if the API fails
//     throw new Error("Failed to analyze the medical text using AI.");
//   }
// };

const { generateContentWithRetry, getGeminiModelName } = require("./geminiClient");

exports.analyzeMedicalText = async (extractedText) => {
  try {
    const prompt = `
      You are an expert medical AI assistant.
      I am providing you with text extracted from a medical report via OCR. The OCR might have errors or messy formatting.
      Your job is to read it, infer the correct medical parameters, and summarize the report.

      Extracted Text:
      """
      ${extractedText}
      """

      Analyze the text and return the result STRICTLY in the following JSON format. Do not add any markdown formatting like \`\`\`json or any other text outside the JSON object.

      {
        "simpleExplanation": "A 2-3 sentence summary in simple, non-medical language for a patient explaining what this report indicates overall.",
        "parameters": [
          {
            "name": "Name of the test (e.g., Hemoglobin, TLC, Platelets)",
            "value": "The exact value with its unit (e.g., 14.2 g/dL)",
            "status": "Normal, High, Low, or Abnormal (figure this out based on standard medical ranges)",
            "meaning": "1 short sentence explaining what this specific parameter means in simple terms."
          }
        ]
      }
    `;

    const result = await generateContentWithRetry(prompt, { retries: 2 });
    const responseText = result.response.text();

    const cleanedJsonString = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedJsonString);
    } catch (parseErr) {
      const err = new Error(
        "AI response was not valid JSON. Try again, or adjust the prompt/model."
      );
      err.cause = parseErr;
      err.model = getGeminiModelName();
      err.raw = responseText?.slice?.(0, 1500);
      throw err;
    }

    return parsedData;

  } catch (error) {
    console.error("Gemini AI API Error in Analyzer:", error);
    throw new Error("Failed to analyze the medical text using AI.");
  }
};