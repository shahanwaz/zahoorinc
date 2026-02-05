import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Coins, Calendar, Users as UsersIcon } from 'lucide-react';

export default function EjaraCard({ post, onAvail }) {
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const isCompleted = post.status === 'completed';

  return (
    <div className="flex-shrink-0 w-80 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-emerald-200 shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-yellow-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-yellow-800" />
          </div>
          <span className="text-xs text-yellow-900 font-medium">Posted by {post.poster_name}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isCompleted ? 'Completed' : 'Active'}
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <h3 className="text-lg font-bold text-emerald-900">{post.title}</h3>
        <p className="text-sm text-emerald-700 line-clamp-2">
          {post.type === 'qaza_namaz' ? `${post.days_count} days of Namaz` : `${post.quran_count} Qurans`}
        </p>
      </div>
      
      <div className="space-y-1 text-sm mb-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <Coins className="w-4 h-4 text-yellow-600" />
          <span>₹{post.hadiya_per_person.toLocaleString()} Hadiya</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-800">
          <UsersIcon className="w-4 h-4 text-emerald-600" />
          <span>{post.participants_needed - post.participants_joined} of {post.participants_needed} slots left</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-yellow-200/70">
        <div className="flex items-center gap-1 text-xs text-yellow-700">
          <Calendar className="w-3 h-3" />
          <span>Valid till {formatDate(post.validity_date)}</span>
        </div>
        <Button onClick={() => onAvail(post.id)} className="bg-yellow-600 hover:bg-yellow-700 text-white" disabled={isCompleted}>Avail</Button>
      </div>
    </div>
  );
}