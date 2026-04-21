import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Slightly longer delay so the animation breathes
    const timer = setTimeout(() => navigate("/home"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50">
      {/* Animated Background Orbs for Depth */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-blue-200 blur-[100px] filter pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-teal-200 blur-[100px] filter pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <Logo className="mb-8 scale-150 transform" />
        <p className="mb-4 text-xs font-bold text-slate-500 tracking-[0.2em] uppercase">Securing Connection</p>

        {/* Progress Bar Loader */}
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 shadow-inner">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.7)]"
          />
        </div>
      </motion.div>
    </main>
  );
}

export default SplashPage;