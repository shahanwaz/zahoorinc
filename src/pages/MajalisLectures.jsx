import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Search, Play, Filter, Plus, Eye, Clock, User,
  Video, Loader2, Music, ExternalLink, BookOpen
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { MediaVideo } from "@/entities/MediaVideo";
import { User as UserEntity } from "@/entities/User";
import UploadVideoModal from "@/components/media/UploadVideoModal";

const CATEGORIES = [
  { id: "all", label: "All", emoji: "📺" },
  { id: "majlis", label: "Majlis", emoji: "🎤" },
  { id: "lecture", label: "Lectures", emoji: "🎓" },
  { id: "aza", label: "Aza", emoji: "🖤" },
  { id: "quran_tafseer", label: "Quran Tafseer", emoji: "📖" },
  { id: "history", label: "History", emoji: "📜" },
  { id: "youth_programs", label: "Youth Programs", emoji: "👥" }
];

// Curated default media items
const CURATED_MEDIA = [
  {
    id: "curated-1",
    title: "Roohani Bayan – Reflection on Dua e Kumayl",
    lecturer: "Maulana Syed Rizvi",
    source: "youtube",
    video_url: "https://youtu.be/zsG66Mm7bDg?si=TJw_JLZ-CqoBovE4",
    thumbnail_url: "https://img.youtube.com/vi/zsG66Mm7bDg/hqdefault.jpg",
    category: "lecture",
    view_count: 1250,
    is_curated: true
  },
  {
    id: "curated-2",
    title: "Majlis e Aza – The Legacy of Karbala",
    lecturer: "Zakir Ali Mehdi",
    source: "youtube",
    video_url: "https://youtu.be/_LGXjgl3vfw?si=Gf7k7Pw5F1GpQLd0",
    thumbnail_url: "https://img.youtube.com/vi/_LGXjgl3vfw/hqdefault.jpg",
    category: "majlis",
    view_count: 2340,
    is_curated: true
  },
  {
    id: "curated-3",
    title: "The Call of Faith – Majlis on Patience (Sabr)",
    lecturer: "Zakira Fatema Zahra",
    source: "youtube",
    video_url: "https://youtu.be/FvVhaxXl7vA?si=cB_8FClt-WZbT_c0",
    thumbnail_url: "https://img.youtube.com/vi/FvVhaxXl7vA/hqdefault.jpg",
    category: "majlis",
    view_count: 890,
    is_curated: true
  },
  {
    id: "curated-4",
    title: "Spiritual Reflections – Heartfelt Recitation",
    lecturer: "Syed Haider",
    source: "spotify",
    video_url: "https://open.spotify.com/track/72gpnbuY0LkLCQIm88zRwE?si=efb722c965a64ffe",
    thumbnail_url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=400&fit=crop",
    category: "aza",
    view_count: 560,
    is_curated: true
  }
];

