import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger } from
"@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { LogOut, Crown, UserCog } from "lucide-react";

export default function RightSidebar({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuSections = [
  {
    title: "MAIN",
    items: [
    { emoji: "🏠", label: "Home", path: "Home" },
    { emoji: "📅", label: "Mahfil, Majalis & Events", path: "Events" },
    { emoji: "💰", label: "Wallet", path: "Wallet" },
    { emoji: "💳", label: "Payment", path: "Payment" },
    { emoji: "🕊️", label: "Ejara Services", path: "EjaraServices" },
    { emoji: "🔮", label: "Istikhara Service", path: "Istikhara" },
    { emoji: "🎥", label: "Media Library", path: "MediaLibrary" },
    { emoji: "🎤", label: "Majalis & Lectures", path: "MediaLibrary?tab=majalis" },
    { emoji: "🏆", label: "Contests & Rewards", path: "ContestsRewards" },
    { emoji: "🍲", label: "Halal Food Near Me", path: "Nearby" }]

  },
  {
    title: "SPIRITUAL CORNER",
    items: [
    { emoji: "📖", label: "Duas & Ziyarat", path: "Duas" },
    { emoji: "🧭", label: "Qibla Compass", path: "QiblaCompass" },
    { emoji: "🕋", label: "Prayer Times", path: "PrayerTimesPage" },
    { emoji: "📅", label: "Islamic Calendar", path: "IslamicCalendar" },
    { emoji: "🌿", label: "Awaiters Corner (313)", path: "AwaitersCorner" }]

  },
  {
    title: "COMMUNITY",
    items: [
    { emoji: "📍", label: "Nearby", path: "Nearby" },
    { emoji: "❓", label: "Ask Questions", path: "Questions" },
    { emoji: "👥", label: "Anjuman Explorer", path: "AnjumanExplorer" },
    { emoji: "➕", label: "Create Anjuman", path: "CreateAnjuman" },
    { emoji: "👳‍♂️", label: "Find Maulana", path: "FindMaulana", premium: true },
    { emoji: "❤️", label: "Donate & Support", path: "DonationSupport" },
    { emoji: "🎉", label: "Wishes & Celebrations", path: "WishesCelebrations" }]

  },
  {
    title: "PERSONAL",
    items: [
    { emoji: "🌀", label: "My Status", path: "MyStatus" },
    { emoji: "🔔", label: "Notifications", path: "Notifications" },
    { emoji: "🙍", label: "Profile", path: "Profile" },
    { emoji: "📓", label: "Bayaz / Notes", path: "Notes" },
    { emoji: "🔖", label: "Saved / Bookmarks", path: "SavedItems" }]

  },
  {
    title: "SETTINGS",
    items: [
    { emoji: "🔔", label: "Azaan Settings", path: "AzaanSettings" },
    { emoji: "🌐", label: "Language & RTL", path: "LanguageSettings" },
    { emoji: "🆘", label: "Help & Report Content", path: "HelpAndReportContent" }]

  },
  {
    title: "ABOUT & LEGAL",
    items: [
    { emoji: "ℹ️", label: "About Zahoor", path: "AboutUs" },
    { emoji: "📜", label: "Terms & Conditions", path: "TermsAndConditions" },
    { emoji: "🔒", label: "Privacy Policy", path: "PrivacyPolicy" }]

  },
  {
    title: "ROLES & ADMIN",
    items: [
    { emoji: "🎓", label: "Apply as Tutor/Maulana", path: "Profile" }]

  }];


  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="dialog-bg w-full max-w-sm sm:max-w-md p-0 flex flex-col">
        {/* Enhanced Header Section with User Info + CTAs */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative overflow-hidden">
          {/* Islamic Pattern Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M30 30m-20,0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3Cpath d='M30 10v40M10 30h40'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />

          
          <div className="relative z-10">
            {/* User Profile Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={currentUser?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.full_name || 'User')}&background=ffffff&color=059669`}
                alt={currentUser?.full_name || 'User'}
                className="w-16 h-16 rounded-full border-4 border-white/30 shadow-lg" />

              <div className="flex-1 min-w-0">
                <h3 className="text-slate-50 text-lg font-bold leading-tight truncate">
                  {currentUser?.full_name || 'User'}
                </h3>
                <p className="text-emerald-100 text-sm truncate">
                  {currentUser?.email || 'user@zahoor.app'}
                </p>
                {currentUser?.user_type && currentUser.user_type !== 'general' &&
                <Badge className="mt-1 bg-white/20 text-white border-white/30 text-xs">
                    {currentUser.user_type === 'maulana' && '🎓 Maulana'}
                    {currentUser.user_type === 'zakir' && '🎤 Zakir'}
                    {currentUser.user_type === 'zakera' && '👩‍🦱 Zakera'}
                    {currentUser.user_type === 'tutor' && '📚 Tutor'}
                    {currentUser.user_type === 'admin' && '👑 Admin'}
                  </Badge>
                }
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link to={createPageUrl("Profile")} className="block">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm justify-start">
                  <UserCog className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </Link>
              <Link to={createPageUrl("GoPremium")} className="block">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 font-bold shadow-lg justify-start">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="py-4 space-y-4">
            {menuSections.map((section) =>
            <div key={section.title}>
                <h3 className="px-4 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  {section.title}
                </h3>
                <div className="space-y-1 px-2">
                  {section.items.map((item, index) =>
                <Link
                  key={index}
                  to={createPageUrl(item.path)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer group">

                      <span className="text-xl w-6 text-center group-hover:scale-110 transition-transform">{item.emoji}</span>
                      <span className="font-medium flex-1 text-emerald-800 group-hover:text-emerald-900">
                        {item.label}
                      </span>
                      {item.premium &&
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                          💎
                        </Badge>
                  }
                    </Link>
                )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Bottom Fixed Section - Logout Only */}
        <div className="p-4 border-t border-emerald-200 bg-white">
          {currentUser &&
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold">

              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          }
        </div>
      </SheetContent>
    </Sheet>);

}