import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trophy, ChevronRight, Gift, Users, Calendar } from "lucide-react";

export default function ContestsCarousel() {
  const contestsData = [
    {
      id: 1,
      title: "Quran Recitation Contest",
      prize: "₹10,000",
      participants: "245",
      deadline: "5 days left",
      type: "Audio Submission",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      id: 2,
      title: "Islamic Calligraphy",
      prize: "₹7,500",
      participants: "128",
      deadline: "12 days left",
      type: "Image Upload",
      color: "from-emerald-600 to-emerald-700"
    },
    {
      id: 3,
      title: "Hadith Memorization",
      prize: "₹5,000",
      participants: "89",
      deadline: "8 days left",
      type: "Video Recording",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-800">Contests & Rewards</h2>
        </div>
        <Link to={createPageUrl("ContestsRewards")}>
          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md h-9 w-9">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {contestsData.map((contest) => (
          <div key={contest.id} className="flex-shrink-0 w-72">
            <div className={`bg-gradient-to-r ${contest.color} rounded-xl p-4 text-white mb-3`}>
              <div className="flex items-center justify-between mb-3">
                <Trophy className="w-6 h-6" />
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{contest.type}</span>
              </div>
              <h4 className="text-slate-50 mb-2 text-lg font-bold">{contest.title}</h4>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  {contest.prize}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {contest.deadline}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-emerald-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{contest.participants} joined</span>
                </div>
              </div>
              <Button className="w-full primary-btn" size="sm">
                Participate Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}