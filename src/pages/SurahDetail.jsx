
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Volume2, ChevronDown } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function SurahDetail() {
    const navigate = useNavigate();
    const [surah, setSurah] = useState(null);
    const [ayahs, setAyahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('arabic');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAyah, setCurrentAyah] = useState(1);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [audioLoading, setAudioLoading] = useState(false);
    const [volume, setVolume] = useState(1);
    const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
    const [showReciterMenu, setShowReciterMenu] = useState(false);
    const audioRef = useRef(null);

    const reciters = [
        { code: 'ar.alafasy', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري بن راشد العفاسي' },
        { code: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais', arabicName: 'عبد الرحمن السديس' },
        { code: 'ar.shaatree', name: 'Abu Bakr Al-Shatri', arabicName: 'أبو بكر الشاطري' },
        { code: 'ar.hani', name: 'Hani Ar-Rifai', arabicName: 'هاني الرفاعي' },
        { code: 'ar.maher', name: 'Maher Al-Muaiqly', arabicName: 'ماهر المعيقلي' },
        { code: 'ar.parhizgar', name: 'Nasser Alqatami', arabicName: 'ناصر القطامي' },
        { code: 'ar.walk', name: 'Waleed Al-Maneeseh', arabicName: 'وليد المنيسيه' }
    ];

    const fetchSurah = useCallback(async (surahNumber) => {
        setLoading(true);
        try {
            // Fetch surah info
            const surahResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            const surahData = await surahResponse.json();
            
            // Fetch with translation
            const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`);
            const translationData = await translationResponse.json();
            
            // Fetch audio version with selected reciter
            const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedReciter}`);
            const audioData = await audioResponse.json();
            
            setSurah(surahData.data);
            
            // Combine Arabic, translation, and audio
            const combinedAyahs = surahData.data.ayahs.map((ayah, index) => ({
                ...ayah,
                translation: translationData.data?.ayahs[index]?.text || 'Translation not available',
                audio: audioData.data?.ayahs[index]?.audio || null,
                juz: ayah.juz || null,
                sajda: ayah.sajda || null
            }));
            
            setAyahs(combinedAyahs);
        } catch (error) {
            console.error('Error fetching surah:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedReciter]); // fetchSurah now depends on selectedReciter

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const surahNumber = urlParams.get('surah');
        if (surahNumber) {
            fetchSurah(surahNumber);
        }
    }, [fetchSurah]); // useEffect now depends on fetchSurah

    const playContinuousSurah = async () => {
        if (!ayahs.length || audioLoading) return;
        
        setAudioLoading(true);
        setIsPlaying(true);
        setCurrentAyah(1);

        try {
            for (let i = 0; i < ayahs.length; i++) {
                if (!ayahs[i].audio) continue;
                
                setCurrentAyah(i + 1);
                
                const audio = new Audio(ayahs[i].audio);
                audioRef.current = audio;
                
                audio.volume = volume;
                audio.playbackRate = playbackSpeed;
                
                await new Promise((resolve, reject) => {
                    audio.addEventListener('ended', resolve);
                    audio.addEventListener('error', reject);
                    audio.play().catch(reject);
                });
                
                // Small pause between ayahs
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            
            setIsPlaying(false);
        } catch (error) {
            console.error('Error playing continuous surah:', error);
            setIsPlaying(false);
        } finally {
            setAudioLoading(false);
        }
    };

    const stopPlayback = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
        setAudioLoading(false);
    };

    const togglePlayback = () => {
        if (isPlaying) {
            stopPlayback();
        } else {
            playContinuousSurah();
        }
    };

    const changeReciter = (reciterCode) => {
        setSelectedReciter(reciterCode);
        setShowReciterMenu(false);
        stopPlayback(); // Stop current playback when changing reciter
    };

    const changeSpeed = (speed) => {
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (!surah) {
        return (
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
                <p className="text-emerald-700">Surah not found</p>
            </div>
        );
    }

    const currentReciter = reciters.find(r => r.code === selectedReciter);

    return (
        <div className="min-h-screen bg-emerald-50 pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b shadow-sm border-emerald-200">
                <div className="flex items-center p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="hover:bg-emerald-50 mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-emerald-800" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-emerald-800">{surah.englishName}</h1>
                        <p className="text-sm text-emerald-600">{surah.englishNameTranslation}</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="px-4">
                    <div className="flex border-b border-emerald-200">
                        <button
                            onClick={() => setActiveTab('arabic')}
                            className={`flex-1 p-3 text-sm font-medium transition-colors ${
                                activeTab === 'arabic'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-emerald-500'
                            }`}
                        >
                            Arabic Text
                        </button>
                        <button
                            onClick={() => setActiveTab('translation')}
                            className={`flex-1 p-3 text-sm font-medium transition-colors ${
                                activeTab === 'translation'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-emerald-500'
                            }`}
                        >
                            Translation
                        </button>
                    </div>
                </div>
            </div>

            {/* Surah Header Info */}
            <div className="p-6 text-center bg-white mx-4 mt-4 rounded-2xl shadow-sm border border-emerald-100">
                <h2 className="text-3xl font-arabic-title text-emerald-700 mb-2" dir="rtl">{surah.name}</h2>
                <p className="text-emerald-600 mb-2">{surah.englishName} - {surah.englishNameTranslation}</p>
                <p className="text-sm text-emerald-500">{surah.numberOfAyahs} Ayahs • {surah.revelationType}</p>
                
                {/* Reciter Selection Dropdown */}
                <div className="relative inline-block mt-3">
                    <button
                        onClick={() => setShowReciterMenu(!showReciterMenu)}
                        className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                        🎵 Recited by {currentReciter?.name}
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {showReciterMenu && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-emerald-200 p-2 min-w-64 z-50">
                            <p className="text-xs text-emerald-600 font-medium mb-2 px-2">Select Reciter</p>
                            {reciters.map((reciter) => (
                                <button
                                    key={reciter.code}
                                    onClick={() => changeReciter(reciter.code)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-emerald-50 transition-colors ${
                                        selectedReciter === reciter.code ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    <div className="font-medium">{reciter.name}</div>
                                    <div className="text-xs text-gray-500 font-arabic">{reciter.arabicName}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Continuous Surah Display */}
            <div className="p-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
                    {activeTab === 'arabic' ? (
                        <div className="space-y-6">
                            {ayahs.map((ayah, index) => (
                                <div key={ayah.number} className="relative">
                                    {/* Juz Marker */}
                                    {ayah.juz && index > 0 && ayahs[index - 1].juz !== ayah.juz && (
                                        <div className="text-center mb-4">
                                            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                                                📖 Juz {ayah.juz}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Sajda Marker */}
                                    {ayah.sajda && (
                                        <div className="text-center mb-2">
                                            <div className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                                                🕌 Sajda
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={`flex items-start gap-4 transition-all duration-300 ${
                                        currentAyah === ayah.numberInSurah && isPlaying ? 'bg-emerald-50 p-4 rounded-xl' : 'p-2'
                                    }`}>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-2 ${
                                            currentAyah === ayah.numberInSurah && isPlaying ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {ayah.numberInSurah}
                                        </span>
                                        <p className="font-arabic-large text-right text-xl leading-loose text-emerald-800 flex-1" dir="rtl">
                                            {ayah.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ayahs.map((ayah, index) => (
                                <div key={ayah.number} className="relative">
                                    {/* Juz Marker */}
                                    {ayah.juz && index > 0 && ayahs[index - 1].juz !== ayah.juz && (
                                        <div className="text-center mb-4">
                                            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                                                📖 Juz {ayah.juz}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Sajda Marker */}
                                    {ayah.sajda && (
                                        <div className="text-center mb-2">
                                            <div className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                                                🕌 Sajda
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={`flex items-start gap-4 transition-all duration-300 ${
                                        currentAyah === ayah.numberInSurah && isPlaying ? 'bg-emerald-50 p-4 rounded-xl' : 'p-2'
                                    }`}>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                            currentAyah === ayah.numberInSurah && isPlaying ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {ayah.numberInSurah}
                                        </span>
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {ayah.translation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Audio Controller */}
            <div className="fixed bottom-24 left-4 right-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-emerald-200 p-4 backdrop-blur-md bg-white/95">
                    {/* Current Progress */}
                    <div className="text-center mb-3">
                        <p className="text-sm font-medium text-emerald-800">
                            {surah.englishName} - Ayah {currentAyah} of {surah.numberOfAyahs}
                        </p>
                        <div className="w-full bg-emerald-100 rounded-full h-1 mt-2">
                            <div
                                className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${(currentAyah / surah.numberOfAyahs) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Audio Controls */}
                    <div className="flex items-center justify-center gap-4">
                        {/* Play/Pause */}
                        <Button
                            onClick={togglePlayback}
                            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                            disabled={audioLoading}
                        >
                            {audioLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-6 h-6" />
                            ) : (
                                <Play className="w-6 h-6 ml-0.5" />
                            )}
                        </Button>

                        {/* Volume */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-emerald-50"
                            onClick={() => setVolume(volume === 0 ? 1 : 0)}
                        >
                            <Volume2 className={`w-5 h-5 ${volume === 0 ? 'text-gray-400' : 'text-emerald-600'}`} />
                        </Button>

                        {/* Speed Control */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                className="hover:bg-emerald-50"
                            >
                                <span className="text-xs font-semibold text-emerald-600">{playbackSpeed}x</span>
                            </Button>

                            {showSpeedMenu && (
                                <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border border-emerald-200 p-2 min-w-24">
                                    <p className="text-xs text-emerald-600 font-medium mb-2 px-2">Speed</p>
                                    {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => changeSpeed(speed)}
                                            className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-emerald-50 ${
                                                playbackSpeed === speed ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-700'
                                            }`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mt-2">
                        <p className="text-xs text-emerald-600">
                            Continuous Surah Recitation by {currentReciter?.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
