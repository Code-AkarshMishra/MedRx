import { useState } from "react";
import { Link } from "react-router-dom";
import ResultCards from "../components/ResultCards";
import { STORAGE_KEYS, getJSON } from "../utils/storage";

function ResultsPage() {
  const [result] = useState(getJSON(STORAGE_KEYS.result));
  const [hinglish, setHinglish] = useState(false);

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-slate-700">No report data available yet.</p>
          <Link className="mt-3 inline-block text-blue-600" to="/portal">
            Go to Upload
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-900">Report Analysis Result</h1>
          <div className="flex gap-2">
            <button className={`rounded-lg px-3 py-2 text-sm ${hinglish ? "bg-slate-200" : "bg-blue-600 text-white"}`} onClick={() => setHinglish(false)}>English</button>
            <button className={`rounded-lg px-3 py-2 text-sm ${hinglish ? "bg-blue-600 text-white" : "bg-slate-200"}`} onClick={() => setHinglish(true)}>Hinglish</button>
            <Link to="/portal" className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">Analyze New</Link>
          </div>
        </div>
        <ResultCards result={result} hinglish={hinglish} />
      </div>
    </main>
  );
}

export default ResultsPage;
