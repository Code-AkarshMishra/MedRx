// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Chatbot() {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <div className="fixed bottom-6 right-6 z-[100]">
//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 20, scale: 0.95 }}
//                         transition={{ duration: 0.2 }}
//                         className="absolute bottom-16 right-0 mb-4 h-96 w-80 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
//                     >
//                         {/* Chat Header */}
//                         <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
//                             <div className="flex items-center gap-2">
//                                 <span className="relative flex h-3 w-3">
//                                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//                                     <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
//                                 </span>
//                                 <span className="font-bold">MedRx Assistant</span>
//                             </div>
//                             <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white">
//                                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                             </button>
//                         </div>

//                         {/* Chat Body */}
//                         <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
//                             <div className="mb-4 w-fit max-w-[85%] rounded-2xl rounded-tl-none bg-blue-100 p-3 text-sm text-blue-900 shadow-sm">
//                                 Hello! How can I assist you with your medical reports today?
//                             </div>
//                         </div>

//                         {/* Chat Input */}
//                         <div className="border-t border-slate-200 bg-white p-3">
//                             <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
//                                 <input type="text" placeholder="Type a message..." className="w-full bg-transparent text-sm outline-none" />
//                                 <button className="rounded-lg bg-blue-600 p-1.5 text-white shadow-sm hover:bg-blue-700 transition">
//                                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Floating Action Button */}
//             <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
//             >
//                 {isOpen ? (
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                 ) : (
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
//                 )}
//             </motion.button>
//         </div>
//     );
// }


import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! How can I assist you with your medical reports today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userText }]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await api.post("/chat", { message: userText });
            setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Connection Error. Ensure the backend is running." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 mb-4 h-[400px] w-[350px] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    >
                        {/* Chat Header */}
                        <div className="flex items-center justify-between bg-slate-900 p-4 text-white shadow-sm z-10">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                                </span>
                                <span className="font-bold">MedRx Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white transition">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 shadow-sm flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-slate-200 bg-white p-3">
                            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message..."
                                    className="w-full bg-transparent text-sm outline-none text-slate-900"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isTyping || !input.trim()}
                                    className="rounded-lg bg-blue-600 p-1.5 text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
            >
                {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                )}
            </motion.button>
        </div>
    );
}