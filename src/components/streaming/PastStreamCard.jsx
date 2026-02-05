import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PastStreamCard({ stream }) {
  const navigate = useNavigate();

  const formatViewCount = (count) => {
    const num = Number(count);
    if (!num || isNaN(num)) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <Card className="overflow-hidden bg-white rounded-2xl shadow-sm border border-emerald-200/50 hover:shadow-md transition-all">
      <div className="flex">
        <div className="relative w-40 h-28 flex-shrink-0">
          <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Ended Badge */}
          <Badge className="absolute top-2 left-2 bg-gray-600 text-white text-xs">
            ⬜ Ended
          </Badge>

          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {stream.duration}
          </div>

          {/* Play Button */}
          <Button 
            onClick={() => navigate(`/streaming/replay/${stream.id}`)}
            size="icon"
            variant="ghost"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-emerald-800 rounded-full"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </Button>
        </div>

        <CardContent className="flex-1 p-4">
          <h4 className="font-semibold text-emerald-800 mb-2 line-clamp-2">{stream.title}</h4>
          
          <div className="flex items-center gap-2 mb-3">
            <img src={stream.hostImage} alt={stream.host} className="w-6 h-6 rounded-full" />
            <p className="text-sm text-emerald-700 font-medium">{stream.host}</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-emerald-600 mb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViewCount(stream.views)} views
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(stream.endedTime)}
            </div>
          </div>

          <Button 
            onClick={() => navigate(`/streaming/replay/${stream.id}`)}
            variant="outline"
            size="sm"
            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Replay
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}