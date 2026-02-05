import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Heart, Lightbulb } from 'lucide-react';

const reactions = [
  { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
  { icon: Heart, label: "Love", color: "text-red-500" },
  { icon: Lightbulb, label: "Insight", color: "text-yellow-500" },
  { icon: () => "🙏", label: "Pray", color: "text-emerald-500" }
];

export default function ReactionButtons() {
  return (
    <div className="col-span-2 flex justify-around items-center bg-emerald-50 rounded-xl p-2 border border-emerald-200/50">
      {reactions.map((reaction, index) => {
        const Icon = reaction.icon;
        return (
          <Button key={index} variant="ghost" className="flex flex-col items-center h-auto p-1">
            <Icon className={`w-6 h-6 ${reaction.color}`} />
            <span className="text-xs text-emerald-700">{reaction.label}</span>
          </Button>
        );
      })}
    </div>
  );
}