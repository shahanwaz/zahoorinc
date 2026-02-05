import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, Play, FileText, MoreVertical } from "lucide-react";

export default function NoteCard({ note, onOpen, onPin, onDelete }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPreview = (content, type) => {
    if (type === 'audio') return 'Tap to play audio note';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-l-4 ${
        note.is_pinned ? 'border-l-yellow-400 bg-yellow-50' : 'border-l-emerald-400'
      }`}
      onClick={() => onOpen(note)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {note.type === 'audio' ? (
                <Play className="w-4 h-4 text-emerald-600" />
              ) : (
                <FileText className="w-4 h-4 text-emerald-600" />
              )}
              {note.is_pinned && <Pin className="w-4 h-4 text-yellow-500" />}
            </div>
            <h3 className="font-semibold text-emerald-800 leading-tight">
              {note.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // Toggle pin/unpin
              onPin(note.id, !note.is_pinned);
            }}
            className="text-gray-400 hover:text-emerald-600 -mt-2 -mr-2"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {getPreview(note.content || '', note.type)}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {note.type === 'audio' ? '🎤 Audio' : '📝 Text'}
          </Badge>
          <span className="text-xs text-gray-500">
            {formatDate(note.created_date)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}