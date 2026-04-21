const { generateContentWithRetry, getGeminiModelName } = require("./geminiClient");

exports.analyzeMedicalText = async (extractedText, patientContext = null) => {
  try {
    const contextText = patientContext
      ? `Patient Context (may be null fields):
${JSON.stringify(patientContext, null, 2)}`
      : "Patient Context: null";

    const prompt = `
You are MedRx AI, an expert clinical assistant.
You will receive messy OCR/PDF text from a lab report. Extract clinically relevant information and return a STRICT JSON object only.
Do NOT output markdown, backticks, or extra text.

${contextText}

Extracted Report Text:
"""
${extractedText}
"""

Return STRICT JSON with this shape:
{
  "simpleExplanation": "2-4 short sentences in simple language summarizing the overall report",
  "parameterAnalysis": [
    {
      "name": "Hemoglobin",
      "value": 14.6,
      "unit": "g/dL",
      "whatItMeasures": "What it represents in the body",
      "normalRange": {
        "child": "text range if applicable",
        "adultMale": "text range",
        "adultFemale": "text range",
        "elderlyMale": "text range",
        "elderlyFemale": "text range"
      },
      "usedRange": "the single range you used based on patientContext (or best guess)",
      "status": "Low|Normal|High|Abnormal",
      "notes": "1-2 short lines explaining the finding"
    }
  ],
  "symptoms": {
    "physical": ["..."],
    "neurological": ["..."],
    "digestive": ["..."],
    "respiratory": ["..."],
    "urinary": ["..."],
    "other": ["..."]
  },
  "possibleConditions": [
    {
      "condition": "Condition name",
      "confidence": 72,
      "reasoning": ["bullet 1 linking parameters/symptoms", "bullet 2"]
    }
  ],
  "precautions": {
    "homeRemedies": ["..."],
    "diet": { "eat": ["..."], "avoid": ["..."] },
    "lifestyle": ["..."]
  },
  "whenToSeeDoctor": {
    "warningSigns": ["..."],
    "urgentIf": ["..."]
  }
}

Rules:
- Confidence must be an integer 0-100.
- If symptoms are not present in the report text, infer NONE and return empty arrays.
- Be conservative: do not diagnose; present as "possible conditions".
- Ensure valid JSON (double quotes, no trailing commas).
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