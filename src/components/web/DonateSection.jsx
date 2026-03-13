import React from "react";
import { motion } from "framer-motion";
import { Heart, Smartphone } from "lucide-react";

export default function DonateSection() {
  return (
    <section id="donate" className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Support the Community
          </h2>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
            Help us serve the Ummah better. Every contribution makes a difference in someone's spiritual journey. Support mosques, scholars, and community programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://zahoorinc.com/app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-2xl inline-flex items-center gap-3"
            >
              <Heart className="w-5 h-5" />
              Donate Now
            </a>
            <a
              href="https://zahoorinc.com/app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-3"
            >
              <Smartphone className="w-5 h-5" />
              Download the App
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}