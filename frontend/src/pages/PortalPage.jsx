import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPanel from "../components/AuthPanel";
import UploadPanel from "../components/UploadPanel";
import { api, setAuthToken } from "../services/api";
import { STORAGE_KEYS, getJSON } from "../utils/storage";

function PortalPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getJSON(STORAGE_KEYS.user));
  const [token] = useState(getJSON(STORAGE_KEYS.token));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      api
        .get("/history", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setHistory(res.data))
        .catch(() => setHistory([]));
    }
  }, [token]);

  return (
    <main className="min-h-screen px-4 py-8 md:px-10">
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">MedRx Portal</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <AuthPanel onAuthSuccess={setUser} />
          {user && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              Logged in as {user.name || user.email}
            </div>
          )}
          {history.length > 0 && (
            <div className="mt-4 rounded-2xl bg-white p-4 shadow">
              <h3 className="text-sm font-semibold text-slate-700">Saved Report History</h3>
              <ul className="mt-2 space-y-2 text-xs text-slate-600">
                {history.slice(0, 5).map((item) => (
                  <li key={item._id} className="rounded bg-slate-50 p-2">
                    {item.originalFileName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section>
          <UploadPanel token={token} onAnalyzed={() => navigate("/results")} />
          <p className="mt-3 text-xs text-slate-600">You can upload directly without login too.</p>
        </section>
      </div>
    </main>
  );
}

export default PortalPage;
