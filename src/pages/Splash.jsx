import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { User } from '@/entities/User';
import { Loader } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  const isWeb = window.innerWidth >= 1024;

  useEffect(() => {
    const checkUserStatus = async () => {
      // Web: always go to LandingPage for unauthenticated, Home for authenticated
      if (isWeb) {
        try {
          const user = await User.me();
          navigate(createPageUrl('Home'));
        } catch (error) {
          navigate(createPageUrl('LandingPage'));
        }
        return;
      }

      // Mobile: original flow
      try {
        const user = await User.me();
        if (user && user.onboardingCompleted) {
          navigate(createPageUrl('Home'));
        } else {
          navigate(createPageUrl('CategorySelection'));
        }
      } catch (error) {
        navigate(createPageUrl('Intro'));
      }
    };

    const timer = setTimeout(checkUserStatus, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/2c0282437_487ad098c_yabaqiyatullah.png" 
          alt="Zahoor Logo" 
          className="w-28 h-28 rounded-3xl shadow-2xl mb-6"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Zahoor</h1>
        <p className="text-lg text-emerald-200">Hearts Await Zahoor</p>
      </motion.div>
      <div className="absolute bottom-12 flex items-center space-x-2 text-emerald-300">
        <Loader className="w-4 h-4 animate-spin" />
        <span>Loading Community...</span>
      </div>
    </div>
  );
}