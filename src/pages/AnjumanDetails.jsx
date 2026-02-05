import React, { useState, useEffect } from "react";
import { Anjuman } from "@/entities/Anjuman";
import { Event } from "@/entities/Event";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Calendar, Mail, Phone, Globe, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AnjumanDetails() {
  const navigate = useNavigate();
  const [anjuman, setAnjuman] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const anjumanId = urlParams.get('id');
      
      if (anjumanId) {
        const anjumanData = await Anjuman.list();
        const foundAnjuman = anjumanData.find(a => a.id === anjumanId);
        setAnjuman(foundAnjuman);
        
        const user = await User.me();
        setCurrentUser(user);
        
        if (foundAnjuman && user) {
          setIsJoined(foundAnjuman.members?.includes(user.id) || false);
        }
        
        // Load related events
        const allEvents = await Event.list();
        setEvents(allEvents.slice(0, 3)); // Show first 3 events
      }
    } catch (error) {
      console.error("Error loading anjuman details:", error);
    }
  };

  const handleJoinToggle = async () => {
    if (!currentUser || !anjuman) return;
    
    try {
      const updatedMembers = isJoined 
        ? anjuman.members.filter(id => id !== currentUser.id)
        : [...(anjuman.members || []), currentUser.id];

      await Anjuman.update(anjuman.id, { 
        members: updatedMembers,
        member_count: updatedMembers.length
      });
      
      setIsJoined(!isJoined);
      setAnjuman({...anjuman, members: updatedMembers, member_count: updatedMembers.length});
    } catch (error) {
      console.error("Error toggling membership:", error);
    }
  };

  if (!anjuman) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#FF0066'}}></div>
          <p style={{color: '#6A0066'}}>Loading anjuman details...</p>
        </div>
      </div>
    );
  }

  const typeColors = {
    majlis: "#6A0066",
    matami: "#FF0066",
    youth: "#934790",
    women: "#E8D4B7",
    charity: "#6A0066",
    others: "#934790"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b" style={{borderColor: '#E8D4B7'}}>
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-pink-50">
            <ArrowLeft className="w-5 h-5" style={{color: '#6A0066'}} />
          </Button>
          <h1 className="text-lg font-bold text-center flex-1 px-4" style={{color: '#6A0066'}}>
            {anjuman.name}
          </h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Banner Image */}
      <div className="relative">
        <img 
          src={anjuman.banner_url || anjuman.logo_url || `https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=800&h=300&fit=crop`}
          alt={anjuman.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {anjuman.is_verified && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
          </div>
        )}
        
        <Badge 
          className="absolute bottom-4 left-4 text-white border-0"
          style={{backgroundColor: typeColors[anjuman.type]}}
        >
          {anjuman.type}
        </Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" style={{color: '#6A0066'}}>
                {anjuman.name}
              </h2>
              {anjuman.tagline && (
                <p className="text-lg" style={{color: '#934790'}}>{anjuman.tagline}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{anjuman.location?.city}, {anjuman.location?.country}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" style={{color: '#934790'}} />
              <span style={{color: '#934790'}}>{anjuman.member_count || 0} members</span>
            </div>
            {anjuman.founded_year && (
              <span className="text-gray-500">Since {anjuman.founded_year}</span>
            )}
          </div>

          <Button
            onClick={handleJoinToggle}
            className={`w-full mb-4 ${
              isJoined 
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'primary-btn'
            }`}
          >
            {isJoined ? 'Joined ✓' : 'Join Anjuman'}
          </Button>
        </div>

        {/* About Section */}
        <div className="glassmorphism rounded-2xl p-4">
          <h3 className="text-lg font-bold mb-3" style={{color: '#6A0066'}}>About</h3>
          <p className="text-gray-700 leading-relaxed">
            {anjuman.description || "This Anjuman is dedicated to serving the Shia community and promoting Islamic values."}
          </p>
          
          {anjuman.activities && anjuman.activities.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2" style={{color: '#934790'}}>Activities:</h4>
              <div className="flex flex-wrap gap-2">
                {anjuman.activities.map((activity, index) => (
                  <Badge key={index} variant="outline" className="border-gray-300">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="glassmorphism rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold" style={{color: '#6A0066'}}>Upcoming Events</h3>
            <Button variant="ghost" size="sm" className="text-pink-600">View All</Button>
          </div>
          
          <div className="space-y-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5" style={{color: '#FF0066'}} />
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{color: '#6A0066'}}>{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} • {event.venue}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="glassmorphism rounded-2xl p-4">
          <h3 className="text-lg font-bold mb-3" style={{color: '#6A0066'}}>Contact Information</h3>
          
          <div className="space-y-3">
            {anjuman.contact_info?.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{anjuman.contact_info.address}</span>
              </div>
            )}
            
            {anjuman.contact_info?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <a href={`tel:${anjuman.contact_info.phone}`} className="text-gray-700 hover:text-pink-600">
                  {anjuman.contact_info.phone}
                </a>
              </div>
            )}
            
            {anjuman.contact_info?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <a href={`mailto:${anjuman.contact_info.email}`} className="text-gray-700 hover:text-pink-600">
                  {anjuman.contact_info.email}
                </a>
              </div>
            )}
            
            {anjuman.contact_info?.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <a href={anjuman.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600">
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Placeholder */}
        <div className="glassmorphism rounded-2xl p-4">
          <h3 className="text-lg font-bold mb-3" style={{color: '#6A0066'}}>Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3,4,5,6].map((index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}