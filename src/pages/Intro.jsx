import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Intro() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6" style={{ backgroundColor: '#4a7f34' }}>
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .fade-in-content {
          animation: fadeIn 1.5s ease-out;
        }

        .intro-btn {
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          transition: background-color 0.3s;
        }
        .intro-btn:hover {
          background-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
            Skip
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center fade-in-content">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/74ed9749a_intro.png"
          alt="Zahoor Intro"
          className="w-full max-w-sm h-auto"
        />
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Zahoor hoga, zaroor hoga.
          </h1>
          <p className="text-lg text-yellow-300">Insha'Allah</p>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="pb-8 fade-in-content" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
        <Link to={createPageUrl("Home")}>
          <Button className="w-full max-w-sm mx-auto intro-btn text-lg py-6">
            Get Started
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}