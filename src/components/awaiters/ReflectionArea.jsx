import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function ReflectionArea() {
    return (
        <div className="glassmorphism rounded-2xl p-5">
            <h3 className="text-lg font-bold mb-3" style={{ color: '#6A0066' }}>💬 Reflection & Discussion</h3>
            <Textarea 
                placeholder="Write your thoughts and letters for Imam (a.s.)..."
                className="dialog-input mb-3 min-h-[100px]"
            />
            <Button className="w-full primary-btn">
                <Send className="w-4 h-4 mr-2" />
                Submit Anonymously
            </Button>
            <div className="mt-4 border-t border-cream-beige pt-4">
                 <h4 className="font-semibold mb-2 text-sm" style={{color: '#934790'}}>Community Reflections:</h4>
                 <div className="text-sm text-gray-700 italic p-3 bg-cream-beige/50 rounded-lg">
                    "My Imam, this world is dark without you. We await your light..."
                 </div>
            </div>
        </div>
    );
}