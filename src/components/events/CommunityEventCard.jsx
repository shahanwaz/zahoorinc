import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Calendar, Users as UsersIcon, Clock, Navigation } from 'lucide-react';
import { format } from 'date-fns';

export default function CommunityEventCard({ event, currentUser, onJoin, onGetDirection }) {
  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const isUserJoined = event.attendees?.includes(currentUser?.id);
  const isFull = event.max_attendees && event.attendees?.length >= event.max_attendees;
  const canJoin = !isUserJoined && !isFull;

  return (
    <div className="glassmorphism rounded-2xl p-4 space-y-4 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
            {event.organizer_avatar ? (
              <img 
                src={event.organizer_avatar} 
                alt={event.organizer_name || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-emerald-700" />
            )}
          </div>
          <div>
            <span className="text-xs text-emerald-700 font-medium">Posted by</span>
            <p className="text-sm font-semibold text-emerald-900">
              {event.organizer_name || 'Community Member'}
            </p>
          </div>
        </div>
        
        {event.distance !== undefined && (
          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
            <MapPin className="w-3 h-3 mr-1" />
            {event.distance < 1 
              ? `${(event.distance * 1000).toFixed(0)}m away`
              : `${event.distance.toFixed(1)}km away`
            }
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-emerald-900 leading-tight flex-1">{event.title}</h3>
          {event.event_type && (
            <Badge className="bg-emerald-500 text-white">
              {event.event_type}
            </Badge>
          )}
        </div>
        {event.description && (
          <p className="text-sm text-emerald-700 line-clamp-2 leading-relaxed">{event.description}</p>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-emerald-800">
          <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{formatDate(event.date)}</span>
          <span className="text-emerald-600">•</span>
          <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{formatTime(event.time)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-emerald-800">
          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="truncate flex-1">{event.venue}</span>
        </div>
        
        <div className="flex items-center gap-2 text-emerald-800">
          <UsersIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            {event.attendees?.length || 0} joined
            {event.max_attendees && ` • ${event.max_attendees - (event.attendees?.length || 0)} slots left`}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-emerald-200/70">
        <Button
          onClick={() => onGetDirection(event.location)}
          variant="outline"
          className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          disabled={!event.location?.latitude}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Directions
        </Button>
        
        <Button 
          onClick={() => onJoin(event.id)} 
          className={`flex-1 ${
            isUserJoined 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'primary-btn'
          }`}
          disabled={isFull && !isUserJoined}
        >
          {isUserJoined ? '✓ Joined' : isFull ? 'Full' : 'Join Event'}
        </Button>
      </div>

      {/* Expiry Notice */}
      <div className="text-xs text-emerald-600 text-center pt-2 border-t border-emerald-100">
        Auto-deletes 24 hours after event time
      </div>
    </div>
  );
}