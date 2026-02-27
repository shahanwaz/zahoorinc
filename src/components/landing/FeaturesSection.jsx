import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  { icon: "❓", title: "Community Q&A", desc: "Ask scholars and community members your Islamic questions and get verified answers.", color: "from-blue-50 to-blue-100", border: "border-blue-200", accent: "text-blue-600" },
  { icon: "🕊️", title: "Ejara Services", desc: "Book trusted Maulanas for Majalis, Nikahs, and other religious ceremonies.", color: "from-emerald-50 to-emerald-100", border: "border-emerald-200", accent: "text-emerald-600" },
  { icon: "🔮", title: "Istikhara", desc: "Request Istikhara from qualified scholars securely and privately.", color: "from-purple-50 to-purple-100", border: "border-purple-200", accent: "text-purple-600" },
  { icon: "🎤", title: "Majalis & Lectures", desc: "Watch and share Majalis, Bayans, and scholarly lectures from around the world.", color: "from-amber-50 to-amber-100", border: "border-amber-200", accent: "text-amber-600" },
  { icon: "🎥", title: "Media Library", desc: "A rich library of Nauhas, Duas, Quran Tafseer, and spiritual content.", color: "from-red-50 to-red-100", border: "border-red-200", accent: "text-red-600" },
  { icon: "👶", title: "Kids Section", desc: "Safe, engaging Islamic educational content specially curated for children.", color: "from-pink-50 to-pink-100", border: "border-pink-200", accent: "text-pink-600" },
  { icon: "🖼️", title: "Gallery", desc: "Beautiful Islamic imagery, calligraphy, and celebration graphics to share.", color: "from-teal-50 to-teal-100", border: "border-teal-200", accent: "text-teal-600" },
  { icon: "👳", title: "Find Maulana", desc: "Search and connect with Maulanas by location, specialty, and availability.", color: "from-indigo-50 to-indigo-100", border: "border-indigo-200", accent: "text-indigo-600" },
  { icon: "📅", title: "Events", desc: "Discover and host Mahfils, Majalis, and community events near you.", color: "from-orange-50 to-orange-100", border: "border-orange-200", accent: "text-orange-600" },
  { icon: "💰", title: "Wallet", desc: "Secure in-app wallet to pay for Istikhara, Ejara, and donations.", color: "from-green-50 to-green-100", border: "border-green-200", accent: "text-green-600" },
  { icon: "🔖", title: "Saved Items", desc: "Bookmark your favorite Duas, lectures, and content for quick access.", color: "from-slate-50 to-slate-100", border: "border-slate-200", accent: "text-slate-600" },
  { icon: "🌐", title: "Language Support", desc: "Access Zahoor in multiple languages with full RTL support for Arabic & Urdu.", color: "from-cyan-50 to-cyan-100", border: "border-cyan-200", accent: "text-cyan-600" },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <section id="features" ref={ref} className="py-24 bg-gradient-to-b from-white to-[#f0fdf6]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase mb-4">Everything You Need</span>
          <h2 className="text-4xl md:text-5xl font-black text-emerald-900 mb-4">
            Powerful Features,{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-amber-500 bg-clip-text text-transparent">One Platform</span>
          </h2>
          <p className="text-emerald-700/70 text-lg max-w-2xl mx-auto">From spiritual tools to community services — Zahoor is your complete Islamic companion.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feat, i) => (
            <motion.div key={feat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(16,185,129,0.15)" }}
              className={`bg-gradient-to-br ${feat.color} border ${feat.border} rounded-2xl p-6 cursor-default transition-all duration-300 group`}>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feat.icon}</div>
              <h3 className={`text-base font-bold mb-2 ${feat.accent}`}>{feat.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}