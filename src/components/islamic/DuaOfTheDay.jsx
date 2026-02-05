import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Play, Pause, ChevronRight, Share2 } from 'lucide-react'; // Added Share2 icon

// Import the same static duas from DuasSection
const staticDuas = [
    {
        id: 1,
        title: "Morning Du'a (Dua al-Sabah)",
        title_ar: "دُعَاءُ الصَّبَاحِ",
        category: "Daily",
        arabic: "اَللّٰهُمَّ بِكَ اَصْبَحْنَا وَبِكَ اَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوْتُ وَاِلَيْكَ النُّشُوْرُ",
        translation: "O Allah, with You we enter the morning, with You we enter the evening, with You we live, with You we die, and to You is our resurrection.",
        transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilayka an-nushur.",
        source: "Hadith" // Added a placeholder source for sharing
    },
    {
        id: 2,
        title: "Evening Du'a (Dua al-Masa)",
        title_ar: "دُعَاءُ الْمَسَاءِ",
        category: "Daily",
        arabic: "اَللّٰهُمَّ بِكَ اَمْسَيْنَا وَبِكَ اَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوْتُ وَاِلَيْكَ الْمَصِيْرُ",
        translation: "O Allah, with You we enter the evening, with You we enter the morning, with You we live, with You we die, and to You is our return.",
        transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilayka al-masir.",
        source: "Hadith"
    },
    {
        id: 3,
        title: "Du'a before Eating",
        title_ar: "دُعَاءُ قَبْلَ الطَّعَامِ",
        category: "Daily",
        arabic: "بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ",
        translation: "In the name of Allah and with the blessing of Allah.",
        transliteration: "Bismillahi wa 'ala barakatillah.",
        source: "Hadith"
    },
    {
        id: 4,
        title: "Du'a after Eating",
        title_ar: "دُعَاءُ بَعْدَ الطَّعَامِ",
        category: "Daily",
        arabic: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ",
        translation: "All praise is due to Allah, the Lord of the worlds.",
        transliteration: "Alhamdu lillahi rabbil 'alameen.",
        source: "Quran"
    },
    {
        id: 5,
        title: "Du'a for Forgiveness (Istighfar)",
        title_ar: "دُعَاءُ الِاسْتِغْفَارِ",
        category: "Repentance",
        arabic: "اَسْتَغْفِرُ اللهَ رَبِّي وَاَتُوْبُ اِلَيْهِ",
        translation: "I seek forgiveness from Allah, my Lord, and I turn to Him in repentance.",
        transliteration: "Astaghfirullaha rabbi wa atubu ilayh.",
        source: "Hadith"
    },
    {
        id: 6,
        title: "Du'a for Traveling",
        title_ar: "دُعَاءُ السَّفَرِ",
        category: "Travel",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
        translation: "Glory be to Him who has subjected this to us, and we could never have it (by our efforts). And verily, to our Lord we indeed are returning.",
        transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrineen wa inna ila rabbina lamunqaliboon.",
        source: "Quran"
    },
    {
        id: 7,
        title: "Du'a for Protection from Evil",
        title_ar: "دُعَاءُ الْحِفْظِ مِنَ الشَّرِّ",
        category: "Protection",
        arabic: "اَعُوْذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        transliteration: "A'udhu bi kalimatillahit-tammati min sharri ma khalaq.",
        source: "Hadith"
    }
];

