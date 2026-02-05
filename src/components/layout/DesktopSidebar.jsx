import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, MessageCircle, Briefcase, Sparkles, Video, BookOpen, 
  Baby, Image, UserSearch, Calendar, Wallet, Bookmark, Settings,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", icon: Home, path: "Home" },
  { name: "Community Q&A", icon: MessageCircle, path: "Questions" },
  { name: "Ejara Services", icon: Briefcase, path: "EjaraServices" },
  { name: "Istikhara", icon: Sparkles, path: "Istikhara" },
  { name: "Majalis & Lectures", icon: Video, path: "MajalisLectures" },
  { name: "Media Library", icon: BookOpen, path: "MediaLibrary" },
  { name: "Kids Section", icon: Baby, path: "MediaLibrary?tab=kids" },
  { name: "Gallery", icon: Image, path: "MediaLibrary?tab=gallery" },
  { name: "Find Maulana", icon: UserSearch, path: "FindMaulana" },
  { name: "Events", icon: Calendar, path: "Events" },
  { name: "Wallet", icon: Wallet, path: "Wallet" },
  { name: "Saved Items", icon: Bookmark, path: "SavedItems" },
  { name: "Premium", icon: Crown, path: "GoPremium", highlight: true },
  { name: "Settings", icon: Settings, path: "Profile" }
];

export default function DesktopSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    const currentPath = location.pathname;
    const navPath = createPageUrl(path.split('?')[0]);
    return currentPath === navPath;
  };

  return (
    <aside className="fixed left-0 top-[73px] bottom-0 w-64 bg-white border-r border-emerald-100 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.name}
              to={createPageUrl(item.path)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                active 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md" 
                  : item.highlight
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}