import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Briefcase, Sparkles, Video, Image, Baby, Users, Calendar, BookOpen } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "Community Q&A", desc: "Ask Islamic questions and get answers from scholars" },
  { icon: Briefcase, title: "Ejara Services", desc: "Find and offer community services instantly" },
  { icon: Sparkles, title: "Istikhara Guidance", desc: "Seek spiritual guidance from qualified scholars" },
  { icon: Video, title: "Majalis & Lectures", desc: "Watch live and recorded Islamic lectures" },
  { icon: Image, title: "Media Library", desc: "Access Islamic educational content" },
  { icon: Baby, title: "Kids Section", desc: "Islamic stories and learning for children" },
  { icon: Users, title: "Find Maulana", desc: "Connect with scholars for events and guidance" },
  { icon: Calendar, title: "Events", desc: "Discover and join community gatherings" },
  { icon: BookOpen, title: "Gallery", desc: "Islamic images and visual resources" }
];

export default function PlatformOverview() {
  return (
    <section id="platform" className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Everything you need to stay connected with your faith and community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(16,185,129,0.15)" }}
                className="bg-white p-8 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-3">{feature.title}</h3>
                <p className="text-emerald-700">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}