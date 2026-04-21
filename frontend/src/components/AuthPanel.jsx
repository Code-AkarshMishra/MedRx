import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, setAuthToken } from "../services/api";
import { STORAGE_KEYS, saveJSON } from "../utils/storage";

const defaultForm = { name: "", email: "", password: "" };

function AuthPanel({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      const { data } = await api.post(endpoint, payload);
      saveJSON(STORAGE_KEYS.token, data.token);
      saveJSON(STORAGE_KEYS.user, data.user);
      setAuthToken(data.token);
      onAuthSuccess(data.user);
      setForm(defaultForm);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800">Account Access</h2>
      <p className="mt-1 mb-6 text-sm text-slate-500">Log in to save your report history securely.</p>

      {/* Animated Toggle */}
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1 relative">
        {["login", "signup"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setMode(tab); setError(""); }}
            className={`relative w-1/2 rounded-lg py-2 text-sm font-bold transition-colors ${mode === tab ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
          >
            {mode === tab && (
              <motion.div layoutId="auth-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
            )}
            <span className="relative z-10 capitalize">{tab}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {mode === "signup" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="mb-1 block text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600 uppercase tracking-wide">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
            placeholder="medrx@gmail.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
            minLength={6}
          />
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </motion.p>
        )}

        <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3 mt-2 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60 disabled:hover:bg-blue-600">
          {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default AuthPanel;