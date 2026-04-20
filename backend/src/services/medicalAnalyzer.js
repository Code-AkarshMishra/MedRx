const STANDARD_RANGES = {
  hemoglobin: { min: 12, max: 16, unit: "g/dL" },
  bloodSugar: { min: 70, max: 140, unit: "mg/dL" },
  cholesterol: { min: 120, max: 200, unit: "mg/dL" },
};

const findValue = (text, pattern, groupIndex = 1) => {
  const match = text.match(pattern);
  return match ? Number(match[groupIndex]) : null;
};

const getStatus = (value, range) => {
  if (value < range.min) return "Low";
  if (value > range.max) return "High";
  return "Normal";
};

const explain = (key, status, value, unit) => {
  const map = {
    hemoglobin: {
      Low: `Your hemoglobin is ${value} ${unit}, lower than normal. This may cause fatigue or weakness. Consider consulting a doctor and improving iron intake.`,
      High: `Your hemoglobin is ${value} ${unit}, above normal. This can happen due to dehydration or other causes. Please discuss with a clinician.`,
      Normal: `Your hemoglobin is ${value} ${unit}, which is within a healthy range.`,
    },
    bloodSugar: {
      Low: `Your blood sugar is ${value} ${unit}, below normal. You may feel dizzy or weak. A doctor can guide dietary adjustments.`,
      High: `Your blood sugar is ${value} ${unit}, above normal. This may indicate poor glucose control and should be medically reviewed.`,
      Normal: `Your blood sugar is ${value} ${unit}, which appears normal.`,
    },
    cholesterol: {
      Low: `Your cholesterol is ${value} ${unit}, slightly below standard range. Please review this with your healthcare provider.`,
      High: `Your cholesterol is ${value} ${unit}, higher than recommended. Diet, exercise, and doctor consultation are advised.`,
      Normal: `Your cholesterol is ${value} ${unit}, inside the healthy range.`,
    },
  };
  return map[key][status];
};

const explainHinglish = (key, status, value, unit) => {
  const map = {
    hemoglobin: {
      Low: `Aapka hemoglobin ${value} ${unit} hai, jo normal se kam hai. Isse weakness ya thakan ho sakti hai. Doctor se consult karein aur iron intake badhayein.`,
      High: `Aapka hemoglobin ${value} ${unit} hai, jo normal se zyada hai. Iska cause samajhne ke liye doctor se baat karein.`,
      Normal: `Aapka hemoglobin ${value} ${unit} hai, jo normal range mein hai.`,
    },
    bloodSugar: {
      Low: `Aapka blood sugar ${value} ${unit} hai, jo low hai. Chakkar ya weakness ho sakti hai. Diet ke liye doctor ki salah lein.`,
      High: `Aapka blood sugar ${value} ${unit} hai, jo high hai. Glucose control ke liye medical advice lena zaroori hai.`,
      Normal: `Aapka blood sugar ${value} ${unit} normal range mein hai.`,
    },
    cholesterol: {
      Low: `Aapka cholesterol ${value} ${unit} hai, jo thoda kam hai. Doctor se discuss karna sahi rahega.`,
      High: `Aapka cholesterol ${value} ${unit} hai, jo zyada hai. Lifestyle changes aur doctor consultation ki salah di jati hai.`,
      Normal: `Aapka cholesterol ${value} ${unit} healthy range mein hai.`,
    },
  };
  return map[key][status];
};

const analyzeMedicalText = (rawText) => {
  const text = rawText.replace(/\s+/g, " ").trim().toLowerCase();

  const values = {
    hemoglobin: findValue(text, /hemoglobin[^0-9]{0,15}(\d+(\.\d+)?)/i),
    bloodSugar: findValue(text, /(blood\s*sugar|glucose)[^0-9]{0,15}(\d+(\.\d+)?)/i, 2),
    cholesterol: findValue(text, /cholesterol[^0-9]{0,15}(\d+(\.\d+)?)/i),
  };

  const parameters = Object.entries(values)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => {
      const range = STANDARD_RANGES[key];
      const status = getStatus(value, range);
      return {
        key,
        value,
        unit: range.unit,
        status,
        range: `${range.min}-${range.max} ${range.unit}`,
        explanation: explain(key, status, value, range.unit),
        explanationHinglish: explainHinglish(key, status, value, range.unit),
      };
    });

  const finalExplanation =
    parameters.length > 0
      ? parameters.map((p) => p.explanation).join(" ")
      : "We could not confidently detect core markers from this report. Please upload a clearer scan.";

  const finalExplanationHinglish =
    parameters.length > 0
      ? parameters.map((p) => p.explanationHinglish).join(" ")
      : "Report se clear medical values detect nahi ho payi. Kripya better quality scan upload karein.";

  return {
    cleanedText: rawText.replace(/\s+/g, " ").trim(),
    parameters,
    finalExplanation,
    finalExplanationHinglish,
  };
};

module.exports = { analyzeMedicalText };
