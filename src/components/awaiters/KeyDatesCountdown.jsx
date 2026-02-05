import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight } from 'lucide-react';

export default function KeyDatesCountdown() {
    return (
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: '#E8D4B7' }}>
            <div>
                <h4 className="font-bold" style={{color: '#6A0066'}}>15th Sha'ban (Wiladat)</h4>
                <p className="text-sm" style={{color: '#934790'}}>Countdown: 45 Days Left</p>
            </div>
            <Link to={createPageUrl("PrayerTimesPage")} className="flex items-center text-sm font-semibold" style={{color: '#FF0066'}}>
                View Calendar <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    );
}