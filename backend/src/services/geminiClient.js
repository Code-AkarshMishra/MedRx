const { GoogleGenerativeAI } = require("@google/generative-ai");

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!key) {
    throw new Error(
      "Missing GEMINI_API_KEY (or AI_API_KEY). Add it to backend/.env (or your environment) and restart the server."
    );
  }
  return key;
}

function getGeminiModelName() {
  // `gemini-1.5-*` models were retired; use a living alias by default.
  // Prefer a stable, explicit model to avoid alias hot-swaps & outages.
  // Use a lighter-weight model by default to reduce 503/high-demand errors.
  return process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
}

function createGeminiModel() {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  return genAI.getGenerativeModel({ model: getGeminiModelName() });
}

async function generateContentWithRetry(prompt, { retries = 2 } = {}) {
  const model = createGeminiModel();
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      lastErr = err;
      const status = err?.status;
      const retryable = status === 429 || status === 503;
      if (!retryable || attempt === retries) break;
      // Simple backoff: 500ms, 1000ms, 1500ms...
      const waitMs = 500 * (attempt + 1);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  throw lastErr;
}

module.exports = { createGeminiModel, generateContentWithRetry, getGeminiModelName };

