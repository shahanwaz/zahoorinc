import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden bg-white">
      {/* Parallax BG Pattern */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-pat" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#059669" strokeWidth="0.8"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="#059669" strokeWidth="0.8"/>
              <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="none" stroke="#059669" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-pat)"/>
        </svg>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <motion.div variants={item} className="mb-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase">
                About Zahoor
              </span>
            </motion.div>
            <motion.h2 variants={item} className="text-4xl md:text-5xl font-black text-emerald-900 mb-6 leading-tight">
              A Platform Built{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                with Love
              </span>
              {" "}for the Ummah
            </motion.h2>
            <motion.p variants={item} className="text-emerald-700/80 text-lg leading-relaxed mb-6">
              Zahoor is a comprehensive Islamic social platform designed specifically for the global Shia Muslim community. 
              We combine spiritual tools, community services, and educational resources into one beautifully crafted experience.
            </motion.p>
            <motion.p variants={item} className="text-emerald-700/70 leading-relaxed mb-8">
              From Prayer Times and Qibla direction to Ejara services, Istikhara, and live Majalis — 
              Zahoor is your complete spiritual companion.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-3">
              {["🕌 Spiritual Tools", "🤝 Community First", "🌐 Global Reach", "🔒 Safe & Secure"].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Glass Cards */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-200/50">
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="card-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#card-pat)"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-emerald-100 leading-relaxed">
                  To empower every believer with access to authentic Islamic resources, 
                  meaningful community connections, and trusted spiritual services — anytime, anywhere.
                </p>
              </div>
            </div>

            {/* Floating Glass Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-5 shadow-xl max-w-[200px]"
            >
              <div className="text-3xl mb-2">🕌</div>
              <div className="text-sm font-bold text-emerald-800">Prayer Times</div>
              <div className="text-xs text-emerald-600">Auto-location based</div>
            </motion.div>

            {/* Floating Gold Card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-8 -right-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-4 shadow-xl text-white"
            >
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xs font-bold">Trusted by</div>
              <div className="text-lg font-black">50K+</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}