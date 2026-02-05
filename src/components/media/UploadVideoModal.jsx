import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, Link, Image, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { MediaVideo } from "@/entities/MediaVideo";
import { base44 } from "@/api/base44Client";

const CATEGORIES = [
  { value: "majlis", label: "🎤 Majlis" },
  { value: "lecture", label: "🎓 Lecture" },
  { value: "duas", label: "🤲 Duas" },
  { value: "ziyarat", label: "🕌 Ziyarat" },
  { value: "nauha", label: "🖤 Nauha" },
  { value: "munqabat", label: "💚 Munqabat" },
  { value: "books", label: "📚 Books in PDF" },
  { value: "kids", label: "👶 Kids Section" },
  { value: "images", label: "🖼️ Images" },
  { value: "aza", label: "🖤 Aza" },
  { value: "quran_tafseer", label: "📖 Quran Tafseer" },
  { value: "history", label: "📜 History" },
  { value: "other", label: "📺 Other" }
];

const KIDS_SUBCATEGORIES = [
  { value: "animated_stories", label: "🎬 Animated Stories" },
  { value: "kids_stories", label: "📚 Kids Stories" },
  { value: "kids_movies", label: "🎥 Kids Movies" }
];

const IMAGES_SUBCATEGORIES = [
  { value: "eid_wishes", label: "🎉 Eid Wishes" },
  { value: "shahadat", label: "🖤 Shahadat" },
  { value: "viladat", label: "💚 Viladat" },
  { value: "special_days", label: "📅 Special Islamic Days" },
  { value: "imam_anniversary", label: "🌹 Imam Birth Anniversary" },
  { value: "general_islamic", label: "☪️ General Islamic" }
];

