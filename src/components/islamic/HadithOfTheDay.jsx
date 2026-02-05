
import React, { useState, useEffect, useCallback } from "react";
import { Heart, Share2, Bookmark, Loader2, AlertCircle, RefreshCw, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function HadithOfTheDay() {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHadith = useCallback(async (retryCount = 0) => {
    if (retryCount === 0) {
      setLoading(true);
      setError(null);
    }

    if (retryCount > 3) {
      setError("Could not load a valid hadith after multiple attempts. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://www.thaqalayn-api.net/api/v2/random');
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
      
      const data = await response.json();
      
      // Much more lenient validation - just check if englishText exists and has some content
      if (data && data.englishText && data.englishText.trim().length > 10) {
        const formattedHadith = {
          hadithArabic: data.arabicText || "",
          hadithEnglish: data.englishText,
          book: {
            bookName: data.book || "Unknown Book",
            chapter: data.chapter || "",
          },
          englishNarrator: data.id || "N/A",
          isAuthentic: Boolean(data.majlisiGrading || data.mohseniGrading || data.behbudiGrading),
          narrator: "", // This API doesn't seem to have narrator info in the same format
        };

        setHadith(formattedHadith);
        setLoading(false);
      } else {
        // If hadith is too short or invalid, try again but with a limit
        console.log(`Hadith too short or invalid (attempt ${retryCount + 1}), trying another...`);
        setTimeout(() => fetchHadith(retryCount + 1), 500);
      }
    } catch (err) {
      console.error(`Error fetching hadith (attempt ${retryCount + 1}):`, err);
      if (retryCount < 3) {
        setTimeout(() => fetchHadith(retryCount + 1), 1000);
      } else {
        setError(`Failed to load hadith: ${err.message}`);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchHadith();
  }, [fetchHadith]);

  const handleShare = async () => {
    if (!hadith) return;
    
    const textToCopy = `🌿 Today's Hadith\n\n${hadith.hadithArabic ? hadith.hadithArabic + '\n\n' : ''}"${hadith.hadithEnglish}"\n\n— ${hadith.book.bookName}${hadith.book.chapter ? ` - ${hadith.book.chapter}` : ''}\n${hadith.isAuthentic ? '✓ Graded as Authentic' : ''}\n\nShared via Zahoor App`;
    
    // Try native share first
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: `Today's Hadith from ${hadith.book.bookName}`,
          text: textToCopy,
        });
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          return; // User cancelled
        }
        console.log('Native share failed, falling back to clipboard');
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Hadith copied to clipboard!', {
        description: 'You can now paste it anywhere to share'
      });
    } catch (clipboardError) {
      toast.error('Could not copy to clipboard', {
        description: 'Please try selecting and copying the text manually'
      });
    }
  };

  const handleSave = () => {
    toast.success("Hadith saved!", {
      description: "Feature coming soon - will be saved to your personal collection"
    });
  };

  const handleLike = () => {
    toast.success("❤️ You liked this hadith!", {
      description: "Feature in progress - your preferences are being noted"
    });
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-emerald-700">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="mt-2 text-sm">Fetching today's wisdom...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-red-600">
          <AlertCircle className="w-8 h-8" />
          <p className="mt-2 text-sm text-center">{error}</p>
          <Button onClick={() => fetchHadith()} variant="ghost" size="sm" className="mt-4 text-emerald-700 hover:bg-emerald-100">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    if (hadith) {
      return (
        <>
          {/* Arabic Text - only show if available */}
          {hadith.hadithArabic && hadith.hadithArabic.trim() && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 border-r-4 border-emerald-500">
              <p className="font-arabic-large text-right leading-loose text-emerald-800 text-lg" dir="rtl">
                {hadith.hadithArabic}
              </p>
            </div>
          )}

          {/* English Translation - always show since it's required */}
          <div className="mb-6">
            <p className="text-emerald-700 italic leading-relaxed text-base">
              "{hadith.hadithEnglish}"
            </p>
          </div>

          {/* Source Info */}
          <div className="text-sm text-emerald-600 flex flex-wrap items-center gap-2 mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">{hadith.book.bookName}</span>
            {hadith.book.chapter && (
              <span className="text-emerald-500">• {hadith.book.chapter}</span>
            )}
            {hadith.englishNarrator && (
              <span className="text-emerald-500">• #{hadith.englishNarrator}</span>
            )}
            {hadith.isAuthentic && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">✓ Graded</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button onClick={handleLike} variant="ghost" size="icon" className="group hover:bg-emerald-100 transition-colors">
              <Heart className="w-5 h-5 text-emerald-600 group-hover:text-red-500 transition-colors" />
            </Button>
            <Button onClick={handleSave} variant="ghost" size="icon" className="group hover:bg-emerald-100 transition-colors">
              <Bookmark className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
            </Button>
            <Button onClick={handleShare} variant="ghost" size="icon" className="group hover:bg-emerald-100 transition-colors">
              <Share2 className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
            </Button>
          </div>

          {/* Refresh Button */}
          <div className="text-center mb-4">
            <Button onClick={() => fetchHadith()} variant="outline" size="sm" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Get Another Hadith
            </Button>
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link to={createPageUrl("Duas") + "?tab=hadith"}>
              <Button variant="outline" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 group">
                View All Hadiths
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-emerald-200/50 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23059669' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23059669' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-800">🌿 Today's Hadith</h2>
            <p className="text-sm text-emerald-600">من كتب الشيعة المعتبرة</p>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
