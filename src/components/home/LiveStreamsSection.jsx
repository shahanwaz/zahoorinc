import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Play, Users, ChevronRight } from "lucide-react";

// Feature flag - set to true to re-enable Live Streaming
const LIVE_STREAMING_ENABLED = false;

export default function LiveStreamsSection() {
  // Return null if feature is disabled
  if (!LIVE_STREAMING_ENABLED) {
    return null;
  }
  const liveStreams = [
    {
      id: "live1",
      title: "Majlis - Shahadat Imam Ali (a.s.)",
      host: "Maulana Abbas Rizvi",
      hostImage: "https://ui-avatars.com/api/?name=Abbas+Rizvi&background=059669&color=fff",
      thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop",
      viewerCount: 234,
      startTime: new Date(Date.now() - 300000),
      isLive: true
    }
  ];

  const formatElapsedTime = (startTime) => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000 / 60);
    return `${elapsed}m ago`;
  };

  const formatViewCount = (count) => {
    const num = Number(count);
    if (!num || isNaN(num)) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (liveStreams.length === 0) return null;

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-bold text-emerald-800">Live Now</h2>
        </div>
        <Link to={createPageUrl("LiveStreaming")}>
          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {liveStreams.map((stream) => (
          <Link key={stream.id} to={createPageUrl("LiveStreaming")} className="flex-shrink-0 w-80">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-emerald-200/50 hover:shadow-md transition-all">
              <div className="relative">
                <img src={stream.thumbnail} alt={stream.title} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <Badge className="bg-red-600 text-white font-bold px-2 py-1 animate-pulse">
                    🔴 LIVE
                  </Badge>
                  <Badge className="bg-black/50 text-white text-xs">
                    {formatElapsedTime(stream.startTime)}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  <Users className="w-3 h-3 inline mr-1" />
                  {formatViewCount(stream.viewerCount)}
                </div>

                <Button 
                  size="icon"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-emerald-800 rounded-full shadow-lg"
                >
                  <Play className="w-6 h-6 ml-0.5" />
                </Button>
              </div>

              <div className="p-3">
                <h4 className="font-bold text-emerald-800 mb-2 line-clamp-2">{stream.title}</h4>
                
                <div className="flex items-center gap-2">
                  <img src={stream.hostImage} alt={stream.host} className="w-6 h-6 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">{stream.host}</p>
                    <p className="text-xs text-emerald-600">is Live Now!</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}