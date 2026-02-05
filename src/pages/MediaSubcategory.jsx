import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Play, Share2, Heart, Download, Loader2, Search,
  Eye, Maximize, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { MediaVideo } from "@/entities/MediaVideo";
import { User } from "@/entities/User";
import VideoPlayerModal from "@/components/media/VideoPlayerModal";
import { toast } from "sonner";

const SUBCATEGORY_INFO = {
  // Kids subcategories
  animated_stories: { title: "Animated Stories", emoji: "🎬", type: "kids" },
  kids_stories: { title: "Kids Stories", emoji: "📚", type: "kids" },
  kids_movies: { title: "Kids Movies", emoji: "🎥", type: "kids" },
  // Gallery subcategories
  eid_wishes: { title: "Eid Wishes", emoji: "🎉", type: "gallery" },
  shahadat: { title: "Shahadat", emoji: "🖤", type: "gallery" },
  viladat: { title: "Viladat", emoji: "💚", type: "gallery" },
  special_days: { title: "Special Islamic Days", emoji: "📅", type: "gallery" },
  imam_anniversary: { title: "Imam Birth Anniversary", emoji: "🌹", type: "gallery" },
  general_islamic: { title: "General Islamic", emoji: "☪️", type: "gallery" }
};

// Demo content for Kids Section
const DEMO_KIDS_CONTENT = {
  animated_stories: [
    { id: "demo-k1", title: "The Story of Prophet Ibrahim", thumbnail_url: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=300&fit=crop", video_url: "https://youtu.be/zsG66Mm7bDg", source: "youtube", view_count: 1250, duration: "12:30" },
    { id: "demo-k2", title: "Karbala - Animated for Kids", thumbnail_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop", video_url: "https://youtu.be/_LGXjgl3vfw", source: "youtube", view_count: 890, duration: "15:00" }
  ],
  kids_stories: [
    { id: "demo-k3", title: "Story of Hazrat Ali (a.s.)", thumbnail_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop", video_url: "https://youtu.be/FvVhaxXl7vA", source: "youtube", view_count: 650, duration: "08:45" }
  ],
  kids_movies: [
    { id: "demo-k4", title: "The Brave Companions", thumbnail_url: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=400&h=300&fit=crop", video_url: "https://youtu.be/zsG66Mm7bDg", source: "youtube", view_count: 2100, duration: "45:00" }
  ]
};

// Demo content for Gallery
const DEMO_GALLERY_CONTENT = {
  eid_wishes: [
    { id: "demo-g1", title: "Eid Mubarak Calligraphy", file_url: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400&h=400&fit=crop" },
    { id: "demo-g2", title: "Eid ul Adha Greeting", file_url: "https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=400&h=400&fit=crop" }
  ],
  shahadat: [
    { id: "demo-g3", title: "Ya Hussain Calligraphy", file_url: "https://images.unsplash.com/photo-1583592823727-48a071844d5a?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1583592823727-48a071844d5a?w=400&h=400&fit=crop" },
    { id: "demo-g4", title: "Karbala Remembrance", file_url: "https://images.unsplash.com/photo-1610190138542-b92de2b5b3a4?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1610190138542-b92de2b5b3a4?w=400&h=400&fit=crop" }
  ],
  viladat: [
    { id: "demo-g5", title: "Birth of Imam Mahdi", file_url: "https://images.unsplash.com/photo-1518173946687-a4c2f0e1f2d5?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1518173946687-a4c2f0e1f2d5?w=400&h=400&fit=crop" }
  ],
  special_days: [
    { id: "demo-g6", title: "Shab e Qadr", file_url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop" }
  ],
  imam_anniversary: [
    { id: "demo-g7", title: "Imam Ali Birthday", file_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop" }
  ],
  general_islamic: [
    { id: "demo-g8", title: "Islamic Geometric Art", file_url: "https://images.unsplash.com/photo-1588075592532-a185b3a27457?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1588075592532-a185b3a27457?w=400&h=400&fit=crop" },
    { id: "demo-g9", title: "Mosque Architecture", file_url: "https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=800&h=800&fit=crop", thumbnail_url: "https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=400&h=400&fit=crop" }
  ]
};

export default function MediaSubcategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const subcategory = urlParams.get('subcategory');
  const type = urlParams.get('type'); // 'kids' or 'gallery'
  
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const info = SUBCATEGORY_INFO[subcategory] || { title: subcategory, emoji: "📁" };
  const isGallery = type === "gallery" || info.type === "gallery";

  useEffect(() => {
    loadMedia();
  }, [subcategory]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const user = await User.me().catch(() => null);
      setCurrentUser(user);
      
      // Fetch from database
      const category = isGallery ? "images" : "kids";
      const dbMedia = await MediaVideo.filter({ category, subcategory }, '-created_date');
      
      // Combine with demo content
      const demoContent = isGallery 
        ? (DEMO_GALLERY_CONTENT[subcategory] || [])
        : (DEMO_KIDS_CONTENT[subcategory] || []);
      
      setMedia([...demoContent, ...(dbMedia || [])]);
    } catch (error) {
      console.error("Error loading media:", error);
      const demoContent = isGallery 
        ? (DEMO_GALLERY_CONTENT[subcategory] || [])
        : (DEMO_KIDS_CONTENT[subcategory] || []);
      setMedia(demoContent);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (item) => {
    if (!item.id?.startsWith('demo-')) {
      MediaVideo.update(item.id, { view_count: (item.view_count || 0) + 1 }).catch(() => {});
    }
    setSelectedVideo(item);
    setShowVideoPlayer(true);
  };

  const handleSave = async (item) => {
    if (!currentUser || item.id?.startsWith('demo-')) return;
    
    try {
      const savedBy = item.saved_by || [];
      const isSaved = savedBy.includes(currentUser.id);
      const updatedSavedBy = isSaved 
        ? savedBy.filter(id => id !== currentUser.id)
        : [...savedBy, currentUser.id];
      
      await MediaVideo.update(item.id, { saved_by: updatedSavedBy });
      setMedia(prev => prev.map(m => 
        m.id === item.id ? { ...m, saved_by: updatedSavedBy } : m
      ));
      toast.success(isSaved ? "Removed from saved" : "Saved to bookmarks");
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const isSaved = (item) => currentUser && item.saved_by?.includes(currentUser.id);

  const handleShare = (item) => {
    const url = item.file_url || item.video_url || window.location.href;
    if (navigator.share) {
      navigator.share({ title: item.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const handleDownload = (item) => {
    const url = item.file_url || item.thumbnail_url;
    window.open(url, '_blank');
  };

  const openLightbox = (item, index) => {
    setLightboxImage(item);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const navigateLightbox = (direction) => {
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < media.length) {
      setLightboxIndex(newIndex);
      setLightboxImage(media[newIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50/30">
      <VideoPlayerModal open={showVideoPlayer} onOpenChange={setShowVideoPlayer} video={selectedVideo} />
      
      {/* Lightbox for Gallery */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-50"
          >
            <X className="w-6 h-6" />
          </Button>
          
          {lightboxIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-4 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}
          
          <img
            src={lightboxImage.file_url || lightboxImage.thumbnail_url}
            alt={lightboxImage.title}
            className="max-w-[90vw] max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {lightboxIndex < media.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-4 text-white hover:bg-white/10"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}
          
          {/* Lightbox Actions */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3" onClick={(e) => e.stopPropagation()}>
            <Button onClick={() => handleDownload(lightboxImage)} className="bg-white/20 hover:bg-white/30 text-white">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button onClick={() => handleShare(lightboxImage)} className="bg-white/20 hover:bg-white/30 text-white">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button onClick={() => handleSave(lightboxImage)} className="bg-white/20 hover:bg-white/30 text-white">
              <Heart className={`w-4 h-4 mr-2 ${isSaved(lightboxImage) ? 'fill-amber-500 text-amber-500' : ''}`} /> Save
            </Button>
          </div>
          
          <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center font-medium">
            {lightboxImage.title}
          </p>
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl(`MediaLibrary?tab=${isGallery ? 'gallery' : 'kids'}`))}
            className="hover:bg-emerald-50"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
              <span>{info.emoji}</span>
              {info.title}
            </h1>
            <p className="text-xs text-emerald-600">{media.length} items</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : media.length > 0 ? (
          isGallery ? (
            // Gallery Grid
            <div className="grid grid-cols-2 gap-3">
              {media.map((item, index) => (
                <Card
                  key={item.id}
                  className="overflow-hidden rounded-2xl border-2 border-amber-200/50 hover:border-amber-400 cursor-pointer group transition-all hover:shadow-xl"
                  onClick={() => openLightbox(item, index)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.thumbnail_url || item.file_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // Kids Videos Grid
            <div className="grid gap-4">
              {media.map((item) => (
                <Card key={item.id} className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {item.duration && (
                      <Badge className="absolute top-3 right-3 bg-black/60 text-white border-0">
                        {item.duration}
                      </Badge>
                    )}
                    
                    <Button
                      onClick={() => handlePlay(item)}
                      size="icon"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 hover:bg-white text-emerald-700 shadow-xl"
                    >
                      <Play className="w-7 h-7 ml-1" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-emerald-800 mb-2 line-clamp-2">{item.title}</h3>
                    
                    <div className="flex items-center text-xs text-emerald-600 mb-4">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.view_count || 0} views
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={() => handlePlay(item)} className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                        <Play className="w-4 h-4 mr-2" /> Watch
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare(item)} className="border-emerald-300">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleSave(item)} className="border-amber-300">
                        <Heart className={`w-4 h-4 ${isSaved(item) ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">No content yet</h3>
            <p className="text-emerald-600">Be the first to upload in this category!</p>
          </div>
        )}
      </main>
    </div>
  );
}