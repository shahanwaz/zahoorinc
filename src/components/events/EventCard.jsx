
import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EventCard({ event, onJoin, isJoined, currentUser }) {
  const eventTypeColors = {
    majlis: "text-white border-0",
    class: "text-white border-0",
    community: "text-white border-0",
    ziyarat: "text-white border-0"
  };

  const eventTypeBgColors = {
    majlis: "#FF0066",
    class: "#6A0066",
    community: "#934790",
    ziyarat: "#FF0066"
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="glassmorphism rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {event.image_url &&
      <div className="h-48 overflow-hidden">
          <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover" />

        </div>
      }
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-green-600 text-lg font-bold leading-tight flex-1" style={{ color: '#6A0066' }}>
            {event.title}
          </h3>
          <Badge className="font-semibold inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:bg-primary/80"

          style={{ backgroundColor: eventTypeBgColors[event.event_type] }}>

            {event.event_type}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#934790' }}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>
              {event.attendees?.length || 0} joined
              {event.max_attendees && ` / ${event.max_attendees} max`}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onJoin(event.id)}
            className={`flex-1 transition-all duration-300 ${
            isJoined ?
            'text-white border-0' :
            'primary-btn'}`
            }
            style={isJoined ? { backgroundColor: '#934790' } : {}}
            disabled={!isJoined && event.max_attendees && event.attendees?.length >= event.max_attendees}>

            {isJoined ? "Joined" : event.max_attendees && event.attendees?.length >= event.max_attendees ? "Event Full" : "Join Event"}
          </Button>
          
          {event.location &&
          <Button
            variant="outline"
            size="icon"
            className="border-pink-200 text-pink-600 hover:bg-pink-50"
            onClick={() => {
              const url = `https://maps.google.com/?q=${event.location.latitude},${event.location.longitude}`;
              window.open(url, '_blank');
            }}>

              <MapPin className="w-4 h-4" />
            </Button>
          }
        </div>
      </div>
    </div>);

}