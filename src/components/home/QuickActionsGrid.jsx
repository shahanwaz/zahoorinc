import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Users, MessageCircle, Trophy, Navigation, Sparkles, Heart } from "lucide-react";

// Feature flag - set to true to re-enable Live Streaming
const LIVE_STREAMING_ENABLED = false;

export default function QuickActionsGrid() {
  const quickActions = [
    { 
      icon: BookOpen, 
      label: "Duas", 
      path: "Duas", 
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-100"
    },
    { 
      icon: Users, 
      label: "Majalis", 
      path: "Events", 
      color: "from-emerald-600 to-emerald-700",
      bg: "bg-emerald-200"
    },
    { 
      icon: Heart, 
      label: "Donate", 
      path: "DonationSupport", 
      color: "from-pink-500 to-pink-600",
      bg: "bg-pink-100"
    },
    { 
      icon: MessageCircle, 
      label: "Ask Maulana", 
      path: "Questions", 
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-100"
    },
    { 
      icon: Trophy, 
      label: "Contests", 
      path: "ContestsRewards", 
      color: "from-emerald-600 to-emerald-700",
      bg: "bg-emerald-200"
    },
    { 
      icon: Navigation, 
      label: "Qibla Compass", 
      path: "QiblaCompass", 
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-100"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-emerald-800">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} to={createPageUrl(action.path)}>
              <Button 
                variant="ghost" 
                className={`h-24 w-full flex-col gap-3 ${action.bg} hover:shadow-lg transition-all duration-300 border-2 border-emerald-200 hover:border-emerald-300 rounded-2xl`}
              >
                <div className={`p-3 rounded-full bg-gradient-to-br ${action.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-bold text-emerald-800">{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}