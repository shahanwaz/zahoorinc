import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { CheckCircle, Home, Sparkles } from 'lucide-react';

export default function WelcomeSuccess() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate(createPageUrl('Home'));
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // Hide confetti after animation
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(confettiTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cream-50 to-gold-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                y: -10, 
                x: Math.random() * window.innerWidth,
                rotate: 0 
              }}
              animate={{ 
                opacity: 0, 
                y: window.innerHeight + 100,
                rotate: 360 
              }}
              transition={{ 
                duration: 3, 
                delay: Math.random() * 2,
                ease: "easeOut" 
              }}
              className={`absolute w-2 h-2 ${
                i % 4 === 0 ? 'bg-emerald-500' :
                i % 4 === 1 ? 'bg-gold-400' :
                i % 4 === 2 ? 'bg-emerald-300' : 'bg-amber-400'
              } rounded-full`}
            />
          ))}
        </div>
      )}

      {/* Success Content */}
      <div className="max-w-md mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            Your Account is Ready! 🎉
          </h1>
          <p className="text-xl text-emerald-600 mb-8 leading-relaxed">
            Welcome to Zahoor! Start exploring the community and connect with fellow believers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <Button
            onClick={() => navigate(createPageUrl('Home'))}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 text-lg shadow-xl"
          >
            <Home className="w-6 h-6 mr-3" />
            Go to Homepage 🏠
          </Button>
          
          <p className="text-sm text-emerald-600">
            Redirecting automatically in 5 seconds...
          </p>
        </motion.div>

        {/* Islamic Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 text-emerald-600"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-4 h-4 text-gold-500 mr-2" />
            <div className="w-12 h-px bg-emerald-300"></div>
            <div className="mx-4 w-3 h-3 bg-emerald-400 rounded-full"></div>
            <div className="w-12 h-px bg-emerald-300"></div>
            <Sparkles className="w-4 h-4 text-gold-500 ml-2" />
          </div>
          <p className="text-lg font-arabic">بَارَكَ اللهُ فِيكَ</p>
          <p className="text-sm text-emerald-600 mt-1">May Allah bless you</p>
        </motion.div>
      </div>
    </div>
  );
}