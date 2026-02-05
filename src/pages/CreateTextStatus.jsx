import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Status } from '@/entities/Status';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function CreateTextStatus() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [background, setBackground] = useState('bg-emerald-500'); // Default to emerald
    const [textAlign, setTextAlign] = useState('center');
    const [isLoading, setIsLoading] = useState(false);

    const backgroundOptions = [
        'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500', 
        'bg-yellow-500', 'bg-gray-800', 'bg-pink-500', 'bg-indigo-500',
        'bg-gradient-to-br from-pink-500 to-yellow-500',
        'bg-gradient-to-br from-blue-500 to-purple-500',
        'bg-gradient-to-br from-green-500 to-emerald-500',
        'bg-gradient-to-br from-red-500 to-pink-500'
    ];

    const alignmentOptions = [
        { key: 'left', label: '←', title: 'Left' },
        { key: 'center', label: '↔', title: 'Center' },
        { key: 'right', label: '→', title: 'Right' }
    ];

    const handlePost = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        try {
            const user = await User.me();
            await Status.create({
                user_id: user.id,
                user_name: user.full_name,
                user_profile_image: user.profile_image,
                type: 'text',
                content: text,
                background: background,
                text_align: textAlign,
            });
            navigate(createPageUrl('MyStatus'));
        } catch (error) {
            console.error("Error creating status:", error);
            alert("Failed to post status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getBackgroundStyle = (bg) => {
        if (bg.startsWith('bg-gradient')) {
            return bg;
        }
        return '';
    };

    const getBackgroundColor = (bg) => {
        if (bg.startsWith('bg-gradient')) {
            return '';
        }
        // Convert Tailwind class to actual color
        const colorMap = {
            'bg-emerald-500': '#10b981',
            'bg-blue-500': '#3b82f6',
            'bg-purple-500': '#8b5cf6',
            'bg-red-500': '#ef4444',
            'bg-yellow-500': '#eab308',
            'bg-gray-800': '#1f2937',
            'bg-pink-500': '#ec4899',
            'bg-indigo-500': '#6366f1'
        };
        return colorMap[bg] || '#10b981';
    };

    return (
        <div 
            className={`w-full h-screen flex flex-col transition-all duration-300 ${getBackgroundStyle(background)}`} 
            style={getBackgroundStyle(background) ? {} : { backgroundColor: getBackgroundColor(background) }}
        >
            <header className="flex items-center justify-between p-4 bg-black/10">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your status"
                    className={`w-full h-full bg-transparent text-white text-3xl font-bold placeholder-white/70 border-none focus:ring-0 resize-none outline-none`}
                    style={{ textAlign }}
                />
            </main>

            <footer className="p-4 bg-black/10 space-y-4">
                {/* Text Alignment */}
                <div className="flex justify-center gap-2">
                    {alignmentOptions.map(option => (
                        <button
                            key={option.key}
                            onClick={() => setTextAlign(option.key)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all ${
                                textAlign === option.key ? 'bg-white/30 scale-110' : 'bg-white/10 hover:bg-white/20'
                            }`}
                            title={option.title}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Background Colors */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {backgroundOptions.map(bg => (
                            <button
                                key={bg}
                                onClick={() => setBackground(bg)}
                                className={`w-10 h-10 rounded-full border-3 flex-shrink-0 transition-all ${
                                    background === bg ? 'border-white scale-110' : 'border-white/30'
                                } ${bg.startsWith('bg-gradient') ? bg : ''}`}
                                style={bg.startsWith('bg-gradient') ? {} : { backgroundColor: getBackgroundColor(bg) }}
                            />
                        ))}
                    </div>
                    <Button 
                        onClick={handlePost} 
                        size="lg" 
                        className="rounded-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/30" 
                        disabled={isLoading || !text.trim()}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </div>
            </footer>
        </div>
    );
}