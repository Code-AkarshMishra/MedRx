import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ResultCards from "../components/ResultCards";
import Logo from "../components/Logo";
import { STORAGE_KEYS, getJSON } from "../utils/storage";

function ResultsPage() {
  const [result] = useState(getJSON(STORAGE_KEYS.result));
  const [hinglish, setHinglish] = useState(false);
  const navigate = useNavigate();

  if (!result) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/50">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-800">No Report Found</h2>
          <p className="mb-8 text-sm text-slate-500">We couldn't find any recent analysis data in your current session. Please upload a report first.</p>
          <button onClick={() => navigate("/portal")} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700">
            Return to Portal
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="cursor-pointer" onClick={() => navigate("/home")}><Logo /></div>
        <Link to="/portal" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600">
          Analyze New Report
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Analysis Complete</h1>
            <p className="mt-1 text-slate-500">Your medical report has been simplified into plain language.</p>
          </div>

          {/* Animated Language Toggle */}
          <div className="flex w-fit rounded-xl bg-slate-200/60 p-1 shadow-inner">
            <button className={`relative rounded-lg px-6 py-2 text-sm font-bold transition-colors ${!hinglish ? "text-slate-900" : "text-slate-500"}`} onClick={() => setHinglish(false)}>
              {!hinglish && <motion.div layoutId="lang-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: "spring", stiffness: 300, damping: 20 }} />}
              <span className="relative z-10">English</span>
            </button>
            <button className={`relative rounded-lg px-6 py-2 text-sm font-bold transition-colors ${hinglish ? "text-slate-900" : "text-slate-500"}`} onClick={() => setHinglish(true)}>
              {hinglish && <motion.div layoutId="lang-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: "spring", stiffness: 300, damping: 20 }} />}
              <span className="relative z-10">Hinglish</span>
            </button>
          </div>
        </motion.div>

        {/* Results Container */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-8">
            {/* Your existing ResultCards component handles the internal mapping */}
            <ResultCards result={result} hinglish={hinglish} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ResultsPage;