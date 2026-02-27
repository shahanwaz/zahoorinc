import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const tools = [
  { icon: "🕋", title: "Prayer Times", desc: "Accurate daily Salah times based on your real-time location with Azan alerts.", gradient: "from-emerald-500 to-emerald-700" },
  { icon: "🧭", title: "Qibla Compass", desc: "Instantly find the direction of the Kaaba from anywhere in the world.", gradient: "from-teal-500 to-teal-700" },
  { icon: "📖", title: "Duas & Ziyarat", desc: "Hundreds of authentic Duas in Arabic with transliteration and translation.", gradient: "from-amber-500 to-amber-700" },
  { icon: "📅", title: "Islamic Calendar", desc: "Full Hijri calendar with all major Islamic dates, events, and observances.", gradient: "from-purple-500 to-purple-700" },
];

const Particle = ({ x, y, delay, size }) => (
  <motion.div
    className="absolute rounded-full bg-emerald-300/30"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 3 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function SpiritualToolsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section id="spiritual" ref={ref} className="py-24 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="spirit-pat" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <polygon points="60,10 110,35 110,85 60,110 10,85 10,35" fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="60" cy="60" r="20" fill="none" stroke="white" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spirit-pat)"/>
        </svg>
      </motion.div>

      {[{x:5,y:20,delay:0,size:"8px"},{x:90,y:15,delay:1,size:"12px"},{x:15,y:70,delay:0.5,size:"6px"},
        {x:85,y:65,delay:1.5,size:"10px"},{x:50,y:90,delay:0.8,size:"8px"},{x:30,y:10,delay:1.2,size:"5px"}
      ].map((p,i)=><Particle key={i} {...p}/>)}

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-emerald-200 text-sm font-semibold tracking-wide uppercase border border-white/20 mb-4">Spiritual Tools</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Your Daily{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Spiritual Companion</span>
          </h2>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">Built-in Islamic tools that help you stay connected to your faith every single day.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, i) => (
            <motion.div key={tool.title}
              initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 overflow-hidden cursor-default transition-all duration-300 hover:bg-white/10 hover:border-white/20`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`} />
              <motion.div className="text-5xl mb-5 relative z-10" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}>
                {tool.icon}
              </motion.div>
              <h3 className="text-white font-bold text-lg mb-3 relative z-10">{tool.title}</h3>
              <p className="text-emerald-300/80 text-sm leading-relaxed relative z-10">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}