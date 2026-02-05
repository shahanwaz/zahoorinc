import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Users, Share2, DollarSign, Loader2, StopCircle
} from 'lucide-react';

import LiveStreamPlayer from '@/components/streaming/LiveStreamPlayer';
import LiveChat from '@/components/streaming/LiveChat';
import ReactionButtons from '@/components/streaming/ReactionButtons';
import ShareModal from '@/components/streaming/ShareModal';
import DonationModal from '@/components/donations/DonationModal';
import { LiveStream } from '@/entities/LiveStream';
import { User } from '@/entities/User';
import { toast } from 'sonner';

export default function WatchStream() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const streamId = params.get('id');
  
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    loadStream();
    loadUser();
    
    // Update viewer count every 30 seconds
    const interval = setInterval(updateViewerCount, 30000);
    return () => clearInterval(interval);
  }, [streamId]);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadStream = async () => {
    setLoading(true);
    try {
      if (!streamId) {
        toast.error("Invalid stream");
        navigate(-1);
        return;
      }

      const streams = await LiveStream.filter({ id: streamId });
      if (streams && streams.length > 0) {
        const streamData = streams[0];
        setStream(streamData);
        
        // Check if current user is the host
        const user = await User.me().catch(() => null);
        if (user && user.id === streamData.host_id) {
          setIsHost(true);
        }
        
        // Increment view count only if we have a valid stream
        if (streamData.id) {
          await LiveStream.update(streamData.id, {
            total_views: (streamData.total_views || 0) + 1
          });
        }
      } else {
        toast.error("Stream not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error loading stream:", error);
      toast.error("Failed to load stream");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const updateViewerCount = async () => {
    // Simulate viewer count update - in production, this would be real-time
    if (stream && stream.status === 'live' && stream.id) {
      const randomChange = Math.floor(Math.random() * 10) - 5;
      const newCount = Math.max(0, (stream.viewer_count || 0) + randomChange);
      await LiveStream.update(stream.id, { viewer_count: newCount });
      await loadStream();
    }
  };

  const handleEndStream = async () => {
    if (!window.confirm("Are you sure you want to end this live stream?")) {
      return;
    }

    try {
      const now = new Date();
      const startedAt = new Date(stream.started_at);
      const durationSeconds = Math.floor((now - startedAt) / 1000);
      
      // Calculate expiry date (7 days from now)
      const expiryDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      await LiveStream.update(streamId, {
        status: 'ended',
        ended_at: now.toISOString(),
        duration_seconds: durationSeconds,
        recording_url: stream.stream_url, // In production, this would be the actual recording URL
        recording_expires_at: expiryDate.toISOString()
      });
      
      toast.success("Stream ended", {
        description: "Your recording will be available for 7 days.",
      });
      
      navigate(-1);
    } catch (error) {
      console.error("Error ending stream:", error);
      toast.error("Failed to end stream");
    }
  };

  const formatElapsedTime = (startTime) => {
    if (!startTime) return '0m ago';
    const elapsed = Math.floor((Date.now() - new Date(startTime)) / 1000 / 60);
    if (elapsed < 60) return `${elapsed}m ago`;
    const hours = Math.floor(elapsed / 60);
    return `${hours}h ${elapsed % 60}m ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-emerald-600">Stream not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-emerald-50 mr-2">
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-emerald-800 truncate">{stream.title}</h1>
            <p className="text-sm text-emerald-600">{stream.host_name}</p>
          </div>
          {isHost && stream.status === 'live' && (
            <Button 
              onClick={handleEndStream}
              variant="destructive"
              size="sm"
              className="ml-2"
            >
              <StopCircle className="w-4 h-4 mr-1" />
              End
            </Button>
          )}
        </div>
      </header>

      <main className="pb-24">
        {/* Video Player */}
        <LiveStreamPlayer src={stream.stream_url || stream.recording_url} isLive={stream.status === 'live'} />

        {/* Event Details Card */}
        <div className="p-4 space-y-4">
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/50">
            <h2 className="text-xl font-bold text-emerald-800 mb-2">{stream.title}</h2>

            <div className="flex items-center gap-3 mb-3">
              <img src={stream.host_image} alt={stream.host_name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-emerald-700">
                  {stream.host_name}
                </p>
                <div className="flex items-center gap-3 text-xs text-emerald-600">
                  <span>{formatElapsedTime(stream.started_at)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{stream.status === 'live' ? stream.viewer_count : stream.total_views} {stream.status === 'live' ? 'viewers' : 'views'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {stream.status === 'live' && (
                <Badge className="bg-red-500 text-white">
                  🔴 LIVE
                </Badge>
              )}
              {stream.tags?.map((tag) => (
                <Badge key={tag} className="bg-emerald-100 text-emerald-700">
                  {tag}
                </Badge>
              ))}
              {stream.description && (
                <p className="text-sm text-emerald-700 mt-2 w-full">{stream.description}</p>
              )}
            </div>
          </div>
          
          {/* Engagement Section */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
            <h3 className="font-semibold text-emerald-800 mb-3">React & Engage</h3>
            <div className="grid grid-cols-2 gap-3">
              <ReactionButtons />
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 border-emerald-200" onClick={() => setShowShareModal(true)}>
                  <Share2 className="w-5 h-5 mr-2 text-emerald-600" /> Share
                </Button>
                <Button variant="outline" className="h-12 bg-emerald-50 border-emerald-200" onClick={() => setShowDonationModal(true)}>
                  <DollarSign className="w-5 h-5 mr-2 text-emerald-600" /> Support
                </Button>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <LiveChat />
        </div>
      </main>

      {/* Modals */}
      <ShareModal open={showShareModal} onOpenChange={setShowShareModal} streamTitle={stream.title} />
      <DonationModal open={showDonationModal} onOpenChange={setShowDonationModal} />
    </div>
  );
}