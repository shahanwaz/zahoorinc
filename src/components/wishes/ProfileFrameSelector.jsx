import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Download, Camera } from "lucide-react";

export default function ProfileFrameSelector({ frames }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserPhoto(url);
    }
  };

  const handleFrameApply = () => {
    if (selectedFrame && userPhoto) {
      // Simulate frame application
      alert(`Frame "${selectedFrame.name}" applied to your photo!`);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-bold text-emerald-800 mb-4">Profile Picture Frames</h2>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {frames.map((frame) => (
          <div key={frame.id} className="relative">
            <img 
              src={frame.preview} 
              alt={frame.name}
              className="w-full aspect-square rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <p className="text-white text-xs text-center px-1">{frame.name}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full primary-btn">
            <Camera className="w-4 h-4 mr-2" />
            Apply Frame to Photo
          </Button>
        </DialogTrigger>
        <DialogContent className="dialog-bg">
          <DialogHeader>
            <DialogTitle className="text-emerald-800">Apply Profile Frame</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Frame Selection */}
            <div>
              <h4 className="font-semibold mb-2 text-emerald-800">Choose a Frame:</h4>
              <div className="grid grid-cols-3 gap-2">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedFrame?.id === frame.id ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={frame.preview} alt={frame.name} className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h4 className="font-semibold mb-2 text-emerald-800">Upload Your Photo:</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {userPhoto ? (
                  <div className="relative">
                    <img src={userPhoto} alt="Your photo" className="w-24 h-24 mx-auto rounded-full object-cover" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserPhoto(null)}
                      className="mt-2"
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Upload your photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('photo-upload').click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <Button
              onClick={handleFrameApply}
              disabled={!selectedFrame || !userPhoto}
              className="w-full primary-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              Apply Frame & Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}