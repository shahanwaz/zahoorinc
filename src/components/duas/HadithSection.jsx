import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, RefreshCw, Loader2, AlertCircle, Globe } from 'lucide-react';

export default function HadithSection() {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const languages = [
    { code: "english", label: "English", field: "englishText" },
    { code: "arabic", label: "العربية (Arabic)", field: "arabicText" },
    { code: "french", label: "Français (French)", field: "frenchText" },
  ];

  const fetchHadiths = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch multiple hadiths by making several requests to the random endpoint
      const hadithPromises = Array.from({ length: 10 }, () => 
        fetch('https://www.thaqalayn-api.net/api/v2/random').then(res => res.json())
      );
      
      const hadithResponses = await Promise.all(hadithPromises);
      
      // Filter out any invalid responses and format them
      const validHadiths = hadithResponses
        .filter(data => data && (data.englishText || data.arabicText || data.frenchText))
        .map(data => ({
          id: data.id || Math.random().toString(),
          englishText: data.englishText || "",
          arabicText: data.arabicText || "",
          frenchText: data.frenchText || "",
          book: data.book || "Unknown Book",
          chapter: data.chapter || "",
          author: data.author || "",
          translator: data.translator || "",
          majlisiGrading: data.majlisiGrading,
          mohseniGrading: data.mohseniGrading,
          behbudiGrading: data.behbudiGrading,
        }));

      setHadiths(validHadiths);
    } catch (err) {
      console.error("Error fetching hadiths:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHadiths();
  }, []);

  const getCurrentLanguageField = () => {
    return languages.find(lang => lang.code === selectedLanguage)?.field || "englishText";
  };

  const renderHadithContent = () => {
    if (loading) {
      return <div className="text-center p-8"><Loader2 className="animate-spin inline-block w-8 h-8 text-emerald-500" /></div>;
    }
    if (error) {
      return <div className="text-center p-8 text-red-600"><AlertCircle className="inline-block w-6 h-6 mr-2" /> {error}</div>;
    }
    if (hadiths.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4">No hadiths loaded yet.</p>
          <Button onClick={fetchHadiths} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Load Hadiths
          </Button>
        </div>
      );
    }

    const languageField = getCurrentLanguageField();

    return hadiths.map((hadith) => {
      const translationText = hadith[languageField];
      
      // Skip hadith if selected language is not available
      if (!translationText || translationText.trim() === "") {
        return null;
      }

      return (
        <div key={hadith.id} className="p-4 border-b last:border-b-0 border-emerald-100">
          {/* Always show Arabic if available and not selected language */}
          {hadith.arabicText && selectedLanguage !== "arabic" && (
            <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
              <p className="font-arabic text-right text-lg leading-loose text-emerald-800" dir="rtl">
                {hadith.arabicText}
              </p>
            </div>
          )}
          
          {/* Selected language text */}
          <p className={`mb-3 leading-relaxed ${
            selectedLanguage === "arabic" ? "font-arabic text-right text-lg text-emerald-800" : "text-gray-600 italic"
          }`} dir={selectedLanguage === "arabic" ? "rtl" : "ltr"}>
            {selectedLanguage === "arabic" ? translationText : `"${translationText}"`}
          </p>
          
          {/* Source info */}
          <div className="text-xs text-emerald-600 space-y-1">
            <div>
              <span className="font-medium">{hadith.book}</span>
              {hadith.chapter && <span> • {hadith.chapter}</span>}
              <span> • Hadith #{hadith.id}</span>
            </div>
            {hadith.translator && selectedLanguage !== "arabic" && (
              <div className="text-emerald-500">
                Translated by: {hadith.translator}
              </div>
            )}
            {(hadith.majlisiGrading || hadith.mohseniGrading || hadith.behbudiGrading) && (
              <div className="flex gap-2 mt-2">
                {hadith.majlisiGrading && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Majlisi: {hadith.majlisiGrading}
                  </span>
                )}
                {hadith.mohseniGrading && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Mohseni: {hadith.mohseniGrading}
                  </span>
                )}
                {hadith.behbudiGrading && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Behbudi: {hadith.behbudiGrading}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }).filter(Boolean); // Remove null entries
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-emerald-200 bg-emerald-50/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-emerald-800">Hadith Collection</h2>
              <p className="text-sm text-gray-500">من كتب الشيعة المعتبرة</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Load Button */}
            <Button 
              onClick={fetchHadiths}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Loading...' : 'Load New Hadiths'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {renderHadithContent()}
      </div>
      
      {hadiths.length > 0 && (
        <div className="p-4 bg-emerald-50 text-center">
          <p className="text-sm text-emerald-700">
            Showing {hadiths.filter(h => h[getCurrentLanguageField()] && h[getCurrentLanguageField()].trim() !== "").length} hadiths in {languages.find(l => l.code === selectedLanguage)?.label}
          </p>
        </div>
      )}
    </div>
  );
}