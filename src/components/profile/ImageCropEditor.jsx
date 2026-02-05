import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, ZoomIn, Check, X, Move } from 'lucide-react';

export default function ImageCropEditor({ imageSrc, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    drawImage();
  }, [rotation, zoom, brightness, contrast, position]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!img) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-size / 2 + position.x, -size / 2 + position.y);

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    const scale = Math.max(size / img.width, size / img.height);
    const x = (size - img.width * scale) / 2;
    const y = (size - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    ctx.restore();

    // Draw circle crop overlay
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      onSave(blob);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
        <h2 className="text-white font-semibold">Edit Profile Picture</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className="text-white hover:bg-white/10"
        >
          <Check className="w-5 h-5" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="rounded-full border-4 border-white shadow-2xl cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
            <Move className="w-3 h-3 inline mr-1" />
            Drag to reposition
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/50 p-4 space-y-4">
        {/* Zoom */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-white text-sm">
            <span className="flex items-center gap-2">
              <ZoomIn className="w-4 h-4" />
              Zoom
            </span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-white text-sm">
            <span className="flex items-center gap-2">
              <RotateCw className="w-4 h-4" />
              Rotation
            </span>
            <span>{rotation}°</span>
          </div>
          <Slider
            value={[rotation]}
            onValueChange={([value]) => setRotation(value)}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>

        {/* Brightness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-white text-sm">
            <span>☀️ Brightness</span>
            <span>{brightness}%</span>
          </div>
          <Slider
            value={[brightness]}
            onValueChange={([value]) => setBrightness(value)}
            min={50}
            max={150}
            step={1}
            className="w-full"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-white text-sm">
            <span>🎨 Contrast</span>
            <span>{contrast}%</span>
          </div>
          <Slider
            value={[contrast]}
            onValueChange={([value]) => setContrast(value)}
            min={50}
            max={150}
            step={1}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleSave}
          >
            <Check className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}