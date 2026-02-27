import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { base44 } from "@/api/base44Client";

const IslamicPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="islamic-hero" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#059669" strokeWidth="0.5"/>
        <path d="M40 10 L70 40 L40 70 L10 40 Z" fill="none" stroke="#059669" strokeWidth="0.5"/>
        <circle cx="40" cy="40" r="8" fill="none" stroke="#059669" strokeWidth="0.5"/>
        <path d="M40 10 L40 0 M40 70 L40 80 M0 40 L10 40 M70 40 L80 40" stroke="#059669" strokeWidth="0.3"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-hero)"/>
  </svg>
);

const FloatingShape = ({ x, y, size, delay, duration }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-br from-emerald-400/10 to-emerald-600/5 backdrop-blur-sm border border-emerald-200/20"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [0, -20, 0], rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const GoldStar = ({ x, y, delay }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-amber-400/60"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 2.5, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0fdf6] via-[#FAFDF9] to-[#f5f5f0]"
    >
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <IslamicPattern />
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl" />
      </motion.div>

      {/* Floating Shapes */}
      <FloatingShape x={8} y={15} size="80px" delay={0} duration={6} />
      <FloatingShape x={88} y={20} size="60px" delay={1} duration={7} />
      <FloatingShape x={5} y={65} size="100px" delay={2} duration={8} />
      <FloatingShape x={92} y={70} size="70px" delay={0.5} duration={6.5} />
      <FloatingShape x={50} y={8} size="50px" delay={1.5} duration={7.5} />

      {/* Gold Stars */}
      <GoldStar x={15} y={25} delay={0} />
      <GoldStar x={82} y={35} delay={0.8} />
      <GoldStar x={25} y={75} delay={1.6} />
      <GoldStar x={70} y={80} delay={0.4} />
      <GoldStar x={45} y={18} delay={1.2} />
      <GoldStar x={60} y={88} delay={2} />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {/* Bismillah Badge */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg shadow-emerald-100/50">
              <span className="font-arabic text-emerald-700 text-sm" style={{ fontFamily: "serif" }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6"
          >
            <span className="text-emerald-900">Connecting the</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Global Shia
            </span>
            <br />
            <span className="text-emerald-900">Community</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-emerald-700/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Zahoor brings together millions of believers — from daily Duas and Majalis to
            Ejara services, Islamic Calendar, and Istikhara. One platform, one Ummah.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.button
              whileHover={{ scale: 1.07, boxShadow: "0 0 32px rgba(16,185,129,0.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => base44.auth.redirectToLogin()}
              className="px-8 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-200 transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center"
            >
              <span>🌿</span> Create Account
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.07, boxShadow: "0 0 24px rgba(245,158,11,0.35)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => base44.auth.redirectToLogin()}
              className="px-8 py-4 rounded-2xl text-lg font-bold text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg shadow-amber-100 transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center"
            >
              <span>✨</span> Sign In
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 text-sm text-emerald-600">
            {["🌍 Global Community", "🔒 Secure & Private", "📱 Mobile & Web", "🆓 Free to Join"].map((badge) => (
              <span key={badge} className="flex items-center gap-1 font-medium">{badge}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-emerald-300 flex justify-center pt-2">
            <div className="w-1 h-3 bg-emerald-400 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}