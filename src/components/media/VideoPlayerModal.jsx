import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Eye, Calendar, ExternalLink, Music, Video } from "lucide-react";

export default function VideoPlayerModal({ open, onOpenChange, video }) {
  if (!video) return null;

  const getEmbedUrl = (url, source) => {
    if (!url) return null;

    // YouTube
    if (source === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      }
    }

    // Spotify
    if (source === "spotify" || url.includes("spotify.com")) {
      const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
      if (trackMatch) {
        return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator&theme=0`;
      }
      const episodeMatch = url.match(/spotify\.com\/episode\/([a-zA-Z0-9]+)/);
      if (episodeMatch) {
        return `https://open.spotify.com/embed/episode/${episodeMatch[1]}?utm_source=generator&theme=0`;
      }
    }

    // Vimeo
    if (source === "vimeo" || url.includes("vimeo.com")) {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }

    // Facebook - use direct link
    if (source === "facebook" || url.includes("facebook.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    }

    return null;
  };

  const isSpotify = video.source === "spotify" || video.video_url?.includes("spotify.com");

  const embedUrl = getEmbedUrl(video.video_url, video.source);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white border-emerald-200 p-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-4 border-b border-emerald-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-emerald-800 text-lg line-clamp-2">{video.title}</DialogTitle>
              <div className="flex items-center gap-3 mt-2 text-sm text-emerald-600">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {video.lecturer || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.view_count || 0} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(video.created_date)}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="hover:bg-emerald-50">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Video/Audio Player */}
        <div className={`relative bg-black ${isSpotify ? 'h-[152px]' : 'aspect-video'}`}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white py-8">
              {isSpotify ? (
                <Music className="w-12 h-12 mb-4 text-green-500" />
              ) : (
                <Video className="w-12 h-12 mb-4 text-emerald-400" />
              )}
              <p className="mb-4">Unable to embed this media</p>
              <Button
                onClick={() => window.open(video.video_url, '_blank')}
                className={isSpotify ? "bg-green-500 hover:bg-green-600" : "bg-emerald-600 hover:bg-emerald-700"}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in {isSpotify ? "Spotify" : "New Tab"}
              </Button>
            </div>
          )}
        </div>

        {/* Video Details */}
        <div className="p-4 border-t border-emerald-100">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              {video.category?.replace('_', ' ')}
            </Badge>
            <Badge className={`${isSpotify ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} border-0 flex items-center gap-1`}>
              {isSpotify ? <Music className="w-3 h-3" /> : <Video className="w-3 h-3" />}
              {video.source || "youtube"}
            </Badge>
            {video.duration && (
              <Badge variant="outline" className="border-emerald-300 text-emerald-600">
                {video.duration}
              </Badge>
            )}
          </div>
          {video.description && (
            <p className="text-sm text-emerald-700">{video.description}</p>
          )}
          
          {/* Open in Platform Button */}
          <Button
            onClick={() => window.open(video.video_url, '_blank')}
            variant="outline"
            className="w-full mt-3 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in {isSpotify ? "Spotify" : "YouTube"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}