export default function MajalisLectures() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [user, videoList] = await Promise.all([
        UserEntity.me().catch(() => null),
        MediaVideo.list('-created_date')
      ]);
      setCurrentUser(user);
      // Combine curated media with user-uploaded videos
      const allVideos = [...CURATED_MEDIA, ...(videoList || [])];
      setVideos(allVideos);
    } catch (error) {
      console.error("Error loading data:", error);
      // Still show curated content on error
      setVideos(CURATED_MEDIA);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.lecturer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatViewCount = (count) => {
    const num = Number(count) || 0;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handlePlayVideo = (video) => {
    if (video.is_curated) {
      // For curated videos, open in MediaLibrary with special handling
      navigate(createPageUrl(`MediaLibrary?curated=${video.id}`));
    } else {
      navigate(createPageUrl(`MediaLibrary?video=${video.id}`));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-emerald-50">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                🎥 Majalis & Lectures
              </h1>
              <p className="text-xs text-emerald-600">Listen, Learn, and Reflect — A collection of soulful Majalis and enlightening lectures.</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-500" />
            <Input
              placeholder="Search by Speaker or Topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 border-emerald-200 bg-emerald-50/50 rounded-full focus:border-emerald-500"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-emerald-100">
              <Filter className="w-4 h-4 text-emerald-600" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                    : 'bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-32">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid gap-4">
            {filteredVideos.map((video) => (
              <MediaCard
                key={video.id}
                video={video}
                onPlay={() => handlePlayVideo(video)}
                formatViewCount={formatViewCount}
              />
            ))}
          </div>
        ) : (
          <EmptyState searchQuery={searchQuery} onUpload={() => setShowUploadModal(true)} />
        )}

        {/* View All in Media Library */}
        {filteredVideos.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => navigate(createPageUrl("MediaLibrary"))}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View All in Media Library
            </Button>
          </div>
        )}
      </main>

      {/* Floating Upload Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button
          onClick={() => setShowUploadModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </Button>
        <span className="absolute -top-8 right-0 text-xs bg-emerald-800 text-white px-2 py-1 rounded-full whitespace-nowrap shadow-md">
          Upload Majlis
        </span>
      </div>

      {/* Upload Modal */}
      <UploadVideoModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        currentUser={currentUser}
        onVideoUploaded={loadData}
      />
    </div>
  );
}

function MediaCard({ video, onPlay, formatViewCount }) {
  const isSpotify = video.source === "spotify";
  const isYouTube = video.source === "youtube";

  const getCategoryLabel = (cat) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? `${found.emoji} ${found.label}` : cat;
  };

  const getSourceIcon = () => {
    if (isSpotify) return <Music className="w-4 h-4" />;
    return <Video className="w-4 h-4" />;
  };

  const getSourceBadgeStyle = () => {
    if (isSpotify) return "bg-green-500 text-white border-0";
    if (isYouTube) return "bg-red-500 text-white border-0";
    return "bg-gray-500 text-white border-0";
  };

  return (
    <Card className="overflow-hidden bg-white rounded-2xl shadow-md border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={video.thumbnail_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop"}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Source Badge */}
        <Badge className={`absolute top-3 right-3 ${getSourceBadgeStyle()} flex items-center gap-1`}>
          {getSourceIcon()}
          {isSpotify ? "Spotify" : isYouTube ? "YouTube" : video.source}
        </Badge>

        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 bg-amber-500/90 text-white border-0">
          {getCategoryLabel(video.category)}
        </Badge>

        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        )}

        {/* Play Button */}
        <Button
          onClick={onPlay}
          size="icon"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-2xl ${
            isSpotify 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-white/95 hover:bg-white text-emerald-700"
          }`}
        >
          <Play className="w-7 h-7 ml-1" />
        </Button>

        {/* Curated Badge */}
        {video.is_curated && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            ⭐ Featured
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-emerald-800 mb-2 line-clamp-2">{video.title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-emerald-700">{video.lecturer || "Unknown Lecturer"}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-emerald-600 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViewCount(video.view_count)} views
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onPlay} 
            className={`flex-1 ${
              isSpotify 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            } text-white`}
          >
            <Play className="w-4 h-4 mr-2" />
            Play Now
          </Button>
          <Button
            onClick={onPlay}
            variant="outline"
            className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View in Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ searchQuery, onUpload }) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center shadow-lg">
        <Video className="w-12 h-12 text-emerald-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-emerald-800">
        {searchQuery ? "No videos found" : "No Majalis & Lectures Yet"}
      </h3>
      <p className="text-emerald-600 mb-6 max-w-sm mx-auto">
        {searchQuery ? "Try different keywords or explore other categories" : "Be the first to share a soulful Majlis or enlightening lecture!"}
      </p>
      <Button onClick={onUpload} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3">
        <Plus className="w-4 h-4 mr-2" />
        Upload Majlis / Lecture
      </Button>
    </div>
  );
}