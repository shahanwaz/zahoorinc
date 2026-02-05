import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Note } from "@/entities/Note";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Plus, SortAsc } from "lucide-react";

import AddNoteModal from "@/components/notes/AddNoteModal";
import NoteCard from "@/components/notes/NoteCard";
import NoteDetailView from "@/components/notes/NoteDetailView";

export default function Notes() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const filterAndSortNotes = useCallback(() => {
    let filtered = notes.filter(note =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort notes
    filtered = filtered.sort((a, b) => {
      // Pinned notes always come first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      
      if (sortBy === 'date') {
        return new Date(b.created_date) - new Date(a.created_date);
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setFilteredNotes(filtered);
  }, [notes, searchQuery, sortBy]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [filterAndSortNotes]);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      if (user) {
        const userNotes = await Note.filter({ user_id: user.id }, '-created_date');
        setNotes(userNotes);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const handleSaveNote = async (noteData) => {
    if (!currentUser) return;

    try {
      await Note.create({
        ...noteData,
        user_id: currentUser.id
      });
      loadData();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handlePinNote = async (noteId, isPinned) => {
    try {
      await Note.update(noteId, { is_pinned: isPinned });
      loadData();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await Note.delete(noteId);
        setShowDetailView(false);
        loadData();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleOpenNote = (note) => {
    setSelectedNote(note);
    setShowDetailView(true);
  };

  const handleEditNote = (note) => {
    // For now, close detail view - in future could open edit modal
    setShowDetailView(false);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AddNoteModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleSaveNote}
      />
      
      <NoteDetailView
        note={selectedNote}
        open={showDetailView}
        onOpenChange={setShowDetailView}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onPin={handlePinNote}
      />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm border-emerald-100">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-emerald-50"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          
          <h1 className="text-xl font-bold text-emerald-800">Bayaz / Notes</h1>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes List */}
      <div className="p-4 space-y-4 pb-24">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOpen={handleOpenNote}
              onPin={handlePinNote}
              onDelete={handleDeleteNote}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Plus className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-800">No Notes Yet</h3>
            <p className="text-emerald-600 mb-4">
              {searchQuery ? 'No notes match your search' : 'Start writing your thoughts and memories'}
            </p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="primary-btn"
            >
              Create Your First Note
            </Button>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6">
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 rounded-full primary-btn shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}