import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, ChevronRight, Navigation, Star } from "lucide-react";

export default function NearbyHighlights() {
  const nearbyData = [
    {
      id: 1,
      name: "Masjid-e-Kufa",
      type: "Imambargah",
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1718680962024-0fa899e1815e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.8"
    },
    {
      id: 2,
      name: "Anjuman Haidari",
      type: "Community Center",
      distance: "2.0 km",
      image: "https://images.unsplash.com/photo-1559733891-440cc65b36d2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.6"
    },
    {
      id: 3,
      name: "Islamic Bookstore",
      type: "Shop",
      distance: "800m",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop",
      rating: "4.5"
    }
  ];

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-800">Nearby Highlights</h2>
        </div>
        <Link to={createPageUrl("Nearby")}>
          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {nearbyData.map((place) => (
          <div key={place.id} className="flex-shrink-0 w-56 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <img src={place.image} alt={place.name} className="w-full h-32 object-cover" />
            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm text-emerald-800">{place.name}</h4>
                  <p className="text-xs text-emerald-600">{place.type}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <Star className="w-3 h-3 fill-current" />
                  {place.rating}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-500">{place.distance}</span>
                <Button variant="outline" size="sm" className="h-7 px-3 border-emerald-300 text-emerald-700">
                  <Navigation className="w-3 h-3 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}