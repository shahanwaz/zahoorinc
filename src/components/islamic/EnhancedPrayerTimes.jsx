import React, { useState, useEffect, useCallback } from "react";
import { Clock, MapPin, ChevronRight, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Static fallback prayer times (approximate for major cities)
const getFallbackPrayerTimes = (latitude = 21.4225, longitude = 39.8262) => {
  const today = new Date();
  return {
    timings: {
      Fajr: "05:30",
      Sunrise: "06:45",
      Dhuhr: "12:15",
      Asr: "15:30",
      Maghrib: "18:00",
      Isha: "19:30"
    },
    date: {
      hijri: `15-07-1446`,
      readable: today.toDateString()
    }
  };
};

export default function EnhancedPrayerTimes() {
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Loading...");
  const [nextPrayer, setNextPrayer] = useState({ name: "...", time: "..." });
  const [timeToNext, setTimeToNext] = useState("...");
  const [hijriDate, setHijriDate] = useState("Loading...");
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchApiData = useCallback(async (latitude, longitude, isFallback = false) => {
    try {
      // Get location name
      if (!isFallback) {
        try {
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
            mode: 'cors'
          });
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            const cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state_district;
            setLocation(cityName || "Your Location");
          } else {
            setLocation("Your Location");
          }
        } catch (error) {
          setLocation("Your Location");
        }
      } else {
        setLocation("Mecca (Default)");
      }

      // Try Al-Adhan API first (most reliable)
      try {
        console.log("Fetching from Al-Adhan API...");
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`, {
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (data.code !== 200) throw new Error('API returned error');
        
        console.log("Successfully fetched prayer times");
        setPrayerData({
          timings: data.data.timings,
          date: data.data.date
        });
        setUsingFallback(false);
        
        // Set Hijri date
        if (data.data.date?.hijri) {
          if (data.data.date.hijri.day) {
            setHijriDate(`${data.data.date.hijri.day} ${data.data.date.hijri.month?.en || 'Rajab'}, ${data.data.date.hijri.year} AH`);
          } else {
            setHijriDate("1446 AH");
          }
        } else {
          setHijriDate("1446 AH");
        }
        
        setLoading(false);
        return;
        
      } catch (error) {
        console.log("Al-Adhan API failed:", error);
      }

      // If primary API fails and we're not already using fallback location, try with Mecca
      if (!isFallback) {
        console.log("Trying with Mecca coordinates...");
        return fetchApiData(21.4225, 39.8262, true);
      }

      // If all fails, use static fallback
      console.log("Using static fallback data");
      setUsingFallback(true);
      const fallbackData = getFallbackPrayerTimes(latitude, longitude);
      setPrayerData(fallbackData);
      setHijriDate("1446 AH (Approximate)");
      setLocation("Offline Mode");
      
    } catch (error) {
      console.error("Error in fetchApiData:", error);
      // Use static fallback as last resort
      setUsingFallback(true);
      const fallbackData = getFallbackPrayerTimes();
      setPrayerData(fallbackData);
      setHijriDate("1446 AH (Approximate)");
      setLocation("Offline Mode");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mounted) {
            fetchApiData(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          // Silently fallback to Mecca coordinates - no error logging
          if (mounted) {
            fetchApiData(21.4225, 39.8262, true);
          }
        },
        { 
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 600000
        }
      );
    } else {
      // Geolocation not supported
      if (mounted) {
        fetchApiData(21.4225, 39.8262, true);
      }
    }

    return () => {
      mounted = false;
    };
  }, [fetchApiData]);

  useEffect(() => {
    if (!prayerData?.timings) return;

    const updateNextPrayer = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = [
        { name: "Fajr", time: prayerData.timings.Fajr },
        { name: "Dhuhr", time: prayerData.timings.Dhuhr },
        { name: "Asr", time: prayerData.timings.Asr },
        { name: "Maghrib", time: prayerData.timings.Maghrib },
        { name: "Isha", time: prayerData.timings.Isha }
      ].filter(prayer => prayer.time).map(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        return { ...prayer, minutes: hours * 60 + minutes };
      });

      let nextPrayerInfo = prayers.find(prayer => prayer.minutes > currentTime);
      
      if (!nextPrayerInfo) {
        nextPrayerInfo = prayers[0];
        const tomorrowMinutes = nextPrayerInfo.minutes + 24 * 60;
        const timeLeft = tomorrowMinutes - currentTime;
        setTimeToNext(formatDuration(timeLeft * 60 * 1000));
      } else {
        const timeLeft = nextPrayerInfo.minutes - currentTime;
        setTimeToNext(formatDuration(timeLeft * 60 * 1000));
      }

      setNextPrayer({
        name: nextPrayerInfo.name,
        time: nextPrayerInfo.time
      });
    };

    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [prayerData]);

  const gregorianDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 border border-emerald-200/50 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669'%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%23059669' stroke-width='1'/%3E%3Cpath d='M20 8v24M8 20h24' stroke='%23059669' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Next Prayer</p>
                <p className="text-2xl font-bold">{nextPrayer.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xl font-bold">{nextPrayer.time}</p>
              <p className="text-white/80 text-sm">in {timeToNext}</p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center mt-2">
              <Loader2 className="w-5 h-5 animate-spin text-white/70" />
              <span className="text-white/80 text-xs ml-2">Loading prayer times...</span>
            </div>
          )}
          
          {!loading && usingFallback && (
            <div className="mt-2 text-center">
              <p className="text-white/80 text-xs">⚠️ Using offline prayer times</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium">
            <Calendar className="w-3 h-3" />
            <span>{gregorianDate}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium">
            <span>{hijriDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700">
            <MapPin className="w-4 h-4" />
            <span className="font-medium text-sm">{location}</span>
          </div>
          <Link to={createPageUrl("PrayerTimesPage")}>
            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}