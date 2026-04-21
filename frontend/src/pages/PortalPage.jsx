import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthPanel from "../components/AuthPanel";
import UploadPanel from "../components/UploadPanel";
import Navbar from "../components/Navbar";
import { api, setAuthToken } from "../services/api";
import { STORAGE_KEYS, getJSON } from "../utils/storage";

function PortalPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getJSON(STORAGE_KEYS.user));
  const [token] = useState(getJSON(STORAGE_KEYS.token));
  const [history, setHistory] = useState([]);

  // ... (keep your existing useEffect logic) ...

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/50">
      <Navbar user={user} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8 md:p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Analysis Center</h1>
          <p className="mt-2 text-slate-500 font-medium">Drop your reports to securely process them.</p>
        </header>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* Main Upload Tile (Takes up massive space) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/40 p-2 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex-1 flex flex-col bg-slate-50 rounded-[1.5rem] border border-slate-100 p-8">
              <UploadPanel token={token} onAnalyzed={() => navigate("/results")} />
            </div>
          </motion.div>

          {/* User / Auth Tile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-4 rounded-[2rem] bg-gradient-to-br from-[#004e92] to-[#002f5c] text-white p-8 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none" />
            {!user ? (
              <div className="relative z-10 h-full flex items-center">
                <AuthPanel onAuthSuccess={setUser} theme="dark" /> {/* Update AuthPanel to accept a dark theme prop if needed */}
              </div>
            ) : (
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-white/60 font-bold tracking-wider text-xs uppercase mb-1">Active Profile</h3>
                  <p className="text-2xl font-bold">{user.name || user.email}</p>
                </div>
                <div className="mt-6 flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  <span className="text-sm font-medium">Session Secured</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* History Tile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Recent Scans</h3>
              <button className="text-xs font-bold text-[#004e92] hover:underline">View All</button>
            </div>

            {user && history.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {history.slice(0, 4).map((item) => (
                  <div key={item._id} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{item.originalFileName}</p>
                      <p className="text-xs text-slate-400">Processed successfully</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <p className="text-sm font-medium text-slate-500">No reports analyzed yet</p>
              </div>
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default PortalPage;