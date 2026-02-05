import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';

export default function CommentCard({ comment }) {
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
        maulana: 'bg-yellow-100 text-yellow-700',
        tutor: 'bg-blue-100 text-blue-700',
        user: 'bg-gray-100 text-gray-600',
    };

    return (
        <div className="flex gap-3">
            <div className="w-full h-full border-l-2 border-gray-200 pl-3 ml-5">
                <div className="flex gap-2">
                    <img src={comment.author_avatar} alt={comment.author_name} className="w-8 h-8 rounded-full" />
                    <div className="flex-1 bg-gray-50 rounded-lg p-2.5">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-semibold text-sm text-gray-800">{comment.author_name}</span>
                                <Badge variant="outline" className={`capitalize text-xs ml-2 h-5 border-none ${roleColors[comment.author_role]}`}>{comment.author_role}</Badge>
                            </div>
                            <span className="text-xs text-gray-400">{timeAgo(comment.created_date)}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Button variant="ghost" size="sm" className="h-6 px-1 flex items-center gap-1 text-xs">
                                <ThumbsUp className="w-3 h-3" /> {comment.likes.length}
                            </Button>
                            ·
                            <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                                Reply
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}