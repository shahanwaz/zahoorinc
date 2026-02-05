
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, PlayCircle, Loader2 } from "lucide-react";
// Collapsible might still be used elsewhere, keeping it in imports

const QURAN_COM_AUDIO_BASE = "https://verses.quran.com/";

export default function SurahDetail({
    surah,
    reciters,
    selectedReciter,
    onSurahChange,
    onPlaybackStateChange,
    onReciterChange,
    currentPlayingAyah,
    onBackToList
}) {
    const [surahData, setSurahData] = useState(null);
    const [translationData, setTranslationData] = useState(null);
    const [selectedTranslation, setSelectedTranslation] = useState('en.sahih');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [translationLoading, setTranslationLoading] = useState(false); // New state for translation loading
    const ayahRefs = useRef({});

    // Translation options - updated as per outline
    const translationOptions = [
        { value: 'en.sahih', label: 'English - Sahih International' },
        { value: 'en.pickthall', label: 'English - Pickthall' },
        { value: 'ur.jalandhry', label: 'Urdu - Jalandhry' }, // Updated from ur.kanzuliman
        { value: 'hi.hindi', label: 'Hindi Translation' }, // Updated from hi.hindi
    ];

    useEffect(() => {
        if (currentPlayingAyah && ayahRefs.current[currentPlayingAyah]) {
            ayahRefs.current[currentPlayingAyah].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentPlayingAyah]);

    const fetchSurahData = useCallback(async () => {
        if (!surah) return;
        
        setLoading(true);
        setError(null);
        try {
            const [textRes, audioRes] = await Promise.all([
                fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surah.id}`),
                fetch(`https://api.quran.com/api/v4/recitations/${selectedReciter}/by_chapter/${surah.id}?per_page=all`)
            ]);

            if (!textRes.ok || !audioRes.ok) {
                throw new Error("Network response was not ok. Please check your connection.");
            }

            const textData = await textRes.json();
            const audioData = await audioRes.json();

            const audioMap = new Map(audioData.audio_files.map(file => [file.verse_key, file.url]));

            const ayahs = textData.verses.map(verse => ({
                number: verse.id,
                numberInSurah: verse.verse_number,
                text: verse.text_uthmani,
                audio: audioMap.has(verse.verse_key) ? QURAN_COM_AUDIO_BASE + audioMap.get(verse.verse_key) : null,
            }));

            const surahInfo = {
                name: surah.name_simple,
                arabicName: surah.name_arabic,
                number: surah.id,
                ayahs: ayahs,
                bismillah: surah.bismillah_pre, // This will be used but with updated conditions
            };

            setSurahData(surahInfo);
            onSurahChange(ayahs.map(a => a.audio), surahInfo);

        } catch (err) {
            console.error("Error fetching Surah data:", err.message);
            setError(err.message);
            setSurahData(null);
        } finally {
            setLoading(false);
        }
    }, [surah, selectedReciter, onSurahChange]);

    const fetchTranslation = useCallback(async () => {
        if (!surah || !selectedTranslation) {
            setTranslationData(null); // Clear translation if surah or selectedTranslation is not set
            return;
        }
        
        setTranslationLoading(true); // Start translation loading
        try {
            // The API expects the translator ID, which is the part after the dot (e.g., 'sahih' from 'en.sahih')
            const translatorId = selectedTranslation.split('.')[1];
            if (!translatorId) {
                throw new Error("Invalid translation selected format.");
            }
            const response = await fetch(`https://api.quran.com/api/v4/quran/translations/${translatorId}?chapter_number=${surah.id}`);
            if (response.ok) {
                const data = await response.json();
                setTranslationData(data.translations);
            } else {
                setTranslationData(null); // Clear data on non-ok response
                console.error("Failed to fetch translation:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching translation:", error);
            setTranslationData(null); // Clear data on error
        } finally {
            setTranslationLoading(false); // End translation loading
        }
    }, [surah, selectedTranslation]);

    useEffect(() => {
        fetchSurahData();
        // Since translation is now always displayed, fetch it along with Surah data
        fetchTranslation(); 
    }, [fetchSurahData, fetchTranslation]); // Added fetchTranslation dependency

    const handlePlaySurah = () => {
        if (surahData?.ayahs) {
            onPlaybackStateChange({ action: 'play', trackIndex: 0 });
        }
    };
    
    const handlePlayFromAyah = (ayahNumberInSurah) => {
        const trackIndex = surahData.ayahs.findIndex(a => a.numberInSurah === ayahNumberInSurah);
        if (trackIndex !== -1) {
            onPlaybackStateChange({ action: 'play', trackIndex });
        }
    };

    if (!surah) return null;

    return (
        <div className="min-h-screen bg-emerald-50">
            {/* Header */}
            <div className="px-4 pt-4">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBackToList}
                        className="hover:bg-emerald-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-emerald-800" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-emerald-800">{surah.name_simple}</h1>
                        <p className="text-emerald-600 text-sm">{surah.translated_name?.name}</p>
                    </div>
                </div>

                {/* Reciter Selection */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-emerald-100 mb-6">
                    <label className="text-sm font-medium text-emerald-700 mb-2 block">Select Reciter</label>
                    <Select value={selectedReciter} onValueChange={onReciterChange}>
                        <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                            <SelectValue placeholder="Choose a Reciter" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {reciters.map(r => (
                                <SelectItem key={r.id} value={String(r.id)}>
                                    {r.reciter_name} ({r.style})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    <span className="ml-3 text-emerald-700">Loading Surah...</span>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-600 px-4">
                    <p className="text-lg font-medium mb-2">Failed to load Surah</p>
                    <p className="text-sm mb-4">{error}</p>
                    <Button onClick={fetchSurahData}>Retry</Button>
                </div>
            ) : surahData ? (
                <>
                    {/* Surah Content */}
                    <div className="px-4 space-y-6 pb-32">
                        {/* Surah Header (Arabic Name, Simple Name, Play Button) */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm border border-emerald-100">
                            <h1 className="text-3xl font-arabic-title text-emerald-800 mb-2" dir="rtl">
                                {surahData.arabicName}
                            </h1>
                            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                                {surahData.name}
                            </h2>
                            
                            {/* Play Button */}
                            <Button
                                onClick={handlePlaySurah}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg"
                            >
                                <PlayCircle className="w-5 h-5 mr-2" />
                                Play Full Surah
                            </Button>
                        </div>

                        {/* Arabic Text */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                            <div className="bg-emerald-600 text-white text-center py-3">
                                <h3 className="font-semibold">Arabic Text</h3>
                            </div>
                            <div className="p-6">
                                {/* Bismillah - Display for all surahs except Al-Fatihah (1) and At-Tawbah (9) */}
                                {surahData.number !== 1 && surahData.number !== 9 && (
                                    <div className="text-center mb-8 py-4 border-b border-emerald-200">
                                        <p className="text-3xl font-quranic text-emerald-800" dir="rtl">
                                            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                                        </p>
                                    </div>
                                )}

                                {/* Ayahs */}
                                <div className="space-y-6">
                                    {surahData.ayahs.map((ayah) => (
                                        <div
                                            key={ayah.numberInSurah}
                                            ref={el => ayahRefs.current[ayah.numberInSurah] = el}
                                            className={`
                                                transition-all duration-300 rounded-lg p-2
                                                ${currentPlayingAyah === ayah.numberInSurah 
                                                    ? 'bg-emerald-100 shadow-md' 
                                                    : 'hover:bg-emerald-50/50'
                                                }
                                            `}
                                        >
                                            <p 
                                                className="text-2xl font-quranic text-emerald-800 text-right leading-relaxed cursor-pointer" 
                                                dir="rtl"
                                                onClick={() => handlePlayFromAyah(ayah.numberInSurah)}
                                            >
                                                {ayah.text}
                                                <span className="inline-flex items-center justify-center w-8 h-8 mx-2 bg-emerald-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                                                    {ayah.numberInSurah}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Translation Section */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                            <div className="bg-emerald-100 border-b border-emerald-200 p-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <h3 className="font-semibold text-emerald-800">Translation</h3>
                                    <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                                        <SelectTrigger className="w-full sm:w-48 border-emerald-300">
                                            <SelectValue placeholder="Select Translation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {translationOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {translationLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                        <span className="ml-2 text-emerald-700">Loading translation...</span>
                                    </div>
                                ) : translationData && translationData.length > 0 ? (
                                    <div className="space-y-4">
                                        {translationData.map((verse, index) => (
                                            <div key={verse.verse_number} className="border-b border-emerald-100 pb-3 last:border-b-0">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full text-xs flex items-center justify-center font-bold mt-1">
                                                        {verse.verse_number}
                                                    </span>
                                                    <p className="text-emerald-700 leading-relaxed">
                                                        {verse.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-emerald-600 py-8">Translation not available for the selected Surah or language.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            
            {/* Bottom safe area */}
            <div className="h-32"></div>
        </div>
    );
}
