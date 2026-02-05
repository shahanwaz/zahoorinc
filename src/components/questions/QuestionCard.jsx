import React from "react";
import { MessageCircle, Eye, Clock, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Question } from "@/entities/Question";

export default function QuestionCard({ question, currentUser, onUpdate }) {
  const navigate = useNavigate();
  
  const categoryColors = {
    fiqh: "bg-blue-100 text-blue-700 border-blue-200",
    akhlaq: "bg-teal-100 text-teal-700 border-teal-200", 
    history: "bg-purple-100 text-purple-700 border-purple-200",
    quran: "bg-indigo-100 text-indigo-700 border-indigo-200",
    hadith: "bg-pink-100 text-pink-700 border-pink-200",
    general: "bg-gray-100 text-gray-700 border-gray-200",
    duas: "bg-green-100 text-green-700 border-green-200",
    community: "bg-orange-100 text-orange-700 border-orange-200"
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Don't render if no title or content
  if (!question.title && !question.content) {
    return null;
  }

  const handleClick = (e) => {
    // Only navigate if not clicking on interactive elements
    if (e.target.closest('.like-button')) {
      return;
    }
    
    // Store question data in sessionStorage for access on detail page
    sessionStorage.setItem(`question_${question.id}`, JSON.stringify(question));
    
    // Navigate to question detail page with dynamic ID
    navigate(createPageUrl(`QuestionDetail?id=${question.id}`));
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert("Please log in to like questions");
      return;
    }

    try {
      const currentLikes = question.likes || [];
      const hasLiked = currentLikes.includes(currentUser.id);
      
      let updatedLikes;
      if (hasLiked) {
        // Unlike
        updatedLikes = currentLikes.filter(id => id !== currentUser.id);
      } else {
        // Like
        updatedLikes = [...currentLikes, currentUser.id];
      }

      // Update in database if it's a real question (not dummy data)
      if (question.id && !question.id.startsWith('fiqh') && !question.id.startsWith('hist') && 
          !question.id.startsWith('duas') && !question.id.startsWith('comm') && 
          !question.id.startsWith('akhl') && !question.id.startsWith('quran') && 
          !question.id.startsWith('had') && !question.id.startsWith('gen')) {
        await Question.update(question.id, { likes: updatedLikes });
      }

      // Update local state
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error liking question:", error);
    }
  };

  const isLiked = currentUser && question.likes?.includes(currentUser.id);

  return (
    <Card 
      className="bg-white hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Header with Avatar and Meta */}
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={question.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(question.author_name || 'User')}&background=10b981&color=fff`} 
            alt={question.author_name} 
            className="w-10 h-10 rounded-full border-2 border-emerald-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-emerald-800 text-sm">{question.author_name}</span>
              <span className="text-xs text-gray-500">•</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatDate(question.created_date)}</span>
              </div>
            </div>
            <Badge className={`${categoryColors[question.category]} text-xs font-medium border`}>
              {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Question Title */}
        <h3 className="font-bold text-lg text-emerald-900 mb-2 leading-tight line-clamp-2">
          {question.title}
        </h3>

        {/* Question Content Preview */}
        {question.content && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
            {question.content}
          </p>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">{question.answer_count || 0}</span>
              <span className="text-gray-500">answers</span>
            </div>
            <button 
              onClick={handleLike}
              className={`like-button flex items-center gap-1.5 transition-colors ${
                isLiked ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-emerald-600' : ''}`} />
              <span className="font-medium">{question.likes?.length || 0}</span>
            </button>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{question.view_count || 0}</span>
            </div>
          </div>

          {question.is_answered && (
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium">
              ✓ Answered
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}