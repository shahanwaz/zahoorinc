import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Search, ArrowLeft, Play, Pause } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ZiyaratCard = ({ ziyarat, onSelect }) => (
    <Card 
        className="bg-white border-emerald-100 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onSelect(ziyarat)}
    >
        <CardHeader>
            <CardTitle className="text-lg text-emerald-800">{ziyarat.title}</CardTitle>
            {ziyarat.title_ar && (
                <p className="text-2xl font-arabic text-right text-emerald-700 mt-1" dir="rtl">
                    {ziyarat.title_ar}
                </p>
            )}
        </CardHeader>
    </Card>
);

const ZiyaratDetail = ({ ziyarat, onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef(null);
    const audioUrl = ziyarat.attachments?.find(att => att.type === 'mp3')?.url;

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => setIsPlaying(false);
        }
    }, [audioRef]);

    return (
        <div className="px-4 py-4 space-y-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Ziyarat
            </Button>
            <Card className="bg-white border-emerald-100">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-emerald-800">{ziyarat.title}</CardTitle>
                    {ziyarat.title_ar && (
                        <p className="text-3xl font-arabic-title text-emerald-700 mt-2" dir="rtl">{ziyarat.title_ar}</p>
                    )}
                </CardHeader>
                <CardContent>
                    {audioUrl && (
                        <div className="flex justify-center mb-6">
                            <Button onClick={toggleAudio} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                                {isPlaying ? 'Pause Audio' : 'Play Audio'}
                            </Button>
                            <audio ref={audioRef} src={audioUrl} className="hidden" />
                        </div>
                    )}
                    <div 
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: ziyarat.description }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};


export default function ZiyaratSection() {
    const [ziyarats, setZiyarats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedZiyarat, setSelectedZiyarat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchZiyarats = async () => {
            setLoading(true);
            try {
                // Note: The provided API endpoint for Ziyarat is not valid.
                // Using Duas as a placeholder. Replace with correct Ziyarat endpoint when available.
                const response = await fetch('https://api3.islamhouse.com/v3/paV29H2gm56kvLP/main/showall/books/showall/json?language=en&pageNum=1&limit=50');
                if (response.ok) {
                    const data = await response.json();
                    // Filter for items that might be Ziyarat-related for demonstration
                    const potentialZiyarats = data.data.filter(item => 
                        item.title.toLowerCase().includes('ziyarat') || 
                        item.title.toLowerCase().includes('visitation')
                    );
                    setZiyarats(potentialZiyarats.length > 0 ? potentialZiyarats : data.data.slice(0, 5)); // Fallback to show some data
                }
            } catch (error) {
                console.error("Failed to fetch Ziyarats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchZiyarats();
    }, []);

    const filteredZiyarats = ziyarats.filter(ziyarat =>
        ziyarat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedZiyarat) {
        return <ZiyaratDetail ziyarat={selectedZiyarat} onBack={() => setSelectedZiyarat(null)} />;
    }

    return (
        <div className="px-4 py-4 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-800 mb-2">Ziyarat Collection</h2>
                <p className="text-emerald-600">Visitations from IslamHouse</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search Ziyarat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 bg-white"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            ) : (
                <div className="space-y-4 pb-24">
                    {filteredZiyarats.length > 0 ? (
                        filteredZiyarats.map((ziyarat) => (
                            <ZiyaratCard key={ziyarat.id} ziyarat={ziyarat} onSelect={setSelectedZiyarat} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>No Ziyarat found with the provided API.</p>
                            <p className="text-sm">Displaying placeholder content.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}