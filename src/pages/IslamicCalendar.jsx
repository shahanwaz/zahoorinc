import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, AlertTriangle, Moon, Sunrise as SunriseIcon, Sun, Sunset, Bell, Play, CheckCircle, AlertCircle } from "lucide-react";
import HijriCalendar from "@/components/islamic/HijriCalendar";

// Manual data for important dates, as requested. In a real app, this could be an API.
const importantDatesData = [
    { hijri: "12-03", event: "Wiladat of Prophet Muhammad (PBUH)", type: "good" },
    { hijri: "10-01", event: "Shahadat of Imam Hussain (AS)", type: "nahas" },
    { hijri: "13-07", event: "Wiladat of Imam Ali (AS)", type: "good" },
    { hijri: "21-09", event: "Shahadat of Imam Ali (AS)", type: "nahas" },
    { hijri: "15-08", event: "Wiladat of Imam Mahdi (ATFS)", type: "good" },
    { hijri: "03-08", event: "Wiladat of Imam Hussain (AS)", type: "good" },
];

const prayerIcons = {
    Fajr: Moon,
    Sunrise: SunriseIcon,
    Dhuhr: Sun,
    Asr: Sun,
    Maghrib: Sunset,
    Isha: Moon,
    Midnight: Moon,
};

export default function IslamicCalendar() {
    const navigate = useNavigate();
    const [prayerTimings, setPrayerTimings] = useState(null);
    const [hijriInfo, setHijriInfo] = useState(null);
    const [location, setLocation] = useState({ city: null, country: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPrayerKey, setNextPrayerKey] = useState(null);

    // 1. Fetch Location and then API Data
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get user's location first
                const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 }));
                const { latitude, longitude } = position.coords;

                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                if (!geoResponse.ok) throw new Error("Failed to get city from location.");
                const geoData = await geoResponse.json();
                const city = geoData.address.city || geoData.address.town || geoData.address.village;
                const country = geoData.address.country;
                setLocation({ city, country });
                
                if (!city || !country) throw new Error("Could not determine city and country.");

                // Fetch Aladhan data using the determined city and country
                const date = new Date().toISOString().split('T')[0];
                const timingsPromise = fetch(`https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=${country}&method=2`);
                const calendarPromise = fetch(`https://api.aladhan.com/v1/hijriCalendarByCity?city=${city}&country=${country}`);

                const [timingsRes, calendarRes] = await Promise.all([timingsPromise, calendarPromise]);

                if (!timingsRes.ok || !calendarRes.ok) throw new Error("Failed to fetch data from Aladhan API.");

                const timingsData = await timingsRes.json();
                const calendarData = await calendarRes.json();
                
                setPrayerTimings(timingsData.data);
                setHijriInfo(calendarData.data);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Could not load prayer data. Please check your location settings and network.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // 2. Calculate next prayer and set up an interval to update it
    useEffect(() => {
        if (!prayerTimings) return;

        const calculateNextPrayer = () => {
            const now = new Date();
            const prayerOrderForCalc = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Midnight"];
            
            for (const prayerName of prayerOrderForCalc) {
                const prayerTimeStr = prayerTimings.timings[prayerName];
                if (!prayerTimeStr) continue;
                
                const [hours, minutes] = prayerTimeStr.split(':').map(Number);
                const prayerDate = new Date(now);
                prayerDate.setHours(hours, minutes, 0, 0);

                if (prayerDate > now) {
                    setNextPrayerKey(prayerName);
                    return;
                }
            }
            // If all prayers for today are done, next prayer is Fajr tomorrow
            setNextPrayerKey("Fajr");
        };

        calculateNextPrayer();
        const interval = setInterval(calculateNextPrayer, 60000); // Update every minute
        return () => clearInterval(interval);

    }, [prayerTimings]);
    
    const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Midnight"];

    const PrayerCard = ({ name }) => {
        const time = prayerTimings?.timings[name];
        const Icon = prayerIcons[name] || Sun;
        const isNext = nextPrayerKey === name;

        return (
            <div className={`transition-all duration-300 rounded-xl border p-4 flex items-center justify-between ${isNext ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-4">
                    <Icon className={`w-6 h-6 ${isNext ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <div>
                        <p className={`font-semibold text-lg ${isNext ? 'text-emerald-700' : 'text-gray-700'}`}>{name}</p>
                        <p className={`font-bold text-2xl ${isNext ? 'text-emerald-600' : 'text-gray-800'}`}>{time || '--:--'}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500 hover:bg-gray-100"><Bell className="w-3 h-3 mr-1.5"/> Reminder</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500 hover:bg-gray-100"><Play className="w-3 h-3 mr-1.5"/> Play Azan</Button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white" style={{'--primary-green': '#10B981'}}>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-bold" style={{fontFamily: 'serif'}}>Prayer / Salah / Namaaz Timings</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>

            {loading && (
                <div className="flex flex-col items-center justify-center text-center p-10 h-[80vh]">
                    <Loader2 className="w-12 h-12 mb-4 text-emerald-500 animate-spin" />
                    <p className="text-lg font-semibold text-gray-700">Fetching prayer times for your location...</p>
                    <p className="text-sm text-gray-500">Please ensure location access is enabled.</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center text-center p-10 h-[80vh] bg-red-50">
                    <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
                    <p className="text-lg font-semibold text-red-700">Failed to Load Data</p>
                    <p className="text-sm text-red-600 max-w-sm">{error}</p>
                </div>
            )}

            {!loading && !error && prayerTimings && hijriInfo && (
                <main className="container mx-auto p-4 space-y-8">
                    {/* Current Date & Time Section */}
                    <Card className="text-center p-4 bg-emerald-50/50 border-emerald-200">
                        <h2 className="text-2xl font-bold text-emerald-600">{hijriInfo[0].hijri.day} {hijriInfo[0].hijri.month.en}, {hijriInfo[0].hijri.year}</h2>
                        <p className="text-sm text-gray-500">{hijriInfo[0].gregorian.weekday.en}, {hijriInfo[0].gregorian.date}</p>
                    </Card>

                    {/* Prayer Times Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prayerOrder.map(name => <PrayerCard key={name} name={name} />)}
                    </div>

                    {/* Hijri Calendar Section */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Hijri Calendar</h2>
                        <HijriCalendar />
                    </div>

                    {/* Important Islamic Dates Section */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Important Dates This Month</h2>
                        <div className="space-y-3">
                            {importantDatesData.map((item, index) => (
                                <Card key={index} className="p-4 flex items-center justify-between border-l-4" style={{borderColor: item.type === 'good' ? 'var(--primary-green)' : '#F59E0B'}}>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.event}</p>
                                        <p className="text-sm text-gray-500">{item.hijri} Hijri</p>
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full ${item.type === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {item.type === 'good' ? <CheckCircle className="w-3.5 h-3.5"/> : <AlertCircle className="w-3.5 h-3.5"/>}
                                        <span>{item.type === 'good' ? 'Auspicious' : 'Nahas'}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}