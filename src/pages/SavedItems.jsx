import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Bookmark, Play, Trash2, Video, Music, FileText, Image,
  Loader2, Eye
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { MediaVideo } from "@/entities/MediaVideo";
import { User } from "@/entities/User";
import VideoPlayerModal from "@/components/media/VideoPlayerModal";

const TABS = [
  { id: "all", label: "All", icon: Bookmark },
  { id: "video", label: "Videos", icon: Video },
  { id: "audio", label: "Audio", icon: Music },
  { id: "pdf", label: "Books", icon: FileText },
  { id: "image", label: "Images", icon: Image }
];

export default function SavedItems() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [savedMedia, setSavedMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      if (user) {
        const allMedia = await MediaVideo.list('-created_date');
        const saved = allMedia.filter(m => m.saved_by?.includes(user.id));
        setSavedMedia(saved);
      }
    } catch (error) {
      console.error("Error loading saved items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSaved = async (media) => {
    if (!currentUser) return;
    
    try {
      const updatedSavedBy = (media.saved_by || []).filter(id => id !== currentUser.id);
      await MediaVideo.update(media.id, { saved_by: updatedSavedBy });
      setSavedMedia(prev => prev.filter(m => m.id !== media.id));
    } catch (error) {
      console.error("Error removing from saved:", error);
    }
  };

  const handlePlayMedia = (media) => {
    if (media.media_type === "pdf" && media.file_url) {
      window.open(media.file_url, '_blank');
    } else if (media.media_type === "image" && media.file_url) {
      window.open(media.file_url, '_blank');
    } else {
      setSelectedVideo(media);
      setShowVideoPlayer(true);
    }
  };

  const filteredMedia = savedMedia.filter(m => {
    if (activeTab === "all") return true;
    return m.media_type === activeTab;
  });

  const getMediaIcon = (type) => {
    switch (type) {
      case "audio": return <Music className="w-4 h-4" />;
      case "pdf": return <FileText className="w-4 h-4" />;
      case "image": return <Image className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50/30">
      <VideoPlayerModal open={showVideoPlayer} onOpenChange={setShowVideoPlayer} video={selectedVideo} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-emerald-50">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                Saved Items
              </h1>
              <p className="text-xs text-emerald-600">Your bookmarked media collection</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count = tab.id === "all" ? savedMedia.length : savedMedia.filter(m => m.media_type === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                      : 'bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-emerald-100'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredMedia.length > 0 ? (
          <div className="grid gap-4">
            {filteredMedia.map((media) => (
              <SavedMediaCard
                key={media.id}
                media={media}
                onPlay={() => handlePlayMedia(media)}
                onRemove={() => handleRemoveFromSaved(media)}
                getMediaIcon={getMediaIcon}
              />
            ))}
          </div>
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </main>
    </div>
  );
}

function SavedMediaCard({ media, onPlay, onRemove, getMediaIcon }) {
  const isSpotify = media.source === "spotify";
  const isYouTube = media.source === "youtube";

  return (
    <Card className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="flex">
        {/* Thumbnail */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <img
            src={media.thumbnail_url || media.file_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"}
            alt={media.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button
              onClick={onPlay}
              size="icon"
              className={`w-10 h-10 rounded-full shadow-lg ${
                isSpotify ? "bg-green-500 hover:bg-green-600" : "bg-white/90 hover:bg-white text-emerald-700"
              }`}
            >
              <Play className="w-5 h-5 ml-0.5" />
            </Button>
          </div>
          
          {/* Media Type Badge */}
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
            isSpotify ? 'bg-green-500 text-white' : isYouTube ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {getMediaIcon(media.media_type)}
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-emerald-800 line-clamp-2 text-sm">{media.title}</h3>
            <p className="text-xs text-emerald-600 mt-1">{media.lecturer || media.uploader_name || "Unknown"}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                {media.category?.replace('_', ' ')}
              </Badge>
              {media.subcategory && (
                <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-600">
                  {media.subcategory?.replace('_', ' ')}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-emerald-500 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {media.view_count || 0} views
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function EmptyState({ activeTab }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center shadow-lg">
        <Bookmark className="w-12 h-12 text-emerald-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-emerald-800">No Saved Items</h3>
      <p className="text-emerald-600 mb-6 max-w-sm mx-auto">
        {activeTab === "all" 
          ? "Start saving your favorite videos, audio, and more!" 
          : `No saved ${activeTab} items yet.`}
      </p>
      <Button 
        onClick={() => window.location.href = createPageUrl("MediaLibrary")}
        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
      >
        Browse Media Library
      </Button>
    </div>
  );
}