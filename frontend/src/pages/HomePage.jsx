import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="rounded-3xl bg-white/90 p-10 text-center shadow-xl">
        <h1 className="text-4xl font-bold text-slate-900">Welcome to MedRx</h1>
        <p className="mt-3 text-slate-600">Upload and understand your medical reports in simple language.</p>
        <button onClick={() => navigate("/portal")} className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700">
          Start Now
        </button>
      </div>
    </main>
  );
}

export default HomePage;
