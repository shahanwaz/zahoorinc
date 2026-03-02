import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { base44 } from "@/api/base44Client";

const FloatingShape = ({ x, y, size, delay, duration }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-br from-emerald-400/10 to-emerald-600/5 border border-emerald-200/20"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
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
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
  const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0fdf6] via-[#FAFDF9] to-[#f5f5f0]">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {/* Parallax background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/3/38/%D8%B5%D8%AD%D9%86_%D8%A7%DB%8C%D9%88%D8%A7%D9%86_%D8%B7%D9%84%D8%A7_%D9%88_%D8%B3%D9%82%D8%A7%D8%AE%D8%A7%D9%86%D9%87.jpg')`,
            willChange: "transform",
          }}
        />
        {/* Emerald-gold color overlay for theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/75 via-emerald-800/60 to-amber-900/50" />
        {/* Soft light bleed from center */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFDF9] via-transparent to-transparent" style={{ opacity: 0.55 }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl" />
      </motion.div>

      <FloatingShape x={8} y={15} size="80px" delay={0} duration={6} />
      <FloatingShape x={88} y={20} size="60px" delay={1} duration={7} />
      <FloatingShape x={5} y={65} size="100px" delay={2} duration={8} />
      <FloatingShape x={92} y={70} size="70px" delay={0.5} duration={6.5} />
      <GoldStar x={15} y={25} delay={0} /><GoldStar x={82} y={35} delay={0.8} />
      <GoldStar x={25} y={75} delay={1.6} /><GoldStar x={70} y={80} delay={0.4} />
      <GoldStar x={45} y={18} delay={1.2} /><GoldStar x={60} y={88} delay={2} />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-lg">
              <span className="text-amber-200 text-sm drop-shadow" style={{ fontFamily: "serif" }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
            </div>
          </motion.div>

          <motion.h1 variants={item} className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-white drop-shadow-lg">Connecting the</span><br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">Global Shia</span><br />
            <span className="text-white drop-shadow-lg">Community</span>
          </motion.h1>

          <motion.p variants={item} className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Zahoor brings together millions of believers — from daily Duas and Majalis to Ejara services, Islamic Calendar, and Istikhara. One platform, one Ummah.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.button
              whileHover={{ scale: 1.07, boxShadow: "0 0 32px rgba(16,185,129,0.45)" }} whileTap={{ scale: 0.97 }}
              onClick={() => base44.auth.redirectToLogin()}
              className="px-8 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-200 min-w-[200px]">
              🌿 Create Account
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.07, boxShadow: "0 0 24px rgba(245,158,11,0.35)" }} whileTap={{ scale: 0.97 }}
              onClick={() => base44.auth.redirectToLogin()}
              className="px-8 py-4 rounded-2xl text-lg font-bold text-amber-100 bg-white/15 backdrop-blur-sm border-2 border-white/40 shadow-lg min-w-[200px]">
              ✨ Sign In
            </motion.button>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap justify-center gap-6 text-sm text-emerald-100/80 font-medium">
            {["🌍 Global Community", "🔒 Secure & Private", "📱 Mobile & Web", "🆓 Free to Join"].map((b) => (
              <span key={b}>{b}</span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 rounded-full border-2 border-emerald-300 flex justify-center pt-2">
            <div className="w-1 h-3 bg-emerald-400 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}