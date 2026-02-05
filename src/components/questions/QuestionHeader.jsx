import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Share2, Bookmark, MessageSquare, Eye } from 'lucide-react';

export default function QuestionHeader({ question }) {
  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };
  
  const roleColors = {
    maulana: 'bg-yellow-500 text-white',
    tutor: 'bg-blue-500 text-white',
    user: 'bg-gray-200 text-gray-700',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-200/50 p-5">
      {/* Category and time */}
      <div className="flex justify-between items-center mb-3">
        <Badge className="bg-emerald-100 text-emerald-800 capitalize">{question.category}</Badge>
        <span className="text-xs text-gray-500">{timeAgo(question.created_date)}</span>
      </div>

      {/* Title and Content */}
      <h1 className="text-2xl font-bold text-emerald-900 mb-2">{question.title}</h1>
      <p className="text-gray-700 leading-relaxed mb-4">{question.content}</p>

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-5">
        <img src={question.author_avatar} alt={question.author_name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold text-gray-800">{question.author_name}</p>
          <Badge className={`capitalize text-xs h-5 ${roleColors[question.author_role]}`}>{question.author_role}</Badge>
        </div>
      </div>
      
      {/* Stats and Actions */}
      <div className="border-t border-gray-100 pt-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4"/> {question.likes.length} Likes</span>
            <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4"/> {question.answer_count} Answers</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4"/> {question.view_count} Views</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-emerald-50 hover:text-emerald-600">
              <Share2 className="w-5 h-5"/>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-emerald-50 hover:text-emerald-600">
              <Bookmark className="w-5 h-5"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}