import React, { useState, useEffect } from "react";
import { Maulana } from "@/entities/Maulana";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Filter,
  ChevronRight,
  GraduationCap,
  Mic
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FindMaulana() {
  const [maulanas, setMaulanas] = useState([]);
  const [filteredMaulanas, setFilteredMaulanas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    location: "",
    expertise: "all",
    minRating: 0
  });

  useEffect(() => {
    loadMaulanas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [maulanas, searchQuery, filters]);

  const loadMaulanas = async () => {
    try {
      setLoading(true);
      const data = await Maulana.list('-rating');
      setMaulanas(data);
    } catch (error) {
      console.error("Error loading maulanas:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...maulanas];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.services?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(m => m.amama_type === filters.category);
    }

    // Location filter
    if (filters.location.trim()) {
      filtered = filtered.filter(m =>
        m.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        m.location?.country?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Expertise filter
    if (filters.expertise !== "all") {
      filtered = filtered.filter(m =>
        m.services?.some(s => s.toLowerCase().includes(filters.expertise.toLowerCase()))
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(m => (m.rating || 0) >= filters.minRating);
    }

    setFilteredMaulanas(filtered);
  };

  const getRoleBadge = (amamaType) => {
    if (amamaType === "black") {
      return { icon: GraduationCap, label: "Maulana", color: "bg-emerald-100 text-emerald-700 border-emerald-300" };
    }
    return { icon: Mic, label: "Zakir", color: "bg-blue-100 text-blue-700 border-blue-300" };
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      location: "",
      expertise: "all",
      minRating: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-emerald-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4 text-center">
            🎓 Find Religious Scholars
          </h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
            <Input
              placeholder="Search by name, city, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-12 h-12 border-emerald-200 focus:border-emerald-500 bg-white shadow-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(true)}
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-emerald-50"
            >
              <Filter className="w-5 h-5 text-emerald-600" />
            </Button>
          </div>

          {/* Active Filters Display */}
          {(filters.category !== "all" || filters.expertise !== "all" || filters.minRating > 0 || filters.location.trim()) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600">Filters:</span>
              {filters.category !== "all" && (
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  {filters.category === "black" ? "Maulana" : "Zakir"}
                </Badge>
              )}
              {filters.expertise !== "all" && (
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  {filters.expertise}
                </Badge>
              )}
              {filters.minRating > 0 && (
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  {filters.minRating}★ & above
                </Badge>
              )}
              {filters.location.trim() && (
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  {filters.location}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-emerald-700">Loading scholars...</p>
            </div>
          </div>
        ) : filteredMaulanas.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">No Scholars Found</h3>
            <p className="text-emerald-600 mb-4">
              {searchQuery || filters.category !== "all" || filters.expertise !== "all"
                ? "Try adjusting your search or filters"
                : "No scholars available at the moment"}
            </p>
            {(filters.category !== "all" || filters.expertise !== "all" || filters.minRating > 0 || filters.location.trim()) && (
              <Button
                onClick={resetFilters}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaulanas.map((maulana) => {
              const roleBadge = getRoleBadge(maulana.amama_type);
              const RoleIcon = roleBadge.icon;

              return (
                <Card key={maulana.id} className="group hover:shadow-xl transition-all duration-300 border-emerald-100 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    {/* Profile Header */}
                    <div className="relative h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-500 p-4">
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4'%3E%3Cpath d='M15 15m-10,0a10,10 0 1,1 20,0a10,10 0 1,1 -20,0'/%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '30px 30px'
                          }}
                        />
                      </div>

                      {/* Profile Picture */}
                      <div className="relative z-10 flex items-end justify-between">
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                          {maulana.profile_image_url ? (
                            <img 
                              src={maulana.profile_image_url} 
                              alt={maulana.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                              <span className="text-2xl font-bold text-emerald-600">
                                {maulana.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Verified Badge */}
                        {maulana.is_verified && (
                          <Badge className="bg-white/90 text-emerald-700 border-0 shadow-md">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Name and Role */}
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-emerald-900 leading-tight">
                            {maulana.name}
                          </h3>
                          <Badge className={`${roleBadge.color} border flex items-center gap-1`}>
                            <RoleIcon className="w-3 h-3" />
                            {roleBadge.label}
                          </Badge>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>{maulana.location?.city}, {maulana.location?.country}</span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (maulana.rating || 0)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {maulana.rating?.toFixed(1) || "0.0"} ({maulana.review_count || 0} reviews)
                        </span>
                      </div>

                      {/* Expertise Tags */}
                      {maulana.services && maulana.services.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {maulana.services.slice(0, 3).map((service, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-amber-300 text-amber-700 bg-amber-50 text-xs"
                            >
                              {service}
                            </Badge>
                          ))}
                          {maulana.services.length > 3 && (
                            <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                              +{maulana.services.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Bio Preview */}
                      {maulana.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {maulana.bio}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Link to={createPageUrl(`MaulanaProfile?id=${maulana.id}`)} className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md group-hover:shadow-lg transition-all">
                            View Profile
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                        {maulana.contact_info?.phone && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                            onClick={() => window.open(`tel:${maulana.contact_info.phone}`)}
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="bg-white border-emerald-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald-900 text-xl font-bold">Filter Scholars</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Category Filter */}
            <div>
              <Label className="text-emerald-800 font-medium mb-2 block">Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="black">🎓 Maulana (Syed)</SelectItem>
                  <SelectItem value="white">🎤 Zakir (Non-Syed)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <Label className="text-emerald-800 font-medium mb-2 block">Location</Label>
              <Input
                placeholder="Enter city or country"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>

            {/* Expertise Filter */}
            <div>
              <Label className="text-emerald-800 font-medium mb-2 block">Expertise</Label>
              <Select value={filters.expertise} onValueChange={(value) => setFilters({ ...filters, expertise: value })}>
                <SelectTrigger className="border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  <SelectItem value="fiqh">Fiqh</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="quran">Quran</SelectItem>
                  <SelectItem value="majlis">Majlis</SelectItem>
                  <SelectItem value="marriage">Marriage/Nikah</SelectItem>
                  <SelectItem value="istikhara">Istikhara</SelectItem>
                  <SelectItem value="tuition">Tuition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div>
              <Label className="text-emerald-800 font-medium mb-2 block">Minimum Rating</Label>
              <Select 
                value={filters.minRating.toString()} 
                onValueChange={(value) => setFilters({ ...filters, minRating: parseInt(value) })}
              >
                <SelectTrigger className="border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Ratings</SelectItem>
                  <SelectItem value="3">3★ & above</SelectItem>
                  <SelectItem value="4">4★ & above</SelectItem>
                  <SelectItem value="5">5★ only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Reset
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}