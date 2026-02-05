import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, Search, Play, Pause, Heart, Download, BookOpen, Upload, SkipBack, SkipForward, Maximize, Plus, Loader2,
  Music, Video, Eye, Clock, User as UserIcon, Bookmark
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MediaVideo } from "@/entities/MediaVideo";
import { User } from "@/entities/User";
import VideoPlayerModal from "@/components/media/VideoPlayerModal";
import UploadVideoModal from "@/components/media/UploadVideoModal";
import KidsSectionCategories from "@/components/media/KidsSectionCategories";
import GalleryCategories from "@/components/media/GalleryCategories";

export default function MediaLibrary() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const videoIdFromUrl = urlParams.get('video');
  const curatedIdFromUrl = urlParams.get('curated');
  const tabFromUrl = urlParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "duas");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [kidsSubcategory, setKidsSubcategory] = useState(null);
  const [gallerySubcategory, setGallerySubcategory] = useState(null);

  useEffect(() => {
    loadUploadedVideos();
  }, []);

  // Curated media from MajalisLectures page
  const CURATED_MEDIA = [
    {
      id: "curated-1",
      title: "Roohani Bayan – Reflection on Dua e Kumayl",
      lecturer: "Maulana Syed Rizvi",
      source: "youtube",
      video_url: "https://youtu.be/zsG66Mm7bDg?si=TJw_JLZ-CqoBovE4",
      thumbnail_url: "https://img.youtube.com/vi/zsG66Mm7bDg/hqdefault.jpg",
      category: "lecture"
    },
    {
      id: "curated-2",
      title: "Majlis e Aza – The Legacy of Karbala",
      lecturer: "Zakir Ali Mehdi",
      source: "youtube",
      video_url: "https://youtu.be/_LGXjgl3vfw?si=Gf7k7Pw5F1GpQLd0",
      thumbnail_url: "https://img.youtube.com/vi/_LGXjgl3vfw/hqdefault.jpg",
      category: "majlis"
    },
    {
      id: "curated-3",
      title: "The Call of Faith – Majlis on Patience (Sabr)",
      lecturer: "Zakira Fatema Zahra",
      source: "youtube",
      video_url: "https://youtu.be/FvVhaxXl7vA?si=cB_8FClt-WZbT_c0",
      thumbnail_url: "https://img.youtube.com/vi/FvVhaxXl7vA/hqdefault.jpg",
      category: "majlis"
    },
    {
      id: "curated-4",
      title: "Spiritual Reflections – Heartfelt Recitation",
      lecturer: "Syed Haider",
      source: "spotify",
      video_url: "https://open.spotify.com/track/72gpnbuY0LkLCQIm88zRwE?si=efb722c965a64ffe",
      thumbnail_url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=400&fit=crop",
      category: "aza",
      is_curated: true
    }
  ];
  
  // Add is_curated flag to all curated media
  CURATED_MEDIA.forEach(m => m.is_curated = true);

  useEffect(() => {
    // Open video from URL param
    if (videoIdFromUrl && uploadedVideos.length > 0) {
      const video = uploadedVideos.find(v => v.id === videoIdFromUrl);
      if (video) {
        setSelectedVideo(video);
        setShowVideoPlayer(true);
        setActiveTab("majalis");
      }
    }
    // Open curated video from URL param
    if (curatedIdFromUrl) {
      const curatedVideo = CURATED_MEDIA.find(v => v.id === curatedIdFromUrl);
      if (curatedVideo) {
        setSelectedVideo(curatedVideo);
        setShowVideoPlayer(true);
        setActiveTab("majalis");
      }
    }
  }, [videoIdFromUrl, curatedIdFromUrl, uploadedVideos]);

  const loadUploadedVideos = async () => {
    setLoadingVideos(true);
    try {
      const [user, videos] = await Promise.all([
        User.me().catch(() => null),
        MediaVideo.list('-created_date')
      ]);
      setCurrentUser(user);
      // Combine curated media with user-uploaded videos
      const allVideos = [...CURATED_MEDIA, ...(videos || [])];
      setUploadedVideos(allVideos);
    } catch (error) {
      console.error("Error loading videos:", error);
      setUploadedVideos(CURATED_MEDIA);
    } finally {
      setLoadingVideos(false);
    }
  };

  const tabs = [
    { id: "duas", label: "📖 Duas & Ziyarats" },
    { id: "nauhas", label: "🎵 Nauhas & Manqabat" },
    { id: "majalis", label: "🎤 Majalis & Lectures" },
    { id: "books", label: "📚 Books & PDFs" },
    { id: "kids", label: "🎶 Kids Section" },
    { id: "gallery", label: "🖼 Gallery" }
  ];

  const mediaData = {
    duas: [
      {
        id: 'dua1',
        title: "Dua Kumayl – Arabic & English",
        type: "Audio",
        duration: "12:30",
        reciter: "Maulana Ali Rizvi",
        thumbnail: "https://images.unsplash.com/photo-1588075592532-a185b3a27457?w=400&h=250&fit=crop",
        url: "#"
      },
    ],
    nauhas: [
      {
        id: 'nauha1',
        title: "Ya Hussain (Nauha 2024)",
        type: "Video",
        duration: "06:45",
        reciter: "Syed Abbas",
        thumbnail: "https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=400&h=250&fit=crop",
        url: "#"
      },
    ],
    majalis: [
      {
        id: 'majlis1',
        title: "Majlis – Shahadat of Imam Ali (a.s.)",
        type: "Video",
        duration: "45:00",
        speaker: "Maulana Sadiq Hasan",
        thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=250&fit=crop",
        url: "#"
      },
    ],
    books: [
      {
        id: 'book1',
        title: "Nahjul Balagha (English)",
        type: "PDF Book",
        pages: "400 pages",
        author: "Syed Abbas Jafri",
        thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
        url: "#"
      },
    ],
    kids: [
      {
        id: 'kid1',
        title: "Story of Karbala (Animated)",
        type: "Video",
        duration: "10:15",
        thumbnail: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=400&h=250&fit=crop",
        url: "#"
      },
    ],
    gallery: [
      { id: 'img1', title: "Calligraphy of 'Ya Hussain'", thumbnail: "https://images.unsplash.com/photo-1583592823727-48a071844d5a?w=300&h=300&fit=crop" },
      { id: 'img2', title: "Karbala Shrine Photo", thumbnail: "https://images.unsplash.com/photo-1610190138542-b92de2b5b3a4?w=300&h=300&fit=crop" },
      { id: 'img3', title: "Ashura Procession 2023", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop" },
      { id: 'img4', title: "Imam Reza Shrine Wallpaper", thumbnail: "https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=300&h=300&fit=crop" },
    ]
  };

  const handlePlayPause = (media) => {
    if (currentlyPlaying?.id === media.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(media);
      setIsPlaying(true);
    }
  };

  const toggleFavorite = (mediaId) => {
    setFavorites(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };
  
  const filteredData = mediaData[activeTab]?.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredUploadedVideos = uploadedVideos.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lecturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayUploadedVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
    // Update view count only for non-curated videos
    if (!video.is_curated && video.id) {
      MediaVideo.update(video.id, { view_count: (video.view_count || 0) + 1 }).catch(() => {});
    }
  };

  const handleSaveVideo = async (video) => {
    if (!currentUser || video.is_curated) return;
    
    try {
      const savedBy = video.saved_by || [];
      const isSaved = savedBy.includes(currentUser.id);
      
      const updatedSavedBy = isSaved 
        ? savedBy.filter(id => id !== currentUser.id)
        : [...savedBy, currentUser.id];
      
      await MediaVideo.update(video.id, { saved_by: updatedSavedBy });
      
      setUploadedVideos(prev => prev.map(v => 
        v.id === video.id ? { ...v, saved_by: updatedSavedBy } : v
      ));
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  const isVideoSaved = (video) => {
    return currentUser && video.saved_by?.includes(currentUser.id);
  };

  const MediaCard = ({ media }) => {
    const isFavorite = favorites.includes(media.id);

    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 mb-4 overflow-hidden">
        <div className="relative">
          <img 
            src={media.thumbnail} 
            alt={media.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <Badge 
            variant="secondary"
            className="absolute top-3 right-3 bg-black/50 text-white border-0"
          >
            {media.type}
          </Badge>
          <Button
            onClick={() => handlePlayPause(media)}
            size="icon"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
          >
            <Play className="w-6 h-6 ml-1" />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 text-emerald-800">
            {media.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm mb-4 text-emerald-700">
            <span>{media.reciter || media.speaker || media.author}</span>
            <span>{media.duration || media.pages}</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handlePlayPause(media)}
              className="flex-1 primary-btn"
            >
              {media.type === 'PDF Book' ? (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {media.type === 'Video' ? 'Watch' : 'Play'}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleFavorite(media.id)}
              className="border-emerald-300 hover:bg-emerald-50"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-emerald-500 text-emerald-500' : 'text-gray-600'}`} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="border-emerald-300 hover:bg-emerald-50"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const GalleryGrid = () => (
    <div className="grid grid-cols-2 gap-4">
      {filteredData.map((item) => (
        <Card key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
           <div className="relative">
             <img 
              src={item.thumbnail} 
              alt={item.title}
              className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize className="w-8 h-8 text-white"/>
            </div>
           </div>
        </Card>
      ))}
    </div>
  );
  
  const AudioPlayer = () => (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setCurrentlyPlaying(null)}>
          <div className="w-[90vw] max-w-sm bg-white rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <img src={currentlyPlaying.thumbnail} alt={currentlyPlaying.title} className="w-full aspect-square rounded-xl shadow-lg mb-6"/>
              <h3 className="text-xl font-bold text-center text-emerald-800">{currentlyPlaying.title}</h3>
              <p className="text-center text-sm mb-4 text-emerald-700">{currentlyPlaying.reciter || currentlyPlaying.speaker}</p>
              
              <div className="h-2 bg-gray-200 rounded-full my-4">
                  <div className="h-2 bg-emerald-500 rounded-full" style={{width: '30%'}}></div>
              </div>

              <div className="flex justify-between text-xs font-mono mb-6">
                  <span>03:45</span>
                  <span>12:30</span>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon" className="w-12 h-12"><SkipBack className="w-6 h-6"/></Button>
                  <Button onClick={() => setIsPlaying(!isPlaying)} size="icon" className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700">
                      {isPlaying ? <Pause className="w-8 h-8 text-white"/> : <Play className="w-8 h-8 text-white ml-1"/>}
                  </Button>
                  <Button variant="ghost" size="icon" className="w-12 h-12"><SkipForward className="w-6 h-6"/></Button>
              </div>
          </div>
      </div>
  )

  const UploadedVideoCard = ({ video }) => {
    const isSpotify = video.source === "spotify";
    const isYouTube = video.source === "youtube";

    return (
      <Card className="bg-white rounded-2xl shadow-md border border-emerald-100 hover:shadow-xl transition-all duration-300 mb-4 overflow-hidden hover:-translate-y-1">
        <div className="relative">
          <img 
            src={video.thumbnail_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=250&fit=crop"} 
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Source Badge */}
          <Badge className={`absolute top-3 right-3 ${isSpotify ? 'bg-green-500' : isYouTube ? 'bg-red-500' : 'bg-gray-500'} text-white border-0 flex items-center gap-1`}>
            {isSpotify ? <Music className="w-3 h-3" /> : <Video className="w-3 h-3" />}
            {isSpotify ? "Spotify" : isYouTube ? "YouTube" : video.source}
          </Badge>
          
          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-amber-500/90 text-white border-0">
            {video.category?.replace('_', ' ')}
          </Badge>
          
          {/* Duration */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
          )}
          
          {/* Featured Badge */}
          {video.is_curated && (
            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Featured
            </div>
          )}
          
          <Button
            onClick={() => handlePlayUploadedVideo(video)}
            size="icon"
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-2xl ${
              isSpotify 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-white/95 hover:bg-white text-emerald-700"
            }`}
          >
            <Play className="w-7 h-7 ml-1" />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 text-emerald-800 line-clamp-2">{video.title}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-emerald-700">{video.lecturer || video.uploader_name || 'Unknown'}</span>
          </div>
          
          <div className="flex items-center text-xs text-emerald-600 mb-4">
            <Eye className="w-3 h-3 mr-1" />
            {video.view_count || 0} views
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => handlePlayUploadedVideo(video)} 
              className={`flex-1 ${
                isSpotify 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              } text-white`}
            >
              <Play className="w-4 h-4 mr-2" /> Play Now
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleSaveVideo(video)} 
              className="border-amber-300 hover:bg-amber-50"
              disabled={video.is_curated}
            >
              <Heart className={`w-4 h-4 ${isVideoSaved(video) ? 'fill-amber-500 text-amber-500' : 'text-gray-600'}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {currentlyPlaying && <AudioPlayer />}
      <VideoPlayerModal open={showVideoPlayer} onOpenChange={setShowVideoPlayer} video={selectedVideo} />
      <UploadVideoModal open={showUploadModal} onOpenChange={setShowUploadModal} currentUser={currentUser} onVideoUploaded={loadUploadedVideos} />
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b shadow-sm border-emerald-200">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-emerald-50"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          
          <h1 className="text-xl font-bold text-emerald-800">
            📚 Media Library
          </h1>
          
          <div className="w-10"></div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search Duas, Nauhas, Books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-emerald-200 bg-emerald-50/50 rounded-full focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-emerald-50 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-32">
        {activeTab === 'kids' ? (
          <KidsSectionCategories 
            onSelectCategory={(subcategory) => navigate(createPageUrl(`MediaSubcategory?type=kids&subcategory=${subcategory}`))} 
          />
        ) : activeTab === 'gallery' ? (
          <GalleryCategories 
            onSelectCategory={(subcategory) => navigate(createPageUrl(`MediaSubcategory?type=gallery&subcategory=${subcategory}`))} 
          />
        ) : activeTab === 'majalis' ? (
          // Show uploaded videos for Majalis tab
          loadingVideos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredUploadedVideos.length > 0 ? (
            <>
              {filteredUploadedVideos.map((video) => (
                <UploadedVideoCard key={video.id} video={video} />
              ))}
              {filteredData.map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </>
          ) : filteredData.length > 0 ? (
            filteredData.map((media) => (
              <MediaCard key={media.id} media={media} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-emerald-800">No videos found</h3>
              <p className="text-emerald-600 mb-4">Be the first to upload a Majlis or Lecture!</p>
              <Button onClick={() => setShowUploadModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" /> Upload Video
              </Button>
            </div>
          )
        ) : filteredData.length > 0 ? (
          filteredData.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-800">
              No media found
            </h3>
            <p className="text-emerald-600">
              {searchQuery ? 'Try different keywords' : 'No content available in this category'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Upload Button */}
      <Button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-emerald-200">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowUploadModal(true)}
            className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
          
          <Button 
            onClick={() => navigate(createPageUrl("SavedItems"))}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Saved Items
          </Button>
        </div>
      </div>
    </div>
  );
}