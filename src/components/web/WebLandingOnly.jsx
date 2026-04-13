import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const APP_LINK = "https://zahoorinc.com/app";

const features = [
  { icon: "💬", title: "Community Q&A", desc: "Ask questions, get answers from scholars and the community." },
  { icon: "🤲", title: "Istikhara", desc: "Private spiritual guidance from verified scholars." },
  { icon: "🛠️", title: "Ejara Services", desc: "Post or earn by offering Islamic services." },
  { icon: "🎙️", title: "Majalis & Lectures", desc: "Watch, share, and stream live or recorded majalis." },
  { icon: "📚", title: "Media Library", desc: "Duas, ziyarat, books, kids content and more." },
  { icon: "🧭", title: "Spiritual Tools", desc: "Prayer times, Qibla compass, Hijri calendar, daily dua." },
  { icon: "📅", title: "Events", desc: "Discover nearby majalis and community events." },
  { icon: "👳", title: "Find Maulana", desc: "Connect with Maulanas and Zakirs in your area." },
  { icon: "📸", title: "Status Updates", desc: "Share your spiritual journey and community moments." },
  { icon: "💳", title: "Wallet & Payments", desc: "Secure in-app payments for services and donations." },
];

const userTypes = [
  {
    icon: "👤",
    title: "General Users",
    color: "from-emerald-500 to-teal-500",
    points: ["Learn & ask questions", "Watch majalis & lectures", "Daily spiritual tools", "Join community events"],
  },
  {
    icon: "👳",
    title: "Maulana / Zakir",
    color: "from-amber-500 to-orange-500",
    points: ["Answer community questions", "Give Istikhara guidance", "Share lectures & content", "Build your following"],
  },
  {
    icon: "🤝",
    title: "Service Providers",
    color: "from-purple-500 to-indigo-500",
    points: ["Post Ejara services", "Earn from offerings", "Connect with seekers", "Grow your reach"],
  },
];

const whyPoints = [
  { icon: "🌍", title: "Global Access", desc: "Connect with the Shia community worldwide, anytime." },
  { icon: "✅", title: "Trusted Scholars", desc: "Verified Maulanas and Zakirs you can trust." },
  { icon: "🔒", title: "Safe & Private", desc: "Your data and interactions are secure and private." },
  { icon: "🕌", title: "Built for Shia", desc: "Every feature crafted specifically for the Shia community." },
];

const socialLinks = [
  {
    label: "Instagram", href: "https://instagram.com",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    label: "YouTube", href: "https://youtube.com",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    label: "Telegram", href: "https://telegram.org",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  },
];

function DownloadBtn({ size = "lg" }) {
  const base = "inline-flex items-center gap-3 font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-200 hover:shadow-emerald-300 hover:scale-105 transition-all duration-300";
  const sz = size === "lg" ? "px-10 py-4 text-lg" : "px-7 py-3 text-base";
  return (
    <a href={APP_LINK} target="_blank" rel="noopener noreferrer" className={`${base} ${sz}`}>
      📱 Download Our App
    </a>
  );
}

function StoreButtons() {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <a href={APP_LINK} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-emerald-200 text-emerald-800 text-sm font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-all bg-white shadow-sm">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.42.07 2.42.73 3.25.78 1.24-.19 2.43-.91 3.75-.84 1.58.1 2.77.74 3.55 1.9-3.24 1.94-2.78 6.42.58 7.76-.56 1.32-1.31 2.62-3.13 3.26zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
        App Store
      </a>
      <a href={APP_LINK} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-emerald-200 text-emerald-800 text-sm font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-all bg-white shadow-sm">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3.18 23.76c.3.17.65.19.97.07l12.54-7.13-2.75-2.75-10.76 9.81zm-1.7-20.1A1.98 1.98 0 0 0 1 5v14c0 .6.24 1.15.63 1.55l.07.06 7.84-7.84v-.19L1.48 3.66zm18.28 8.42-2.67-1.52-3.06 3.06 3.06 3.06 2.7-1.54c.77-.44.77-1.63-.03-2.06zM4.15.24 16.7 7.37l-2.75 2.75L3.18.24A1.28 1.28 0 0 1 4.15.24z"/></svg>
        Play Store
      </a>
    </div>
  );
}

