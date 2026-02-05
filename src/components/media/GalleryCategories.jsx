import React from "react";
import { Card } from "@/components/ui/card";

const GALLERY_CATEGORIES = [
  {
    id: "eid_wishes",
    title: "Eid Wishes",
    emoji: "🎉",
    image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400&h=400&fit=crop",
    gradient: "from-amber-400/80 to-yellow-500/80"
  },
  {
    id: "shahadat",
    title: "Shahadat",
    emoji: "🖤",
    image: "https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=400&h=400&fit=crop",
    gradient: "from-gray-700/80 to-gray-900/80"
  },
  {
    id: "viladat",
    title: "Viladat",
    emoji: "💚",
    image: "https://images.unsplash.com/photo-1583592823727-48a071844d5a?w=400&h=400&fit=crop",
    gradient: "from-emerald-500/80 to-green-600/80"
  },
  {
    id: "special_days",
    title: "Special Islamic Days",
    emoji: "📅",
    image: "https://images.unsplash.com/photo-1610190138542-b92de2b5b3a4?w=400&h=400&fit=crop",
    gradient: "from-blue-500/80 to-indigo-600/80"
  },
  {
    id: "imam_anniversary",
    title: "Imam Birth Anniversary",
    emoji: "🌹",
    image: "https://images.unsplash.com/photo-1518173946687-a4c2f0e1f2d5?w=400&h=400&fit=crop",
    gradient: "from-rose-500/80 to-pink-600/80"
  },
  {
    id: "general_islamic",
    title: "General Islamic",
    emoji: "☪️",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop",
    gradient: "from-teal-500/80 to-emerald-600/80"
  }
];

export default function GalleryCategories({ onSelectCategory }) {
  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">🖼️ Gallery</h2>
        <p className="text-emerald-600 text-sm">Beautiful Islamic images & wallpapers</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4">
        {GALLERY_CATEGORIES.map((category) => (
          <Card
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="relative overflow-hidden rounded-2xl cursor-pointer group border-2 border-amber-200/50 hover:border-amber-400 transition-all duration-300 hover:shadow-xl aspect-square"
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`} />
            
            {/* Gold Border Glow on Hover */}
            <div className="absolute inset-0 border-2 border-amber-400/0 group-hover:border-amber-400/50 rounded-2xl transition-all duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <span className="text-3xl mb-2">{category.emoji}</span>
              <h3 className="text-white font-bold text-sm leading-tight drop-shadow-lg">
                {category.title}
              </h3>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-all duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                <span className="text-amber-600 font-bold text-lg">→</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-amber-600 bg-amber-100 inline-block px-4 py-2 rounded-full border border-amber-200">
          🌟 Download & Share Beautiful Islamic Art
        </p>
      </div>
    </div>
  );
}