export default function DuaOfTheDay() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentDua, setCurrentDua] = useState(null);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
        // Get dua based on day of year to ensure it changes daily
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const duaIndex = dayOfYear % staticDuas.length;
        setCurrentDua(staticDuas[duaIndex]);

        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            setSpeechSynthesis(window.speechSynthesis);
        }

        // Cleanup on unmount
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const toggleAudio = () => {
        if (!currentDua || !speechSynthesis) return;

        if (isPlaying) {
            // Stop playing
            speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            // Start playing Arabic text
            speechSynthesis.cancel(); // Cancel any ongoing speech
            
            const newUtterance = new SpeechSynthesisUtterance(currentDua.arabic);
            newUtterance.lang = 'ar-SA'; // Arabic language
            newUtterance.rate = 0.85; // Slower rate for clear pronunciation
            
            // Try to find a male Arabic voice
            // Note: Voice availability depends on the user's OS and browser
            const voices = window.speechSynthesis.getVoices();
            const arabicVoice = voices.find(v => 
                v.lang.includes('ar') && 
                (v.name.includes('Male') || v.name.includes('Maged') || v.name.includes('Tarik'))
            ) || voices.find(v => v.lang.includes('ar'));
            
            if (arabicVoice) {
                newUtterance.voice = arabicVoice;
            } else {
                // Fallback: lower pitch to sound more masculine if no specific male voice found
                newUtterance.pitch = 0.8;
            }
            
            newUtterance.onstart = () => setIsPlaying(true);
            newUtterance.onend = () => setIsPlaying(false);
            newUtterance.onerror = () => setIsPlaying(false);
            
            setUtterance(newUtterance);
            speechSynthesis.speak(newUtterance);
        }
    };

    const handleShare = async () => {
        if (!currentDua) return;
        
        const duaSource = currentDua.source ? `— ${currentDua.source}` : '';
        const shareText = `🤲 Today's Dua\n\n${currentDua.arabic}\n\n${currentDua.translation}\n${duaSource}\n\nShared via Zahoor App`;
        
        // Try native share
        if (navigator.share && navigator.canShare) {
            try {
                await navigator.share({
                    title: `Today's Dua - ${currentDua.title}`,
                    text: shareText,
                });
                return;
            } catch (error) {
                if (error.name === 'AbortError') return; // User cancelled share
                console.error('Web Share API failed:', error);
                // Fallback to clipboard if share failed for other reasons
            }
        }
        
        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(shareText);
            alert('Dua copied to clipboard!');
        } catch (error) {
            console.error('Clipboard write failed:', error);
            alert('Could not copy to clipboard. Please try again or share manually.');
        }
    };

    const getDayName = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };

    if (!currentDua) return null;

    return (
        <div className="px-4">
            <div className="rounded-2xl p-6 relative overflow-hidden shadow-lg bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200">
                {/* Islamic Pattern Background */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{ 
                        backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23187d4c' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='30' cy='30' r='12' fill='none' stroke='%23187d4c' stroke-width='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                        backgroundSize: '40px 40px'
                    }}
                />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-emerald-800">Dua of the Day</h3>
                            <p className="text-sm text-emerald-600">{getDayName()}'s Spiritual Guidance</p>
                        </div>
                        <div className="flex space-x-2"> {/* Group buttons */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleAudio}
                                className="hover:bg-white/50 rounded-full"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 text-emerald-600" />
                                ) : (
                                    <Play className="w-5 h-5 text-emerald-600" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleShare}
                                className="hover:bg-white/50 rounded-full"
                                title="Share this Dua"
                            >
                                <Share2 className="w-5 h-5 text-emerald-600" />
                            </Button>
                        </div>
                    </div>

                    {/* Du'a Title */}
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold text-emerald-800 mb-1">{currentDua.title}</h4>
                        <p className="text-2xl font-arabic text-right text-emerald-700" dir="rtl">
                            {currentDua.title_ar}
                        </p>
                    </div>

                    {/* Arabic Text */}
                    <div className="mb-4 p-4 rounded-lg bg-white/60">
                        <p className="text-right text-xl leading-relaxed font-arabic text-emerald-800" dir="rtl">
                            {currentDua.arabic}
                        </p>
                    </div>

                    {/* English Translation */}
                    <div className="mb-3">
                        <p className="text-sm italic leading-relaxed text-emerald-900">
                            "{currentDua.translation}"
                        </p>
                    </div>

                    {/* Transliteration */}
                    {currentDua.transliteration && (
                        <div className="mb-4">
                            <p className="text-xs text-emerald-700 leading-relaxed">
                                <span className="font-medium">Transliteration:</span> {currentDua.transliteration}
                            </p>
                        </div>
                    )}

                    {/* Category Badge and View All Button */}
                    <div className="flex items-center justify-between">
                        <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                            {currentDua.category}
                        </span>
                        <Link to={createPageUrl("Duas")}>
                            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}