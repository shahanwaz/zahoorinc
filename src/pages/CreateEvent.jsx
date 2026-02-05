
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Loader2, Navigation } from "lucide-react";
import { Event } from "@/entities/Event";
import { User } from "@/entities/User";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    max_attendees: "",
    event_type: "majlis",
    latitude: "",
    longitude: ""
  });

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEventForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          alert("Current location detected!");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Please log in to create an event.");
      return;
    }

    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.venue) {
      alert("Please fill in all required fields (Title, Date, Time, Venue)");
      return;
    }

    setIsLoading(true);
    try {
      const location = {
        address: eventForm.venue
      };

      if (eventForm.latitude && eventForm.longitude) {
        location.latitude = parseFloat(eventForm.latitude);
        location.longitude = parseFloat(eventForm.longitude);
      }

      await Event.create({
        title: eventForm.title,
        description: eventForm.description,
        venue: eventForm.venue,
        date: eventForm.date,
        time: eventForm.time,
        event_type: eventForm.event_type,
        organizer_id: currentUser.id,
        organizer_name: currentUser.full_name,
        organizer_avatar: currentUser.profile_image,
        attendees: [],
        max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : null,
        location: location,
        is_public: true
      });

      alert("Event created successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-emerald-50"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">Create Event</h1>
              <p className="text-sm text-emerald-600">Share your gathering with the community</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="p-4 pb-24">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Event Type */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200">
            <Label className="text-emerald-800 font-semibold mb-2 block">Event Type *</Label>
            <Select
              value={eventForm.event_type}
              onValueChange={(value) => setEventForm({ ...eventForm, event_type: value })}
            >
              <SelectTrigger className="bg-emerald-50 border-emerald-200 text-emerald-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="majlis">🕌 Majlis</SelectItem>
                <SelectItem value="class">📚 Class/Lecture</SelectItem>
                <SelectItem value="community">👥 Community Event</SelectItem>
                <SelectItem value="ziyarat">🕋 Ziyarat Program</SelectItem>
                <SelectItem value="condolence">💐 Condolence Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Basic Details */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Details
            </h3>

            <div>
              <Label className="text-emerald-700">Event Title *</Label>
              <Input
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="e.g., Majlis-e-Aza, Shab-e-Bedari"
                className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1"
              />
            </div>

            <div>
              <Label className="text-emerald-700">Description</Label>
              <Textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Provide details about the event..."
                className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1 min-h-[100px]"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              When
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-emerald-700">Date *</Label>
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1"
                />
              </div>

              <div>
                <Label className="text-emerald-700">Time *</Label>
                <Input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1"
                />
              </div>
            </div>

            <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-3 text-sm text-emerald-800">
              ⏰ <strong>Auto-deletion:</strong> This event will be automatically deleted 24 hours after the event time.
            </div>
          </div>

          {/* Location */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h3>

            <div>
              <Label className="text-emerald-700">Venue / Address *</Label>
              <Textarea
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                placeholder="Enter the full address"
                className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-emerald-700">Latitude (Optional)</Label>
                <Input
                  type="number"
                  step="any"
                  value={eventForm.latitude}
                  onChange={(e) => setEventForm({ ...eventForm, latitude: e.target.value })}
                  placeholder="28.6139"
                  className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1"
                />
              </div>

              <div>
                <Label className="text-emerald-700">Longitude (Optional)</Label>
                <Input
                  type="number"
                  step="any"
                  value={eventForm.longitude}
                  onChange={(e) => setEventForm({ ...eventForm, longitude: e.target.value })}
                  placeholder="77.2090"
                  className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Use My Current Location
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              💡 <strong>Tip:</strong> Adding coordinates helps people find your event on maps and see the distance from their location.
            </div>
          </div>

          {/* Capacity */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Capacity
            </h3>

            <div>
              <Label className="text-emerald-700">Maximum Attendees (Optional)</Label>
              <Input
                type="number"
                value={eventForm.max_attendees}
                onChange={(e) => setEventForm({ ...eventForm, max_attendees: e.target.value })}
                placeholder="Leave empty for unlimited"
                className="bg-emerald-50 border-emerald-200 text-emerald-900 mt-1"
              />
              <p className="text-xs text-emerald-600 mt-1">
                Set a limit if venue capacity is restricted. Leave blank for no limit.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-emerald-50 pt-4 pb-4 -mx-4 px-4 border-t border-emerald-200">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
