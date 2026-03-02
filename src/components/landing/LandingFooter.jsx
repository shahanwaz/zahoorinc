import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function LandingFooter() {
  return (
    <footer className="bg-emerald-900 text-white">
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png" alt="Zahoor" className="w-12 h-12 rounded-xl" />
              <div>
                <span className="text-xl font-black text-white block">Zahoor</span>
                <span className="text-emerald-300 text-xs tracking-widest uppercase">Hearts Await Zahoor</span>
              </div>
            </div>
            <p className="text-emerald-300/80 text-sm leading-relaxed max-w-sm mb-6">
              Connecting the global Shia Muslim community through spiritual tools, community services, and educational resources — anytime, anywhere.
            </p>
            <div className="flex items-center gap-3">
              {["🌐","📱","📩","📢"].map((icon,i) => (
                <motion.button key={i} whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg transition-colors">
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3">
              {["Media Library","Events","Ejara Services","Istikhara","Find Maulana"].map((label) => (
                <li key={label}>
                  <button onClick={() => base44.auth.redirectToLogin()} className="text-emerald-300/80 hover:text-white text-sm transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-5">Legal & Help</h4>
            <ul className="space-y-3">
              {["About Us","Terms & Conditions","Privacy Policy","Help & Report","Donate & Support"].map((label) => (
                <li key={label}>
                  <button onClick={() => base44.auth.redirectToLogin()} className="text-emerald-300/80 hover:text-white text-sm transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-700/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-emerald-400/70 text-sm text-center md:text-left">© {new Date().getFullYear()} Zahoor. All rights reserved. Built with ❤️ for the Ummah.</p>
          <div className="flex items-center gap-2 text-emerald-300/50 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Platform is live & growing
          </div>
        </div>
      </div>
    </footer>
  );
}