
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import { User, GraduationCap, Landmark, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CategorySelection() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    {
      id: 'general',
      icon: User,
      title: 'General User',
      description: 'Access events, duas, prayer times, tuition, contests, and more.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'tutor',
      icon: GraduationCap,
      title: 'Tutor / Teacher',
      description: 'Offer Islamic tuition, answer questions, and conduct classes.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'maulana',
      icon: Landmark, // Changed from Mosque to Landmark
      title: 'Maulana / Scholar',
      description: 'Host Majalis, answer religious queries, share guidance.',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const handleContinue = () => {
    if (selectedCategory) {
      // Store selection in localStorage or state management
      localStorage.setItem('selectedCategory', selectedCategory);
      navigate(createPageUrl('ProfileCompletion'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cream-50 to-gold-50 p-4">
      {/* Progress Indicator */}
      <div className="max-w-md mx-auto pt-8 pb-4">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <div className="w-8 h-1 bg-emerald-500 rounded"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Select your role</h1>
          <p className="text-emerald-600 text-lg">Choose how you want to use Zahoor</p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'ring-2 ring-emerald-500 shadow-xl bg-emerald-50'
                      : 'hover:shadow-lg bg-white/80 backdrop-blur-md'
                  } border-emerald-200`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-emerald-800 mb-2">{category.title}</h3>
                        <p className="text-emerald-600 leading-relaxed">{category.description}</p>
                      </div>
                      {selectedCategory === category.id && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex space-x-3"
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedCategory}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg disabled:opacity-50"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
