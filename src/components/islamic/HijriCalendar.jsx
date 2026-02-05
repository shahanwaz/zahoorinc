import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HijriCalendar({ events, onDateSelect }) {
    const [currentHijriDate, setCurrentHijriDate] = useState({ month: null, year: null });
    const [calendarData, setCalendarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todayHijri, setTodayHijri] = useState('');
    const [todayGregorian, setTodayGregorian] = useState('');

    // 1. Fetch the current Hijri date on initial mount to know where to start
    useEffect(() => {
        const getInitialDate = async () => {
            try {
                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                setTodayGregorian(`${year}-${month}-${day}`);
                
                const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`);
                if (!response.ok) throw new Error("Failed to get initial Hijri date");
                const data = await response.json();
                
                const initialMonth = data.data.hijri.month.number;
                const initialYear = data.data.hijri.year;
                
                setCurrentHijriDate({ month: initialMonth, year: initialYear });
                setTodayHijri(data.data.hijri.date.replace(/-/g, '-'));
            } catch (error) {
                console.error("Error getting initial date:", error);
                // Fallback to a sensible default if API fails
                setCurrentHijriDate({ month: 9, year: 1446 });
            }
        };
        getInitialDate();
    }, []);

    // 2. Fetch the full month's calendar data whenever the month or year changes
    useEffect(() => {
        if (!currentHijriDate.month || !currentHijriDate.year) return;

        const fetchCalendarData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.aladhan.com/v1/hToGCalendar/${currentHijriDate.month}/${currentHijriDate.year}`);
                if (!response.ok) throw new Error("Failed to fetch calendar data");
                const data = await response.json();
                setCalendarData(data.data);
            } catch (error) {
                console.error("Error fetching calendar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarData();
    }, [currentHijriDate]);

    const handleMonthChange = (offset) => {
        setCurrentHijriDate(prev => {
            let newMonth = prev.month + offset;
            let newYear = prev.year;
            if (newMonth > 12) {
                newMonth = 1;
                newYear++;
            } else if (newMonth < 1) {
                newMonth = 12;
                newYear--;
            }
            return { month: newMonth, year: newYear };
        });
    };

    const getMonthName = () => {
        return calendarData?.[0]?.hijri.month.en || "";
    };

    // Calculate empty days to correctly position the first day of the month
    const firstDayOfMonthWeekday = calendarData.length > 0 ? weekdayNames.indexOf(calendarData[0].gregorian.weekday.en.substring(0, 3)) : 0;

    return (
        <div className="bg-white rounded-xl shadow-md p-4 w-full">
            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={() => handleMonthChange(-1)}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                    <h3 className="font-bold text-lg text-[--primary-green]">{getMonthName()} {currentHijriDate.year}</h3>
                    <p className="text-sm text-gray-500">{calendarData?.[0]?.gregorian.month.en} / {calendarData?.[calendarData.length-1]?.gregorian.month.en} {calendarData?.[0]?.gregorian.year}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleMonthChange(1)}>
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-6 h-6 animate-spin text-[--primary-green]" />
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-1 text-center">
                    {weekdayNames.map(day => (
                        <div key={day} className="text-xs font-bold text-gray-500 pb-2">{day}</div>
                    ))}
                    
                    {/* Empty cells for padding */}
                    {Array.from({ length: firstDayOfMonthWeekday }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {/* Calendar days */}
                    {calendarData.map(day => {
                        const hijriDay = day.hijri.day;
                        const gregorianDay = day.gregorian.day;
                        const isToday = day.hijri.date.replace(/-/g, '-') === todayHijri;
                        
                        // Check for events
                        const gregorianDateStr = day.gregorian.date.split('-').reverse().join('-'); // Format to YYYY-MM-DD
                        const event = events ? events[gregorianDateStr] : null;

                        return (
                            <div 
                                key={day.hijri.date} 
                                className={`p-1 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors ${isToday ? 'bg-emerald-100' : ''}`}
                                onClick={() => onDateSelect && onDateSelect({gregorian: day.gregorian, hijri: day.hijri})}
                            >
                                <p className={`font-bold text-lg ${isToday ? 'text-[--primary-green]' : 'text-gray-800'}`}>{hijriDay}</p>
                                <p className="text-xs text-gray-400">{gregorianDay}</p>
                                {event && (
                                    <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${event.type === 'celebration' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}