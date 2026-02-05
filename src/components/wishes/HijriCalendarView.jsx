
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const hijriMonths = [
  'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
  'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HijriCalendarView({ specialDays = [] }) {
  const [date, setDate] = useState(new Date());
  const [hijriDetails, setHijriDetails] = useState({ month: null, year: null });
  const [calendarDays, setCalendarDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCalendarData = useCallback(async (year, month) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
      if (!response.ok) throw new Error('Failed to fetch calendar data');
      const data = await response.json();
      
      const days = data.data;
      if (days && days.length > 0) {
        // Set Hijri month/year from the first day's data
        const firstDayHijri = days[0].hijri;
        setHijriDetails({ month: firstDayHijri.month.number, year: firstDayHijri.year.gregorian }); // Adjusted to use gregorian year for Hijri API consistency

        // Get the day of the week of the first day of the month (0=Sun, 6=Sat)
        const firstDayOfMonth = new Date(`${year}-${month}-01`).getDay();
        
        let calendarGrid = [];
        // Add empty cells for days before the first day
        for (let i = 0; i < firstDayOfMonth; i++) {
          calendarGrid.push(null);
        }
        
        // Get today's date in the correct 'DD-MM-YYYY' format for comparison
        const todayObj = new Date();
        const dd = String(todayObj.getDate()).padStart(2, '0');
        const mm = String(todayObj.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = todayObj.getFullYear();
        const todayFormatted = `${dd}-${mm}-${yyyy}`;

        // Add the actual days
        days.forEach(day => {
          const hijriDay = day.hijri;
          const specialEvent = specialDays.find(sd => 
            sd.hijriDay === parseInt(hijriDay.day) && sd.hijriMonth === hijriDay.month.number
          );
          
          calendarGrid.push({
            gregorian: day.gregorian.day,
            hijri: hijriDay.day,
            isSpecial: !!specialEvent,
            isToday: day.gregorian.date === todayFormatted, // Corrected check for today's date
            holidays: hijriDay.holidays
          });
        });
        setCalendarDays(calendarGrid);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  }, [specialDays]);

  useEffect(() => {
    fetchCalendarData(date.getFullYear(), date.getMonth() + 1);
  }, [date, fetchCalendarData]);

  const nextMonth = () => {
    setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const getEventColor = (eventType) => {
    const colors = {
      'Wiladat': 'bg-green-100 text-green-800 border-green-200',
      'Shahadat': 'bg-red-100 text-red-800 border-red-200',
      'Eid': 'bg-purple-100 text-purple-800 border-purple-200',
      'Special Night': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[eventType] || 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const currentMonthSpecialDays = specialDays.filter(day => hijriDetails.month && day.hijriMonth === hijriDetails.month);

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <h3 className="text-lg font-bold text-emerald-800">
            {hijriDetails.month ? `${hijriMonths[hijriDetails.month - 1]} ${hijriDetails.year}` : 'Loading...'}
          </h3>
          <p className="text-xs text-emerald-600">
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-emerald-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayData, index) => (
                <div key={index} className="aspect-square">
                  {dayData ? (
                    <div className={`
                      h-full w-full rounded-lg flex flex-col items-center justify-center text-xs relative
                      ${dayData.isToday ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-emerald-50'}
                      ${dayData.isSpecial ? 'ring-2 ring-emerald-400' : ''}
                    `}>
                      <span className="text-[10px] text-gray-400 absolute top-1 right-1.5">
                        {dayData.gregorian}
                      </span>
                      <span className={`font-semibold ${
                        dayData.isToday ? 'text-white text-base' : 'text-emerald-800 text-sm'
                      }`}>
                        {dayData.hijri}
                      </span>
                      {dayData.isSpecial && (
                        <Star className="w-2 h-2 text-emerald-600 mt-1" fill="currentColor" />
                      )}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Events for Current Month */}
          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-semibold text-emerald-800">Special Days This Month</h4>
            {currentMonthSpecialDays.length > 0 ? currentMonthSpecialDays.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-emerald-800">{event.name}</p>
                  <p className="text-xs text-emerald-600">
                    {event.hijriDay} {hijriMonths[event.hijriMonth - 1]}
                  </p>
                </div>
                <Badge className={getEventColor(event.type)}>
                  {event.type}
                </Badge>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No special events listed for this month.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
