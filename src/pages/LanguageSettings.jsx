import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Globe, AlignLeft, AlignRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LanguageSettings() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    language: "english",
    enableRTL: false
  });

  const languages = [
    { value: "english", label: "English", nativeName: "English", rtlSupport: false },
    { value: "urdu", label: "Urdu", nativeName: "اردو", rtlSupport: true },
    { value: "arabic", label: "Arabic", nativeName: "العربية", rtlSupport: true },
    { value: "hindi", label: "Hindi", nativeName: "हिन्दी", rtlSupport: false },
    { value: "gujarati", label: "Gujarati", nativeName: "ગુજરાતી", rtlSupport: false },
    { value: "farsi", label: "Persian", nativeName: "فارسی", rtlSupport: true },
    { value: "turkish", label: "Turkish", nativeName: "Türkçe", rtlSupport: false },
    { value: "indonesian", label: "Indonesian", nativeName: "Bahasa Indonesia", rtlSupport: false }
  ];

  const sampleTexts = {
    english: "Welcome to Zahoor - Connecting Hearts, Strengthening Faith",
    urdu: "ظہور میں خوش آمدید - دلوں کو جوڑنا، ایمان کو مضبوط بنانا",
    arabic: "مرحباً بكم في ظهور - ربط القلوب وتقوية الإيمان",
    hindi: "ज़हूर में आपका स्वागत है - दिलों को जोड़ना, ईमान को मजबूत बनाना",
    gujarati: "ઝહૂરમાં આપનું સ્વાગત છે - હૃદયને જોડવું, વિશ્વાસને મજબૂત બનાવવું",
    farsi: "به ظهور خوش آمدید - اتصال قلب‌ها، تقویت ایمان",
    turkish: "Zahoor'a Hoş Geldiniz - Kalpleri Birleştirmek, İmanı Güçlendirmek",
    indonesian: "Selamat datang di Zahoor - Menghubungkan Hati, Memperkuat Iman"
  };

  const selectedLanguage = languages.find(lang => lang.value === settings.language);
  const isRTLLanguage = selectedLanguage?.rtlSupport || false;

  const handleLanguageChange = (value) => {
    const newLanguage = languages.find(lang => lang.value === value);
    setSettings(prev => ({
      ...prev,
      language: value,
      enableRTL: newLanguage?.rtlSupport && prev.enableRTL
    }));
  };

  const handleRTLToggle = (value) => {
    setSettings(prev => ({
      ...prev,
      enableRTL: value
    }));
  };

  const handleSave = () => {
    // In real app, would save settings to backend/local storage and apply changes
    alert(`Language changed to ${selectedLanguage?.label}${settings.enableRTL ? ' with RTL enabled' : ''}`);
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
          <h1 className="text-xl font-bold text-emerald-800">Language & RTL</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Choose App Language */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-emerald-800">Choose App Language</h2>
          </div>
          
          <div className="space-y-3">
            <RadioGroup value={settings.language} onValueChange={handleLanguageChange}>
              {languages.map((language) => (
                <div key={language.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
                  <RadioGroupItem value={language.value} id={language.value} />
                  <Label 
                    htmlFor={language.value} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-emerald-800">{language.label}</span>
                      <span className="text-sm text-emerald-600" dir={language.rtlSupport ? 'rtl' : 'ltr'}>
                        {language.nativeName}
                      </span>
                    </div>
                  </Label>
                  {language.rtlSupport && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      RTL
                    </span>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* RTL Support */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            {settings.enableRTL ? (
              <AlignRight className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlignLeft className="w-5 h-5 text-emerald-600" />
            )}
            <h2 className="text-lg font-semibold text-emerald-800">RTL Support</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-emerald-800">Enable RTL Mode</Label>
                <p className="text-xs text-emerald-600 mt-1">
                  Right-to-left text direction for Arabic, Urdu, and Persian
                </p>
              </div>
              <Switch
                checked={settings.enableRTL}
                onCheckedChange={handleRTLToggle}
                disabled={!isRTLLanguage}
              />
            </div>
            
            {!isRTLLanguage && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-700">
                  RTL mode is only available for Arabic, Urdu, and Persian languages.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">Preview</h2>
          
          <Card className="border border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-emerald-700">
                Sample Text in {selectedLanguage?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`p-4 bg-emerald-50 rounded-lg ${settings.enableRTL ? 'text-right' : 'text-left'}`}
                dir={settings.enableRTL ? 'rtl' : 'ltr'}
              >
                <p className="text-emerald-800 font-medium leading-relaxed">
                  {sampleTexts[settings.language]}
                </p>
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
                <span>Direction:</span>
                <span className="font-medium">
                  {settings.enableRTL ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Changes Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-semibold"
        >
          Save Changes
        </Button>

        {/* Info Note */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-sm text-emerald-700 text-center">
            Language changes will take effect after restarting the app. Some content may still appear in English until full translation is complete.
          </p>
        </div>
      </div>
    </div>
  );
}