import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, ArrowLeft } from 'lucide-react';

export default function GeneralUserProfile({ nextStep, prevStep }) {
    const [profileData, setProfileData] = useState({
        name: '',
        location: '',
        profilePic: null,
    });
    const [interests, setInterests] = useState([]);

    const handleInterestToggle = (interest) => {
        setInterests(prev => 
            prev.includes(interest) 
            ? prev.filter(i => i !== interest) 
            : [...prev, interest]
        );
    };

    const interestOptions = ['Duas', 'Events', 'Tutors', 'Notes', 'Contests', 'History'];

    return (
        <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Set Up Your Profile</h2>
            
            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-2">
                        <AvatarImage src={profileData.profilePic} />
                        <AvatarFallback className="bg-emerald-200 text-emerald-700">
                            <Upload className="w-8 h-8"/>
                        </AvatarFallback>
                    </Avatar>
                    <Button variant="link" className="text-emerald-600">Upload Picture</Button>
                </div>

                <div>
                    <Label htmlFor="name" className="text-emerald-700">Full Name</Label>
                    <Input id="name" placeholder="e.g., Ali Raza" className="dialog-input" />
                </div>

                <div>
                    <Label htmlFor="location" className="text-emerald-700">Location</Label>
                    <Input id="location" placeholder="e.g., Lucknow, India" className="dialog-input" />
                </div>
                 <div>
                    <Label className="text-emerald-700 mb-2 block">Choose Your Interests</Label>
                    <div className="flex flex-wrap gap-2">
                        {interestOptions.map(interest => (
                            <Button 
                                key={interest}
                                variant={interests.includes(interest) ? 'default' : 'outline'}
                                onClick={() => handleInterestToggle(interest)}
                                className={`rounded-full transition-all duration-200 ${interests.includes(interest) ? 'primary-btn' : 'border-emerald-300 text-emerald-700'}`}
                            >
                                {interest}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={prevStep} className="w-full">
                     <ArrowLeft className="w-4 h-4 mr-2"/> Back
                </Button>
                <Button onClick={nextStep} className="primary-btn w-full">
                    Continue
                </Button>
            </div>
        </div>
    );
}