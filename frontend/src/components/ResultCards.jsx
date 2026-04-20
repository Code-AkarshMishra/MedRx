function ResultCards({ result, hinglish }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">Detected Parameters</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {result.parameters.length === 0 && (
            <p className="text-sm text-slate-500">No core parameters detected from OCR.</p>
          )}
          {result.parameters.map((item) => (
            <div key={item.key} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold capitalize">{item.key}</p>
              <p className="text-sm text-slate-700">
                {item.value} {item.unit}
              </p>
              <p className={`mt-1 text-xs font-medium ${item.status === "Normal" ? "text-green-600" : "text-amber-600"}`}>
                {item.status} (Range: {item.range})
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">Simple Explanation</h3>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          {hinglish ? result.explanationHinglish : result.explanation}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">Extracted Text</h3>
        <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          {result.extractedText}
        </pre>
      </div>
    </div>
  );
}

export default ResultCards;
