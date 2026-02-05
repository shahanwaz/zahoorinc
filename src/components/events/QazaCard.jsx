import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandHeart, Calendar, Users, Clock, Coins } from "lucide-react";

export default function QazaCard({ post, onJoin, currentUser }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCompleted = post.status === 'completed';
  const slotsRemaining = post.participants_needed - post.participants_joined;

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-emerald-50 border-2 border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <HandHeart className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm text-yellow-900 font-medium">
              Posted by {post.poster_name}
            </span>
          </div>
          <Badge 
            className={`${
              isCompleted 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}
          >
            {isCompleted ? 'Completed' : 'Active'}
          </Badge>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-emerald-900 mb-2">
            {post.title}
          </h3>
          <p className="text-emerald-700 text-sm leading-relaxed">
            {post.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-emerald-800">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span>₹{post.hadiya_per_person.toLocaleString()} per person</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{slotsRemaining} of {post.participants_needed} slots left</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Valid till {formatDate(post.validity_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              {post.type === 'qaza_namaz' 
                ? `${post.days_count} days` 
                : `${post.quran_count} Qurans`
              }
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-yellow-200/70">
          <div className="text-sm text-yellow-700">
            Total Hadiya: ₹{post.total_hadiya.toLocaleString()}
          </div>
          <Button
            onClick={() => onJoin(post.id)}
            disabled={isCompleted || slotsRemaining === 0}
            className={`${
              isCompleted 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-700'
            } text-white font-semibold px-6`}
          >
            {isCompleted ? 'Completed' : slotsRemaining === 0 ? 'Full' : 'Join & Earn'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}