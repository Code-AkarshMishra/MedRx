function ResultCards({ result, hinglish }) {
  const analysis = result.analysis || result;
  const params = analysis.parameterAnalysis || [];
  const symptoms = analysis.symptoms || {};
  const conditions = analysis.possibleConditions || [];
  const precautions = analysis.precautions || {};
  const whenToSeeDoctor = analysis.whenToSeeDoctor || {};

  const statusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "normal") return "text-green-700 bg-green-50 border-green-200";
    if (s === "low") return "text-blue-700 bg-blue-50 border-blue-200";
    if (s === "high") return "text-red-700 bg-red-50 border-red-200";
    return "text-amber-700 bg-amber-50 border-amber-200";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">1. Parameter Analysis</h3>
        {params.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No parameters detected from the report text.</p>
        ) : (
          <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-bold">Parameter</th>
                  <th className="px-4 py-3 font-bold">Value</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">What it measures</th>
                  <th className="px-4 py-3 font-bold">Normal range (used)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {params.map((p, idx) => (
                  <tr key={`${p.name}-${idx}`} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-slate-800">
                      {p.value} {p.unit}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{p.whatItMeasures}</td>
                    <td className="px-4 py-3 text-slate-700">{p.usedRange || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">Overview</h3>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          {analysis.simpleExplanation || "No summary available."}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">2. Symptoms Identification</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(symptoms).map(([cat, items]) => (
            <div key={cat} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-bold text-slate-800 capitalize">{cat}</p>
              {Array.isArray(items) && items.length > 0 ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {items.map((s, i) => <li key={`${cat}-${i}`}>{s}</li>)}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">None detected</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">3–4. Possible Conditions (Disease Prediction) + Reasoning</h3>
        {conditions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No conditions suggested from the available data.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {conditions.map((c, idx) => (
              <div key={`${c.condition}-${idx}`} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-slate-900">{idx + 1}. {c.condition}</p>
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                    Confidence: {c.confidence}%
                  </span>
                </div>
                {Array.isArray(c.reasoning) && c.reasoning.length > 0 && (
                  <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
                    {c.reasoning.map((r, i) => <li key={`${idx}-r-${i}`}>{r}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">5. Precautions / Diet / Home Remedies</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-800">Home remedies</p>
            {Array.isArray(precautions.homeRemedies) && precautions.homeRemedies.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {precautions.homeRemedies.map((x, i) => <li key={`hr-${i}`}>{x}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Not provided</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-800">Diet</p>
            <p className="mt-2 text-xs font-bold text-green-700">What to eat</p>
            {Array.isArray(precautions.diet?.eat) && precautions.diet.eat.length > 0 ? (
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {precautions.diet.eat.map((x, i) => <li key={`eat-${i}`}>{x}</li>)}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Not provided</p>
            )}
            <p className="mt-3 text-xs font-bold text-red-700">What to avoid</p>
            {Array.isArray(precautions.diet?.avoid) && precautions.diet.avoid.length > 0 ? (
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {precautions.diet.avoid.map((x, i) => <li key={`avoid-${i}`}>{x}</li>)}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Not provided</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-800">Lifestyle precautions</p>
            {Array.isArray(precautions.lifestyle) && precautions.lifestyle.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {precautions.lifestyle.map((x, i) => <li key={`ls-${i}`}>{x}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Not provided</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="text-lg font-semibold text-slate-800">6. When to See a Doctor</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-800">Warning signs</p>
            {Array.isArray(whenToSeeDoctor.warningSigns) && whenToSeeDoctor.warningSigns.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {whenToSeeDoctor.warningSigns.map((x, i) => <li key={`ws-${i}`}>{x}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Not provided</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-800">Urgent if</p>
            {Array.isArray(whenToSeeDoctor.urgentIf) && whenToSeeDoctor.urgentIf.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {whenToSeeDoctor.urgentIf.map((x, i) => <li key={`ui-${i}`}>{x}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Not provided</p>
            )}
          </div>
        </div>
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
