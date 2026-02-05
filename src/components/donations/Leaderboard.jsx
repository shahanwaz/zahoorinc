import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medal, Award, Star } from 'lucide-react';

const topDonors = {
  monthly: [
    { rank: 1, name: "Ali Raza", city: "Mumbai", amount: "₹25,000" },
    { rank: 2, name: "Fatima Syed", city: "Delhi", amount: "₹18,500" },
    { rank: 3, name: "Hussain J.", city: "Lucknow", amount: "₹15,000" },
    { rank: 4, name: "Zainab K.", city: "Hyderabad", amount: "₹12,000" },
  ],
  yearly: [
    { rank: 1, name: "Mohammad Abbas", city: "Dubai", amount: "₹1,50,000" },
    { rank: 2, name: "Ali Raza", city: "Mumbai", amount: "₹1,25,000" },
    { rank: 3, name: "Sakina M.", city: "London", amount: "₹90,000" },
  ],
  lifetime: [
    { rank: 1, name: "Syed Foundation", city: "Global", amount: "₹12,00,000" },
    { rank: 2, name: "Anonymous", city: "-", amount: "₹9,50,000" },
    { rank: 3, name: "Mohammad Abbas", city: "Dubai", amount: "₹7,00,000" },
  ]
};

const DonorRow = ({ rank, name, city, amount }) => {
  const rankStyles = {
    1: { icon: Medal, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    2: { icon: Award, color: "text-gray-400", bg: "bg-gray-400/10" },
    3: { icon: Star, color: "text-orange-500", bg: "bg-orange-500/10" }
  };
  const RankIcon = rankStyles[rank]?.icon || Star;
  
  return (
    <div className={`flex items-center p-3 rounded-lg ${rankStyles[rank]?.bg || 'bg-gray-50/50'}`}>
      <div className="flex items-center gap-3 w-1/2">
        {rank <= 3 ? 
          <RankIcon className={`w-6 h-6 ${rankStyles[rank].color}`} /> : 
          <span className="w-6 text-center text-gray-500 font-bold">{rank}</span>
        }
        <div>
          <p className="font-bold text-emerald-800">{name}</p>
          <p className="text-sm text-emerald-600">{city}</p>
        </div>
      </div>
      <p className="w-1/2 text-right font-bold text-emerald-700">{amount}</p>
    </div>
  );
};

export default function Leaderboard() {
  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6">Our Top Supporters</h2>
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-emerald-200/50">
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-3 bg-emerald-100">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="mt-4 space-y-2">
            {topDonors.monthly.map(donor => <DonorRow key={donor.rank} {...donor} />)}
          </TabsContent>
          <TabsContent value="yearly" className="mt-4 space-y-2">
            {topDonors.yearly.map(donor => <DonorRow key={donor.rank} {...donor} />)}
          </TabsContent>
          <TabsContent value="lifetime" className="mt-4 space-y-2">
            {topDonors.lifetime.map(donor => <DonorRow key={donor.rank} {...donor} />)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}