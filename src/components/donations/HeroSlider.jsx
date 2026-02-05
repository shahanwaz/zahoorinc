import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  { 
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop&q=80",
    text: "Hearts Await Zahoor – Together We Can Change Lives"
  },
  { 
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=600&fit=crop&q=80",
    text: "Empowering Futures Through Education and Hope"
  },
  { 
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop&q=80",
    text: "Your Support Provides Sustenance and Dignity"
  }
];

export default function HeroSlider({ onPrimaryAction }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={slides[currentSlide].image} alt="Impact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4 dark-context">
        <motion.h1 
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl md:text-4xl font-bold max-w-2xl"
        >
          {slides[currentSlide].text}
        </motion.h1>
        <motion.div 
          key={`buttons-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-col sm:flex-row gap-4"
        >
          <Button onClick={() => onPrimaryAction('Chanda')} size="lg" className="primary-btn px-8 text-base">Donate Now</Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 text-base">Join Us & Help Humanity</Button>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'}`}></button>
        ))}
      </div>
      
      <Button onClick={prevSlide} size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"><ChevronLeft /></Button>
      <Button onClick={nextSlide} size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"><ChevronRight /></Button>
    </div>
  );
}