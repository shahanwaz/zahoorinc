import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnswerCard from './AnswerCard';

export default function AnswerSection({ answers }) {
  const [sortBy, setSortBy] = useState('relevant');

  const sortedAnswers = [...answers].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_date) - new Date(a.created_date);
      case 'liked':
        return b.likes.length - a.likes.length;
      case 'relevant':
      default:
        // "Best answer" first, then by score
        if (a.is_best_answer) return -1;
        if (b.is_best_answer) return 1;
        return (b.score || 0) - (a.score || 0);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-emerald-800">{answers.length} Answers</h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-white border-emerald-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevant">Most Relevant</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="liked">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {sortedAnswers.map(answer => (
          <AnswerCard key={answer.id} answer={answer} />
        ))}
      </div>
    </div>
  );
}