import { motion } from "framer-motion";
import logoImg from "../assets/logo.png"; // Make sure this path is correct

export default function Logo({ className = "" }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center ${className}`}
        >
            {/* Adjusted height to fit well in navbars */}
            <img
                src={logoImg}
                alt="MedRx Logo"
                className="h-12 w-auto object-contain drop-shadow-sm transition-all"
            />
        </motion.div>
    );
}   