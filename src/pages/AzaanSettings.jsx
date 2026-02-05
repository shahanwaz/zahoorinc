import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Bell, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  MapPin, 
  Clock,
  Settings
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AzaanSettings() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  const [settings, setSettings] = useState({
    azaanNotifications: true,
    reminderBeforeAzaan: true,
    selectedVoice: "makkah",
    volume: [75],
    vibrateOnly: false,
    autoDetectLocation: true,
    manualLocation: "",
    prayers: {
      fajr: true,
      dhuhr: false,
      asr: true,
      maghrib: true,
      isha: true,
      jumuah: true
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const azaanVoices = [
    { value: "makkah", label: "Makkah Azaan", sample: "sample-makkah.mp3" },
    { value: "madinah", label: "Madinah Azaan", sample: "sample-madinah.mp3" },
    { value: "local", label: "Local Muezzin", sample: "sample-local.mp3" }
  ];

  const prayers = [
    { key: "fajr", name: "Fajr", icon: "🌅", time: "05:15" },
    { key: "dhuhr", name: "Dhuhr", icon: "☀️", time: "13:05" },
    { key: "asr", name: "Asr", icon: "🌤️", time: "16:30" },
    { key: "maghrib", name: "Maghrib", icon: "🌇", time: "18:45" },
    { key: "isha", name: "Isha", icon: "🌙", time: "20:15" },
    { key: "jumuah", name: "Jumu'ah", icon: "🕌", time: "13:00" }
  ];

  const handleToggleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrayerToggle = (prayerKey, value) => {
    setSettings(prev => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [prayerKey]: value
      }
    }));
  };

  const handleVolumeChange = (value) => {
    setSettings(prev => ({
      ...prev,
      volume: value
    }));
  };

  const handlePlayPreview = () => {
    if (isPlaying) {
      setIsPlaying(false);
      // In real app, would stop audio
      setTimeout(() => setIsPlaying(false), 1000);
    } else {
      setIsPlaying(true);
      // In real app, would play selected azaan sample
      setTimeout(() => setIsPlaying(false), 3000); // Mock 3 second preview
    }
  };

  const handleSave = () => {
    // In real app, would save settings to backend/local storage
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings({
      azaanNotifications: true,
      reminderBeforeAzaan: true,
      selectedVoice: "makkah",
      volume: [75],
      vibrateOnly: false,
      autoDetectLocation: true,
      manualLocation: "",
      prayers: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
        jumuah: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm border-emerald-200">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-emerald-50 mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <h1 className="text-xl font-bold text-emerald-800">Azaan Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-emerald-800">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-emerald-800">Enable Azaan Notifications</Label>
                <p className="text-xs text-emerald-600 mt-1">Get notified for prayer times</p>
              </div>
              <Switch
                checked={settings.azaanNotifications}
                onCheckedChange={(value) => handleToggleChange('azaanNotifications', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-emerald-800">Reminder Before Azaan</Label>
                <p className="text-xs text-emerald-600 mt-1">5 minutes before prayer time</p>
              </div>
              <Switch
                checked={settings.reminderBeforeAzaan}
                onCheckedChange={(value) => handleToggleChange('reminderBeforeAzaan', value)}
                disabled={!settings.azaanNotifications}
              />
            </div>
          </div>
        </div>

        {/* Select Azaan Voice */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-emerald-800">Select Azaan Voice</h2>
          </div>
          
          <div className="space-y-4">
            <Select 
              value={settings.selectedVoice} 
              onValueChange={(value) => handleToggleChange('selectedVoice', value)}
            >
              <SelectTrigger className="border-emerald-200">
                <SelectValue placeholder="Choose Azaan Voice" />
              </SelectTrigger>
              <SelectContent>
                {azaanVoices.map((voice) => (
                  <SelectItem key={voice.value} value={voice.value}>
                    {voice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPreview}
                className="border-emerald-200 hover:bg-emerald-50"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2 text-emerald-600" />
                ) : (
                  <Play className="w-4 h-4 mr-2 text-emerald-600" />
                )}
                {isPlaying ? "Stop Preview" : "Play Preview"}
              </Button>
            </div>
          </div>
        </div>

        {/* Prayer-wise Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-emerald-800">Prayer-wise Settings</h2>
          </div>
          
          <div className="space-y-3">
            {prayers.map((prayer, index) => (
              <div key={prayer.key}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{prayer.icon}</span>
                    <div>
                      <Label className="text-sm font-medium text-emerald-800">{prayer.name}</Label>
                      <p className="text-xs text-emerald-600">{prayer.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-emerald-50 h-8 w-8"
                    >
                      <Settings className="w-4 h-4 text-emerald-600" />
                    </Button>
                    <Switch
                      checked={settings.prayers[prayer.key]}
                      onCheckedChange={(value) => handlePrayerToggle(prayer.key, value)}
                      disabled={!settings.azaanNotifications}
                    />
                  </div>
                </div>
                {index < prayers.length - 1 && <Separator className="bg-emerald-100" />}
              </div>
            ))}
          </div>
        </div>

        {/* Volume & Sound Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-emerald-800">Volume & Sound Options</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-emerald-800">Azaan Volume</Label>
                <span className="text-sm text-emerald-600">{settings.volume[0]}%</span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-emerald-400" />
                <Slider
                  value={settings.volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="flex-1"
                  disabled={settings.vibrateOnly}
                />
                <Volume2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-emerald-800">Vibrate Only</Label>
                <p className="text-xs text-emerald-600 mt-1">Silent notifications with vibration</p>
              </div>
              <Switch
                checked={settings.vibrateOnly}
                onCheckedChange={(value) => handleToggleChange('vibrateOnly', value)}
              />
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-emerald-800">Location Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-emerald-800">Auto-detect Location</Label>
                <p className="text-xs text-emerald-600 mt-1">Use GPS for accurate prayer times</p>
              </div>
              <Switch
                checked={settings.autoDetectLocation}
                onCheckedChange={(value) => handleToggleChange('autoDetectLocation', value)}
              />
            </div>
            
            {!settings.autoDetectLocation && (
              <div>
                <Label className="text-sm font-medium text-emerald-800 mb-2 block">Manual Location</Label>
                <Input
                  placeholder="Enter your city name"
                  value={settings.manualLocation}
                  onChange={(e) => handleToggleChange('manualLocation', e.target.value)}
                  className="border-emerald-200"
                />
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={() => navigate('/prayer-times')}
            >
              View Prayer Times Page
            </Button>
          </div>
        </div>

        {/* Save & Reset Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6 border-gray-300 text-gray-600 hover:bg-gray-50 h-12"
          >
            Reset to Default
          </Button>
        </div>

        {/* Footer Note */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-sm text-emerald-700 text-center">
            These settings apply to all prayer notifications. You can manage daily timings from the Prayer Times page.
          </p>
        </div>
      </div>
    </div>
  );
}