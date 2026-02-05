
import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishCategory({ category, onBack }) {
  const [selectedWish, setSelectedWish] = useState(null);

  // Mock wish templates for each category
  const wishTemplates = {
    wiladat: [
      { id: 1, title: 'Wiladat Imam Ali (A.S.)', imageUrl: 'https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=400&h=400&fit=crop', event: 'Imam Ali (A.S.)' },
      { id: 2, title: 'Birth Anniversary', imageUrl: 'https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=400&h=400&fit=crop', event: 'Imam Ali (A.S.)' },
      { id: 3, title: 'Ya Ali Madad', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', event: 'Imam Ali (A.S.)' }
    ],
    shahadat: [
      { id: 4, title: 'Shahadat Imam Hussain (A.S.)', imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', event: 'Imam Hussain (A.S.)' },
      { id: 5, title: 'Ya Hussain (A.S.)', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', event: 'Imam Hussain (A.S.)' }
    ],
    eid: [
      { id: 6, title: 'Eid Mubarak', imageUrl: 'https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=400&h=400&fit=crop', event: 'Eid al-Fitr' },
      { id: 7, title: 'Eid al-Adha', imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop', event: 'Eid al-Adha' }
    ],
    muharram: [
      { id: 8, title: 'Muharram Mourning', imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop', event: 'Ashura' },
      { id: 9, title: 'Labbaik Ya Hussain', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', event: 'Ashura' }
    ]
  };

  const wishes = wishTemplates[category.id] || [];

  const handleShare = async (wish) => {
    // In real app, this would call backend API to generate branded image
    const shareText = `${wish.title}\n\nShared via Zahoor App\n${window.location.origin}`;
    
    // Try native share
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: wish.title,
          text: shareText,
        });
        return; // If native share was successful, stop here
      } catch (error) {
        if (error.name === 'AbortError') {
          // User cancelled the share operation
          return; 
        }
        console.error('Native share failed, attempting clipboard fallback:', error);
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard! You can now paste and share.');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Could not copy to clipboard. Please try sharing manually.');
    }
  };

  const handleDownload = (wish) => {
    // In real app, this would download the branded image
    console.log('Downloading wish:', wish);
    alert('Download feature will be available soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-emerald-50 mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-emerald-800">{category.name}</h1>
            <p className="text-sm text-emerald-600">{category.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {wishes.map((wish) => (
            <div key={wish.id} className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-square relative">
                <img
                  src={wish.imageUrl}
                  alt={wish.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm mb-2">{wish.title}</h3>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => handleDownload(wish)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleShare(wish)}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {wishes.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
            <p className="text-emerald-600">More wishes coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
