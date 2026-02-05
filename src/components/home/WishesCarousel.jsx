import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gift, ChevronRight, Download, Share } from "lucide-react";

export default function WishesCarousel() {
  const wishesData = [
    {
      id: 1,
      title: "Ya Ali Madad",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=250&fit=crop",
      occasion: "Imam Ali Birthday",
      type: "image"
    },
    {
      id: 2,
      title: "Labbaik Ya Hussain",
      thumbnail: "https://images.unsplash.com/photo-1718680962024-0fa899e1815e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      occasion: "Ashura",
      type: "gif"
    },
    {
      id: 3,
      title: "Eid Mubarak",
      thumbnail: "https://plus.unsplash.com/premium_photo-1676232731765-71242ab4a6be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      occasion: "Eid ul Fitr",
      type: "video"
    }
  ];

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-800">Wishes & Celebrations</h2>
        </div>
        <Link to={createPageUrl("WishesCelebrations")}>
          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {wishesData.map((wish) => (
          <div key={wish.id} className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative">
              <img src={wish.thumbnail} alt={wish.title} className="w-full h-32 object-cover" />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                {wish.type}
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm text-emerald-800 mb-1">{wish.title}</h4>
              <p className="text-xs text-emerald-600 mb-3">{wish.occasion}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="flex-1 h-8 border-emerald-300 text-emerald-700">
                  <Download className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 border-emerald-300 text-emerald-700">
                  <Share className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}