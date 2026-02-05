import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function GoodDeeds() {
    const deeds = [
        "Recite Dua-e-Ahad after Fajr prayer.",
        "Give charity (Sadaqah) on behalf of the Imam (a.s.).",
        "Pray sincerely for the Imam's health and early reappearance.",
        "Gain knowledge about the Imam's life and mission.",
        "Help a fellow believer in need.",
    ];
    
    return (
        <div className="glassmorphism rounded-2xl p-5">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#6A0066' }}>✅ Good Deeds of the Day (Amal-e-Intizar)</h3>
            <div className="space-y-3">
                {deeds.map((deed, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <Checkbox id={`deed-${index}`} className="border-muted-violet data-[state=checked]:bg-primary-pink data-[state=checked]:border-primary-pink" />
                        <Label htmlFor={`deed-${index}`} className="text-base font-medium" style={{color: '#333333'}}>
                            {deed}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}