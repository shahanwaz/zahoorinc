import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";

export default function EventsSection() {
  return (
    <section id="events" className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Community Events
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Discover community gatherings and Majalis near you through Zahoor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { type: "Majlis", title: "Shahadat of Imam Ali (AS)", date: "15th Ramadan", attendees: 156 },
            { type: "Community", title: "Youth Islamic Workshop", date: "Next Saturday", attendees: 48 },
            { type: "Lecture", title: "Tafseer Session", date: "Every Friday", attendees: 92 }
          ].map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-block bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                {event.type}
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-4">{event.title}</h3>
              <div className="space-y-2 text-emerald-700 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>View in App</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} joined</span>
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
            View All Events in App
          </a>
        </div>
      </div>
    </section>
  );
}