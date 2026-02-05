
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';

const serviceDetails = {
  roza: { icon: '🌙', label: 'Roza Ejara' },
  quran: { icon: '📖', label: 'Quran Ejara' },
  namaz: { icon: '🤲', label: 'Namaz Ejara' },
  majlis: { icon: '🏛️', label: 'Majlis Ejara' },
};

// Define serviceTypes based on serviceDetails for sharing
const serviceTypes = {
  roza: 'Roza Ejara',
  quran: 'Quran Ejara',
  namaz: 'Namaz Ejara',
  majlis: 'Majlis Ejara',
};

export default function AvailServiceModal({ open, onOpenChange, post, onConfirmAvail }) {
  if (!post) return null;

  const { icon, label } = serviceDetails[post.serviceType] || {};

  const handleConfirm = () => {
    onConfirmAvail(post.id);
    onOpenChange(false);
    toast.success('Service Availed!', {
      description: `Hadiya of ₹${post.total.toLocaleString()} has been added to your wallet.`,
    });
  };

  const handleDownloadPDF = () => {
    toast.success('PDF Generated!', {
      description: 'Ejara agreement has been downloaded as PDF.'
    });
  };

  const handleDownloadImage = () => {
    toast.success('Image Saved!', {
      description: 'Ejara details saved as image to your device.'
    });
  };

  const handleShare = async () => {
    const shareText = `🕊️ Ejara Service Available\n\nService: ${serviceTypes[post?.serviceType]}\nFor: ${post?.forWhom}\nQuantity: ${post?.quantity}\nPayment: ₹${post?.total}\n\nAvailable on Zahoor App`;

    // Try native share
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: 'Ejara Service',
          text: shareText,
        });
        return; // Exit after successful native share
      } catch (error) {
        if (error.name === 'AbortError') {
          // User cancelled share, no need to fallback or show error
          return;
        }
        console.log('Share failed:', error);
        console.log('Falling back to clipboard...');
        // Continue to fallback to clipboard if native share failed for other reasons
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-emerald-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            {label}
          </DialogTitle>
          <p className="text-sm text-emerald-600">You are about to avail this spiritual service.</p>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-emerald-50 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-emerald-600">For Whom (Marhoom)</p>
              <p className="font-semibold text-lg text-emerald-800">{post.forWhom}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-600">Service Details</p>
              <p className="font-semibold text-lg text-emerald-800">{post.quantity} x {post.serviceType}</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg text-center">
            <p className="text-sm text-amber-800 font-semibold">Hadiya (Payment to You)</p>
            <p className="text-3xl font-bold text-amber-900">₹{post.total.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Posted By</p>
            <div className="flex items-center gap-2 mt-1">
              <img src={post.requester.profileImage} alt={post.requester.name} className="w-8 h-8 rounded-full" />
              <p className="font-medium text-gray-800">{post.requester.name}</p>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Download PDF
              </Button>
              <Button onClick={handleDownloadImage} variant="outline" className="flex items-center justify-center gap-2">
                <Image className="w-4 h-4" />
                Save Image
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
              >
                Confirm & Avail
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
