import React from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

import DailyHadith from '@/components/awaiters/DailyHadith';
import GoodDeeds from '@/components/awaiters/GoodDeeds';
import MovementTracker from '@/components/awaiters/MovementTracker';
import DuaForImam from '@/components/awaiters/DuaForImam';
import AwaiterStories from '@/components/awaiters/AwaiterStories';
import DigitalParcham from '@/components/awaiters/DigitalParcham';
import KeyDatesCountdown from '@/components/awaiters/KeyDatesCountdown';
import ReflectionArea from '@/components/awaiters/ReflectionArea';

export default function AwaitersCorner() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b" style={{borderColor: '#E8D4B7'}}>
                <div className="flex items-center justify-between p-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-pink-50">
                        <ArrowLeft className="w-5 h-5" style={{ color: '#6A0066' }} />
                    </Button>
                    <h1 className="text-xl font-bold" style={{ color: '#6A0066' }}>Awaiters' Corner</h1>
                    <Button variant="ghost" size="icon" className="hover:bg-pink-50">
                        <Bell className="w-5 h-5" style={{ color: '#6A0066' }} />
                    </Button>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="pb-24">
                <div className="p-4 space-y-6">
                    <DailyHadith />
                    <GoodDeeds />
                    <MovementTracker />
                    <DuaForImam />
                    <AwaiterStories />
                    <DigitalParcham />
                    <KeyDatesCountdown />
                    <ReflectionArea />
                </div>
            </main>
        </div>
    );
}