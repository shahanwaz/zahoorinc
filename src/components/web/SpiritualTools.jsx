import React from "react";
import { motion } from "framer-motion";
import { Clock, Book, Heart, Compass } from "lucide-react";

const tools = [
  { icon: Clock, title: "Prayer Times", desc: "Accurate prayer times based on your location" },
  { icon: Book, title: "Daily Dua", desc: "Learn and recite authentic Islamic supplications" },
  { icon: Heart, title: "Hadith of the Day", desc: "Daily wisdom from Prophet Muhammad (PBUH)" },
  { icon: Compass, title: "Qibla Compass", desc: "Find the direction to Kaaba anywhere" }
];

export default function SpiritualTools() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Spiritual Tools
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Daily essentials to strengthen your connection with Allah
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg"
              >
                <Icon className="w-10 h-10 mb-4" />
                <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                <p className="text-emerald-100 text-sm">{tool.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}