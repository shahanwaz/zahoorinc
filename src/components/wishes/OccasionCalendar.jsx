import React from "react";
import HijriCalendar from "@/components/islamic/HijriCalendar"; // Import the new component

export default function OccasionCalendar({ onDateSelect }) {
  // This data is keyed by Gregorian date (YYYY-MM-DD)
  const islamicOccasions = {
    '2025-01-07': { name: 'Eid-e-Ghadeer', type: 'celebration' },
    '2025-01-16': { name: '10 Muharram (Ashura)', type: 'mourning' },
    '2025-02-14': { name: 'Arbaeen', type: 'mourning' },
    '2025-03-24': { name: 'Eid-ul-Fitr', type: 'celebration' },
    '2025-04-15': { name: '13 Rajab (Imam Ali Birthday)', type: 'celebration' },
    '2025-05-27': { name: '15 Shaban (Imam Mahdi Birthday)', type: 'celebration' },
    '2025-06-22': { name: '21 Ramadan (Shahadat Imam Ali)', type: 'mourning' },
    '2025-07-30': { name: 'Eid-ul-Adha', type: 'celebration' },
  };

  const handleSelect = (date) => {
    const gregorianDateStr = date.gregorian.date.split('-').reverse().join('-'); // YYYY-MM-DD
    const occasion = islamicOccasions[gregorianDateStr];
    if (occasion) {
        onDateSelect({ date: new Date(gregorianDateStr), occasion });
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-bold text-emerald-800 mb-4">Occasion Calendar</h2>
      
      <HijriCalendar events={islamicOccasions} onDateSelect={handleSelect} />

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4 pt-4 border-t border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-emerald-700">Celebrations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs text-emerald-700">Mourning</span>
        </div>
      </div>
    </div>
  );
}