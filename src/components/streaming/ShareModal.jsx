import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function ShareModal({ open, onOpenChange, streamTitle = "Live Stream", streamUrl = window.location.href }) {
  const handleNativeShare = async (platform) => {
    const text = `🔴 Live Now: ${streamTitle}\nWatch here: ${streamUrl}`;
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(streamUrl);
        toast.success("Link copied to clipboard!");
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to copy link");
      }
      return;
    }
    
    // Platform-specific sharing
    let shareUrl = '';
    
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(streamUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(streamUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "💬",
      color: "bg-green-500 hover:bg-green-600",
      action: () => handleNativeShare('whatsapp')
    },
    {
      name: "Telegram",
      icon: "📱",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => handleNativeShare('telegram')
    },
    {
      name: "Facebook",
      icon: "📘",
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => handleNativeShare('facebook')
    },
    {
      name: "Copy Link",
      icon: "🔗",
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => handleNativeShare('copy')
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-emerald-200">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Live Stream
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <p className="text-sm text-emerald-700 mb-4">Share this live stream with your community</p>
          
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option, index) => (
              <Button
                key={index}
                onClick={option.action}
                className={`${option.color} text-white flex items-center justify-center gap-2 h-12`}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium">{option.name}</span>
              </Button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
            <p className="text-xs text-emerald-600 mb-2">Direct Link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={streamUrl}
                readOnly
                className="flex-1 text-xs bg-white border border-emerald-200 rounded px-2 py-1"
              />
              <Button
                size="sm"
                onClick={() => handleNativeShare('copy')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}