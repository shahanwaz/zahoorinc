import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import LandingFooter from "./LandingFooter";
import { Home, Calendar, Users, MessageCircle, User } from "lucide-react";

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

function MobileBottomNav() {
  const location = useLocation();
  const navItems = [
    { name: "Home", icon: Home, path: "Home" },
    { name: "Events", icon: Calendar, path: "Events" },
    { name: "Nearby", icon: Users, path: "Nearby" },
    { name: "Ask", icon: MessageCircle, path: "Questions" },
    { name: "Profile", icon: User, path: "Profile" },
  ];
  const isActive = (path) => location.pathname === createPageUrl(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-emerald-200/50 rounded-t-3xl shadow-2xl md:hidden">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={createPageUrl(item.path)}
              className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ease-out group ${active ? 'transform scale-110' : 'hover:scale-105'}`}
            >
              <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${active ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30' : 'bg-transparent group-hover:bg-emerald-50'}`}>
                <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'}`} />
                {active && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-md animate-pulse"></div>}
              </div>
              <span className={`text-xs font-medium mt-1.5 transition-all duration-300 ${active ? 'text-emerald-700 font-bold' : 'text-gray-400 group-hover:text-emerald-600'}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
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
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8 pb-24 md:pb-8">
          {showLoginBanner && <LoginRequiredBanner action={loginBannerAction} />}
          {children}
        </main>
        <div className="hidden md:block">
          <LandingFooter />
        </div>
        <MobileBottomNav />
      </div>
    </div>
  );
}}>
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
        <LandingFooter />
      </div>
    </div>
  );
}