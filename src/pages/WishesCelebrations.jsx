
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Star, Gift, Clock, ChevronRight } from 'lucide-react';

import HijriCalendarView from '@/components/wishes/HijriCalendarView';
import EventCard from '@/components/wishes/EventCard';
import WishCategory from '@/components/wishes/WishCategory';

export default function WishesCelebrations() {
  const navigate = useNavigate();
  const [specialDays, setSpecialDays] = useState([]);
  const [nextHoliday, setNextHoliday] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Wish categories with static data (in real app, these would come from backend)
  const wishCategories = [
  {
    id: 'wiladat',
    name: 'Wiladat Wishes',
    subtitle: 'Birth anniversaries of Ahlulbayt',
    icon: '🎂',
    color: 'from-emerald-500 to-emerald-600',
    events: ['Imam Ali (A.S.)', 'Imam Hasan (A.S.)', 'Imam Hussain (A.S.)', 'Lady Fatima (A.S.)']
  },
  {
    id: 'shahadat',
    name: 'Shahadat Wishes',
    subtitle: 'Martyrdom commemorations',
    icon: '🕌',
    color: 'from-red-500 to-red-600',
    events: ['Imam Ali (A.S.)', 'Imam Hasan (A.S.)', 'Imam Hussain (A.S.)', 'Lady Fatima (A.S.)']
  },
  {
    id: 'eid',
    name: 'Eid Wishes',
    subtitle: 'Islamic festivals & celebrations',
    icon: '🌙',
    color: 'from-purple-500 to-purple-600',
    events: ['Eid al-Fitr', 'Eid al-Adha', 'Eid al-Ghadeer', 'Eid al-Mubahila']
  },
  {
    id: 'muharram',
    name: 'Muharram & Ashura',
    subtitle: 'Commemoration of Karbala',
    icon: '⚫',
    color: 'from-gray-700 to-gray-900',
    events: ['Ashura', 'Arbaeen', 'Chehlum', 'Muharram Majlis']
  }];


  const getStaticSpecialDays = useCallback(() => [
  {
    name: 'Wiladat Imam Ali (A.S.)',
    hijriDay: 13,
    hijriMonth: 7, // Rajab
    type: 'Wiladat',
    gregorianDate: '2025-02-10'
  },
  {
    name: 'Laylat al-Miraj',
    hijriDay: 27,
    hijriMonth: 7, // Rajab
    type: 'Special Night',
    gregorianDate: '2025-02-24'
  },
  {
    name: 'Wiladat Imam Mahdi (A.S.)',
    hijriDay: 15,
    hijriMonth: 8, // Sha'ban
    type: 'Wiladat',
    gregorianDate: '2025-03-14'
  },
  {
    name: 'Eid al-Fitr',
    hijriDay: 1,
    hijriMonth: 10, // Shawwal
    type: 'Eid',
    gregorianDate: '2025-04-30'
  }],
  []);

  const getNextStaticHoliday = useCallback(() => ({
    name: 'Wiladat Imam Ali (A.S.)',
    hijriDate: '13 Rajab 1446',
    gregorianDate: 'Feb 10, 2025', // Updated format for consistency
    daysLeft: '15'
  }), []);

  const generateUpcomingEvents = useCallback((specialDays) => {
    return specialDays.slice(0, 6).map((day) => ({
      ...day,
      daysLeft: Math.floor(Math.random() * 30) + 1 // Mock calculation
    }));
  }, []);

  const fetchSpecialDaysData = useCallback(async () => {
    setLoading(true);
    try {
      const apis = [
      // API 1: Special Days
      () => fetch('https://api.aladhan.com/v1/specialDays', { mode: 'cors' }),

      // API 2: Next Holiday
      () => fetch('https://api.aladhan.com/v1/nextHijriHoliday?calendarMethod=UAQ', { mode: 'cors' }),

      // API 3: Holidays for specific month (currently unused in the logic below, but kept as per outline)
      () => fetch('https://api.aladhan.com/v1/hijriHolidays/15/7', { mode: 'cors' })];


      let specialDaysData = [];
      let processedNextHoliday = null;

      // Try to fetch special days
      try {
        const response = await apis[0]();
        if (response.ok) {
          const data = await response.json();
          specialDaysData = data.data || [];
        }
      } catch (error) {
        console.log("Special days API failed:", error);
      }

      // Try to fetch and process next holiday
      try {
        const response = await apis[1]();
        if (response.ok) {
          const apiData = await response.json();
          const holidayData = apiData.data;

          if (holidayData && holidayData.gregorian && holidayData.hijri) {
            const [gDay, gMonth, gYear] = holidayData.gregorian.date.split('-');
            const futureDate = new Date(`${gYear}-${gMonth}-${gDay}`);
            const today = new Date();
            futureDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            const diffTime = futureDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            processedNextHoliday = {
              name: holidayData.hijri.holidays[0] || 'Upcoming Event',
              hijriDate: `${holidayData.hijri.day} ${holidayData.hijri.month.en} ${holidayData.hijri.year}`,
              gregorianDate: new Date(`${gYear}-${gMonth}-${gDay}`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              daysLeft: daysLeft > 0 ? daysLeft : daysLeft === 0 ? 'Today' : 'Past' // Handle 0 or negative days
            };
          }
        }
      } catch (error) {
        console.log("Next holiday API failed:", error);
      }

      // Use static fallback data if APIs failed or returned no data
      if (specialDaysData.length === 0) {
        specialDaysData = getStaticSpecialDays();
      }

      if (!processedNextHoliday || processedNextHoliday.daysLeft === 'Past') {// Also fallback if it's a past event
        processedNextHoliday = getNextStaticHoliday();
      }

      setSpecialDays(specialDaysData);
      setNextHoliday(processedNextHoliday);
      setUpcomingEvents(generateUpcomingEvents(specialDaysData));

    } catch (error) {
      console.error('An unexpected error occurred during data fetching:', error);
      // Use static fallback data if a non-API-fetch related error occurs
      const fallbackData = getStaticSpecialDays();
      setSpecialDays(fallbackData);
      setNextHoliday(getNextStaticHoliday());
      setUpcomingEvents(generateUpcomingEvents(fallbackData));
    } finally {
      setLoading(false);
    }
  }, [getStaticSpecialDays, getNextStaticHoliday, generateUpcomingEvents]);

  useEffect(() => {
    fetchSpecialDaysData();
  }, [fetchSpecialDaysData]);

  if (selectedCategory) {
    return (
      <WishCategory
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)} />);


  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-emerald-50 mr-4">

            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-emerald-800">Wishes & Celebrations</h1>
            <p className="text-sm text-emerald-600">Islamic occasions & spiritual moments</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hijri Calendar Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-emerald-800">Islamic Calendar</h2>
          </div>
          
          {loading ?
          <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-sm text-emerald-600 mt-2">Loading special days...</p>
            </div> :

          <HijriCalendarView specialDays={specialDays} />
          }
        </div>

        {/* Next Holiday Countdown */}
        {nextHoliday &&
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-slate-50 text-lg font-bold">Next Occasion</h3>
                  <p className="text-emerald-100 text-sm">{nextHoliday.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{nextHoliday.daysLeft}</p>
                <p className="text-emerald-200 text-sm">{nextHoliday.daysLeft === 'Today' || nextHoliday.daysLeft === 'Past' ? '' : 'days left'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-emerald-100 text-sm">
                {nextHoliday.hijriDate} • {nextHoliday.gregorianDate}
              </p>
            </div>
          </div>
        }

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-bold text-emerald-800">Upcoming Events</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-emerald-600">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.map((event, index) =>
            <EventCard key={index} event={event} />
            )}
          </div>
        </div>

        {/* Wishes Categories */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-emerald-800">Wishes Collection</h2>
          </div>

          {wishCategories.map((category, index) =>
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300">

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-800">{category.name}</h3>
                    <p className="text-sm text-emerald-600">{category.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-400" />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.events.slice(0, 3).map((event, eventIndex) =>
              <Badge key={eventIndex} variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                    {event}
                  </Badge>
              )}
                {category.events.length > 3 &&
              <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-500">
                    +{category.events.length - 3} more
                  </Badge>
              }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}