import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Bell, Wallet, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";

export default function DesktopHeader() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await UserEntity.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(createPageUrl(`Questions?search=${encodeURIComponent(searchQuery)}`));
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link to={createPageUrl('Home')} className="flex items-center gap-3 min-w-[200px]">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png" 
            alt="Zahoor" 
            className="w-10 h-10 rounded-lg shadow-md object-cover"
          />
          <div>
            <h1 className="text-lg font-bold leading-none text-emerald-800">Zahoor</h1>
            <p className="text-xs text-emerald-600">Hearts Await Zahoor</p>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search questions, duas, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-2.5 border-emerald-200 bg-emerald-50/30 rounded-full focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-2 min-w-[200px] justify-end">
          <Link to={createPageUrl('Notifications')}>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-emerald-50">
              <Bell className="w-5 h-5 text-emerald-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </Link>
          
          <Link to={createPageUrl('Wallet')}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-50">
              <Wallet className="w-5 h-5 text-emerald-700" />
            </Button>
          </Link>
          
          <Link to={createPageUrl('Profile')}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-50">
              {currentUser?.profile_image ? (
                <img src={currentUser.profile_image} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-emerald-700" />
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}