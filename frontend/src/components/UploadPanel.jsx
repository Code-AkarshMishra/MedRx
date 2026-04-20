import { useRef, useState } from "react";
import { api } from "../services/api";
import { STORAGE_KEYS, saveJSON } from "../utils/storage";

function UploadPanel({ token, onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOn, setDragOn] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  const processFile = async (file) => {
    setError("");
    if (!file) return;
    setFileName(file.name);
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, and PDF supported.");
      return;
    }

    const body = new FormData();
    body.append("report", file);
    setLoading(true);
    try {
      const { data } = await api.post("/analyze", body, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      saveJSON(STORAGE_KEYS.result, data);
      onAnalyzed(data);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-2xl font-semibold text-slate-800">Upload Medical Report</h2>
      <p className="mt-1 text-sm text-slate-500">Drag and drop or choose a JPG, PNG, or PDF.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOn(true); }}
        onDragLeave={() => setDragOn(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOn(false);
          processFile(e.dataTransfer.files?.[0]);
        }}
        className={`mt-5 rounded-xl border-2 border-dashed p-8 text-center ${dragOn ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"}`}
      >
        <p className="text-sm text-slate-600">{fileName || "Drop report file here"}</p>
        <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white" onClick={() => inputRef.current?.click()}>
          Browse File
        </button>
        <input ref={inputRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => processFile(e.target.files?.[0])} />
      </div>

      {loading && <p className="mt-3 text-sm text-blue-600">Analyzing report... please wait.</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default UploadPanel;
