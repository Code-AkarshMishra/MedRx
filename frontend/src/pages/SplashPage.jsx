import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/home"), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">MedRx Loading...</h1>
        <div className="mx-auto mt-6 h-2 w-44 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
        </div>
      </div>
    </main>
  );
}

export default SplashPage;
