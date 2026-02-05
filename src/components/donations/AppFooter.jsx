
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const socialIcons = [
  { name: 'Facebook', url: '#' },
  { name: 'Twitter', url: '#' },
  { name: 'Instagram', url: '#' },
  { name: 'YouTube', url: '#' },
];

export default function AppFooter() {
  return (
    <footer className="bg-white border-t border-emerald-200/80 pt-12 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/2c0282437_487ad098c_yabaqiyatullah.png" alt="Zahoor Logo" className="w-8 h-8 rounded-lg" />
              <h3 className="text-xl font-bold text-emerald-800">Zahoor</h3>
            </div>
            <p className="text-emerald-700">Hearts Await Zahoor. A platform for community, spirituality, and charity, dedicated to making the world brighter.</p>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-semibold text-emerald-800 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-emerald-700">
              <li><Link to="#" className="hover:text-emerald-500">About</Link></li>
              <li><Link to={createPageUrl("Events")} className="hover:text-emerald-500">Events</Link></li>
              <li><Link to={createPageUrl("DonationSupport")} className="hover:text-emerald-500">Donate</Link></li>
              <li><Link to="#" className="hover:text-emerald-500">Contact</Link></li>
            </ul>
          </div>
          {/* Social */}
          <div>
            <h4 className="font-semibold text-emerald-800 mb-3">Follow Us</h4>
            <div className="flex gap-3">
              {/* Replace with actual icons later */}
              {socialIcons.map(s => <Button key={s.name} variant="outline" size="icon" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">{s.name.charAt(0)}</Button>)}
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-100 pt-6 text-center text-sm text-emerald-600">
          <p>“Every act of kindness counts. Together, we make the world brighter.”</p>
          <p className="mt-2 opacity-80">&copy; {new Date().getFullYear()} Zahoor Foundation. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
