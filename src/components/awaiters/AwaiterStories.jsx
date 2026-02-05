import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles } from 'lucide-react';

export default function AwaiterStories() {
    const stories = [
        { 
            id: 1,
            title: "The Scholar's Dream", 
            excerpt: "A pious scholar saw the Imam (a.s.) in his dream and received guidance that changed his entire community...", 
            image: "https://images.unsplash.com/photo-1593095475958-52b8553ae4b5?q=80&w=800",
            category: "Dreams"
        },
        { 
            id: 2,
            title: "A Mother's Prayer", 
            excerpt: "A mother prayed for her lost son and found him through the blessings of Dua-e-Tawassul during Muharram...", 
            image: "https://images.unsplash.com/photo-1591948449749-2ce3c0852c42?q=80&w=800",
            category: "Miracles"
        },
        { 
            id: 3,
            title: "The Young Believer", 
            excerpt: "A young student dedicated his life to serving the community in anticipation of the Imam's return...", 
            image: "https://images.unsplash.com/photo-1618335829924-1c4b13dde289?q=80&w=800",
            category: "Service"
        },
        { 
            id: 4,
            title: "The Ziyarat Journey", 
            excerpt: "An elderly man's pilgrimage to Karbala revealed the true meaning of awaiting the Imam (a.s.)...", 
            image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800",
            category: "Ziyarat"
        }
    ];

    return (
        <div>
            <div className="flex items-center gap-2 mb-4 px-1">
                <Sparkles className="w-5 h-5" style={{color: '#FF0066'}} />
                <h3 className="text-lg font-bold" style={{ color: '#6A0066' }}>✨ Stories of Awaiters</h3>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {stories.map((story, index) => (
                    <Card 
                        key={index} 
                        className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                        style={{
                            boxShadow: `0 8px 32px rgba(106, 0, 102, 0.15)`,
                        }}
                    >
                        <div className="relative">
                            <img 
                                src={`${story.image}&auto=format&fit=crop&w=400&h=200`} 
                                className="h-40 w-full object-cover" 
                                alt={story.title}
                            />
                            <div 
                                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-t-2xl"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{backgroundColor: '#934790'}}>
                                    {story.category}
                                </span>
                            </div>
                        </div>
                        
                        <CardContent className="p-4">
                            <h4 className="font-bold mb-2 text-base" style={{color: '#6A0066'}}>
                                {story.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                                {story.excerpt}
                            </p>
                            <Link 
                                to={createPageUrl(`StoryDetail?id=${story.id}`)} 
                                className="flex items-center gap-1 text-sm font-semibold group"
                                style={{color: '#FF0066'}}
                            >
                                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Read More
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}