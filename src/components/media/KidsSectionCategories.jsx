import React from "react";
import { Card } from "@/components/ui/card";
import { Play, Sparkles, BookOpen, Film } from "lucide-react";

const KIDS_CATEGORIES = [
  {
    id: "animated_stories",
    title: "Animated Stories",
    emoji: "🎬",
    icon: Sparkles,
    description: "Fun Islamic animations",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50"
  },
  {
    id: "kids_stories",
    title: "Kids Stories",
    emoji: "📚",
    icon: BookOpen,
    description: "Islamic stories for children",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
    gradient: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-50"
  },
  {
    id: "kids_movies",
    title: "Kids Movies",
    emoji: "🎥",
    icon: Film,
    description: "Islamic movies for kids",
    image: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=300&fit=crop",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50"
  }
];

export default function KidsSectionCategories({ onSelectCategory }) {
  return (
    <div className="relative">
      {/* Islamic Pattern Background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Cpath d='M30 30m-25,0a25,25 0 1,1 50,0a25,25 0 1,1 -50,0'/%3E%3Cpath d='M30 5v50M5 30h50'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">👶 Kids Section</h2>
        <p className="text-emerald-600 text-sm">Islamic content for little ones</p>
      </div>

      {/* Category Cards */}
      <div className="space-y-4 relative z-10">
        {KIDS_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`${category.bgColor} border-2 border-white/50 rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex items-center p-4">
                {/* Image/Icon Side */}
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg relative overflow-hidden`}>
                  <span className="text-5xl">{category.emoji}</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Content Side */}
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-bold text-emerald-800 mb-1">{category.title}</h3>
                  <p className="text-sm text-emerald-600 mb-2">{category.description}</p>
                  <div className="flex items-center text-xs text-emerald-500">
                    <Play className="w-3 h-3 mr-1" />
                    <span>Tap to explore</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Decorative Bar */}
              <div className={`h-1 bg-gradient-to-r ${category.gradient}`} />
            </Card>
          );
        })}
      </div>

      {/* Bottom Note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-emerald-500 bg-emerald-100 inline-block px-4 py-2 rounded-full">
          ✨ Safe & Educational Islamic Content
        </p>
      </div>
    </div>
  );
}