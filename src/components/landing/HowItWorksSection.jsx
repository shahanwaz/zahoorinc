import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { step: "01", icon: "📝", title: "Create Account", desc: "Sign up for free in under a minute. No credit card required. Join thousands of believers worldwide." },
  { step: "02", icon: "🎭", title: "Select Your Role", desc: "Choose your role — General User, Maulana, Zakir, Zakera, or Tutor — for a personalized experience." },
  { step: "03", icon: "🌟", title: "Explore Features", desc: "Discover Prayer Times, Duas, Ejara, Majalis, Media Library, Q&A, and dozens of spiritual tools." },
  { step: "04", icon: "🤝", title: "Connect & Grow", desc: "Join the global Shia community. Share knowledge, attend events, and support each other in faith." },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/60 to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="works-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 5 L75 25 L75 55 L40 75 L5 55 L5 25 Z" fill="none" stroke="#059669" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#works-pat)"/>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase mb-4">Getting Started</span>
          <h2 className="text-4xl md:text-5xl font-black text-emerald-900 mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">Zahoor Works</span>
          </h2>
          <p className="text-emerald-700/70 text-lg">Simple steps to join the global community.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-200 hidden md:block" />
          <div className="space-y-16">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div key={step.step}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.65, ease: "easeOut" }}
                  className={`flex items-center gap-8 md:gap-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${isEven ? "md:text-right md:pr-16" : "md:pl-16"}`}>
                    <span className="text-5xl font-black text-emerald-100 leading-none block">{step.step}</span>
                    <div className="text-4xl mb-3">{step.icon}</div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-3">{step.title}</h3>
                    <p className="text-emerald-700/70 leading-relaxed max-w-sm ml-auto">{step.desc}</p>
                  </div>
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-200 items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                    <span className="text-white font-bold text-sm">{step.step}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}