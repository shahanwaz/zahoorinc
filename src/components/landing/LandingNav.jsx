import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-emerald-100/50 border-b border-emerald-100" : "bg-gradient-to-b from-black/40 to-transparent backdrop-blur-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png"
            alt="Zahoor" className="w-10 h-10 rounded-xl shadow-md"
          />
          <div>
            <span className={`text-xl font-bold block leading-none transition-colors duration-300 ${scrolled ? "text-emerald-800" : "text-white drop-shadow-md"}`}>Zahoor</span>
            <span className={`text-[10px] font-medium tracking-widest uppercase transition-colors duration-300 ${scrolled ? "text-emerald-500" : "text-amber-300"}`}>Hearts Await Zahoor</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["features", "spiritual", "how-it-works", "about"].map((id) => (
            <button key={id} onClick={() => scrollTo(id)}
              className={`text-sm font-medium transition-colors duration-300 capitalize ${scrolled ? "text-emerald-700 hover:text-emerald-500" : "text-white/90 hover:text-amber-300 drop-shadow"}`}>
              {id.replace("-", " ")}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => base44.auth.redirectToLogin()}
            className={`hidden sm:block px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${scrolled ? "text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50" : "text-white border-white/60 hover:border-white hover:bg-white/15"}`}>
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => base44.auth.redirectToLogin()}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200">
            Get Started
          </motion.button>
          <button className={`md:hidden ml-2 flex flex-col gap-1.5 p-1 transition-colors duration-300 ${scrolled ? "text-emerald-700" : "text-white"}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-emerald-100 overflow-hidden">
            <div className="px-6 py-4 space-y-3">
              {["features", "spiritual", "how-it-works", "about"].map((id) => (
                <button key={id} onClick={() => scrollTo(id)} className="block text-sm font-medium text-emerald-700 py-1 capitalize">
                  {id.replace("-", " ")}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}