import React, { useState, useEffect, useCallback } from "react";
import { Note } from "@/entities/Note";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Plus, ChevronRight, Pin, Mic } from "lucide-react";

export default function NotesPreview({ currentUser }) {
  const [recentNotes, setRecentNotes] = useState([]);

  const loadNotes = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const notes = await Note.filter({ user_id: currentUser.id }, '-created_date', 3);
      setRecentNotes(notes);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  if (!currentUser) return null;

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-800">Your Bayaz</h2>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("Notes")}>
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </Link>
          <Link to={createPageUrl("Notes")}>
            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {recentNotes.length > 0 ? (
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {recentNotes.map((note) => (
            <Link key={note.id} to={createPageUrl("Notes")} className="flex-shrink-0">
              <div className="w-64 p-3 bg-white rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-emerald-800 line-clamp-1">
                    {note.title || 'Untitled Note'}
                  </h4>
                  <div className="flex items-center gap-1 text-emerald-600">
                    {note.is_pinned && <Pin className="w-3 h-3" />}
                    {note.type === 'audio' && <Mic className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-xs text-emerald-700 line-clamp-2">
                  {note.content || 'Audio note'}
                </p>
                <p className="text-xs text-emerald-500 mt-2">
                  {new Date(note.created_date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
          <p className="text-emerald-600 mb-3">Start writing your spiritual journey</p>
          <Link to={createPageUrl("Notes")}>
            <Button className="primary-btn" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create First Note
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}