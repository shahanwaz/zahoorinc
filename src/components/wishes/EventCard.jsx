import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

export default function EventCard({ event }) {
  const getEventColor = (eventType) => {
    const colors = {
      'Wiladat': 'bg-green-100 text-green-800 border-green-200',
      'Shahadat': 'bg-red-100 text-red-800 border-red-200',
      'Eid': 'bg-purple-100 text-purple-800 border-purple-200',
      'Special Night': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[eventType] || 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-emerald-800 text-sm leading-tight">
            {event.name}
          </h4>
          <Badge className={`ml-2 text-xs ${getEventColor(event.type)}`}>
            {event.type}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-600">
            <Calendar className="w-3 h-3" />
            <span>{event.hijriDay} {getHijriMonthName(event.hijriMonth)} 1446</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600">
            <Clock className="w-3 h-3" />
            <span>{event.gregorianDate}</span>
          </div>
        </div>
      </div>
      
      {event.daysLeft && (
        <div className="text-right ml-3">
          <p className="text-lg font-bold text-emerald-700">{event.daysLeft}</p>
          <p className="text-xs text-emerald-600">days left</p>
        </div>
      )}
    </div>
  );
}

function getHijriMonthName(monthNumber) {
  const months = [
    'Muharram', 'Safar', 'Rabi\' I', 'Rabi\' II',
    'Jumada I', 'Jumada II', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];
  return months[monthNumber - 1] || '';
}