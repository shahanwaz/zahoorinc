import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

export default function WelcomeScreen({ onFinish }) {
    return (
        <motion.div 
            className="glassmorphism rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <motion.div
                animate={{ rotate: [-10, 10, -10], transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' } }}
                className="inline-block"
            >
                <PartyPopper className="w-16 h-16 text-emerald-500 mb-4" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">You're All Set!</h1>
            <p className="text-emerald-700 mb-6">
                JazakAllah for joining the Zahoor community. You are now ready to explore.
            </p>
            <Button 
                onClick={onFinish} 
                className="primary-btn w-full text-lg h-12"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Enter the App
            </Button>
        </motion.div>
    );
}