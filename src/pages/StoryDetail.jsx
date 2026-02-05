
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart, Share2, Bookmark, Sparkles, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StoryDetail() {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [story, setStory] = useState(null);
    const [allStories, setAllStories] = useState([]);

    useEffect(() => {
        // Get story ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const storyId = urlParams.get('id');
        
        // Mock story data - in real app would fetch from backend
        const stories = {
            '1': {
                id: 1,
                title: "The Scholar's Dream",
                category: "Dreams",
                image: "https://images.unsplash.com/photo-1593095475958-52b8553ae4b5?q=80&w=800",
                content: `It was during the blessed nights of Ramadan when Hujjat-ul-Islam Syed Ahmad had a vivid dream that would change not only his life but the lives of hundreds in his community.

In his dream, he found himself in a vast, luminous garden where every flower seemed to recite the name of Allah. As he walked deeper into this celestial paradise, he encountered a figure whose face radiated divine light - it was Imam al-Mahdi (may Allah hasten his reappearance).

The Imam (a.s.) spoke to him with a voice that resonated in his heart: "O my faithful servant, the time has come to prepare my community. Teach them the true meaning of awaiting - it is not passive hope, but active preparation through knowledge, charity, and unity."

When Syed Ahmad awoke, tears of joy streamed down his face. He immediately began organizing weekly study circles, feeding the poor every Friday, and bringing together the scattered Shia families in his city.

Within months, what was once a divided community became a beacon of Islamic brotherhood. The local Imambargah became a center not just for worship, but for education, social welfare, and spiritual growth.

Years later, when asked about the secret of his success, Syed Ahmad would always say: "The Imam (a.s.) guides those who truly await him. Our duty is to make ourselves worthy of his guidance."`,
                author: "Submitted by Fatima Zahra",
                submittedDate: "2024-12-15",
                likes: 342,
                shares: 89,
                excerpt: "A pious scholar saw the Imam (a.s.) in his dream and received guidance that changed his entire community..."
            },
            '2': {
                id: 2,
                title: "A Mother's Prayer",
                category: "Miracles",
                image: "https://images.unsplash.com/photo-1591948449749-2ce3c0852c42?q=80&w=800",
                content: `Bibi Khadija had not seen her son Ali for three years. He had left home after a family dispute and completely cut off contact. As a devoted mother and believer, she never stopped praying for his safe return.

Every night after her prayers, she would recite Dua-e-Tawassul with such devotion that neighbors could hear her tearful supplications. "Ya Ali, ya Hussein, ya Fatima Zahra, bring my son back to the right path," she would cry.

During the month of Muharram, as she participated in the majalis of Imam Hussein (a.s.), her heart felt an unusual peace. On the 10th night of Muharram, after the special ziyarat, she made one final, heartfelt dua.

The very next morning, there was a knock on her door. It was Ali, transformed - his face glowing with the light of tawbah (repentance). He fell to his mother's feet, seeking forgiveness.

"Ami," he said, "I saw Imam Hussein (a.s.) in my dream last night. He told me that a mother's tears for her child reach the Arsh of Allah, and that I should return to you and to the right path."

From that day forward, Ali became one of the most active members of their local Imambargah, dedicating his life to serving the community and preparing for the Imam's (a.s.) return.

Bibi Khadija's story spread throughout their city, inspiring many mothers to never lose hope and continue their duas for their children.`,
                author: "Submitted by Mohammad Hasan",
                submittedDate: "2024-11-28",
                likes: 567,
                shares: 134,
                excerpt: "A mother prayed for her lost son and found him through the blessings of Dua-e-Tawassul during Muharram..."
            },
            '3': {
                id: 3,
                title: "The Young Believer",
                category: "Service",
                image: "https://images.unsplash.com/photo-1618335829924-1c4b13dde289?q=80&w=800",
                content: `At only 19 years old, Hussain Raza decided that waiting for Imam al-Mahdi (a.s.) meant more than just praying - it meant becoming the change he wanted to see in the world.

Living in a small town where the Shia community was scattered and disconnected, Hussain took it upon himself to unite his community. He started small - organizing weekly Quran study sessions in his home, teaching children the basics of Islamic history, and helping elderly community members with their daily needs.

His dedication caught the attention of local families, and soon his home became too small for the gatherings. The community came together to rent a small space that they transformed into a makeshift Imambargah.

What made Hussain special was his innovative approach. He used social media to connect young Shias, organized blood donation drives during Muharram, and created a WhatsApp network to help community members in emergencies.

His initiative "313 Ready" - named after the companions who will join Imam al-Mahdi (a.s.) - became a model for other cities. The group focused on three pillars: Knowledge (studying Islamic sciences), Service (helping the community), and Preparation (developing skills needed for a just society).

When asked about his motivation, Hussain would say: "The Imam (a.s.) will return to a prepared ummah. We are not waiting passively - we are preparing actively. Every good deed, every act of service, every moment of learning brings us closer to becoming worthy of his era."

Today, his community has grown to over 500 active families, with multiple educational programs, welfare initiatives, and spiritual development circles - all inspired by one young man's vision of true intizar (awaiting).`,
                author: "Submitted by Zainab Ali",
                submittedDate: "2024-12-08",
                likes: 892,
                shares: 276,
                excerpt: "A young student dedicated his life to serving the community in anticipation of the Imam's return..."
            }
        };

        setStory(stories[storyId] || stories['1']);
        setAllStories(Object.values(stories));
    }, []);

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleShare = async () => {
        const shareData = {
            title: story.title,
            text: story.excerpt,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // Handle cases where sharing is denied or fails
                if (err.name !== 'AbortError') {
                    console.error("Share failed, falling back to clipboard:", err);
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Sharing is unavailable. Link copied to clipboard!');
                    } catch (copyErr) {
                        console.error("Clipboard fallback failed:", copyErr); // Corrected from copyHandler to copyErr
                        alert('Could not share or copy the link.');
                    }
                }
            }
        } else {
            // Fallback for browsers that do not support the Web Share API
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            } catch (copyErr) {
                console.error("Clipboard fallback failed:", copyErr); // Corrected from copyHandler to copyErr
                alert('Could not copy the link.');
            }
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    if (!story) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b" style={{borderColor: '#E8D4B7'}}>
                <div className="flex items-center justify-between p-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-pink-50">
                        <ArrowLeft className="w-5 h-5" style={{ color: '#6A0066' }} />
                    </Button>
                    <h1 className="text-lg font-bold flex-1 text-center mx-4 truncate" style={{ color: '#6A0066' }}>
                        {story.title}
                    </h1>
                    <div className="w-10" />
                </div>
            </div>

            {/* Content */}
            <div className="relative">
                {/* Hero Image */}
                <div className="relative h-64 overflow-hidden">
                    <img 
                        src={`${story.image}&auto=format&fit=crop&w=800&h=400`}
                        className="w-full h-full object-cover"
                        alt={story.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/90 text-purple-700 mb-2">
                            {story.category}
                        </Badge>
                        <h1 className="text-2xl font-bold leading-tight" style={{color: 'white'}}>
                            {story.title}
                        </h1>
                    </div>
                </div>

                {/* Story Content */}
                <div className="p-4 space-y-6">
                    {/* Story Meta */}
                    <div className="flex items-center justify-between text-sm" style={{color: '#934790'}}>
                        <span>{story.author}</span>
                        <span>{new Date(story.submittedDate).toLocaleDateString()}</span>
                    </div>

                    {/* Decorative Divider */}
                    <div className="flex items-center justify-center">
                        <div className="h-px bg-gradient-to-r from-transparent via-cream-beige to-transparent flex-1" />
                        <Sparkles className="w-5 h-5 mx-4" style={{color: '#FF0066'}} />
                        <div className="h-px bg-gradient-to-l from-transparent via-cream-beige to-transparent flex-1" />
                    </div>

                    {/* Story Text */}
                    <div className="prose prose-lg max-w-none">
                        {story.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-base leading-relaxed mb-4" style={{color: '#333333'}}>
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Another Decorative Divider */}
                    <div className="flex items-center justify-center py-4">
                        <div className="h-px bg-gradient-to-r from-transparent via-cream-beige to-transparent flex-1" />
                        <div className="px-4">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#FF0066'}} />
                        </div>
                        <div className="h-px bg-gradient-to-l from-transparent via-cream-beige to-transparent flex-1" />
                    </div>

                    {/* Engagement Section */}
                    <div className="glassmorphism rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleLike}
                                    className="flex items-center gap-2 transition-colors"
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-500'}`} />
                                    <span className="text-sm font-medium" style={{color: isLiked ? '#FF0066' : '#934790'}}>
                                        {story.likes + (isLiked ? 1 : 0)}
                                    </span>
                                </button>
                                
                                <button 
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                    <span className="text-sm font-medium">{story.shares}</span>
                                </button>
                            </div>

                            <button 
                                onClick={handleBookmark}
                                className="transition-colors"
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'}`} />
                            </button>
                        </div>

                        <Button className="w-full primary-btn">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Submit Your Story
                        </Button>
                    </div>

                    {/* Related Stories Suggestion */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4" style={{color: '#6A0066'}}>More Inspiring Stories</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {allStories.filter(s => s.id !== story.id).slice(0, 2).map((relatedStory) => (
                                <Link 
                                    key={relatedStory.id}
                                    to={createPageUrl(`StoryDetail?id=${relatedStory.id}`)}
                                    className="block"
                                >
                                    <div className="flex gap-3 p-3 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                                        <img 
                                            src={`${relatedStory.image}&auto=format&fit=crop&w=200&h=150`}
                                            className="w-16 h-16 rounded-lg object-cover"
                                            alt={relatedStory.title}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm mb-1" style={{color: '#6A0066'}}>
                                                {relatedStory.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {relatedStory.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
