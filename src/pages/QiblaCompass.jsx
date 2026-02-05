
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Compass, Share2, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const kaabaIconUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/af7a9d021_kaaba.svg";
const calibrationGifUrl = "https://i.gifer.com/7H5G.gif";

export default function QiblaCompass() {
  const navigate = useNavigate();
  const [heading, setHeading] = useState(0);
  const [qibla, setQibla] = useState({ direction: 0, distance: 4500 }); // Better default values
  const [location, setLocation] = useState({ city: "Loading...", country: "" });
  const [nextPrayer, setNextPrayer] = useState({ name: "...", time: "..." });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Function to request device orientation permission (for iOS)
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
        } else {
          setError("Permission denied. Compass requires device orientation access.");
        }
      } catch (err) {
        setError("Permission request failed. Please enable sensor access in your browser settings.");
      }
    } else {
      // For non-iOS devices
      setPermissionGranted(true);
    }
  };

  const handleOrientation = (event) => {
    let alpha = event.alpha;
    if (event.webkitCompassHeading) {
      alpha = event.webkitCompassHeading;
    }
    setHeading(alpha);
  };

  const fetchApiData = useCallback(async (latitude, longitude, isFallback = false) => {
    setLoading(true);
    // Don't clear error if it's a permission error that we want to keep displayed
    if (!error || !error.includes("permission")) {
      setError(null);
    }
    try {
      // Calculate Qibla direction manually as fallback
      const calculateQiblaDirection = (lat, lon) => {
        const meccaLat = 21.4225; // Mecca latitude
        const meccaLon = 39.8262; // Mecca longitude
        
        const dLon = (meccaLon - lon) * Math.PI / 180;
        const lat1 = lat * Math.PI / 180;
        const lat2 = meccaLat * Math.PI / 180;
        
        const y = Math.sin(dLon) * Math.cos(lat2) - Math.cos(lat1) * Math.sin(lat2) * Math.cos(dLon);
        const x = Math.cos(lat1) * Math.sin(lat2) * Math.sin(dLon); // Fixed calculation for Qibla
        
        let brng = Math.atan2(x, y) * 180 / Math.PI; // Adjusted order for atan2
        return (brng + 360) % 360;
      };

      // Calculate distance to Mecca
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.round(R * c);
      };

      const calculatedDirection = calculateQiblaDirection(latitude, longitude);
      const calculatedDistance = calculateDistance(latitude, longitude, 21.4225, 39.8262);
      
      // Set calculated values first as fallback
      setQibla(prev => ({ 
        direction: calculatedDirection || 0, 
        distance: calculatedDistance || 4500 
      }));

      // Fetch Prayer Times
      const prayerApiUrl = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
      const prayerResponse = await fetch(prayerApiUrl);
      
      if (prayerResponse.ok) {
        const prayerData = await prayerResponse.json();
        
        // Update with API qibla direction if available and valid, otherwise keep calculated
        if (prayerData.data?.meta?.qibla !== undefined && prayerData.data.meta.qibla !== null && !isNaN(prayerData.data.meta.qibla)) {
          setQibla(prev => ({ 
            ...prev, 
            direction: parseFloat(prayerData.data.meta.qibla)
          }));
        }

        // Set next prayer info
        if (prayerData.data?.timings) {
          const timings = prayerData.data.timings;
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
          
          const prayersInMinutes = prayerOrder
            .filter(p => timings[p]) // Only include prayers that exist
            .map(p => {
              const [h, m] = timings[p].split(':').map(Number);
              return { name: p, time: timings[p], minutes: h * 60 + m };
            });

          const next = prayersInMinutes.find(p => p.minutes > currentTime);
          const nextPrayerInfo = next || prayersInMinutes[0]; // Fajr tomorrow as fallback
          
          if (nextPrayerInfo) {
            setNextPrayer({ 
              name: nextPrayerInfo.name, 
              time: nextPrayerInfo.time 
            });
          }
        }
      } else {
        console.error("Could not fetch prayer data, using calculated Qibla direction.");
      }

      // Fetch Location Name
      if (isFallback) {
        setLocation({ city: "Default Location", country: "Mecca" });
      } else {
        try {
          const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          const geoResponse = await fetch(geoApiUrl);
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            if (geoData?.address) {
              setLocation({
                city: geoData.address.city || geoData.address.town || geoData.address.state_district || "Your Location",
                country: geoData.address.country || "",
              });
            } else {
              console.warn("No address data found in geocoding response.");
              setLocation({
                city: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
                country: "Coordinates"
              });
            }
          } else {
            console.error("Could not fetch location data from Nominatim.");
            setLocation({
              city: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
              country: "Coordinates"
            });
          }
        } catch (geoError) {
          console.log("Location name fetch failed, using coordinates");
          setLocation({
            city: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            country: "",
          });
        }
      }
    } catch (apiError) {
      console.error("Error fetching data:", apiError);
      if (!error) { // Only set generic error if no specific permission error is already displayed
        setError("Failed to load data. Using calculated Qibla direction and default distance.");
      }
    } finally {
      setLoading(false);
    }
  }, [error]); // Added error to dependency array

  useEffect(() => {
    let mounted = true;
    
    // Auto-request permission on component mount (for DeviceOrientation for iOS)
    requestPermission();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mounted) {
            setError(null); // Clear previous errors if geolocation is successful
            fetchApiData(position.coords.latitude, position.coords.longitude);
          }
        },
        (err) => {
          if (mounted) {
            if (err.code === 1) { // PERMISSION_DENIED
              setError("Location permission denied. Please enable it in your browser settings for an accurate direction. Showing direction from a default location.");
            } else {
              setError("Could not get your location. Showing direction from a default location.");
            }
            // Fallback to Mecca coordinates
            fetchApiData(21.4225, 39.8262, true); // Pass true for isFallback
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Geolocation options
      );
    } else {
      if (mounted) {
        setError("Geolocation is not supported by your browser. Showing direction from a default location.");
        fetchApiData(21.4225, 39.8262, true); // Pass true for isFallback
      }
    }

    return () => { mounted = false; };
  }, [fetchApiData]);

  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [permissionGranted]);
  
  // Safeguard qibla properties against potential undefined values
  const safeQiblaDirection = qibla?.direction ?? 0;
  const safeQiblaDistance = qibla?.distance ?? 4500;
  
  // The compass dial now rotates by `-heading`.
  const compassRotationStyle = { transform: `rotate(${-heading}deg)` };
  // The Qibla pointer needs to show direction relative to the device's current heading.
  // safeQiblaDirection is absolute from North, heading is device's absolute from North.
  // So, safeQiblaDirection - heading gives the Qibla direction relative to device's top.

  if (error && !loading) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-emerald-50 text-center p-4">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700">An Error Occurred</h2>
            <p className="text-gray-600 my-2">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4 primary-btn">Try Again</Button>
            <Button variant="ghost" onClick={() => navigate(-1)} className="mt-2 text-emerald-700">Go Back</Button>
        </div>
    );
  }

  if (!permissionGranted && typeof DeviceOrientationEvent.requestPermission === 'function' && !error) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-emerald-50 text-center p-4">
            <Compass className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-emerald-800">Sensor Access Required</h2>
            <p className="text-gray-600 my-4 max-w-sm">To use the Qibla Compass, please grant access to your device's motion and orientation sensors.</p>
            <Button onClick={requestPermission} className="primary-btn px-8 py-6 text-lg">
                Activate Compass
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4 text-emerald-700">Cancel</Button>
        </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex flex-col">
      <header className="p-4 flex items-center z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/80 rounded-full">
          <ArrowLeft className="w-5 h-5 text-emerald-800" />
        </Button>
        <h1 className="flex-grow text-center text-xl font-bold text-emerald-800 font-arabic-title">Qibla Finder</h1>
        <div className="w-10"></div> {/* Placeholder for alignment */}
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mb-4 rounded-r-lg shadow-md z-10 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <main className="flex-grow flex flex-col justify-around items-center px-4 pb-8">
        {loading ? (
           <div className="flex flex-col items-center justify-center text-center py-20">
             <Loader2 className="w-12 h-12 text-emerald-500 animate-spin"/>
             <p className="mt-4 text-emerald-700 font-semibold">Finding Qibla...</p>
           </div>
        ) : (
          <>
            <div className="w-full max-w-sm">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 flex justify-between items-center shadow-sm border border-emerald-200/50">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-800">{location.city}</p>
                    <p className="text-sm text-emerald-600">{location.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-800">{safeQiblaDistance.toLocaleString()} km</p>
                  <p className="text-sm text-emerald-600">to Kaaba</p>
                </div>
              </div>
            </div>

            {/* Compass */}
            <div className="relative w-72 h-72">
              {/* Compass Dial which rotates */}
              <div 
                className="absolute inset-0 rounded-full bg-white shadow-xl transition-transform duration-500 ease-out" 
                style={compassRotationStyle}
              >
                {/* Cardinal points */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl font-bold text-emerald-400">N</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xl font-medium text-emerald-300">S</span>
                <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xl font-medium text-emerald-300">E</span>
                <span className="absolute top-1/2 left-2 -translate-y-1/2 text-xl font-medium text-emerald-300">W</span>
              </div>
              
              {/* Qibla Pointer - OUTSIDE the rotating dial, positioned relative to device orientation */}
              <div 
                className="absolute inset-0 transition-transform duration-500 ease-out" 
                style={{ transform: `rotate(${safeQiblaDirection - heading}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 -mt-1 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-b-full flex items-end justify-center pb-1 shadow-md">
                  <img 
                    src={kaabaIconUrl} 
                    alt="Kaaba" 
                    className="w-6 h-6"
                    onError={(e) => {
                      try {
                        const parent = e.target?.parentElement;
                        if (parent) {
                          e.target.style.display = 'none';
                          parent.innerHTML = '🕋';
                          parent.style.fontSize = '20px';
                          parent.style.color = '#1f2937';
                        }
                      } catch (error) {
                        console.log('Image fallback error:', error);
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Static Phone Heading Needle (points UP) */}
              <div className="absolute top-1/2 left-1/2 w-4 h-32 -translate-x-1/2 -translate-y-full origin-bottom">
                <div 
                  className="w-full h-full" 
                  style={{
                    background: 'linear-gradient(to top, transparent, #10b981)',
                    clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'
                  }}
                ></div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-emerald-500 rounded-full z-10"></div>
            </div>

            <div>
              <div className="text-center">
                <p className="text-5xl font-bold text-emerald-700">
                  {safeQiblaDirection.toFixed(0)}°
                </p>
                <p className="text-lg font-medium text-emerald-600">
                  Direction to Qibla
                </p>
              </div>
            </div>
            
            {/* Next Prayer Card */}
            <div className="w-full max-w-sm bg-white/70 backdrop-blur-lg rounded-2xl p-4 flex justify-between items-center shadow-sm border border-emerald-200/50">
                <div>
                    <p className="text-sm text-emerald-600">Next Prayer</p>
                    <p className="text-xl font-bold text-emerald-800">{nextPrayer.name}</p>
                </div>
                <p className="text-2xl font-bold text-emerald-700">{nextPrayer.time}</p>
            </div>
          </>
        )}
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md p-4 border-t border-emerald-200 flex justify-around">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex flex-col h-auto p-2 items-center gap-1 text-emerald-700">
              <HelpCircle className="w-6 h-6" />
              <span className="text-xs">Calibrate</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="dialog-bg">
            <SheetHeader>
              <SheetTitle className="heading-color text-2xl font-arabic-title">Calibrate Compass</SheetTitle>
            </SheetHeader>
            <div className="py-4 text-center">
                <p className="text-muted mb-4">To improve accuracy, move your phone in a figure-eight pattern as shown below.</p>
                <img src={calibrationGifUrl} alt="Calibration animation" className="rounded-lg mx-auto w-48"/>
                <p className="text-sm text-muted mt-4">Avoid magnetic objects and metal cases.</p>
            </div>
          </SheetContent>
        </Sheet>
        
        <Button variant="ghost" className="flex flex-col h-auto p-2 items-center gap-1 text-emerald-700">
          <Share2 className="w-6 h-6" />
          <span className="text-xs">Share</span>
        </Button>
      </footer>
    </div>
  );
}
