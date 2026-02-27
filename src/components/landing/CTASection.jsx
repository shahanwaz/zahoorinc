import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-gradient-to-br from-[#f0fdf6] to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-sm mb-8">
            🌿 Join 50,000+ Believers
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-emerald-900 mb-6 leading-tight">
            Start Your{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 bg-clip-text text-transparent">Spiritual Journey</span>
            <br />Today
          </h2>
          <p className="text-emerald-700/80 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Join Zahoor for free and experience the most comprehensive Islamic community platform ever built. Your faith, your community, your Zahoor.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.button whileHover={{ scale: 1.07, boxShadow: "0 0 40px rgba(16,185,129,0.5)" }} whileTap={{ scale: 0.97 }}
              onClick={() => base44.auth.redirectToLogin()}
              className="px-10 py-5 rounded-2xl text-xl font-black text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-2xl shadow-emerald-200">
              🌿 Create Free Account
            </motion.button>
            <motion.button whileHover={{ scale: 1.07, boxShadow: "0 0 30px rgba(245,158,11,0.4)" }} whileTap={{ scale: 0.97 }}
              onClick={() => base44.auth.redirectToLogin()}
              className="px-10 py-5 rounded-2xl text-xl font-black text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-xl shadow-amber-100">
              ✨ Sign In
            </motion.button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "Zahoor has transformed my daily spiritual routine. The Prayer Times and Duas are incredibly accurate.", name: "Fatima Z.", role: "Member" },
              { quote: "I found a wonderful Maulana for our family Majlis through Ejara. Highly recommended!", name: "Ahmed R.", role: "Community Leader" },
              { quote: "The Kids Section keeps my children engaged with Islamic content safely. JazakAllah!", name: "Maryam K.", role: "Parent" },
            ].map((t, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-lg text-left">
                <p className="text-emerald-700/80 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">{t.name[0]}</div>
                  <div>
                    <div className="text-xs font-bold text-emerald-800">{t.name}</div>
                    <div className="text-xs text-emerald-500">{t.role}</div>
                  </div>
                  <div className="ml-auto text-amber-400 text-xs">★★★★★</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}