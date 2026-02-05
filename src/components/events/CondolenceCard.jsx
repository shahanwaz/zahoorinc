
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, User } from "lucide-react";

export default function CondolenceCard({ condolence, onOfferDua }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
      {condolence.image_url && (
        <div className="h-32 overflow-hidden rounded-t-2xl">
          <img
            src={condolence.image_url}
            alt={condolence.title}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800 leading-tight flex-1">
            {condolence.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-500">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{condolence.dua_count}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {condolence.message}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{condolence.user_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(condolence.created_date)}</span>
            </div>
          </div>

          <Button
            onClick={() => onOfferDua(condolence.id)}
            className="bg-gray-600 hover:bg-gray-700 text-white"
            size="sm"
          >
            <Heart className="w-4 h-4 mr-1" />
            Offer Dua
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center mt-4 opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
