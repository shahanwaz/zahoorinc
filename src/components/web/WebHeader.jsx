import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WebHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-emerald-100" : "bg-gradient-to-b from-black/40 to-transparent backdrop-blur-md"
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
          {[
            { id: "hero", label: "Home" },
            { id: "platform", label: "Platform" },
            { id: "features", label: "Features" },
            { id: "media", label: "Media Library" },
            { id: "events", label: "Events" },
            { id: "community", label: "Community" },
            { id: "donate", label: "Donate" },
            { id: "about", label: "About" }
          ].map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)}
              className={`text-sm font-medium transition-colors duration-300 ${scrolled ? "text-emerald-700 hover:text-emerald-500" : "text-white/90 hover:text-amber-300 drop-shadow"}`}>
              {label}
            </button>
          ))}
        </nav>

        <motion.a
          href="https://zahoorinc.com/app"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
          Download Our App
        </motion.a>
      </div>
    </motion.header>
  );
}