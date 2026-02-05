import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Share2, CheckCircle } from 'lucide-react';
import CommentCard from './CommentCard';
import ReplyInput from './ReplyInput';

export default function AnswerCard({ answer }) {
  const [showComments, setShowComments] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [comments, setComments] = useState(answer.comments || []);

  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
  };
  
  const roleColors = {
    maulana: 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
    tutor: 'bg-blue-500/20 text-blue-700 border-blue-300',
    user: 'bg-gray-200 text-gray-700',
  };

  const handlePostComment = (content) => {
    const newComment = {
      id: `c${Date.now()}`,
      answer_id: answer.id,
      content,
      author_id: 'currentUser',
      author_name: 'Current User',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=C+U&background=random',
      created_date: new Date().toISOString(),
      likes: [],
    };
    setComments(prev => [newComment, ...prev]);
    setShowReplyInput(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4">
      <div className="flex gap-4">
        <img src={answer.author_avatar} alt={answer.author_name} className="w-10 h-10 rounded-full mt-1" />
        <div className="flex-1">
          {/* Author and Best Answer Badge */}
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-gray-800">{answer.author_name}</span>
              <Badge variant="outline" className={`capitalize text-xs ml-2 ${roleColors[answer.author_role]}`}>{answer.author_role}</Badge>
            </div>
            {answer.is_best_answer && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" /> Best Answer
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2">{timeAgo(answer.created_date)}</p>

          {/* Answer Content */}
          <p className="text-gray-700 leading-relaxed mb-3">{answer.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-emerald-50">
              <ThumbsUp className="w-4 h-4" /> {answer.likes.length}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReplyInput(!showReplyInput)} className="flex items-center gap-1 hover:bg-emerald-50">
              <MessageSquare className="w-4 h-4" /> Reply
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-emerald-50">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3">
              <ReplyInput onSubmit={handlePostComment} placeholder="Write your comment..." />
            </div>
          )}

          {/* Comments Section */}
          {comments.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
              {comments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}