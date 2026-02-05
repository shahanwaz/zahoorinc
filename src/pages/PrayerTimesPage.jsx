import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft, 
  MapPin, 
  Sunrise, 
  Sunset, 
  Clock, 
  Star, 
  Bell, 
  Settings, 
  ChevronDown, 
  Navigation,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Helper function to format 24-hour time to 12-hour time with AM/PM
const formatTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const period = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${period}`;
};

const hijriMonths = [
  "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
  "Jumada al-awwal", "Jumada al-thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];


export default function PrayerTimesPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Getting location...");
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExtraTimings, setShowExtraTimings] = useState(false);
  const [notifications, setNotifications] = useState({
    fajr: true,
    dhuhr: false,
    asr: true,
    maghrib: true,
    isha: true
  });
  const [gregorianDate, setGregorianDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");

  const mainPrayers = [
    { key: "Fajr", name: "Fajr", icon: Sunrise, description: "Dawn Prayer" },
    { key: "Sunrise", name: "Sunrise", icon: Sunrise, description: "Sun Rising Time", isOptional: true },
    { key: "Dhuhr", name: "Dhuhr", icon: Clock, description: "Midday Prayer" },
    { key: "Asr", name: "Asr", icon: Clock, description: "Afternoon Prayer" },
    { key: "Maghrib", name: "Maghrib", icon: Sunset, description: "Sunset Prayer" },
    { key: "Isha", name: "Isha", icon: Clock, description: "Night Prayer" }
  ];

  const extraTimings = [
    { key: "Imsak", name: "Imsak", icon: Clock },
    { key: "Midnight", name: "Midnight", icon: Clock },
    { key: "Firstthird", name: "First Third", icon: Clock },
    { key: "Lastthird", name: "Last Third", icon: Clock }
  ];

  const fetchPrayerTimes = useCallback(async (latitude, longitude, isFallback = false) => {
    try {
        if (!isFallback) {
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
            if (geoResponse.ok) {
                const geoData = await geoResponse.json();
                const cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state_district;
                setLocation(cityName || "Your Location");
            } else {
                setLocation("Your Location");
            }
        } else {
             setLocation("Mecca (Default)");
        }

        const date = new Date();
        const timestamp = Math.floor(date.getTime() / 1000);
        // Using a generally stable API
        const apiResponse = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2`);
        if (!apiResponse.ok) throw new Error('Failed to fetch prayer times from Al-Adhan API');
        
        const data = await apiResponse.json();

        if (data.code !== 200 || !data.data) {
           throw new Error('Al-Adhan API returned an error or invalid data.');
        }

        setPrayerData(data.data);
        setGregorianDate(data.data.date.readable);
        
        const hijri = data.data.date.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.en}, ${hijri.year}`);

    } catch (error) {
        console.error("Error fetching prayer times:", error);
        if (!isFallback) {
            console.log("Primary API failed, trying fallback to Mecca...");
            fetchPrayerTimes(21.4225, 39.8262, true); 
        } else {
            setLocation("Could not fetch data");
            setHijriDate("Unavailable");
            setPrayerData(null);
        }
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // If user denies location, fallback to Mecca
          fetchPrayerTimes(21.4225, 39.8262, true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
        // Geolocation not supported, fallback to Mecca
        fetchPrayerTimes(21.4225, 39.8262, true);
    }
  }, [fetchPrayerTimes]);

  const getCurrentActivePrayer = () => {
    if (!prayerData?.timings) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerTimesInMinutes = mainPrayers
      .filter(p => prayerData.timings[p.key])
      .map(p => {
        const [hours, minutes] = prayerData.timings[p.key].split(':').map(Number);
        return { key: p.key, time: hours * 60 + minutes };
      })
      .sort((a, b) => a.time - b.time);

    let activePrayer = prayerTimesInMinutes[prayerTimesInMinutes.length - 1]?.key;

    for (const prayer of prayerTimesInMinutes) {
      if (currentTime < prayer.time) {
        const currentIndex = prayerTimesInMinutes.findIndex(p => p.key === prayer.key);
        activePrayer = prayerTimesInMinutes[currentIndex - 1]?.key || prayerTimesInMinutes[prayerTimesInMinutes.length - 1]?.key;
        break;
      }
    }
    return activePrayer;
  };

  const activePrayer = getCurrentActivePrayer();

  const toggleNotification = (prayerKey) => {
    const key = prayerKey.toLowerCase();
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isFriday = new Date().getDay() === 5;
  const qiblaDirection = prayerData?.meta?.direction;

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-4 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">Prayer Times</h1>
              <p className="text-sm text-emerald-600">نماز شریف</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to={createPageUrl("AzaanSettings")}>
              <Button variant="ghost" size="icon" className="hover:bg-emerald-50">
                <Settings className="w-5 h-5 text-emerald-600" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Date & Location Bar */}
        <div className="px-4 pb-3">
          <div className="glassmorphism rounded-xl p-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">{location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700">
                  {gregorianDate || '...'}
                </span>
              </div>

              {qiblaDirection && (
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-700">
                    Qibla: {qiblaDirection.toFixed(1)}°
                  </span>
                </div>
              )}
            </div>

            <div className="text-center mt-2 font-medium text-emerald-700">{hijriDate}</div>

            {isFriday && (
              <div className="mt-2 text-center">
                <Badge className="bg-emerald-600 text-white">
                  🕌 Jummah Mubarak - Don't forget Surah Al-Kahf
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Main Prayer Times */}
        {loading ? (
          <div className="text-center py-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-emerald-700">Fetching prayer times...</p>
            <p className="text-xs text-emerald-600">Please allow location access for accurate times</p>
          </div>
        ) : !prayerData?.timings ? (
          <div className="text-center py-8">
            <p className="text-red-700 mb-2">Could not load prayer times.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainPrayers.map((prayer) => {
              const prayerTime24 = prayerData.timings[prayer.key];
              const isActive = activePrayer === prayer.key;
              const Icon = prayer.icon;
              const hasNotification = notifications[prayer.key.toLowerCase()];

              if (!prayerTime24) return null;

              return (
                <div
                  key={prayer.key}
                  className={`glassmorphism rounded-2xl p-4 transition-all duration-300 ${
                    isActive 
                      ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' 
                      : 'hover:shadow-lg hover:shadow-emerald-200'
                  } ${prayer.isOptional ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        isActive 
                          ? 'bg-emerald-600' 
                          : 'bg-emerald-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-emerald-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${
                          isActive ? 'text-emerald-700' : 'text-emerald-800'
                        }`}>
                          {prayer.name}
                        </h3>
                        <p className="text-xs text-emerald-600">{prayer.description}</p>
                      </div>
                    </div>

                    {!prayer.isOptional && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleNotification(prayer.key)}
                        className="p-1 hover:bg-emerald-100"
                      >
                        <Bell className={`w-4 h-4 ${
                          hasNotification ? 'text-emerald-600 fill-current' : 'text-gray-400'
                        }`} />
                      </Button>
                    )}
                  </div>

                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      isActive ? 'text-emerald-700' : 'text-emerald-800'
                    }`}>
                      {prayerTime24}
                    </p>
                    <p className="text-sm text-emerald-600">
                      {formatTo12Hour(prayerTime24)}
                    </p>
                  </div>

                  {isActive && (
                    <div className="mt-3 text-center">
                      <Badge className="bg-emerald-600 text-white animate-pulse">
                        Current Prayer Time
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Extra Timings Section */}
        {prayerData?.timings && (
          <Collapsible open={showExtraTimings} onOpenChange={setShowExtraTimings}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full glassmorphism rounded-xl p-4 justify-between">
                <span className="font-medium text-emerald-800">Additional Timings</span>
                <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${
                  showExtraTimings ? 'rotate-180' : ''
                }`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {extraTimings.map((timing) => {
                  const timingData24 = prayerData.timings[timing.key];
                  const Icon = timing.icon;

                  if (!timingData24) return null;

                  return (
                    <div key={timing.name} className="glassmorphism rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">
                          {timing.name}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-emerald-700">
                        {timingData24}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Islamic Quote Footer */}
        <div className="glassmorphism rounded-2xl p-6 text-center mt-8">
          <div className="mb-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-emerald-800 font-medium mb-2 leading-relaxed font-arabic-large">
            "الصلاة عماد الدين"
          </p>
          <p className="text-emerald-700 italic text-sm mb-2">
            "Prayer is the pillar of faith"
          </p>
          <p className="text-emerald-600 text-xs">
            — Imam Ali (a.s.)
          </p>
        </div>
      </main>
    </div>
  );
}