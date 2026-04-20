import { useState } from "react";
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
    <div className="rounded-2xl bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-2xl font-semibold text-slate-800">Account Access</h2>
      <p className="mt-1 text-sm text-slate-500">Login or create an account to save report history.</p>

      <div className="mt-4 flex gap-2">
        <button className={`rounded-lg px-3 py-2 text-sm ${mode === "login" ? "bg-blue-600 text-white" : "bg-slate-100"}`} onClick={() => setMode("login")}>Login</button>
        <button className={`rounded-lg px-3 py-2 text-sm ${mode === "signup" ? "bg-blue-600 text-white" : "bg-slate-100"}`} onClick={() => setMode("signup")}>Signup</button>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        {mode === "signup" && (
          <input className="w-full rounded-lg border p-2.5" placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        )}
        <input type="email" className="w-full rounded-lg border p-2.5" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input type="password" className="w-full rounded-lg border p-2.5" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required minLength={6} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-slate-900 py-2.5 text-white disabled:opacity-60">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default AuthPanel;
