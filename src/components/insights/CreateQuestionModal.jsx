import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { UploadFile } from '@/integrations/Core';

export default function CreateQuestionModal({ open, onOpenChange, onSubmit, currentUser, categories }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    language: 'en',
    tags: []
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Default categories if not provided
  const defaultCategories = [
    { value: "fiqh", label: "Fiqh", emoji: "📖" },
    { value: "history", label: "History", emoji: "📜" },
    { value: "duas", label: "Duas", emoji: "🤲" },
    { value: "community", label: "Community", emoji: "👥" },
    { value: "akhlaq", label: "Akhlaq", emoji: "💚" },
    { value: "quran", label: "Quran", emoji: "📕" },
    { value: "hadith", label: "Hadith", emoji: "📔" },
    { value: "general", label: "General", emoji: "❓" }
  ];

  const categoryOptions = categories || defaultCategories;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const newMediaUrls = results.map(result => result.file_url);
      
      setMediaFiles(prev => [...prev, ...newMediaUrls]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) return;
    
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        media_urls: mediaFiles,
        tags: formData.tags.filter(tag => tag.trim())
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: '',
        language: 'en',
        tags: []
      });
      setMediaFiles([]);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-900 border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-700 dark:text-emerald-400 text-xl">💡 Ask a Question</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Title */}
          <div>
            <Label className="text-emerald-600 dark:text-emerald-300 mb-2 block">Question Title *</Label>
            <Input
              placeholder="What would you like to know?"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-emerald-50 dark:bg-black/30 border-emerald-300 dark:border-emerald-700/50 text-emerald-900 dark:text-white placeholder-emerald-500 dark:placeholder-emerald-400/50"
              required
            />
          </div>

          {/* Question Details */}
          <div>
            <Label className="text-emerald-600 dark:text-emerald-300 mb-2 block">Question Details (Optional)</Label>
            <Textarea
              placeholder="Provide more context or details about your question..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="bg-emerald-50 dark:bg-black/30 border-emerald-300 dark:border-emerald-700/50 text-emerald-900 dark:text-white placeholder-emerald-500 dark:placeholder-emerald-400/50 min-h-24"
            />
          </div>

          {/* Category & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-emerald-600 dark:text-emerald-300 mb-2 block">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="bg-emerald-50 dark:bg-black/30 border-emerald-300 dark:border-emerald-700/50 text-emerald-900 dark:text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700">
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">
                      {cat.emoji} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-emerald-600 dark:text-emerald-300 mb-2 block">Language</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger className="bg-emerald-50 dark:bg-black/30 border-emerald-300 dark:border-emerald-700/50 text-emerald-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700">
                  <SelectItem value="en" className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">English</SelectItem>
                  <SelectItem value="ar" className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">Arabic</SelectItem>
                  <SelectItem value="ur" className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">Urdu</SelectItem>
                  <SelectItem value="fa" className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">Farsi</SelectItem>
                  <SelectItem value="hi" className="text-emerald-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-700">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <Label className="text-emerald-600 dark:text-emerald-300 mb-2 block">Attach Media (Optional)</Label>
            <div className="space-y-3">
              <input
                type="file"
                id="media-upload"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('media-upload').click()}
                className="w-full border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/30"
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images/Videos'}
              </Button>

              {/* Media Preview */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {mediaFiles.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded border border-emerald-300 dark:border-emerald-700/30"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || !formData.category || submitting}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              {submitting ? 'Publishing...' : 'Publish Question'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}