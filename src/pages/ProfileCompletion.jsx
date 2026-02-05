
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import { User } from '@/entities/User';
import { ArrowLeft, Camera, Upload } from 'lucide-react';

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const [selectedCategory] = useState(localStorage.getItem('selectedCategory') || 'general');
  const [profileImage, setProfileImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    country: '',
    city: '',
    bio: '',
    expertise: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app, would upload to storage and get a URL
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        ...formData,
        profile_image: profileImage,
        user_type: selectedCategory,
        onboardingCompleted: true // Mark onboarding as complete
      };
      
      // Call the User entity method to update user data
      await User.updateMyUserData(userData); 
      
      navigate(createPageUrl('WelcomeSuccess'));
    } catch (error) {
      console.error('Profile creation failed:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleSkip = async () => {
    try {
        // Mark onboarding as complete without filling profile details
        await User.updateMyUserData({ onboardingCompleted: true });
        navigate(createPageUrl('Home'));
    } catch(error) {
        console.error("Failed to update user onboarding status", error);
        // Even if update fails, navigate to home to allow user to proceed
        navigate(createPageUrl('Home'));
    }
  };

  const countries = [
    'India', 'Pakistan', 'Iran', 'Iraq', 'Lebanon', 'Syria', 'Yemen', 'Bahrain', 
    'Kuwait', 'UAE', 'Saudi Arabia', 'USA', 'UK', 'Canada', 'Australia'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cream-50 to-gold-50 p-4">
      {/* Progress Indicator */}
      <div className="max-w-md mx-auto pt-8 pb-4">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <div className="w-8 h-1 bg-emerald-500 rounded"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <div className="w-8 h-1 bg-emerald-500 rounded"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
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
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Complete your Profile</h1>
          <p className="text-emerald-600 text-lg">Fill in your details to get started</p>
        </motion.div>

        <Card className="bg-white/80 backdrop-blur-md border-emerald-200 shadow-xl mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-emerald-500" />
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute -bottom-1 -right-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-emerald-600 mt-2">Upload your profile picture</p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name" className="text-emerald-700 font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 border-emerald-300 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="gender" className="text-emerald-700 font-medium">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger className="mt-1 border-emerald-300">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth" className="text-emerald-700 font-medium">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="mt-1 border-emerald-300 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="country" className="text-emerald-700 font-medium">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                      <SelectTrigger className="mt-1 border-emerald-300">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country.toLowerCase()}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-emerald-700 font-medium">City *</Label>
                    <Input
                      id="city"
                      required
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="mt-1 border-emerald-300 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Conditional Fields Based on Category */}
                {selectedCategory === 'general' && (
                  <div>
                    <Label htmlFor="bio" className="text-emerald-700 font-medium">Bio / Interests</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and your interests..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="mt-1 border-emerald-300 focus:border-emerald-500 min-h-20"
                    />
                  </div>
                )}

                {(selectedCategory === 'tutor' || selectedCategory === 'maulana') && (
                  <div>
                    <Label htmlFor="expertise" className="text-emerald-700 font-medium">
                      {selectedCategory === 'tutor' ? 'Subjects / Expertise' : 'Areas of Knowledge'}
                    </Label>
                    <Textarea
                      id="expertise"
                      placeholder={selectedCategory === 'tutor' ? 
                        "e.g., Quran, Arabic, Islamic History, Fiqh..." : 
                        "e.g., Fiqh, Tafseer, Hadith, Islamic Philosophy..."
                      }
                      value={formData.expertise}
                      onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                      className="mt-1 border-emerald-300 focus:border-emerald-500 min-h-20"
                    />
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.country || !formData.city}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              Create Account ✅
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            Skip for now (complete later)
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
