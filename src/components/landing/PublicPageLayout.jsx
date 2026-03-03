import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import LandingFooter from "./LandingFooter";

function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to={createPageUrl("LandingPage")} className="flex items-center gap-3">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png"
            alt="Zahoor"
            className="w-10 h-10 rounded-xl shadow-md"
          />
          <div>
            <span className="text-lg font-black text-emerald-800 block leading-none">Zahoor</span>
            <span className="text-[10px] text-emerald-500 font-medium tracking-widest uppercase">Hearts Await Zahoor</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => base44.auth.redirectToLogin()}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => base44.auth.redirectToLogin()}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-emerald-900 text-white mt-16">
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400" />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to={createPageUrl("LandingPage")} className="flex items-center gap-3 mb-4">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png" alt="Zahoor" className="w-10 h-10 rounded-xl" />
              <div>
                <span className="text-lg font-black text-white block">Zahoor</span>
                <span className="text-emerald-300 text-xs tracking-widest uppercase">Hearts Await Zahoor</span>
              </div>
            </Link>
            <p className="text-emerald-300/80 text-sm leading-relaxed max-w-sm">
              Connecting the global Shia Muslim community through spiritual tools, community services, and educational resources.
            </p>
          </div>
          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map(({ label, page }) => (
                <li key={page}>
                  <Link to={createPageUrl(page)} className="text-emerald-300/80 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-4">Legal & Help</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map(({ label, page }) => (
                <li key={page}>
                  <Link to={createPageUrl(page)} className="text-emerald-300/80 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-700/50 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-emerald-400/70 text-sm">© {new Date().getFullYear()} Zahoor. All rights reserved. Built with ❤️ for the Ummah.</p>
          <div className="flex items-center gap-2 text-emerald-300/50 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Platform is live & growing
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LoginRequiredBanner({ action = "access full features" }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔐</span>
        <p className="text-amber-800 text-sm font-medium">
          <span className="font-bold">Login required</span> to {action}. You're browsing in guest mode.
        </p>
      </div>
      <button
        onClick={() => base44.auth.redirectToLogin()}
        className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md hover:scale-105 transition-transform whitespace-nowrap"
      >
        Sign In / Register
      </button>
    </div>
  );
}

export default function PublicPageLayout({ children, showLoginBanner = false, loginBannerAction }) {
  return (
    <div className="min-h-screen bg-[#FAFDF9] flex flex-col" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .public-layout h1, .public-layout h2, .public-layout h3,
        .public-layout h4, .public-layout h5, .public-layout h6 { color: inherit; }
      `}</style>
      <div className="public-layout flex flex-col flex-1">
        <PublicHeader />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8">
          {showLoginBanner && <LoginRequiredBanner action={loginBannerAction} />}
          {children}
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}