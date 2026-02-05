import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function LiveStreamPlayer({ src, isLive = true }) {
  // In a real app, this would use a video library like video.js or Plyr
  // For live streams, you'd use HLS.js or DASH for adaptive streaming
  return (
    <div className="relative w-full aspect-video bg-black group">
      {isLive && (
        <Badge className="absolute top-3 left-3 z-20 bg-red-600 text-white font-bold px-3 py-1 animate-pulse">
          🔴 LIVE
        </Badge>
      )}
      
      <video
        src={src}
        className="w-full h-full"
        controls
        autoPlay={isLive}
        playsInline
        muted // Muted to allow autoplay on most browsers
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      
      {/* Simulation notice */}
      {isLive && (
        <div className="absolute top-14 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
          📹 Simulated Stream
        </div>
      )}
    </div>
  );
}