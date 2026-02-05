
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Heart, Book, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DuasSection from "@/components/duas/DuasSection";
import ZiyaratSection from "@/components/duas/ZiyaratSection";
import HadithSection from "@/components/duas/HadithSection";
import SurahList from "@/components/quran/SurahList";

export default function Duas() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("quran");

  // Check URL params to set active tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['quran', 'duas', 'ziyarat', 'hadith'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const tabs = [
    { id: "quran", label: "Qur'an", icon: BookOpen },
    { id: "duas", label: "Du'as", icon: Heart },
    { id: "ziyarat", label: "Ziyarat", icon: Book },
    { id: "hadith", label: "Hadith", icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "quran":
        return <SurahList />;
      case "duas":
        return <DuasSection />;
      case "ziyarat":
        return <ZiyaratSection />;
      case "hadith":
        return <HadithSection />;
      default:
        return <SurahList />;
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-4 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <h1 className="text-xl font-bold text-emerald-800">Islamic Resources</h1>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-emerald-50">
            <Search className="w-5 h-5 text-emerald-800" />
          </Button>
        </div>
        <div className="px-2">
          <div className="flex justify-around border-b border-emerald-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 text-sm font-medium transition-colors duration-300 ${
                    activeTab === tab.id
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-emerald-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="p-4 space-y-8 pb-24">
        {renderContent()}
      </main>
    </div>
  );
}
