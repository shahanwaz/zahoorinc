import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Camera, Mic, MicOff, RotateCw, StopCircle, Eye, Share2, Clock, Calendar
} from "lucide-react";
import { toast } from "sonner";
import { LiveStream } from "@/entities/LiveStream";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function GoLive() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [stage, setStage] = useState("form"); // form, live, ended
  const [currentUser, setCurrentUser] = useState(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [liveStream, setLiveStream] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState("user");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    visibility: "public"
  });

  const categories = [
    { value: "majlis", label: "🎤 Majlis" },
    { value: "quran", label: "📖 Quran Recitation" },
    { value: "lecture", label: "📚 Islamic Lecture" },
    { value: "dua", label: "🤲 Dua & Zikr" },
    { value: "talk", label: "💬 Community Talk" },
    { value: "other", label: "📺 Other" }
  ];

  useEffect(() => {
    loadUser();
    return () => {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
      toast.error("Please log in to go live");
      navigate(-1);
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: facingMode },
        audio: true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const flipCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    stopCamera();
    
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: newFacingMode },
          audio: true
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error flipping camera:", error);
        toast.error("Could not flip camera");
      }
    }, 100);
  };

  const handleStartLive = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const streamData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        host_id: currentUser.id,
        host_name: currentUser.full_name,
        host_image: currentUser.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name)}&background=059669&color=fff`,
        is_public: formData.visibility === "public",
        status: "live",
        viewer_count: 0,
        total_views: 0,
        started_at: new Date().toISOString(),
        tags: [formData.category, "Live"],
        stream_url: `https://stream.zahoor.app/live/${Date.now()}`,
        thumbnail_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop"
      };

      const newStream = await LiveStream.create(streamData);
      setLiveStream(newStream);
      setStage("live");
      await startCamera();

      // Start elapsed time counter
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      }, 1000);

      toast.success("🔴 You're Live!", {
        description: "Your stream is now broadcasting.",
      });
    } catch (error) {
      console.error("Error starting live:", error);
      toast.error("Failed to start live stream");
    }
  };

  const handleStopLive = () => {
    setShowEndDialog(true);
  };

  const confirmEndLive = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const now = new Date();
      const expiryDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

      await LiveStream.update(liveStream.id, {
        status: "ended",
        ended_at: now.toISOString(),
        duration_seconds: elapsedTime,
        recording_url: liveStream.stream_url,
        recording_expires_at: expiryDate.toISOString()
      });

      stopCamera();
      setStage("ended");
      setShowEndDialog(false);

      toast.success("Live session ended", {
        description: "Your recording will be available for 7 days.",
      });
    } catch (error) {
      console.error("Error ending live:", error);
      toast.error("Failed to end live stream");
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${createPageUrl(`WatchStream?id=${liveStream.id}`)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: liveStream.title,
          text: `Watch my live stream: ${liveStream.title}`,
          url: shareUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="hover:bg-emerald-50"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <h1 className="text-xl font-bold text-emerald-800">
              {stage === "form" && "Go Live 🎥"}
              {stage === "live" && "🔴 Live Now"}
              {stage === "ended" && "Live Ended ✅"}
            </h1>
          </div>
          {stage === "live" && (
            <Badge className="bg-red-600 text-white px-3 py-1 animate-pulse">
              🔴 LIVE
            </Badge>
          )}
        </div>
      </header>

      {/* Stage 1: Form */}
      {stage === "form" && (
        <main className="p-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-emerald-800 font-semibold mb-2 block">
                  Live Session Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Majlis on Shahadat Imam Ali (a.s.)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="dialog-input"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-emerald-800 font-semibold mb-2 block">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="dialog-input">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-emerald-800 font-semibold mb-2 block">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add details about your live session..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="dialog-input min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-emerald-800 font-semibold mb-2 block">
                  Visibility
                </Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={formData.visibility === "public" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, visibility: "public" })}
                    className={formData.visibility === "public" ? "primary-btn" : "border-emerald-300"}
                  >
                    🌍 Public
                  </Button>
                  <Button
                    type="button"
                    variant={formData.visibility === "private" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, visibility: "private" })}
                    className={formData.visibility === "private" ? "primary-btn" : "border-emerald-300"}
                  >
                    🔒 Private
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleStartLive}
                disabled={!formData.title || !formData.category}
                className="w-full primary-btn text-lg py-6"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Live Session ✅
              </Button>
            </div>
          </div>
        </main>
      )}

      {/* Stage 2: Live Streaming */}
      {stage === "live" && (
        <main className="relative h-[calc(100vh-64px)]">
          {/* Video Preview */}
          <div className="relative w-full h-full bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Live Overlay Info */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-600 text-white font-bold px-3 py-1 animate-pulse">
                    🔴 LIVE
                  </Badge>
                  <Badge className="bg-black/50 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(elapsedTime)}
                  </Badge>
                </div>
                <Badge className="bg-black/50 text-white">
                  <Eye className="w-4 h-4 mr-1" />
                  {viewerCount}
                </Badge>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={flipCamera}
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <RotateCw className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>

                <Button
                  onClick={handleStopLive}
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl"
                >
                  <StopCircle className="w-10 h-10" />
                </Button>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-white font-bold text-lg">{formData.title}</h3>
                <p className="text-white/80 text-sm">{currentUser?.full_name}</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Stage 3: Ended Summary */}
      {stage === "ended" && (
        <main className="p-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>

            <h2 className="text-2xl font-bold text-emerald-800 mb-2">
              Live Session Saved Successfully!
            </h2>
            <p className="text-emerald-600 mb-6">
              Your recording will be available for 7 days
            </p>

            {/* Thumbnail */}
            <div className="relative rounded-xl overflow-hidden mb-6">
              <img 
                src={liveStream?.thumbnail_url} 
                alt="Stream thumbnail"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="font-bold text-xl">{formData.title}</p>
                  <p className="text-sm">Duration: {formatTime(elapsedTime)}</p>
                </div>
              </div>
            </div>

            {/* Expiry Info */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Expires in 7 days</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleShare}
                className="w-full primary-btn"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Recording
              </Button>

              <Button
                onClick={() => navigate(createPageUrl("LiveStreaming"))}
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                View in Live Archive
              </Button>

              <Button
                onClick={() => navigate(createPageUrl("Home"))}
                variant="ghost"
                className="w-full text-emerald-600"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </main>
      )}

      {/* End Live Confirmation Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="dialog-bg">
          <DialogHeader>
            <DialogTitle className="text-emerald-800">End Live Session?</DialogTitle>
          </DialogHeader>
          <p className="text-emerald-700">
            Are you sure you want to end your live session? Your recording will be saved and available for 7 days.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEndDialog(false)}
              className="border-emerald-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmEndLive}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, End Live
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}