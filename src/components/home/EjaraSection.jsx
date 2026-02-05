import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, Calendar, Coins, ChevronRight } from "lucide-react";

export default function EjaraSection() {
  const ejaraData = [
    {
      id: 1,
      type: "Roza (Fasting)",
      description: "Complete missed fasts",
      hadiya: "₹500",
      validity: "7 days",
      slots_total: 30,
      slots_joined: 12,
      icon: "🌙"
    },
    {
      id: 2,
      type: "Namaz (Prayer)",
      description: "Qaza prayers completion",
      hadiya: "₹300",
      validity: "5 days",
      slots_total: 50,
      slots_joined: 28,
      icon: "🤲"
    },
    {
      id: 3,
      type: "Quran Recitation",
      description: "Full Quran recitation",
      hadiya: "₹1000",
      validity: "10 days",
      slots_total: 10,
      slots_joined: 3,
      icon: "📖"
    },
    {
      id: 4,
      type: "Tasbeehat",
      description: "Zikr and remembrance",
      hadiya: "₹200",
      validity: "3 days",
      slots_total: 100,
      slots_joined: 67,
      icon: "📿"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl p-5 border border-emerald-300 shadow-lg relative overflow-hidden">
      {/* Islamic Motif Background */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g fill="#059669">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#059669" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#059669" strokeWidth="1" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="#059669" strokeWidth="1" />
            <path d="M50 20v60M20 50h60" stroke="#059669" strokeWidth="0.5" />
            <circle cx="50" cy="30" r="3" fill="#059669" />
            <circle cx="50" cy="70" r="3" fill="#059669" />
            <circle cx="30" cy="50" r="3" fill="#059669" />
            <circle cx="70" cy="50" r="3" fill="#059669" />
          </g>
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-800">Ejara Services</h2>
              <p className="text-emerald-700 text-xs">Earn Hadiya through spiritual services</p>
            </div>
          </div>
          <Link to={createPageUrl("EjaraServices")}>
            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
          {ejaraData.map((ejara) => (
            <div key={ejara.id} className="flex-shrink-0 w-64 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-emerald-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ejara.icon}</span>
                  <div>
                    <h3 className="font-bold text-emerald-800 text-sm leading-tight">{ejara.type}</h3>
                    <p className="text-xs text-emerald-600">{ejara.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-700">{ejara.hadiya}</p>
                  <p className="text-xs text-emerald-600">per service</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-emerald-700">Available Slots</span>
                  <span className="text-sm font-semibold text-emerald-800">
                    {ejara.slots_total - ejara.slots_joined} left
                  </span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(ejara.slots_joined / ejara.slots_total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-emerald-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{ejara.slots_joined} joined</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{ejara.validity} left</span>
                  </div>
                </div>
              </div>

              <Link to={createPageUrl("EjaraServices")}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm h-9">
                  Join & Earn
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}