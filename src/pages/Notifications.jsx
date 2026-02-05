
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Bell, Calendar, Users, Heart, Trophy, HandHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function Notifications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock notifications data
    setNotifications([
      {
        id: 1,
        type: "events",
        icon: Calendar,
        title: "New Majlis Tomorrow",
        message: "Majlis-e-Aza at Central Imambargah starting at 7 PM",
        timestamp: "2 hours ago",
        isRead: false,
        actionUrl: "/events"
      },
      {
        id: 2,
        type: "community",
        icon: Users,
        title: "New Member Joined",
        message: "Ali Hassan joined your local community group",
        timestamp: "5 hours ago",
        isRead: true,
        actionUrl: "/nearby"
      },
      {
        id: 3,
        type: "tutors",
        icon: Bell,
        title: "Question Answered",
        message: "Maulana Ahmad answered your Fiqh question",
        timestamp: "1 day ago",
        isRead: false,
        actionUrl: "/questions"
      },
      {
        id: 4,
        type: "contests",
        icon: Trophy,
        title: "Contest Results",
        message: "You won 2nd place in the Quran recitation contest!",
        timestamp: "2 days ago",
        isRead: true,
        actionUrl: "#"
      },
      {
        id: 5,
        type: "donations",
        icon: HandHeart,
        title: "Blood Donation Drive",
        message: "Urgent need for O+ blood type at City Hospital",
        timestamp: "3 days ago",
        isRead: false,
        actionUrl: "#"
      },
      {
        id: 6,
        type: "majalis",
        icon: Heart,
        title: "Upcoming Majlis",
        message: "Special Majlis for Imam Hussain (AS) this Friday",
        timestamp: "1 week ago",
        isRead: true,
        actionUrl: "/events"
      }
    ]);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const handleDelete = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notif => 
    activeFilter === "all" || notif.type === activeFilter
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm border-emerald-200">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-emerald-50"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-emerald-800">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-emerald-700">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-emerald-50"
          >
            <Settings className="w-5 h-5 text-emerald-800" />
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-3 border-b border-emerald-200">
        <NotificationFilters 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
            <h3 className="text-lg font-semibold mb-2 text-emerald-800">No Notifications</h3>
            <p className="text-sm text-emerald-700">
              {activeFilter === "all" 
                ? "You're all caught up! No new notifications."
                : `No ${activeFilter} notifications found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
