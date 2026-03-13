import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Sparkles, Users, Calendar } from "lucide-react";

const services = [
  { icon: Briefcase, title: "Ejara Services", desc: "Post and find community services like catering, decoration, transportation, and more" },
  { icon: Sparkles, title: "Istikhara Guidance", desc: "Request spiritual guidance from qualified scholars through secure private consultations" },
  { icon: Users, title: "Scholar Access", desc: "Connect with verified Maulanas for Majalis, Nikah, and other religious services" },
  { icon: Calendar, title: "Community Events", desc: "Discover and participate in local gatherings, Majalis, and community programs" }
];

export default function CommunityServices() {
  return (
    <section id="community" className="py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Community Services
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Supporting the Ummah through meaningful connections
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex gap-6 p-8 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900 mb-3">{service.title}</h3>
                  <p className="text-emerald-700 leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}