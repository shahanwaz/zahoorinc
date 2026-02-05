
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Trophy, Gift, Star, Award, Crown, Sparkles, Medal, ShieldCheck
} from "lucide-react";

export default function ContestsRewards() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);

  // --- Mock Data ---
  const userPoints = { current: 380, nextReward: 500 };
  
  const banners = [
    { title: "Daily Islamic Quiz", description: "Test your knowledge and earn daily points.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
    { title: "Win a Ziyarat Trip", description: "Participate in our lucky draw for a chance to win.", image: "https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=400&h=200&fit=crop" },
    { title: "Best Nauha Recitation", description: "Upload your recitation and get featured.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop" }
  ];

  const ongoingContests = [
    { icon: "📖", title: "Fiqh & History Quiz", description: "5 questions on Islamic history.", timeLeft: "2h 15m remaining", cta: "Join Now" },
    { icon: "🎤", title: "Manqabat Challenge", description: "Share your best Manqabat recitation.", timeLeft: "3 days remaining", cta: "Upload & Participate" },
    { icon: "🎨", title: "Islamic Art Contest", description: "Design art inspired by Ahlulbayt (a.s).", timeLeft: "Ends Sunday", cta: "Join Now" }
  ];

  const previousContests = [
    { title: "Ramadan Quiz 2025", winner: "Ali Raza", avatar: "https://i.pravatar.cc/150?u=a" },
    { title: "Calligraphy Contest", winner: "Fatima K.", avatar: "https://i.pravatar.cc/150?u=b" },
    { title: "Poetry Competition", winner: "Hassan J.", avatar: "https://i.pravatar.cc/150?u=c" }
  ];
  
  const rewards = [
    { icon: "📚", name: "Islamic Book Coupon", points: 250 },
    { icon: "🎟️", name: "Premium Event Pass", points: 500 },
    { icon: "✨", name: "Ziyarat Draw Entry", points: 1000 }
  ];
  
  const leaderboard = [
    { rank: 1, name: "Ali Hassan", points: 2450, avatar: "https://i.pravatar.cc/150?u=d" },
    { rank: 2, name: "Fatima Zahra", points: 2340, avatar: "https://i.pravatar.cc/150?u=e" },
    { rank: 3, name: "Abbas Rizvi", points: 2180, avatar: "https://i.pravatar.cc/150?u=f" },
  ];

  const userBadges = [
    { icon: Medal, name: "Quiz Master", color: "text-amber-500", achieved: true },
    { icon: Award, name: "Top Contributor", color: "text-blue-500", achieved: true },
    { icon: ShieldCheck, name: "Verified Pro", color: "text-green-500", achieved: true },
    { icon: Crown, name: "Community King", color: "text-purple-500", achieved: false },
    { icon: Star, name: "Daily Streak", color: "text-red-500", achieved: false }
  ];

  // --- Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-emerald-100">
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <h1 className="text-xl font-bold text-emerald-800">Contests & Rewards</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Top Banner Carousel */}
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
          <AnimatePresence>
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white dark-context"
            >
              <img src={banners[currentBanner].image} alt="Banner" className="w-full h-full object-cover mix-blend-overlay opacity-30" />
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">{banners[currentBanner].title}</h2>
                <p className="text-sm opacity-90 mb-4">{banners[currentBanner].description}</p>
                <Button size="sm" className="bg-white text-emerald-600 hover:bg-gray-100 w-fit">
                  Participate Now
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Reward Points Card */}
        <Card className="bg-white rounded-2xl shadow-sm border border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Gift className="w-5 h-5" /> Your Reward Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <p className="text-3xl font-bold text-emerald-600">{userPoints.current} <span className="text-base font-normal">pts</span></p>
              <p className="text-sm text-emerald-600">{userPoints.nextReward - userPoints.current} pts to next reward</p>
            </div>
            <Progress value={(userPoints.current / userPoints.nextReward) * 100} className="h-2 [&>div]:bg-emerald-500" />
          </CardContent>
        </Card>
        
        {/* Ongoing Contests */}
        <div>
          <h2 className="text-xl font-bold text-emerald-700 mb-4">Ongoing Contests</h2>
          <div className="space-y-3">
            {ongoingContests.map((contest, idx) => (
              <Card key={idx} className="bg-gray-50 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-3xl">{contest.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-emerald-800">{contest.title}</h3>
                    <p className="text-xs text-gray-600">{contest.description}</p>
                    <p className="text-xs font-medium text-emerald-600 mt-1">{contest.timeLeft}</p>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">{contest.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gamification Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Trophy className="w-5 h-5" /> Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <span className="font-bold text-emerald-600 w-5">{user.rank}.</span>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <p className="font-medium text-emerald-800 flex-1">{user.name}</p>
                  <p className="font-bold text-sm text-emerald-700">{user.points} pts</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Sparkles className="w-5 h-5" /> Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              {userBadges.map((badge, idx) => {
                const BadgeIcon = badge.icon;
                return (
                  <div key={idx} className={`flex flex-col items-center ${!badge.achieved ? 'opacity-40' : ''}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${badge.achieved ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <BadgeIcon className={`w-8 h-8 ${badge.achieved ? badge.color : 'text-gray-500'}`} />
                    </div>
                    <p className="text-xs font-medium mt-2">{badge.name}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Redeemable Rewards */}
        <div>
          <h2 className="text-xl font-bold text-emerald-700 mb-4">Redeem Rewards</h2>
          <div className="space-y-2">
            {rewards.map((reward, idx) => (
              <Card key={idx} className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <p className="font-medium text-emerald-800">{reward.name}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white"
                    disabled={userPoints.current < reward.points}
                  >
                    Redeem ({reward.points} pts)
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Previous Contests */}
        <div>
          <h2 className="text-xl font-bold text-emerald-700 mb-4">Past Winners</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {previousContests.map((contest, idx) => (
              <div key={idx} className="relative w-40 flex-shrink-0 text-center cursor-pointer group">
                <img src={contest.avatar} alt={contest.winner} className="w-24 h-24 rounded-full mx-auto border-4 border-emerald-200 shadow-md group-hover:border-emerald-500 transition-colors" />
                <Badge className="absolute top-16 right-2 bg-amber-400 text-black border-0">Winner</Badge>
                <p className="font-semibold mt-2 text-sm text-emerald-800">{contest.winner}</p>
                <p className="text-xs text-gray-600">{contest.title}</p>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base">
          Explore More Contests
        </Button>
      </div>
    </div>
  );
}
