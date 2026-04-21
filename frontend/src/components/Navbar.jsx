// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Logo from "./Logo";
// import { removeJSON, STORAGE_KEYS } from "../utils/storage";

// export default function Navbar({ user }) {
//     const navLinks = [
//         { name: "Home", href: "#home" },
//         { name: "Features", href: "#features" },
//         { name: "How it Works", href: "#how-it-works" },
//         { name: "Contact", href: "#contact" },
//     ];

//     return (
//         <motion.header
//             initial={{ y: -100 }}
//             animate={{ y: 0 }}
//             className="sticky top-0 z-[90] w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm"
//         >
//             <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
//                 <Link to="/home" className="flex items-center">
//                     <Logo />
//                 </Link>

//                 {/* Desktop Links */}
//                 <nav className="hidden items-center gap-8 md:flex">
//                     {navLinks.map((link) => (
//                         <a key={link.name} href={link.href} className="text-sm font-semibold text-slate-600 transition hover:text-blue-600">
//                             {link.name}
//                         </a>
//                     ))}
//                 </nav>

//                 {/* Actions */}
//                 <div className="flex items-center gap-4">
//                     {user ? (
//                         <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-4 shadow-sm">
//                             <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
//                                 {user.name?.[0]?.toUpperCase() || "U"}
//                             </div>
//                             <span className="text-sm font-bold text-slate-700">{user.name || "User"}</span>
//                         </div>
//                     ) : (
//                         <Link to="/portal">
//                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-600">
//                                 Get Started
//                             </motion.button>
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </motion.header>
//     );
// }


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Navbar({ user }) {
    const navLinks = [
        { name: "Home", href: "#home" },
        { name: "Features", href: "#features" },
        { name: "How it Works", href: "#how-it-works" },
        { name: "Contact", href: "#contact" },
    ];

    // ✅ NAYA LOGIC: Logout Function
    const handleLogout = () => {
        // LocalStorage se user aur token hata do
        localStorage.clear();
        // Page ko refresh karke home par bhej do
        window.location.href = "/home";
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-[90] w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm"
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                <Link to="/home" className="flex items-center">
                    <Logo />
                </Link>

                {/* Desktop Links */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="text-sm font-semibold text-slate-600 transition hover:text-blue-600">
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        // ✅ NAYA LOGIC: Wrapper jisme Avatar aur Logout Button dono hain
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-4 shadow-sm">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="text-sm font-bold text-slate-700">{user.name || "User"}</span>
                            </div>

                            {/* ✅ NAYA LOGIC: Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="text-sm font-bold text-red-600 hover:text-red-700 transition hover:underline"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/portal">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-600">
                                Get Started
                            </motion.button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.header>
    );
}