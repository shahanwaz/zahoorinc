import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, ArrowLeft } from 'lucide-react';

export default function ProfessionalProfile({ role, roleTitle, nextStep, prevStep, isSecondStep = false }) {

    const renderVerificationFields = () => (
        <>
            <div>
                <Label className="text-emerald-700 mb-2 block">
                    {role === 'business' || role === 'madarsa' || role === 'ngo' 
                        ? 'Upload Verification Document' 
                        : 'Upload Sample Work (Audio/Video)'}
                </Label>
                <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 text-center cursor-pointer hover:bg-emerald-50">
                    <UploadCloud className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                    <p className="text-emerald-700">Click to upload file</p>
                    <p className="text-xs text-emerald-500">
                        {role === 'business' ? 'Business License, GST, etc.' : 'Audio, Video, or Document'}
                    </p>
                </div>
            </div>
            {role === 'maulana' &&
                <div>
                     <Label className="text-emerald-700">Scholar ID / Reference</Label>
                     <Input placeholder="Enter your Hawza ID or a reference" className="dialog-input" />
                </div>
            }
        </>
    );

    const renderAvailabilityFields = () => (
        <>
            <div>
                <Label className="text-emerald-700">Availability</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Select>
                        <SelectTrigger className="dialog-input"><SelectValue placeholder="Days" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekdays">Weekdays</SelectItem>
                            <SelectItem value="weekends">Weekends</SelectItem>
                            <SelectItem value="all">All Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="dialog-input"><SelectValue placeholder="Time" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="evenings">Evenings</SelectItem>
                            <SelectItem value="mornings">Mornings</SelectItem>
                            <SelectItem value="any">Any Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label className="text-emerald-700">Services Offered</Label>
                <Input placeholder="e.g., Majalis, Nikah, Consultations" className="dialog-input" />
            </div>
        </>
    );

    const renderInitialProfileFields = () => {
        const fields = {
            maulana: <>
                <Input placeholder="Full Name (e.g., Maulana Syed Ali Naqvi)" className="dialog-input"/>
                <Select>
                    <SelectTrigger className="dialog-input"><SelectValue placeholder="Amama Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="black">Black (Syed)</SelectItem>
                        <SelectItem value="white">White (Non-Syed)</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea placeholder="Areas of Expertise (e.g., Fiqh, History, Quran Tafseer)" className="dialog-input"/>
            </>,
            zakir: <><Input placeholder="Full Name" className="dialog-input"/><Input placeholder="Style of Recitation" className="dialog-input"/></>,
            nauhakwan: <><Input placeholder="Group or Solo Name" className="dialog-input"/><Input placeholder="Recitation Style" className="dialog-input"/></>,
            shayar: <><Input placeholder="Pen Name" className="dialog-input"/><Textarea placeholder="Describe your poetry style" className="dialog-input"/></>,
            business: <><Input placeholder="Business Name" className="dialog-input"/><Input placeholder="Business Type (e.g., Bookstore, Halal Food)" className="dialog-input"/></>,
            madarsa: <><Input placeholder="Name of Madarsa" className="dialog-input"/><Input placeholder="Administrator Name" className="dialog-input"/></>,
            ngo: <><Input placeholder="NGO Name" className="dialog-input"/><Input placeholder="Registration No." className="dialog-input"/></>
        };
        return fields[role] || null;
    };

    return (
        <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-1">{isSecondStep ? 'Verification & Availability' : `Join as ${roleTitle}`}</h2>
            <p className="text-emerald-600 mb-6">{isSecondStep ? 'Provide details to complete your professional profile.' : 'Please provide some basic information.'}</p>
            
            <div className="space-y-4">
                {!isSecondStep && renderInitialProfileFields()}
                {isSecondStep && (role === 'maulana' || role === 'zakir') && renderAvailabilityFields()}
                {isSecondStep && renderVerificationFields()}
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