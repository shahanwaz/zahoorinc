import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Upload, Square, Play, Loader2 } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function AddNoteModal({ open, onOpenChange, onSave }) {
  const [activeTab, setActiveTab] = useState("text");
  const [textNote, setTextNote] = useState({ title: "", content: "" });
  const [audioNote, setAudioNote] = useState({ title: "", file: null, isRecording: false });
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleTextSave = async () => {
    if (!textNote.content.trim()) return;
    
    setIsLoading(true);
    const finalTitle = textNote.title.trim() || textNote.content.split('\n')[0].substring(0, 50) + "...";
    
    await onSave({
      type: "text",
      title: finalTitle,
      content: textNote.content
    });
    
    setTextNote({ title: "", content: "" });
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleAudioSave = async () => {
    if (!audioNote.file) return;
    
    setIsLoading(true);
    try {
      const response = await UploadFile({ file: audioNote.file });
      
      await onSave({
        type: "audio",
        title: audioNote.title.trim() || `Audio Note ${new Date().toLocaleDateString()}`,
        content: audioNote.title,
        audio_url: response.file_url,
        audio_duration: audioNote.file.duration || 0
      });
      
      setAudioNote({ title: "", file: null, isRecording: false });
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setAudioNote(prev => ({ ...prev, file: audioFile, isRecording: false }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setAudioNote(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioNote(prev => ({ ...prev, file }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-bg max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-800">Add New Note</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="text">📝 Text Note</TabsTrigger>
            <TabsTrigger value="audio">🎤 Audio Note</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="text-title">Title (Optional)</Label>
              <Input
                id="text-title"
                value={textNote.title}
                onChange={(e) => setTextNote(prev => ({...prev, title: e.target.value}))}
                placeholder="Enter note title..."
                className="dialog-input"
              />
            </div>
            <div>
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                value={textNote.content}
                onChange={(e) => setTextNote(prev => ({...prev, content: e.target.value}))}
                placeholder="Write your note here..."
                className="dialog-input min-h-32"
              />
            </div>
            <Button 
              onClick={handleTextSave} 
              className="w-full primary-btn"
              disabled={!textNote.content.trim() || isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Text Note
            </Button>
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-4">
            <div>
              <Label htmlFor="audio-title">Title</Label>
              <Input
                id="audio-title"
                value={audioNote.title}
                onChange={(e) => setAudioNote(prev => ({...prev, title: e.target.value}))}
                placeholder="Enter audio note title..."
                className="dialog-input"
              />
            </div>
            
            <div className="border-2 border-dashed border-emerald-200 rounded-lg p-4 text-center">
              {audioNote.isRecording ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-red-600 font-medium">Recording...</p>
                  <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white">
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                </div>
              ) : audioNote.file ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-emerald-500 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">
                    Audio Ready: {audioNote.file.name}
                  </p>
                  <Button onClick={() => setAudioNote(prev => ({...prev, file: null}))} variant="outline">
                    Remove Audio
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center gap-3">
                    <Button onClick={startRecording} className="primary-btn">
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                    <Button variant="outline" onClick={() => document.getElementById('audio-upload').click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Audio
                    </Button>
                  </div>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleAudioSave} 
              className="w-full primary-btn"
              disabled={!audioNote.file || isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Audio Note
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}