function Section({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function WebLandingOnly() {
  return (
    <div className="min-h-screen bg-[#FAFDF9] text-gray-900" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .web-landing h1, .web-landing h2, .web-landing h3,
        .web-landing h4, .web-landing h5, .web-landing h6 { color: inherit; }
        .gold-text { color: #d97706; }
        .section-tag {
          display: inline-block;
          background: linear-gradient(135deg, #d1fae5, #fef3c7);
          color: #065f46;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 14px;
          border-radius: 999px;
          margin-bottom: 12px;
        }
      `}</style>

      <div className="web-landing">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden text-white" style={{ backgroundImage: "url('https://media.base44.com/images/public/68874558a4cb8143d474b0a5/10be7e500_ChatGPTImageApr13202611_57_51AM.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-emerald-950/90 pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex justify-center mb-8">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png"
                alt="Zahoor" className="w-24 h-24 rounded-3xl shadow-2xl ring-4 ring-white/20"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
              className="section-tag mb-6" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
              ظهور — Hearts Await Zahoor
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-6xl font-black leading-tight mb-6 text-white"
            >
              If You Are Shia,<br />
              <span className="gold-text">This App Is For You.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }}
              className="text-emerald-200 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Zahoor is a complete digital platform for the global Shia community —
              faith, knowledge, and community in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center gap-5"
            >
              <DownloadBtn size="lg" />
              <StoreButtons />
            </motion.div>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="bg-white border-y border-emerald-100 py-8">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[["10+", "Features"], ["3", "User Types"], ["🌍", "Global Community"], ["100%", "Shia-Focused"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-3xl font-black text-emerald-700">{val}</div>
                <div className="text-sm text-gray-500 font-medium mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ABOUT ── */}
        <Section className="py-20 px-6 bg-[#FAFDF9]">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-tag">About Zahoor</span>
            <h2 className="text-4xl font-black text-emerald-900 mb-6">
              One App. Everything You Need.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Zahoor is an all-in-one digital platform built exclusively for the Shia Muslim community.
              Whether you want to <strong className="text-emerald-700">learn Islam</strong>, connect with
              verified <strong className="text-emerald-700">scholars and Maulanas</strong>, access
              community services, or simply stay connected with your faith daily —
              Zahoor brings it all together in one beautifully designed app.
            </p>
          </div>
        </Section>

        {/* ── FEATURES ── */}
        <Section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="section-tag">Features</span>
              <h2 className="text-4xl font-black text-emerald-900">Everything in One Place</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-[#FAFDF9] border border-emerald-100 rounded-2xl p-5 text-center hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-emerald-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── USER TYPES ── */}
        <Section className="py-20 px-6 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="section-tag" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>Who It's For</span>
              <h2 className="text-4xl font-black text-white">Zahoor Is For Everyone</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {userTypes.map((u, i) => (
                <motion.div
                  key={u.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-7 hover:bg-white/15 transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${u.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                    {u.icon}
                  </div>
                  <h3 className="text-xl font-black text-white mb-4">{u.title}</h3>
                  <ul className="space-y-2">
                    {u.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-emerald-200 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── WHY ZAHOOR ── */}
        <Section className="py-20 px-6 bg-[#FAFDF9]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="section-tag">Why Zahoor</span>
              <h2 className="text-4xl font-black text-emerald-900">Built With Purpose</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyPoints.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-white border border-emerald-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="text-4xl mb-4">{w.icon}</div>
                  <h3 className="font-bold text-emerald-900 mb-2">{w.title}</h3>
                  <p className="text-gray-500 text-sm">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── FINAL CTA ── */}
        <Section className="py-24 px-6 bg-gradient-to-br from-amber-50 via-emerald-50 to-emerald-100">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-tag">Get Started</span>
            <h2 className="text-5xl font-black text-emerald-900 mb-6 leading-tight">
              Join the Digital Shia<br />
              <span className="gold-text">Community Today</span>
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Download Zahoor and become part of a growing global movement of faith, knowledge and community.
            </p>
            <div className="flex flex-col items-center gap-5">
              <DownloadBtn size="lg" />
              <StoreButtons />
              <p className="text-emerald-600 text-sm font-medium mt-2">Free to download · Available on Android & iOS</p>
            </div>
          </div>
        </Section>

        {/* ── FOOTER ── */}
        <footer className="bg-emerald-950 text-white py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png"
                alt="Zahoor" className="w-8 h-8 rounded-lg"
              />
              <span className="text-sm text-emerald-400">© 2026 Zahoor. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}