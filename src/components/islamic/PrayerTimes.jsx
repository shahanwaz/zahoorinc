import React, { useState, useEffect } from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PrayerTimes() {
  const [nextPrayer, setNextPrayer] = useState({ name: "Maghrib", time: "18:30" });
  const [timeToNext, setTimeToNext] = useState("1h 15m");
  const [location, setLocation] = useState("Your Location");

  useEffect(() => {
    // In a real app, this would calculate based on current time and prayer times object/API
    // This is a static placeholder for design purposes
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden glassmorphism relative p-4">
      <div className="absolute top-0 left-0 h-full w-2 bg-emerald-600"></div>
      
      <div className="pl-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">NEXT PRAYER</p>
            <h2 className="text-3xl font-bold heading-color">{nextPrayer.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold heading-color">{nextPrayer.time}</p>
            <p className="text-sm font-semibold text-emerald-600">in {timeToNext}</p>
          </div>
        </div>
        
        <div className="h-px my-3 bg-emerald-200" />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <Link to={createPageUrl("PrayerTimesPage")}>
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 -mr-2">
              View all times <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}