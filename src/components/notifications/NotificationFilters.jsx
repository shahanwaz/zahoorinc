import React from "react";

export default function NotificationFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "events", label: "Events" },
    { id: "majalis", label: "Majalis" },
    { id: "tutors", label: "Tutors" },
    { id: "community", label: "Community" },
    { id: "contests", label: "Contests" },
    { id: "donations", label: "Donations" }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            activeFilter === filter.id
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}