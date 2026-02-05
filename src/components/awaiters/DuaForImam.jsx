import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Volume2 } from 'lucide-react';

export default function DuaForImam() {
    return (
        <div className="glassmorphism rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
                 <h3 className="text-lg font-bold" style={{ color: '#6A0066' }}>📿 Du'a for Imam (a.s.)</h3>
                 <Button variant="ghost" size="icon" className="hover:bg-pink-50 rounded-full">
                    <Volume2 className="w-5 h-5" style={{ color: '#FF0066' }} />
                </Button>
            </div>
            <div className="p-3 rounded-lg bg-cream-beige/50 mb-4">
                 <p className="text-center font-arabic text-lg" style={{ color: '#6A0066' }}>
                    اَللّهُمَّ کُنْ لِوَلِیِّکَ الْحُجَّةِ بْنِ الْحَسَنِ
                </p>
            </div>
            <p className="text-center text-sm italic mb-4" style={{color: '#333333'}}>
                "O Allah, be, for Your representative, the Hujjat (proof), son of AlHasan..."
            </p>
            <div className="flex justify-center">
                <Link to={createPageUrl("Duas")}>
                    <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700">
                        See All Duas
                    </Button>
                </Link>
            </div>
        </div>
    );
}