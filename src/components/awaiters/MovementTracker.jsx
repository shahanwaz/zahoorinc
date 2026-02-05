import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export default function MovementTracker() {
    return (
        <div className="rounded-2xl p-6 text-center" style={{background: 'linear-gradient(135deg, #6A0066, #934790)'}}>
            <h3 className="text-lg font-bold text-white mb-2">🌍 313 Movement Tracker</h3>
            <p className="text-5xl font-bold text-white mb-1">1,234,567</p>
            <p className="text-cream-beige mb-4">Global Pledged Deeds</p>
            <Button className="primary-btn w-full sm:w-auto">
                Pledge a Deed <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    );
}