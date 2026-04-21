import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

// Reusable animated section wrapper
const Section = ({ children, id, className = "" }) => (
  <section id={id} className={`py-24 px-6 ${className}`}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-7xl"
    >
      {children}
    </motion.div>
  </section>
);

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 selection:bg-blue-100 selection:text-blue-900 relative">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-40 px-6 text-center overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 mx-auto max-w-4xl">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-7xl leading-tight">
            Complex Medical Reports?<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-500">Simplified Instantly.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 md:text-xl leading-relaxed">
            Upload your clinical documents and let our advanced AI translate complicated medical jargon into clear, actionable plain English.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/portal")} className="rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700">
              Launch Workspace
            </motion.button>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#how-it-works" className="rounded-full bg-white px-8 py-4 font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 inline-flex items-center justify-center">
              See How It Works
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <Section id="features" className="bg-white rounded-[3rem] mx-4 md:mx-10 shadow-sm border border-slate-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Platform Capabilities</h2>
          <p className="mt-4 text-slate-500">Designed for clarity, built for security.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-blue-50 p-10 md:col-span-2 border border-blue-100 transition hover:shadow-md">
            <div className="w-12 h-12 bg-blue-600 rounded-xl mb-6 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Deep AI Analysis</h3>
            <p className="mt-2 text-slate-600 leading-relaxed">Our proprietary engine scans every diagnostic term, medication, and value, cross-referencing vast medical databases to provide accurate summaries.</p>
          </div>
          <div className="rounded-[2rem] bg-teal-50 p-10 border border-teal-100 transition hover:shadow-md">
            <div className="w-12 h-12 bg-teal-600 rounded-xl mb-6 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Plain Language</h3>
            <p className="mt-2 text-slate-600">Zero medical jargon. Results are delivered in a conversational, easy-to-digest format.</p>
          </div>
          <div className="rounded-[2rem] bg-slate-900 p-10 text-white md:col-span-3 transition hover:shadow-lg hover:shadow-slate-900/20">
            <h3 className="text-2xl font-bold">End-to-End Encryption</h3>
            <p className="mt-2 text-slate-400 max-w-2xl">Your medical data is highly sensitive. Documents are processed securely, encrypted during transit, and can be analyzed anonymously without account creation.</p>
          </div>
        </div>
      </Section>

      {/* How it Works */}
      <Section id="how-it-works" className="bg-slate-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">How It Works</h2>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { step: "01", title: "Upload Document", desc: "Drag and drop your lab results, prescriptions, or clinical notes (PDF, JPG, PNG)." },
            { step: "02", title: "AI Processing", desc: "Our system extracts text and identifies complex medical conditions and metrics." },
            { step: "03", title: "Review Insights", desc: "Read a clear, simplified summary of your health status instantly." },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition"
            >
              <span className="text-6xl font-black text-slate-100 absolute top-4 right-6">{item.step}</span>
              <div className="relative z-10 mt-8">
                <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                <p className="mt-3 text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="bg-white rounded-[3rem] mx-4 md:mx-10 mb-20 shadow-sm border border-slate-100">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-slate-500 mb-10">Have questions about our enterprise API or need support with your account? Send us a message.</p>

          <form className="space-y-4 text-left">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition" placeholder="Full Name" />
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition" placeholder="Email Address" type="email" />
            </div>
            <textarea className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition h-32 resize-none" placeholder="How can we help you?" />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white shadow-lg transition hover:bg-blue-600">
              Send Message
            </motion.button>
          </form>
        </div>
      </Section>

      <Footer />

      {/* Global Chatbot */}
      <Chatbot />
    </div>
  );
}

export default HomePage;