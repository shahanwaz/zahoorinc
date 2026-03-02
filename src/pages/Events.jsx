import React, { useState, useEffect } from "react";
import { Event } from "@/entities/Event";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Plus, ArrowLeft, MapPin, Navigation, Calendar, Filter, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CommunityEventCard from "@/components/events/CommunityEventCard";
import CondolenceCard from "@/components/events/CondolenceCard";
import EjaraCard from "@/components/events/EjaraCard";

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Check if event has expired (24 hours after event date/time)
const isEventExpired = (eventDate, eventTime) => {
  if (!eventDate || !eventTime) return false;
  
  try {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const expiryTime = new Date(eventDateTime.getTime() + (24 * 60 * 60 * 1000)); // 24 hours after event
    const now = new Date();
    return now > expiryTime;
  } catch (error) {
    console.error("Error checking expiry:", error);
    return false;
  }
};

export default function Events() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10); // Default 10km
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Static condolences and ejara data
  const [condolences] = useState([
    {
      id: 1,
      title: "In Memory of Syed Ali Hassan",
      message: "We are deeply saddened by the passing of our beloved brother Syed Ali Hassan. He was a pillar of our community, known for his kindness, wisdom, and dedication to serving others. May Allah grant him the highest place in Jannah and give patience to his family. Please recite Surah Al-Fatiha for his soul.",
      user_name: "Fatima Zahra",
      created_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      dua_count: 47,
      image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Remembering Maulana Syed Haider Naqvi",
      message: "Our respected Maulana Syed Haider Naqvi has returned to his Creator. He dedicated his life to teaching and spreading the message of Ahlul Bayt (AS). His lectures and guidance touched thousands of hearts. May his soul rest in eternal peace.",
      user_name: "Abbas Mehdi",
      created_date: new Date(Date.now() - 86400000 * 5).toISOString(),
      dua_count: 123,
      image_url: "https://images.unsplash.com/photo-1551858195-72dcb9ab02b9?w=400&h=200&fit=crop"
    }
  ]);

  const [ejaraPosts] = useState([
    {
      id: 1,
      type: "qaza_namaz",
      title: "Qaza Namaz for Father",
      description: "Help complete 180 days of Qaza Namaz for my late father's soul",
      days_count: 180,
      participants_needed: 6,
      participants_joined: 2,
      hadiya_per_person: 5000,
      validity_date: "2025-09-15",
      status: "active",
      poster_name: "Ali Hassan"
    },
    {
      id: 2,
      type: "quran_recitation",
      title: "Quran Recitation for Mother",
      description: "Complete 10 full Quran recitations for my mother's Esal-e-Sawab",
      quran_count: 10,
      participants_needed: 5,
      participants_joined: 5,
      hadiya_per_person: 2000,
      validity_date: "2025-01-20",
      status: "completed",
      poster_name: "Fatima Khan"
    },
    {
      id: 3,
      type: "roza",
      title: "30 Days of Roza",
      description: "Need help completing 30 missed fasts from last Ramadan",
      days_count: 30,
      participants_needed: 3,
      participants_joined: 1,
      hadiya_per_person: 3000,
      validity_date: "2025-08-30",
      status: "active",
      poster_name: "Zainab Ahmed"
    }
  ]);

  useEffect(() => {
    loadData();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      filterNearbyEvents();
    }
  }, [events, userLocation, searchRadius]);

  useEffect(() => {
    // Clean up expired events every minute
    const cleanupInterval = setInterval(() => {
      cleanupExpiredEvents();
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  const getUserLocation = () => {
    setLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          // Silently fallback to default location
          setUserLocation({
            latitude: 28.6139, // Delhi, India
            longitude: 77.2090
          });
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 600000
        }
      );
    } else {
      setUserLocation({
        latitude: 28.6139,
        longitude: 77.2090
      });
      setLoadingLocation(false);
    }
  };

  const loadData = async () => {
    try {
      // Load events without requiring auth
      const allEvents = await Event.list('-created_date');
      
      // Filter out expired events
      const activeEvents = allEvents.filter(event => {
        return !isEventExpired(event.date, event.time);
      });
      
      setEvents(activeEvents);

      // Try to get user (optional, non-blocking)
      User.me().then(setCurrentUser).catch(() => {});
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const cleanupExpiredEvents = async () => {
    try {
      const allEvents = await Event.list();
      
      for (const event of allEvents) {
        if (isEventExpired(event.date, event.time)) {
          await Event.delete(event.id);
          console.log(`Deleted expired event: ${event.title}`);
        }
      }
      
      await loadData();
    } catch (error) {
      console.error("Error cleaning up expired events:", error);
    }
  };

  const filterNearbyEvents = () => {
    if (!userLocation) {
      setNearbyEvents(events);
      return;
    }

    const eventsWithDistance = events
      .filter(event => event.location?.latitude && event.location?.longitude)
      .map(event => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          event.location.latitude,
          event.location.longitude
        );
        return { ...event, distance };
      })
      .filter(event => event.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    setNearbyEvents(eventsWithDistance);
  };

  const handleJoinEvent = async (eventId) => {
    if (!currentUser) {
      alert("Please log in to join an event.");
      return;
    }

    try {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      const isAlreadyJoined = event.attendees?.includes(currentUser.id);
      const updatedAttendees = isAlreadyJoined
        ? event.attendees.filter((id) => id !== currentUser.id)
        : [...(event.attendees || []), currentUser.id];

      if (!isAlreadyJoined && event.max_attendees && updatedAttendees.length > event.max_attendees) {
        alert("Sorry, this event is full!");
        return;
      }

      await Event.update(eventId, { attendees: updatedAttendees });
      await loadData();
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handleGetDirection = (location) => {
    if (!location?.latitude || !location?.longitude) {
      alert("Location not available for this event.");
      return;
    }
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };

  const handleOfferDua = (condolenceId) => {
    alert("May Allah accept your dua. JazakAllah for your prayers.");
  };

  const handleAvailEjara = (postId) => {
    alert("Ejara service booking will be processed. Details will be sent to you.");
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Redesigned Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-emerald-50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="hover:bg-emerald-50 rounded-full relative"
            >
              <div className={`absolute inset-0 rounded-full transition-colors ${showFilters ? 'bg-emerald-100' : ''}`}></div>
              <Filter className={`w-5 h-5 relative z-10 transition-colors ${showFilters ? 'text-emerald-700' : 'text-emerald-600'}`} />
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-emerald-800 mb-1">
              Majalis, Mahfil & More
            </h1>
            <p className="text-sm text-emerald-600">
              Community Gatherings & Spiritual Services
            </p>
          </div>
        </div>

        {/* Location & Radius Filter */}
        {showFilters && (
          <div className="p-4 bg-emerald-50 border-t border-emerald-200">
            <div className="space-y-4">
              {/* Location Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {loadingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span className="text-sm text-emerald-700">Detecting location...</span>
                    </>
                  ) : userLocation ? (
                    <>
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        Showing events within {searchRadius}km
                      </span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Location unavailable</span>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getUserLocation}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>

              {/* Radius Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-emerald-800">Search Radius</label>
                  <span className="text-sm font-bold text-emerald-600">{searchRadius} km</span>
                </div>
                <Slider
                  value={[searchRadius]}
                  onValueChange={(value) => setSearchRadius(value[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-emerald-600 mt-1">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-emerald-700">
                <span className="font-semibold">{nearbyEvents.length}</span> events found nearby
              </div>

              {/* Increase Radius Button */}
              {nearbyEvents.length === 0 && !loadingLocation && (
                <Button
                  variant="outline"
                  onClick={() => setSearchRadius(Math.min(50, searchRadius + 10))}
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Increase Radius to {Math.min(50, searchRadius + 10)}km
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="p-4 space-y-8 pb-32">
        {/* Section 1: Majalis & Mahfil */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-emerald-800">Majalis & Mahfil Nearby</h2>
            {loadingLocation && (
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            )}
          </div>
          
          {loadingLocation ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto mb-4 text-emerald-600 animate-spin" />
              <p className="text-emerald-700">Loading events near you...</p>
            </div>
          ) : nearbyEvents.length > 0 ? (
            <div className="space-y-4">
              {nearbyEvents.map((event) => (
                <CommunityEventCard
                  key={event.id}
                  event={event}
                  currentUser={currentUser}
                  onJoin={handleJoinEvent}
                  onGetDirection={handleGetDirection}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center border border-emerald-200">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
              <h3 className="text-lg font-bold text-emerald-800 mb-2">
                No events found within {searchRadius}km
              </h3>
              <p className="text-emerald-600 mb-4">
                Try increasing the search radius or create a new event
              </p>
              <div className="flex gap-3 justify-center">
                <Link to={createPageUrl("CreateEvent")}>
                  <Button className="primary-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Condolences */}
        <section>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Condolences</h2>
          <div className="space-y-4">
            {condolences.map((condolence) => (
              <CondolenceCard
                key={condolence.id}
                condolence={condolence}
                onOfferDua={handleOfferDua}
              />
            ))}
          </div>
        </section>

        {/* Section 3: Ejara */}
        <section>
          <div className="bg-gradient-to-r from-yellow-100 via-emerald-50 to-yellow-100 rounded-2xl p-4 mb-4 text-center border-2 border-yellow-300/50">
            <h3 className="text-lg font-bold text-yellow-900 flex items-center justify-center gap-2">
              🌟 Complete Ejara – Roza, Namaz & More
            </h3>
            <p className="text-sm text-yellow-800">Earn up to ₹20,000 in Hadiya</p>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {ejaraPosts.map((post) => (
              <EjaraCard
                key={post.id}
                post={post}
                onAvail={handleAvailEjara}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Floating Add Post Button */}
      <Link to={createPageUrl("CreateEvent")}>
        <Button 
          className="fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 z-40 transition-transform hover:scale-110 active:scale-95"
          size="icon"
        >
          <Plus className="w-8 h-8 text-white" />
        </Button>
      </Link>
    </div>
  );
}