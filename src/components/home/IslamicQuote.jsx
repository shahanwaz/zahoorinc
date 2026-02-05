import React from "react";
import { Button } from "@/components/ui/button";
import { Quote, Share } from "lucide-react";

export default function IslamicQuote() {
  const quoteData = {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    translation: "Actions are but by intention",
    source: "Hadith - Sahih Bukhari",
    author: "Prophet Muhammad (SAWW)"
  };

  return (
    <div className="glassmorphism rounded-2xl p-4 bg-gradient-to-r from-emerald-100 to-emerald-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-800">Hadith of the Day</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
          <Share className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-lg font-arabic text-emerald-800 mb-3 leading-relaxed">
          {quoteData.arabic}
        </p>
        <p className="text-emerald-700 italic mb-2">"{quoteData.translation}"</p>
        <p className="text-sm text-emerald-600">{quoteData.source}</p>
        <p className="text-xs text-emerald-500 mt-1">— {quoteData.author}</p>
      </div>
    </div>
  );
}