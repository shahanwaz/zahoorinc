import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Pin, Edit, Trash2, Volume2 } from "lucide-react";

export default function NoteDetailView({ note, open, onOpenChange, onEdit, onDelete, onPin }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!note) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-bg max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-emerald-800 mb-2">
                {note.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {note.type === 'audio' ? '🎤 Audio Note' : '📝 Text Note'}
                </Badge>
                {note.is_pinned && (
                  <Badge className="text-xs bg-yellow-100 text-yellow-800">
                    📌 Pinned
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {formatDate(note.created_date)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Content */}
          {note.type === 'text' ? (
            <div className="prose prose-emerald max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {note.content}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-xl p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-emerald-600" />
              </div>
              
              {note.audio_url && (
                <>
                  <audio
                    ref={audioRef}
                    src={note.audio_url}
                    onEnded={handleAudioEnded}
                    className="hidden"
                  />
                  <Button
                    onClick={toggleAudio}
                    className="primary-btn"
                    size="lg"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'} Audio
                  </Button>
                </>
              )}
              
              {note.content && (
                <p className="text-sm text-emerald-700 italic">
                  {note.content}
                </p>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button
              onClick={() => onPin(note.id, !note.is_pinned)}
              variant="outline"
              size="sm"
              className="flex-1 border-emerald-200 hover:bg-emerald-50"
            >
              <Pin className="w-4 h-4 mr-2" />
              {note.is_pinned ? 'Unpin' : 'Pin'} Note
            </Button>
            
            <Button
              onClick={() => onEdit(note)}
              variant="outline"
              size="sm"
              className="flex-1 border-blue-200 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Note
            </Button>
            
            <Button
              onClick={() => onDelete(note.id)}
              variant="outline"
              size="sm"
              className="flex-1 border-red-200 hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}