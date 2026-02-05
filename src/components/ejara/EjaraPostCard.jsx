import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const serviceDetails = {
  roza: { icon: '🌙', label: 'Roza Ejara' },
  quran: { icon: '📖', label: 'Quran Ejara' },
  namaz: { icon: '🤲', label: 'Namaz Ejara' },
  majlis: { icon: '🏛️', label: 'Majlis Ejara' },
};

const statusConfig = {
  available: { label: 'Available', color: 'bg-red-500 text-white', icon: '🔴' },
  availed: { label: 'Availed', color: 'bg-green-500 text-white', icon: '🟢' },
  completed: { label: 'Completed', color: 'bg-gray-400 text-white', icon: '⚪' },
};

export default function EjaraPostCard({ post, onAvail, currentUser }) {
  const { icon, label } = serviceDetails[post.serviceType] || {};
  const status = statusConfig[post.status] || {};
  const isMyPost = post.requester.name === currentUser.name;

  return (
    <Card className="bg-white/80 backdrop-blur-md border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold text-emerald-800">{label}</span>
          </div>
          <Badge className={`${status.color} font-semibold`}>
            {status.icon} {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <p className="text-sm text-emerald-600">For Whom (Marhoom)</p>
          <h3 className="text-lg font-bold text-emerald-900">{post.forWhom}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-emerald-50 p-3 rounded-lg">
            <p className="text-sm text-emerald-600">Quantity</p>
            <p className="text-xl font-bold text-emerald-800">{post.quantity}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-700">Total Hadiya</p>
            <p className="text-xl font-bold text-amber-900">₹{post.total.toLocaleString()}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-emerald-600">Posted By</p>
          <div className="flex items-center gap-2 mt-1">
            <img src={post.requester.profileImage} alt={post.requester.name} className="w-6 h-6 rounded-full" />
            <p className="font-medium text-emerald-700">{post.requester.name}</p>
          </div>
        </div>
        
        {post.status === 'availed' && post.availedBy && (
           <div>
            <p className="text-sm text-emerald-600">Availed By</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle className="w-4 h-4 text-green-600"/>
              <p className="font-medium text-green-700">{post.availedBy}</p>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter>
        {isMyPost ? (
           <Button variant="outline" className="w-full border-emerald-300 text-emerald-700" disabled>This is your post</Button>
        ) : post.status === 'available' ? (
          <Button onClick={onAvail} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
            ✅ Avail Service
          </Button>
        ) : (
          <Button variant="outline" className="w-full border-gray-300 text-gray-500" disabled>
            Service Availed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}