export default function UploadVideoModal({ open, onOpenChange, currentUser, onVideoUploaded }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    lecturer: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    duration: "",
    file_url: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlValidation, setUrlValidation] = useState({ status: null, message: "" });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      subcategory: "",
      lecturer: "",
      description: "",
      video_url: "",
      thumbnail_url: "",
      duration: "",
      file_url: ""
    });
    setUrlValidation({ status: null, message: "" });
  };

  const showSubcategory = formData.category === "kids" || formData.category === "images";
  const showFileUpload = formData.category === "books" || formData.category === "images";
  const showUrlInput = !showFileUpload || formData.category !== "images";

  const parseVideoUrl = (url) => {
    if (!url) return { source: null, videoId: null };

    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return { source: "youtube", videoId: ytMatch[1] };

    const spotifyTrackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (spotifyTrackMatch) return { source: "spotify", videoId: spotifyTrackMatch[1] };

    const spotifyEpisodeMatch = url.match(/spotify\.com\/episode\/([a-zA-Z0-9]+)/);
    if (spotifyEpisodeMatch) return { source: "spotify", videoId: spotifyEpisodeMatch[1] };

    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) return { source: "vimeo", videoId: vimeoMatch[1] };

    if (url.includes("facebook.com") || url.includes("fb.watch")) return { source: "facebook", videoId: null };
    if (url.includes("instagram.com")) return { source: "instagram", videoId: null };

    return { source: "other", videoId: null };
  };

  const validateAndParseUrl = (url) => {
    const parsed = parseVideoUrl(url);
    
    if (!url) {
      setUrlValidation({ status: null, message: "" });
      return;
    }

    if (parsed.source === "youtube" && parsed.videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
      setFormData(prev => ({ ...prev, thumbnail_url: thumbnailUrl }));
      setUrlValidation({ status: "success", message: "✓ Valid YouTube URL - Thumbnail auto-fetched" });
    } else if (parsed.source === "spotify") {
      setUrlValidation({ status: "success", message: "🎵 Valid Spotify URL detected" });
    } else if (parsed.source === "vimeo") {
      setUrlValidation({ status: "success", message: "✓ Valid Vimeo URL" });
    } else if (parsed.source === "facebook") {
      setUrlValidation({ status: "success", message: "✓ Facebook video detected" });
    } else if (parsed.source === "instagram") {
      setUrlValidation({ status: "success", message: "✓ Instagram video detected" });
    } else if (url.startsWith("http")) {
      setUrlValidation({ status: "warning", message: "⚠ Unknown source - Please verify URL" });
    } else {
      setUrlValidation({ status: "error", message: "✗ Invalid URL format" });
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, video_url: url }));
    validateAndParseUrl(url);
  };

  const handleFileUpload = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      if (fileType === "image") {
        setFormData(prev => ({ ...prev, file_url: file_url, thumbnail_url: file_url }));
      } else {
        setFormData(prev => ({ ...prev, file_url: file_url }));
      }
      toast.success(`${fileType === "pdf" ? "PDF" : "Image"} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!showFileUpload && !formData.video_url) {
      toast.error("Please enter a video URL");
      return;
    }

    if (showFileUpload && !formData.file_url && !formData.video_url) {
      toast.error("Please upload a file or enter a URL");
      return;
    }

    setLoading(true);
    try {
      const parsed = parseVideoUrl(formData.video_url);
      
      let mediaType = "video";
      if (formData.category === "books") mediaType = "pdf";
      else if (formData.category === "images") mediaType = "image";
      else if (parsed.source === "spotify") mediaType = "audio";

      await MediaVideo.create({
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory || null,
        lecturer: formData.lecturer,
        description: formData.description,
        video_url: formData.video_url || null,
        file_url: formData.file_url || null,
        thumbnail_url: formData.thumbnail_url,
        duration: formData.duration,
        source: formData.file_url ? "upload" : (parsed.source || "other"),
        media_type: mediaType,
        uploader_id: currentUser?.id,
        uploader_name: currentUser?.full_name || "Anonymous",
        view_count: 0,
        saved_by: []
      });

      toast.success("Media uploaded successfully!", {
        description: "Your content is now available in the library."
      });
      
      resetForm();
      onOpenChange(false);
      if (onVideoUploaded) onVideoUploaded();
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Failed to upload media");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) resetForm(); }}>
      <DialogContent className="sm:max-w-lg bg-white border-emerald-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-600" />
            Upload Majlis / Lecture / Media
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-emerald-700">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Majlis - Shahadat Imam Hussain (a.s.)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-emerald-700">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: "" })}>
              <SelectTrigger className="border-emerald-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory for Kids/Images */}
          {showSubcategory && (
            <div>
              <Label htmlFor="subcategory" className="text-emerald-700">Subcategory</Label>
              <Select value={formData.subcategory} onValueChange={(value) => setFormData({ ...formData, subcategory: value })}>
                <SelectTrigger className="border-emerald-200">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.category === "kids" ? KIDS_SUBCATEGORIES : IMAGES_SUBCATEGORIES).map((sub) => (
                    <SelectItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* File Upload for PDF/Images */}
          {showFileUpload && (
            <div>
              <Label className="text-emerald-700 flex items-center gap-2">
                {formData.category === "books" ? <FileText className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                {formData.category === "books" ? "Upload PDF" : "Upload Image"}
              </Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept={formData.category === "books" ? ".pdf" : "image/*"}
                  onChange={(e) => handleFileUpload(e, formData.category === "books" ? "pdf" : "image")}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-700">
                        {formData.file_url ? "File uploaded ✓" : "Click to upload"}
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Lecturer */}
          <div>
            <Label htmlFor="lecturer" className="text-emerald-700">Lecturer / Reciter Name</Label>
            <Input
              id="lecturer"
              placeholder="e.g., Maulana Ali Rizvi"
              value={formData.lecturer}
              onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          {/* Video URL */}
          {showUrlInput && (
            <div>
              <Label htmlFor="video_url" className="text-emerald-700 flex items-center gap-2">
                <Link className="w-4 h-4" />
                Media URL {!showFileUpload && "*"}
              </Label>
              <Input
                id="video_url"
                placeholder="YouTube, Spotify, Vimeo URL"
                value={formData.video_url}
                onChange={handleUrlChange}
                className={`border-emerald-200 focus:border-emerald-500 ${
                  urlValidation.status === "error" ? "border-red-300" : 
                  urlValidation.status === "success" ? "border-emerald-400" : ""
                }`}
              />
              {urlValidation.message && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${
                  urlValidation.status === "success" ? "text-emerald-600" :
                  urlValidation.status === "warning" ? "text-amber-600" : "text-red-600"
                }`}>
                  {urlValidation.status === "success" && <CheckCircle className="w-3 h-3" />}
                  {urlValidation.status === "error" && <AlertCircle className="w-3 h-3" />}
                  {urlValidation.message}
                </p>
              )}
            </div>
          )}

          {/* Thumbnail Preview */}
          {formData.thumbnail_url && (
            <div>
              <Label className="text-emerald-700">Thumbnail Preview</Label>
              <div className="mt-2 rounded-lg overflow-hidden border border-emerald-200">
                <img 
                  src={formData.thumbnail_url} 
                  alt="Thumbnail preview" 
                  className="w-full h-32 object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            </div>
          )}

          {/* Duration */}
          {!showFileUpload && (
            <div>
              <Label htmlFor="duration" className="text-emerald-700">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 45:00"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-emerald-700">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-emerald-200 focus:border-emerald-500 min-h-16"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => { onOpenChange(false); resetForm(); }}
            className="flex-1 border-emerald-300 text-emerald-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.category}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Add to Library
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}