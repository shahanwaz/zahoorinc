
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share, Play, Copy } from "lucide-react";

export default function WishCard({ wish, type, onDownload, onShare, onCopyDua }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img 
          src={wish.thumbnail} 
          alt={wish.title}
          className="w-full h-32 object-cover"
        />
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white/90 rounded-full p-2">
              <Play className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {wish.duration}
            </span>
          </div>
        )}
        {type === 'gif' && (
          <Badge className="absolute top-2 left-2 bg-emerald-600 text-white">
            GIF
          </Badge>
        )}
      </div>
      
      <div className="p-3">
        <h4 className="font-semibold text-sm text-emerald-800 mb-1">{wish.title}</h4>
        <p className="text-xs text-emerald-600 mb-2">{wish.occasion}</p>
        
        {/* Dua Section */}
        <div className="bg-emerald-50 rounded-lg p-2 mb-3">
          <p className="text-xs text-right mb-1 font-arabic" dir="rtl">
            {wish.dua}
          </p>
          <p className="text-xs italic text-emerald-700">
            {wish.duaTranslation}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopyDua}
            className="h-6 p-1 mt-1 text-emerald-600"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Dua
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{wish.downloads} downloads</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
