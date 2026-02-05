import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function AudioPlayer({ 
    tracks, 
    playbackState, 
    onPlaybackStateChange, 
    currentSurahInfo
}) {
    const audioRef = useRef(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const isPlaying = playbackState.action === 'playing';
    const currentTrack = tracks[playbackState.trackIndex];
    const currentAyah = currentSurahInfo?.ayahs[playbackState.trackIndex];

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;
        
        const handleTimeUpdate = () => {
            const current = audio.currentTime;
            const total = audio.duration;
            setCurrentTime(current);
            setDuration(total || 0);
            setProgress(total > 0 ? (current / total) * 100 : 0);
        };
        
        const handleEnded = () => {
            onPlaybackStateChange({ action: 'next' });
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [onPlaybackStateChange]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!currentTrack || !audio) return;

        if (playbackState.action === 'playing') {
            if (audio.src !== currentTrack) {
                audio.src = currentTrack;
            }
            audio.playbackRate = playbackSpeed;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'AbortError') {
                      console.error("Audio play failed:", error);
                    }
                });
            }

        } else if (playbackState.action === 'paused') {
            audio.pause();
        } else if (playbackState.action === 'stop') {
            audio.pause();
            audio.currentTime = 0;
        }
    }, [playbackState, currentTrack, playbackSpeed]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);


    const handlePlayPause = () => {
        if (isPlaying) {
            onPlaybackStateChange({ action: 'paused' });
        } else {
            onPlaybackStateChange({ action: 'play' });
        }
    };

    const handleProgressChange = (value) => {
        if (audioRef.current && duration > 0) {
            const newTime = (value[0] / 100) * duration;
            audioRef.current.currentTime = newTime;
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    if (!tracks || tracks.length === 0 || !currentSurahInfo) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2">
            <div className="bg-white/95 backdrop-blur-xl border border-emerald-200 shadow-2xl rounded-2xl max-w-md mx-auto">
                <div className="p-4 space-y-3">
                    <div className="text-center">
                        <p className="text-sm font-medium text-emerald-800 truncate">
                            {currentSurahInfo.name} - Ayah {currentAyah?.numberInSurah}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Slider 
                            value={[progress]} 
                            onValueChange={handleProgressChange}
                            className="w-full [&_span:first-child]:bg-emerald-200 [&>span:first-child_span]:bg-emerald-600"
                        />
                        <div className="flex justify-between text-xs font-mono text-emerald-600">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onPlaybackStateChange({ action: 'prev' })}
                                className="w-10 h-10 hover:bg-emerald-50"
                            >
                                <SkipBack className="w-5 h-5 text-emerald-700" />
                            </Button>
                            
                            <Button 
                                size="icon" 
                                onClick={handlePlayPause}
                                className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onPlaybackStateChange({ action: 'next' })}
                                className="w-10 h-10 hover:bg-emerald-50"
                            >
                                <SkipForward className="w-5 h-5 text-emerald-700" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-700 w-8 text-center">
                                {playbackSpeed}x
                            </span>
                            <Slider 
                                value={[playbackSpeed]} 
                                onValueChange={(value) => setPlaybackSpeed(value[0])}
                                min={0.5}
                                max={2}
                                step={0.25}
                                className="w-20 [&>span:first-child]:bg-emerald-200 [&>span:first-child_span]:bg-emerald-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}