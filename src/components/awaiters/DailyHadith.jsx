import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export default function DailyHadith() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="glassmorphism rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-cream-beige rounded-bl-xl">
                 <span className="text-xs font-bold" style={{color: '#934790'}}>🌿 Hadith of the Day</span>
            </div>
            <div className="flex items-center justify-between mb-3 mt-8">
                <h3 className="text-lg font-bold" style={{ color: '#6A0066' }}>Imam al-Mahdi (a.s.) said:</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} className="hover:bg-pink-50 rounded-full">
                    {isPlaying ? <Pause className="w-5 h-5" style={{ color: '#FF0066' }} /> : <Play className="w-5 h-5" style={{ color: '#FF0066' }} />}
                </Button>
            </div>
            <div className="space-y-3">
                <p className="text-right text-lg font-arabic" style={{ color: '#6A0066', fontFamily: 'Arial, sans-serif' }}>
                    أكثروا الدعاء بتعجيل الفرج فإن ذلك فرجكم
                </p>
                <p className="text-base italic" style={{ color: '#333333' }}>
                    "Pray often for the reappearance of the awaited one, for in it lies your own salvation."
                </p>
            </div>
        </div>
    );
}