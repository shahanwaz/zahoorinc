import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Play, ChevronRight, Clock, Eye } from "lucide-react";

export default function MajalisCarousel() {
  const majalisData = [
    {
      id: 1,
      title: "Shahadat Imam Ali (a.s.) Majlis",
      speaker: "Maulana Syed Abbas",
      thumbnail: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop",
      duration: "45:30",
      views: "12k",
      type: "video"
    },
    {
      id: 2,
      title: "Fazail-e-Imam Hussain (a.s.)",
      speaker: "Maulana Ali Mehdi",
      thumbnail: "https://images.unsplash.com/photo-1629206755907-d0e179c07dd6?q=80&w=1298&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      duration: "38:45",
      views: "8.5k",
      type: "audio"
    },
    {
      id: 3,
      title: "Dua-e-Kumail Commentary",
      speaker: "Maulana Ahmed Raza",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      duration: "52:15",
      views: "15k",
      type: "video"
    }
  ];

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-800">Majalis & Lectures</h2>
        </div>
        <Link to={createPageUrl("MediaLibrary") + "?tab=majalis"}>
          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {majalisData.map((majlis) => (
          <div key={majlis.id} className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative">
              <img src={majlis.thumbnail} alt={majlis.title} className="w-full h-36 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-12 h-12 text-white bg-emerald-600 rounded-full p-3" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {majlis.duration}
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm text-emerald-800 mb-1 line-clamp-2">{majlis.title}</h4>
              <p className="text-xs text-emerald-600 mb-2">by {majlis.speaker}</p>
              <div className="flex items-center gap-3 text-xs text-emerald-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {majlis.views}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {majlis.type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}