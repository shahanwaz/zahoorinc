
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Heart, Share2, Eye, ThumbsUp, 
  Brain, HelpingHand, MoreHorizontal, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TranslateButton from './TranslateButton';

export default function QuestionCard({ question, currentUser, onReaction, onShare, getRoleBadge }) {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const reactions = question.reactions || { like: [], love: [], insight: [], pray: [] };
  const totalReactions = Object.values(reactions).reduce((sum, arr) => sum + arr.length, 0);
  
  const reactionButtons = [
    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-400' },
    { type: 'love', icon: Heart, label: 'Love', color: 'text-red-400' },
    { type: 'insight', icon: Brain, label: 'Insight', color: 'text-purple-400' },
    { type: 'pray', icon: HelpingHand, label: 'Pray', color: 'text-emerald-400' }
  ];

  const getUserReaction = () => {
    if (!currentUser) return null;
    for (const [type, users] of Object.entries(reactions)) {
      if (users.includes(currentUser.id)) return type;
    }
    return null;
  };

  const userReaction = getUserReaction();
  const roleBadge = getRoleBadge(question.author_role);
  const BadgeIcon = roleBadge.icon;

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const truncateContent = (content, limit = 200) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + '...';
  };

  return (
    <Card className="bg-white dark:bg-black/40 backdrop-blur-xl border border-emerald-200 dark:border-emerald-800/30 hover:border-emerald-400 dark:hover:border-emerald-600/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={question.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(question.author_name)}&background=059669&color=fff`}
              alt={question.author_name}
              className="w-10 h-10 rounded-full border-2 border-emerald-600/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-900 dark:text-white">{question.author_name}</span>
                {BadgeIcon && (
                  <Badge className={`${roleBadge.color} text-xs px-2 py-1 flex items-center gap-1`}>
                    <BadgeIcon className="w-3 h-3" />
                    {roleBadge.label}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-300">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(question.created_date)}</span>
                <Badge variant="outline" className="border-emerald-300 dark:border-emerald-600/50 text-emerald-600 dark:text-emerald-300 text-xs">
                  {question.category}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TranslateButton content={question.title} language={question.language} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-emerald-500 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/30">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700">
                <DropdownMenuItem className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">
                  Report Post
                </DropdownMenuItem>
                <DropdownMenuItem className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">
                  Hide Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question Content */}
        <Link to={createPageUrl('QuestionDetail')} className="block group">
          <h3 className="text-lg font-semibold text-emerald-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
            {question.title}
          </h3>
          {question.content && (
            <p className="text-emerald-700 dark:text-emerald-100 leading-relaxed">
              {showFullContent ? question.content : truncateContent(question.content)}
              {question.content.length > 200 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFullContent(!showFullContent);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 ml-2 font-medium"
                >
                  {showFullContent ? 'Show less' : 'Read more'}
                </button>
              )}
            </p>
          )}
        </Link>

        {/* Media Preview */}
        {question.media_urls && question.media_urls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {question.media_urls.slice(0, 2).map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Question attachment"
                className="w-full h-32 object-cover rounded-lg border border-emerald-200 dark:border-emerald-800/30"
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-300 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{question.view_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{question.answer_count || 0} answers</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{totalReactions} reactions</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{question.share_count || 0} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-emerald-200 dark:border-emerald-800/30 pt-3">
          <div className="flex items-center gap-1">
            {reactionButtons.map((reaction) => {
              const ReactionIcon = reaction.icon;
              const count = reactions[reaction.type]?.length || 0;
              const isActive = userReaction === reaction.type;
              
              return (
                <Button
                  key={reaction.type}
                  variant="ghost"
                  size="sm"
                  onClick={() => onReaction(question.id, reaction.type)}
                  className={`flex items-center gap-1 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-800/30 ${
                    isActive ? reaction.color : 'text-emerald-600 dark:text-emerald-300'
                  }`}
                >
                  <ReactionIcon className="w-4 h-4" />
                  {count > 0 && <span>{count}</span>}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link to={createPageUrl('QuestionDetail') + `?id=${question.id}`}>
              <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/30">
                <MessageSquare className="w-4 h-4 mr-1" />
                Answer
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/30">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700">
                <DropdownMenuItem 
                  onClick={() => onShare(question.id, 'copy')}
                  className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700"
                >
                  📋 Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onShare(question.id, 'whatsapp')}
                  className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700"
                >
                  📱 WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onShare(question.id, 'telegram')}
                  className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700"
                >
                  ✈️ Telegram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
