import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Clock } from "lucide-react";

export default function ScheduledEventCard({ event }) {
  const [reminderSet, setReminderSet] = useState(event.reminderSet);

  const formatScheduledTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((date - now) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Starts in ${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Starts in ${hours}h`;
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleReminderToggle = () => {
    setReminderSet(!reminderSet);
    // In real app, would make API call to set/unset reminder
  };

  return (
    <Card className="overflow-hidden bg-white rounded-2xl shadow-sm border border-emerald-200/50">
      <div className="flex">
        <div className="relative w-32 h-24 flex-shrink-0">
          <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Scheduled Badge */}
          <Badge className="absolute top-1 left-1 bg-amber-500 text-white text-xs">
            📅 Soon
          </Badge>
        </div>

        <CardContent className="flex-1 p-3">
          <h4 className="font-semibold text-emerald-800 mb-1 text-sm line-clamp-2">{event.title}</h4>
          
          <div className="flex items-center gap-2 mb-2">
            <img src={event.hostImage} alt={event.host} className="w-5 h-5 rounded-full" />
            <p className="text-xs text-emerald-700 font-medium">{event.host}</p>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span className="text-xs text-emerald-600">{formatScheduledTime(event.scheduledTime)}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleReminderToggle}
              variant="outline"
              size="sm"
              className={`flex-1 text-xs h-8 ${
                reminderSet 
                  ? 'border-amber-300 text-amber-700 bg-amber-50' 
                  : 'border-emerald-300 text-emerald-700'
              }`}
            >
              {reminderSet ? (
                <>
                  <BellOff className="w-3 h-3 mr-1" />
                  Reminder Set
                </>
              ) : (
                <>
                  <Bell className="w-3 h-3 mr-1" />
                  Remind Me
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 text-xs h-8"
            >
              Details
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}