import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trash2, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status } from '@/entities/Status';
import { User } from '@/entities/User';

export default function StatusViewer({ allUsers, initialUserIndex, onClose }) {
    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [videoLoadingStates, setVideoLoadingStates] = useState({}); // Track loading state of videos
    const [preloadedVideos, setPreloadedVideos] = useState({}); // Cache for preloaded videos

    const videoRef = useRef(null);
    const progressInterval = useRef(null);
    const progressStartTime = useRef(Date.now());
    const preloadRefs = useRef({}); // Store refs for preloaded videos

    const currentUserData = allUsers[currentUserIndex];
    const currentStatus = currentUserData?.statuses[currentStatusIndex];

    // Get status duration (5 seconds default for text/image, actual duration for video)
    const getStatusDuration = (status) => {
        if (status?.type === 'video' && preloadedVideos[status.content]) {
            return preloadedVideos[status.content].duration * 1000;
        }
        return 5000; // 5 seconds for text/image
    };

    const statusDuration = getStatusDuration(currentStatus);

    useEffect(() => {
        User.me().then(setCurrentUser).catch(() => {});
    }, []);

    // Preload videos for smoother playback
    const preloadVideo = useCallback(async (videoUrl) => {
        if (preloadedVideos[videoUrl] || videoLoadingStates[videoUrl]) return;

        setVideoLoadingStates(prev => ({ ...prev, [videoUrl]: 'loading' }));

        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.playsInline = true;
            
            video.oncanplaythrough = () => {
                setPreloadedVideos(prev => ({ 
                    ...prev, 
                    [videoUrl]: { 
                        element: video, 
                        duration: video.duration,
                        loaded: true 
                    } 
                }));
                setVideoLoadingStates(prev => ({ ...prev, [videoUrl]: 'loaded' }));
                preloadRefs.current[videoUrl] = video;
                resolve(video);
            };

            video.onerror = () => {
                setVideoLoadingStates(prev => ({ ...prev, [videoUrl]: 'error' }));
                resolve(null);
            };

            // Add timeout for slow networks
            setTimeout(() => {
                if (videoLoadingStates[videoUrl] === 'loading') {
                    setVideoLoadingStates(prev => ({ ...prev, [videoUrl]: 'timeout' }));
                    resolve(null);
                }
            }, 10000); // 10 second timeout

            video.src = videoUrl;
        });
    }, [videoLoadingStates, preloadedVideos]); // Added preloadedVideos dependency

    // Preload current, next, and previous videos
    useEffect(() => {
        const preloadVideosInRange = async () => {
            const videosToPreload = [];
            
            // Current video
            if (currentStatus?.type === 'video') {
                videosToPreload.push(currentStatus.content);
            }

            // Next video
            let nextUserIndex = currentUserIndex;
            let nextStatusIndex = currentStatusIndex + 1;
            
            if (currentUserData && nextStatusIndex >= currentUserData.statuses.length) {
                nextUserIndex = currentUserIndex + 1;
                nextStatusIndex = 0;
            }

            if (nextUserIndex < allUsers.length) {
                const nextStatus = allUsers[nextUserIndex]?.statuses[nextStatusIndex];
                if (nextStatus?.type === 'video') {
                    videosToPreload.push(nextStatus.content);
                }
            }

            // Previous video
            let prevUserIndex = currentUserIndex;
            let prevStatusIndex = currentStatusIndex - 1;
            
            if (prevStatusIndex < 0) {
                prevUserIndex = currentUserIndex - 1;
                if (prevUserIndex >= 0) {
                    prevStatusIndex = allUsers[prevUserIndex].statuses.length - 1;
                }
            }

            if (prevUserIndex >= 0) {
                const prevStatus = allUsers[prevUserIndex]?.statuses[prevStatusIndex];
                if (prevStatus?.type === 'video') {
                    videosToPreload.push(prevStatus.content);
                }
            }

            // Preload all videos
            for (const videoUrl of videosToPreload) {
                await preloadVideo(videoUrl);
            }
        };

        preloadVideosInRange();
    }, [currentUserIndex, currentStatusIndex, currentUserData, allUsers, preloadVideo, currentStatus?.content, currentStatus?.type]); // Added missing dependencies

    const resetProgress = () => {
        setProgress(0);
        progressStartTime.current = Date.now();
        setIsPlaying(true);
    };

    const nextStatus = useCallback(() => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }

        if (currentUserData && currentStatusIndex < currentUserData.statuses.length - 1) {
            setCurrentStatusIndex(prev => prev + 1);
        } else if (currentUserIndex < allUsers.length - 1) {
            setCurrentUserIndex(prev => prev + 1);
            setCurrentStatusIndex(0);
        } else {
            onClose();
            return;
        }
        resetProgress();
    }, [currentStatusIndex, currentUserIndex, currentUserData, allUsers.length, onClose]);

    const prevStatus = useCallback(() => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }

        if (currentStatusIndex > 0) {
            setCurrentStatusIndex(prev => prev - 1);
        } else if (currentUserIndex > 0) {
            const prevUserIndex = currentUserIndex - 1;
            const prevUser = allUsers[prevUserIndex];
            setCurrentUserIndex(prevUserIndex);
            setCurrentStatusIndex(prevUser.statuses.length - 1);
        }
        resetProgress();
    }, [currentStatusIndex, currentUserIndex, allUsers]);

    // Main progress effect
    useEffect(() => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }

        if (!isPlaying || !currentStatus) return;

        // Handle video playback
        if (currentStatus.type === 'video') {
            const preloadedVideo = preloadedVideos[currentStatus.content];
            
            if (preloadedVideo?.loaded && videoRef.current) {
                // Copy the preloaded video content to the main video element
                videoRef.current.src = currentStatus.content;
                videoRef.current.muted = isMuted;
                videoRef.current.currentTime = 0;
                
                const playPromise = videoRef.current.play();
                if (playPromise) {
                    playPromise.catch(error => {
                        console.log(`Video play error: ${error.message}`);
                    });
                }
            } else if (videoLoadingStates[currentStatus.content] === 'loading') {
                // Still loading, wait a bit more
                return;
            }
        }

        progressStartTime.current = Date.now();

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - progressStartTime.current;
            const newProgress = Math.min((elapsed / statusDuration) * 100, 100);
            
            setProgress(newProgress);
            
            if (newProgress >= 100) {
                nextStatus();
            }
        }, 50);

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [isPlaying, currentStatus, statusDuration, nextStatus, isMuted, preloadedVideos, videoLoadingStates]);

    // Reset progress when status changes
    useEffect(() => {
        resetProgress();
    }, [currentStatusIndex, currentUserIndex]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    const handleClick = (e) => {
        const screenWidth = window.innerWidth;
        const clickX = e.clientX;
        
        if (clickX < screenWidth * 0.3) {
            prevStatus();
        } else if (clickX > screenWidth * 0.7) {
            nextStatus();
        } else {
            if (currentStatus?.type === 'video') {
                toggleMute();
            } else {
                setIsPlaying(!isPlaying);
            }
        }
    };

    const handlePointerDown = () => setIsPlaying(false);
    const handlePointerUp = () => setIsPlaying(true);

    const markAsViewed = useCallback(async () => {
        if (!currentStatus || !currentUser) return;
        
        try {
            const viewerIds = currentStatus.views || [];
            if (!viewerIds.includes(currentUser.id)) {
                await Status.update(currentStatus.id, {
                    views: [...viewerIds, currentUser.id]
                });
            }
        } catch (error) {
            console.error("Error marking status as viewed:", error);
        }
    }, [currentStatus, currentUser]);

    const handleDeleteStatus = async () => {
        if (!currentStatus || !currentUser) return;
        
        if (currentStatus.user_id !== currentUser.id) {
            alert("You can only delete your own status");
            return;
        }

        if (confirm('Delete this status?')) {
            try {
                await Status.delete(currentStatus.id);
                onClose();
            } catch (error) {
                console.error("Error deleting status:", error);
            }
        }
    };

    useEffect(() => {
        if (currentStatus && currentUser) {
            markAsViewed();
        }
    }, [currentStatus, currentUser, markAsViewed]); // Added missing dependencies for clarity

    // Cleanup preloaded videos on unmount
    useEffect(() => {
        // Copy ref to variable for cleanup
        const preloadRefsSnapshot = preloadRefs.current;
        
        return () => {
            Object.values(preloadRefsSnapshot).forEach(video => {
                if (video && typeof video.pause === 'function') {
                    video.pause();
                    video.src = '';
                }
            });
        };
    }, []);

    if (!currentStatus) return null;

    const getBackgroundColor = (bg) => {
        const colorMap = {
            'bg-emerald-500': '#10b981',
            'bg-blue-500': '#3b82f6',
            'bg-purple-500': '#8b5cf6',
            'bg-red-500': '#ef4444',
            'bg-yellow-500': '#eab308',
            'bg-gray-800': '#1f2937',
            'bg-pink-500': '#ec4899',
            'bg-indigo-500': '#6366f1'
        };
        return colorMap[bg] || '#10b981';
    };

    const getGradientStyle = (bg) => {
        const gradientMap = {
            'bg-gradient-to-br from-pink-500 to-yellow-500': 'linear-gradient(to bottom right, #ec4899, #eab308)',
            'bg-gradient-to-br from-blue-500 to-purple-500': 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
            'bg-gradient-to-br from-green-500 to-emerald-500': 'linear-gradient(to bottom right, #22c55e, #10b981)',
            'bg-gradient-to-br from-red-500 to-pink-500': 'linear-gradient(to bottom right, #ef4444, #ec4899)'
        };
        return gradientMap[bg] || null;
    };

    const isVideoLoading = currentStatus.type === 'video' && 
        (!preloadedVideos[currentStatus.content]?.loaded && 
         videoLoadingStates[currentStatus.content] !== 'error');

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Progress Bars */}
            <div className="w-full px-2 pt-3 flex gap-1">
                {currentUserData.statuses.map((_, index) => (
                    <div key={index} className="h-1 flex-1 bg-white/40 rounded-full">
                        <div 
                            className="h-full bg-white rounded-full transition-all duration-100 ease-linear" 
                            style={{ 
                                width: `${
                                    index === currentStatusIndex ? progress : 
                                    (index < currentStatusIndex ? 100 : 0)
                                }%` 
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-4 pt-8">
                <div className="flex items-center gap-3">
                    <img 
                        src={currentUserData.profileImage} 
                        alt={currentUserData.name}
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <p className="text-white font-medium text-sm">{currentUserData.name}</p>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                            <span>
                                {(() => {
                                    const date = new Date(currentStatus.created_date);
                                    const now = new Date();
                                    const diffMs = now - date;
                                    const diffMins = Math.floor(diffMs / 60000);
                                    const diffHours = Math.floor(diffMs / 3600000);
                                    
                                    if (diffMins < 1) return 'Just now';
                                    if (diffMins < 60) return `${diffMins}m ago`;
                                    if (diffHours < 24) return `${diffHours}h ago`;
                                    return date.toLocaleDateString();
                                })()}
                            </span>
                            <span>•</span>
                            <span>{currentStatus.views?.length || 0} views</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    {currentStatus.type === 'video' && (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/10"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                    )}
                    {currentStatus.user_id === currentUser?.id && (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handleDeleteStatus}
                            className="text-white hover:bg-white/10"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose}
                        className="text-white hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div 
                className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden"
                onClick={handleClick}
                onMouseDown={handlePointerDown}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchEnd={handlePointerUp}
            >
                {/* Loading State for Videos */}
                {isVideoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-center text-white">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                            <p className="text-sm">Loading video...</p>
                            {videoLoadingStates[currentStatus.content] === 'timeout' && (
                                <p className="text-xs text-white/70 mt-2">Taking longer than usual</p>
                            )}
                        </div>
                    </div>
                )}

                {currentStatus.type === 'text' && (
                    <div 
                        className="w-full h-full flex items-center justify-center p-8"
                        style={{
                            background: getGradientStyle(currentStatus.background) || getBackgroundColor(currentStatus.background)
                        }}
                    >
                        <p 
                            className="text-white text-2xl md:text-4xl font-bold leading-tight text-center"
                            style={{ textAlign: currentStatus.text_align || 'center' }}
                        >
                            {currentStatus.content}
                        </p>
                    </div>
                )}

                {currentStatus.type === 'image' && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img 
                            src={currentStatus.content} 
                            alt="Status"
                            className="max-w-full max-h-full object-contain"
                        />
                        {currentStatus.caption && (
                            <div className="absolute bottom-20 left-4 right-4">
                                <p className="text-white text-lg text-center bg-black/50 rounded-lg p-3">
                                    {currentStatus.caption}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {currentStatus.type === 'video' && (
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                        <video 
                            ref={videoRef}
                            className="max-w-full max-h-full object-contain"
                            playsInline
                            muted={isMuted}
                            loop={false}
                            style={{ display: isVideoLoading ? 'none' : 'block' }}
                        />
                        
                        {currentStatus.caption && (
                            <div className="absolute bottom-20 left-4 right-4">
                                <p className="text-white text-lg text-center bg-black/50 rounded-lg p-3">
                                    {currentStatus.caption}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation hints for desktop */}
                <div className="absolute inset-0 pointer-events-none hidden md:flex">
                    <div className="flex-1 flex items-center justify-start pl-8">
                        <div className="text-white/30 text-sm">← Previous</div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-white/30 text-sm">
                            {currentStatus.type === 'video' ? 'Tap to mute/unmute' : 'Tap to pause/play'}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-end pr-8">
                        <div className="text-white/30 text-sm">Next →</div>
                    </div>
                </div>
            </div>
        </div>
    );
}