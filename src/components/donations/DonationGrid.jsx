import React from 'react';
import { HandHeart, ShieldHalf, Coins, Gift, Gem, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const donationCategories = [
  { name: "Chanda", icon: HandHeart, description: "General donations" },
  { name: "Zakat", icon: ShieldHalf, description: "Obligatory charity" },
  { name: "Sadqa", icon: Coins, description: "Voluntary charity" },
  { name: "Khairat", icon: Gift, description: "Goodwill contributions" },
  { name: "Khums", icon: Gem, description: "Religious tax" },
  { name: "Support Zahoor", icon: Heart, description: "Help us grow" }
];

export default function DonationGrid({ onSelectCategory }) {
  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6">Choose Your Way to Give</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {donationCategories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className="text-center bg-white border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group" 
                onClick={() => onSelectCategory(cat.name)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="p-3 mb-2 rounded-full bg-emerald-50 group-hover:bg-gradient-to-br from-emerald-100 to-emerald-200 transition-all">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-emerald-800 text-sm">{cat.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}