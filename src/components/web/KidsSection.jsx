import React from "react";
import { motion } from "framer-motion";
import { Baby, Book, Gamepad2, Music } from "lucide-react";

const features = [
  { icon: Book, title: "Islamic Stories", desc: "Engaging stories of Prophets and Imams" },
  { icon: Music, title: "Nauhay & Munqabat", desc: "Kid-friendly Islamic audio content" },
  { icon: Gamepad2, title: "Interactive Learning", desc: "Educational games and quizzes" },
  { icon: Baby, title: "Age-Appropriate", desc: "Content curated for young learners" }
];

export default function KidsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Kids & Education
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Nurturing young hearts with Islamic knowledge
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">{feature.title}</h3>
                <p className="text-emerald-700 text-sm">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}