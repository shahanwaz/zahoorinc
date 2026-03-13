import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const videos = [
  { title: "Majlis on Imam Hussain (AS)", thumbnail: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400&q=80" },
  { title: "Islamic History Lecture", thumbnail: "https://images.unsplash.com/photo-1584286595398-a59f21d4f805?w=400&q=80" },
  { title: "Quran Tafseer Session", thumbnail: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&q=80" },
  { title: "Youth Islamic Program", thumbnail: "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=400&q=80" }
];

export default function MediaSection() {
  return (
    <section id="media" className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Majalis & Lectures
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Access a rich library of Islamic educational content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src={video.thumbnail} alt={video.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <h3 className="text-white font-bold text-sm">{video.title}</h3>
                  <p className="text-emerald-200 text-xs mt-1">Watch inside the Zahoor App</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://zahoorinc.com/app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
          >
            Explore Full Library in App
          </a>
        </div>
      </div>
    </section>
  );
}