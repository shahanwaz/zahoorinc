import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Play, Users, Clock, Eye, Loader2, VideoOff
} from "lucide-react";
import { createPageUrl } from "@/utils";

import ShareModal from "@/components/streaming/ShareModal";
import DonationModal from "@/components/donations/DonationModal";
import GoLiveModal from "@/components/streaming/GoLiveModal";
import ScheduledEventCard from "@/components/streaming/ScheduledEventCard";
import PastStreamCard from "@/components/streaming/PastStreamCard";
import { LiveStream } from "@/entities/LiveStream";

// Feature flag - set to true to re-enable Live Streaming
const LIVE_STREAMING_ENABLED = false;

export default function LiveStreaming() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [liveStreams, setLiveStreams] = useState([]);
  const [pastStreams, setPastStreams] = useState([]);
  const [scheduledStreams, setScheduledStreams] = useState([]);
  
  // Redirect if feature is disabled
  useEffect(() => {
    if (!LIVE_STREAMING_ENABLED) {
      const timer = setTimeout(() => {
        navigate(createPageUrl("Home"));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  useEffect(() => {
    if (LIVE_STREAMING_ENABLED) {
      loadStreams();
    }
  }, []);

  useEffect(() => {
    if (!LIVE_STREAMING_ENABLED) return;
    // Clean up expired recordings every hour
    const cleanupInterval = setInterval(() => {
      cleanupExpiredRecordings();
    }, 3600000); // Check every hour

    return () => clearInterval(cleanupInterval);
  }, []);
  
  // Show unavailable message if feature is disabled
  if (!LIVE_STREAMING_ENABLED) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <VideoOff className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-3">Live Streaming is Currently Unavailable</h1>
          <p className="text-emerald-600 mb-6">This feature is temporarily disabled. We're working on improvements and will be back soon!</p>
          <Button 
            onClick={() => navigate(createPageUrl("Home"))}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const loadStreams = async () => {
    setLoading(true);
    try {
      const allStreams = await LiveStream.list('-created_date');
      
      // Separate streams by status
      const live = allStreams.filter(s => s.status === 'live');
      const ended = allStreams.filter(s => s.status === 'ended' && s.recording_url);
      const scheduled = allStreams.filter(s => s.status === 'scheduled');
      
      setLiveStreams(live);
      setPastStreams(ended);
      setScheduledStreams(scheduled);
    } catch (error) {
      console.error("Error loading streams:", error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupExpiredRecordings = async () => {
    try {
      const allStreams = await LiveStream.list();
      const now = new Date();
      
      for (const stream of allStreams) {
        if (stream.recording_expires_at) {
          const expiryDate = new Date(stream.recording_expires_at);
          if (now > expiryDate) {
            // Delete the expired stream
            await LiveStream.delete(stream.id);
            console.log(`Deleted expired stream: ${stream.title}`);
          }
        }
      }
      
      await loadStreams();
    } catch (error) {
      console.error("Error cleaning up expired recordings:", error);
    }
  };

  const tabs = [
    { id: "live", label: "🔴 Live Now", count: liveStreams.length },
    { id: "past", label: "📼 Past Streams", count: pastStreams.length },
    { id: "scheduled", label: "📅 Scheduled", count: scheduledStreams.length }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-emerald-50 mr-2">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <h1 className="text-xl font-bold text-emerald-800">Live Streaming</h1>
          </div>
          <Button onClick={() => navigate(createPageUrl("GoLive"))} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
            🎥 Go Live
          </Button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 bg-white border-b border-emerald-200/50 px-4 py-3">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : activeTab === "live" && (
          <div className="space-y-6">
            {liveStreams.length > 0 ? (
              liveStreams.map((stream) => (
                <Card key={stream.id} className="overflow-hidden bg-white rounded-2xl shadow-lg border border-emerald-200/50">
                  <div className="relative">
                    <img src={stream.thumbnail_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop"} alt={stream.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge className="bg-red-600 text-white font-bold px-3 py-1 animate-pulse">
                        🔴 LIVE
                      </Badge>
                      <Badge className="bg-black/50 text-white">
                        {formatElapsedTime(stream.started_at)}
                      </Badge>
                    </div>

                    {/* Viewer Count */}
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                      <Users className="w-4 h-4 inline mr-1" />
                      {formatViewCount(stream.viewer_count || 0)}
                    </div>

                    {/* Play Button */}
                    <Button
                      onClick={() => navigate(createPageUrl(`WatchStream?id=${stream.id}`))}
                      size="icon"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 hover:bg-white text-emerald-800 rounded-full shadow-lg"
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-emerald-800 mb-2">{stream.title}</h3>

                        <div className="flex items-center gap-2 mb-3">
                          <img src={stream.host_image} alt={stream.host_name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-semibold text-emerald-700 text-sm">
                              {stream.host_name}
                            </p>
                            <p className="text-xs text-emerald-600">is Live Now!</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {stream.tags?.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(createPageUrl(`WatchStream?id=${stream.id}`))}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Live
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Play className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-emerald-800">No Live Streams</h3>
                <p className="text-emerald-600 mb-4">Be the first to go live and share your knowledge!</p>
                <Button onClick={() => navigate(createPageUrl("GoLive"))} className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  🎥 Start Your Stream
                </Button>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "past" && (
          <div className="grid gap-4">
            {pastStreams.length > 0 ? (
              pastStreams.map((stream) => (
                <PastStreamCard key={stream.id} stream={stream} />
              ))
            ) : (
              <div className="text-center py-12">
                <Eye className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                <p className="text-emerald-600">No past streams available</p>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "scheduled" && (
          <div className="grid gap-4">
            {scheduledStreams.length > 0 ? (
              scheduledStreams.map((stream) => (
                <ScheduledEventCard key={stream.id} event={stream} />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                <p className="text-emerald-600">No scheduled streams</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ShareModal open={showShareModal} onOpenChange={setShowShareModal} />
      <DonationModal open={showDonationModal} onOpenChange={setShowDonationModal} />
      <GoLiveModal open={showGoLiveModal} onOpenChange={setShowGoLiveModal} onStreamCreated={loadStreams} />
    </div>
  );
}