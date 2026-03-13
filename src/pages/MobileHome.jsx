import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, X, Users, Heart, Calendar, MapPin, ChevronRight } from "lucide-react";

import StatusHeader from "@/components/status/StatusHeader";
import EnhancedPrayerTimes from "@/components/islamic/EnhancedPrayerTimes";
import DuaOfTheDay from "@/components/islamic/DuaOfTheDay";
import HadithOfTheDay from "@/components/islamic/HadithOfTheDay";
import QuickActionsGrid from "@/components/home/QuickActionsGrid";
import LiveStreamsSection from "@/components/home/LiveStreamsSection";
import EjaraSection from "@/components/home/EjaraSection";
import NotesPreview from "@/components/home/NotesPreview";
import WishesCarousel from "@/components/home/WishesCarousel";
import MajalisCarousel from "@/components/home/MajalisCarousel";
import ContestsCarousel from "@/components/home/ContestsCarousel";
import NearbyHighlights from "@/components/home/NearbyHighlights";

import { Event } from "@/entities/Event";
import { User } from "@/entities/User";

export default function MobileHome() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [showPremiumToast, setShowPremiumToast] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('status') === 'premium_success') {
      setShowPremiumToast(true);
      const timer = setTimeout(() => setShowPremiumToast(false), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const events = await Event.list('-date', 5);
      setUpcomingEvents(events);

      if (user) {
        const userJoinedEvents = events.filter((event) =>
        event.attendees?.includes(user.id)
        );
        setJoinedEvents(userJoinedEvents.map((e) => e.id));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleJoinEvent = async (eventId) => {
    if (!currentUser) {
      alert("Please log in to join an event.");
      return;
    }

    try {
      const event = upcomingEvents.find((e) => e.id === eventId);
      if (!event) return;

      const isAlreadyJoined = event.attendees?.includes(currentUser.id);
      const updatedAttendees = isAlreadyJoined ?
      event.attendees.filter((id) => id !== currentUser.id) :
      [...(event.attendees || []), currentUser.id];

      await Event.update(eventId, { attendees: updatedAttendees });

      setJoinedEvents((prev) =>
      isAlreadyJoined ?
      prev.filter((id) => id !== eventId) :
      [...prev, eventId]
      );

      loadData();
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  return (
    <div className="space-y-6 relative bg-gradient-to-br from-emerald-50 via-emerald-25 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      {showPremiumToast &&
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-4">
          <span>🎉 You are now a Premium Member. JazakAllah for supporting Zahoor.</span>
          <button onClick={() => setShowPremiumToast(false)}><X className="w-5 h-5" /></button>
        </div>
      }

      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M30 30m-20,0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3Cpath d='M30 10v40M10 30h40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
      </div>

      <div className="relative z-10">
        <StatusHeader />
        <div className="px-4 space-y-8">
          <EnhancedPrayerTimes />
          <DuaOfTheDay />
          <HadithOfTheDay />
          <QuickActionsGrid />
          <LiveStreamsSection />
          <EjaraSection />

          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 dark:from-emerald-800 dark:to-emerald-900 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Majalis, Mahfil & Events</h2>
                  <p className="text-emerald-100 dark:text-emerald-200 text-xs">Join spiritual gatherings in your community</p>
                </div>
              </div>
              <Link to={createPageUrl("Events")}>
                <Button size="icon" className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full shadow-md">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex-shrink-0 w-80">
                    <Link to={createPageUrl("Events")} className="block h-full">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 h-full flex flex-col justify-between hover:bg-white/20 transition-colors duration-300">
                        <div>
                          <div className="mb-3">
                            <div className="inline-block bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-2">
                              {event.event_type}
                            </div>
                            <h3 className="text-white font-bold text-lg leading-tight">{event.title}</h3>
                          </div>
                          
                          <p className="text-emerald-200 dark:text-emerald-100 text-sm mb-4 line-clamp-2">{event.description}</p>
                          
                          <div className="space-y-2 text-emerald-100 dark:text-emerald-200 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees?.length || 0} joined</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-semibold">
                                {event.created_by?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <span className="text-emerald-300 dark:text-emerald-200 text-xs">Posted by User</span>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleJoinEvent(event.id);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-1 text-sm shadow-lg h-8"
                            disabled={!joinedEvents.includes(event.id) && event.max_attendees && event.attendees?.length >= event.max_attendees}
                          >
                            {joinedEvents.includes(event.id) ? "Joined" : "Join Event"}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-white/60" />
                    <p className="text-white mb-4 text-lg">No upcoming events</p>
                    <Link to={createPageUrl("Events")}>
                      <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Event
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <NotesPreview currentUser={currentUser} />
          <WishesCarousel />
          <MajalisCarousel />
          <ContestsCarousel />
          <NearbyHighlights />

          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-700/50 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23059669' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23059669' stroke-width='1'/%3E%3Cpath d='M20 5v30M5 20h30' stroke='%23059669' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '40px 40px'
                }}
              />
            </div>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100 mb-3">Support Our Community</h3>
              <p className="text-emerald-700 dark:text-emerald-200 mb-6 text-lg leading-relaxed max-w-md mx-auto">
                Help us serve the Ummah better. Every contribution makes a difference in someone's spiritual journey.
              </p>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <Link to={createPageUrl("DonationSupport")} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg">
                    ❤️ Donate Now
                  </Button>
                </Link>
                <Link to={createPageUrl("GoPremium")} className="w-full">
                  <Button className="w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-md border-2 border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-800/50 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg">
                    💎 Go Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex justify-center py-6">
            <div className="flex items-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 dark:via-emerald-500 to-emerald-400 dark:to-emerald-500"></div>
              <div className="mx-4 w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full shadow-lg"></div>
              <div className="w-6 h-6 border-2 border-emerald-400 dark:border-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
              </div>
              <div className="mx-4 w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full shadow-lg"></div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-emerald-400 dark:via-emerald-500 to-emerald-400 dark:to-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}