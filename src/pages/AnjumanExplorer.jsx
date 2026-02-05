
import React, { useState, useEffect } from "react";
import { Anjuman } from "@/entities/Anjuman";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Filter, MapPin, Users, Calendar, Mail, Plus, CheckCircle, Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AnjumanExplorer() {
  const navigate = useNavigate();
  const [anjumans, setAnjumans] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [joinedAnjumans, setJoinedAnjumans] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const allAnjumans = await Anjuman.list('-member_count');
      setAnjumans(allAnjumans);
      
      if (user) {
        const userJoined = allAnjumans.filter(anjuman => 
          anjuman.members?.includes(user.id)
        );
        setJoinedAnjumans(userJoined.map(a => a.id));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleJoinAnjuman = async (anjumanId) => {
    if (!currentUser) return;
    
    try {
      const anjuman = anjumans.find(a => a.id === anjumanId);
      if (!anjuman) return;

      const isAlreadyJoined = anjuman.members?.includes(currentUser.id);
      const updatedMembers = isAlreadyJoined 
        ? anjuman.members.filter(id => id !== currentUser.id)
        : [...(anjuman.members || []), currentUser.id];

      await Anjuman.update(anjumanId, { 
        members: updatedMembers,
        member_count: updatedMembers.length
      });
      
      setJoinedAnjumans(prev => 
        isAlreadyJoined 
          ? prev.filter(id => id !== anjumanId)
          : [...prev, anjumanId]
      );
      
      loadData();
    } catch (error) {
      console.error("Error joining anjuman:", error);
    }
  };

  const filteredAnjumans = anjumans.filter(anjuman => {
    const matchesSearch = anjuman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (anjuman.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || anjuman.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const featuredAnjumans = anjumans.slice(0, 3);

  // Dummy suggested anjumans data
  const suggestedAnjumans = [
    { id: 'suggest1', name: 'Anjuman-e-Haideri', location: { city: 'Delhi', country: 'India' }, type: 'majlis', member_count: 2500, logo_url: 'https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=100&h=100&fit=crop' },
    { id: 'suggest2', name: 'Matami Sangat-e-Karbala', location: { city: 'Lucknow', country: 'India' }, type: 'matami', member_count: 1200, logo_url: 'https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=100&h=100&fit=crop' },
    { id: 'suggest3', name: 'Anjuman-e-Fatima Zahra (s.a.)', location: { city: 'Mumbai', country: 'India' }, type: 'women', member_count: 800, logo_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop' },
    { id: 'suggest4', name: 'Ya Hussain Youth Group', location: { city: 'Hyderabad', country: 'India' }, type: 'youth', member_count: 3100, logo_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop' },
    { id: 'suggest5', name: 'Anjuman-e-Ghamkhwaran', location: { city: 'Karachi', country: 'Pakistan' }, type: 'majlis', member_count: 5000, logo_url: 'https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=100&h=100&fit=crop' },
    { id: 'suggest6', name: 'Ansar-e-Zahoor', location: { city: 'Najaf', country: 'Iraq' }, type: 'charity', member_count: 4400, logo_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop' },
    { id: 'suggest7', name: 'Matami Tola Qum', location: { city: 'Qom', country: 'Iran' }, type: 'matami', member_count: 2700, logo_url: 'https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=100&h=100&fit=crop' },
    { id: 'suggest8', name: 'Anjuman-e-Abbas Alamdar', location: { city: 'London', country: 'UK' }, type: 'others', member_count: 1900, logo_url: 'https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=100&h=100&fit=crop' },
    { id: 'suggest9', name: 'Shia Women Welfare Circle', location: { city: 'New York', country: 'USA' }, type: 'women', member_count: 600, logo_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop' },
    { id: 'suggest10', name: 'Awaiters 313 Group', location: { city: 'Global', country: 'Online' }, type: 'youth', member_count: 10000, logo_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop' }
  ];

  const typeColors = {
    majlis: "#6A0066",
    matami: "#FF0066",
    youth: "#934790",
    women: "#E8D4B7",
    charity: "#6A0066",
    others: "#934790"
  };

  const AnjumanCard = ({ anjuman, isFeatured = false, isSuggested = false }) => {
    const isJoined = joinedAnjumans.includes(anjuman.id);
    
    return (
      <div 
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${
          isFeatured ? 'w-80 flex-shrink-0' : ''
        }`}
      >
        <div className="relative">
          <img 
            src={anjuman.banner_url || anjuman.logo_url || `https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=400&h=200&fit=crop`}
            alt={anjuman.name}
            className="w-full h-32 object-cover rounded-t-2xl"
          />
          {anjuman.is_verified && (
            <CheckCircle className="absolute top-3 right-3 w-6 h-6 text-green-500 bg-white rounded-full" />
          )}
          <Badge 
            className="absolute bottom-3 left-3 text-white border-0"
            style={{backgroundColor: typeColors[anjuman.type]}}
          >
            {anjuman.type}
          </Badge>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2" style={{color: '#6A0066'}}>
            {anjuman.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{anjuman.location?.city}, {anjuman.location?.country}</span>
          </div>
          
          {anjuman.tagline && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {anjuman.tagline}
            </p>
          )}
          
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Users className="w-4 h-4" style={{color: '#934790'}} />
            <span style={{color: '#934790'}}>{anjuman.member_count || 0} members</span>
            {anjuman.founded_year && (
              <span className="text-gray-500">• Since {anjuman.founded_year}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            {!isSuggested && (
              <Button
                onClick={() => handleJoinAnjuman(anjuman.id)}
                className={`flex-1 ${
                  isJoined 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'primary-btn'
                }`}
                size="sm"
              >
                {isJoined ? 'Joined' : 'Join'}
              </Button>
            )}
            
            <Link to={createPageUrl(`AnjumanDetails?id=${anjuman.id}`)}>
              <Button variant="outline" size="sm" className="border-gray-300">
                Details
              </Button>
            </Link>
            
            <Button variant="outline" size="icon" className="border-gray-300">
              <Calendar className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="icon" className="border-gray-300">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b" style={{borderColor: '#E8D4B7'}}>
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-pink-50">
            <ArrowLeft className="w-5 h-5" style={{color: '#6A0066'}} />
          </Button>
          <h1 className="text-xl font-bold" style={{color: '#6A0066'}}>Anjuman Explorer</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-pink-50">
              <Search className="w-5 h-5" style={{color: '#6A0066'}} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-pink-50">
              <Filter className="w-5 h-5" style={{color: '#6A0066'}} />
            </Button>
          </div>
        </div>
      </div>

      {/* Create New Anjuman Banner */}
      <div className="p-4">
        <div className="rounded-2xl p-4 border-2 border-dashed" style={{borderColor: '#E8D4B7', backgroundColor: 'rgba(232, 212, 183, 0.1)'}}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1" style={{color: '#6A0066'}}>Can't find your Anjuman?</h3>
              <p className="text-sm" style={{color: '#934790'}}>Create one now and bring your community together!</p>
            </div>
            <Link to={createPageUrl('CreateAnjuman')}>
              <Button className="primary-btn" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Create New
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="p-4 space-y-4 bg-gray-50 border-b" style={{borderColor: '#E8D4B7'}}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search Anjuman by name or city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="nearby">Nearby</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="majlis">Majlis</SelectItem>
              <SelectItem value="matami">Matami</SelectItem>
              <SelectItem value="youth">Youth</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Featured Anjumans */}
        {featuredAnjumans.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5" style={{color: '#FF0066'}} />
              <h2 className="text-lg font-bold" style={{color: '#6A0066'}}>Featured Anjumans</h2>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {featuredAnjumans.map((anjuman) => (
                <AnjumanCard key={anjuman.id} anjuman={anjuman} isFeatured />
              ))}
            </div>
          </div>
        )}

        {/* All Anjumans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{color: '#6A0066'}}>All Anjumans</h2>
            {currentUser?.role === 'admin' && (
              <Link to={createPageUrl('CreateAnjuman')}>
                <Button className="primary-btn" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Create New
                </Button>
              </Link>
            )}
          </div>
          
          <div className="space-y-4">
            {filteredAnjumans.length > 0 ? (
              filteredAnjumans.map((anjuman) => (
                <AnjumanCard key={anjuman.id} anjuman={anjuman} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{color: '#6A0066'}}>No Anjumans Found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Anjumans */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{color: '#6A0066'}}>Suggested for You</h2>
          <div className="grid grid-cols-1 gap-4">
            {suggestedAnjumans.map((anjuman) => (
              <AnjumanCard key={anjuman.id} anjuman={anjuman} isSuggested />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Admins */}
      {currentUser?.role === 'admin' && (
        <div className="fixed bottom-24 right-6">
          <Link to={createPageUrl('CreateAnjuman')}>
            <Button 
              className="rounded-full w-14 h-14 primary-btn shadow-lg"
              size="icon"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
