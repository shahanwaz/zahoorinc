import React from 'react';
import { Button } from '@/components/ui/button';

export default function NgoInvitation() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 text-center dark-context">
      <h3 className="text-2xl font-bold mb-2">Join Us & Help Humanity</h3>
      <p className="mb-6 opacity-90 max-w-lg mx-auto">Are you an NGO or a charitable trust? Partner with Zahoor to amplify your reach and impact. Let's work together for a greater cause.</p>
      <Button size="lg" className="bg-white text-emerald-700 font-bold hover:bg-gray-100 shadow-lg px-8">
        Register Your NGO
      </Button>
    </div>
  );
}