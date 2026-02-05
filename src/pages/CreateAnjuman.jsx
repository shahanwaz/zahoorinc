
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anjuman } from '@/entities/Anjuman';
import { UploadFile } from '@/integrations/Core';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, UploadCloud, Loader2 } from 'lucide-react';

export default function CreateAnjuman() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        listing_type: 'anjuman',
        name: '',
        type: 'religious',
        city: '',
        country: '',
        description: '',
        logoFile: null,
        phone: '',
        email: '',
        website: '',
        founded_year: '',
        is_public: 'true'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, logoFile: file }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let logoUrl = '';
            if (formData.logoFile) {
                const response = await UploadFile({ file: formData.logoFile });
                logoUrl = response.file_url;
            }

            const newAnjumanData = {
                name: formData.name,
                listing_type: formData.listing_type,
                type: formData.type,
                location: {
                    city: formData.city,
                    country: formData.country,
                },
                description: formData.description,
                logo_url: logoUrl,
                banner_url: logoUrl, // Using logo for banner as well for simplicity
                contact_info: {
                    phone: formData.phone,
                    email: formData.email,
                    website: formData.website,
                },
                founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
                is_public: formData.is_public === 'true',
                member_count: 1, // Start with the creator
                members: [], // This would be populated with the current user's ID
            };

            await Anjuman.create(newAnjumanData);

            alert('Your listing has been created successfully!');
            navigate(createPageUrl('AnjumanExplorer'));
        } catch (error) {
            console.error("Error creating Anjuman:", error);
            alert("Failed to create listing. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md p-4 border-b" style={{ borderColor: '#E8D4B7' }}>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4 hover:bg-pink-50">
                        <ArrowLeft className="w-5 h-5" style={{ color: '#6A0066' }} />
                    </Button>
                    <h1 className="text-xl font-bold" style={{ color: '#6A0066' }}>Create New Listing</h1>
                </div>
            </header>

            <main className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Card */}
                    <div className="glassmorphism rounded-2xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="listing_type" className="text-muted-violet">Listing Type</Label>
                                <Select value={formData.listing_type} onValueChange={(value) => handleSelectChange('listing_type', value)}>
                                    <SelectTrigger className="dialog-input"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="anjuman">Anjuman</SelectItem>
                                        <SelectItem value="group">Group</SelectItem>
                                        <SelectItem value="imambargah">Imambargah</SelectItem>
                                        <SelectItem value="masajid">Masajid</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="name" className="text-muted-violet">Name of Listing</Label>
                                <Input id="name" value={formData.name} onChange={handleInputChange} required className="dialog-input" />
                            </div>
                            <div>
                                <Label htmlFor="type" className="text-muted-violet">Category</Label>
                                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                                    <SelectTrigger className="dialog-input"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="religious">Religious</SelectItem>
                                        <SelectItem value="educational">Educational</SelectItem>
                                        <SelectItem value="youth">Youth</SelectItem>
                                        <SelectItem value="women">Women</SelectItem>
                                        <SelectItem value="charity">Charity</SelectItem>
                                        <SelectItem value="event_organizer">Event Organizer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <Label htmlFor="founded_year" className="text-muted-violet">Founding Year (Optional)</Label>
                                <Input id="founded_year" type="number" placeholder="e.g., 1995" value={formData.founded_year} onChange={handleInputChange} className="dialog-input" />
                            </div>
                        </div>
                    </div>
                    
                     {/* Location Card */}
                    <div className="glassmorphism rounded-2xl p-5">
                        <h3 className="font-semibold mb-3 text-lg" style={{ color: '#6A0066' }}>Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="city" className="text-muted-violet">City</Label>
                                <Input id="city" value={formData.city} onChange={handleInputChange} required className="dialog-input" />
                            </div>
                            <div>
                                <Label htmlFor="country" className="text-muted-violet">Country</Label>
                                <Input id="country" value={formData.country} onChange={handleInputChange} required className="dialog-input" />
                            </div>
                        </div>
                    </div>

                    {/* Description and Logo Card */}
                    <div className="glassmorphism rounded-2xl p-5">
                        <div>
                            <Label htmlFor="description" className="text-muted-violet">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={handleInputChange} className="dialog-input min-h-[100px]" placeholder="Write about this Anjuman/Group..." />
                        </div>
                        <div className="mt-4">
                            <Label className="text-muted-violet">Upload Logo/Image</Label>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                    {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover rounded-md" /> : <UploadCloud className="w-8 h-8 text-gray-400" />}
                                </div>
                                <Input id="logoFile" type="file" onChange={handleFileChange} className="hidden" />
                                <Button type="button" variant="outline" onClick={() => document.getElementById('logoFile').click()}>
                                    Choose File
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Visibility Card */}
                    <div className="glassmorphism rounded-2xl p-5">
                        <h3 className="font-semibold mb-3 text-lg" style={{ color: '#6A0066' }}>Contact & Visibility</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <Label htmlFor="phone" className="text-muted-violet">Phone Number</Label>
                                <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="dialog-input" />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-muted-violet">Email (Optional)</Label>
                                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="dialog-input" />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="website" className="text-muted-violet">Website/Social Link (Optional)</Label>
                                <Input id="website" type="url" value={formData.website} onChange={handleInputChange} className="dialog-input" />
                            </div>
                             <div className="md:col-span-2">
                                <Label className="text-muted-violet">Visibility</Label>
                                <RadioGroup value={formData.is_public} onValueChange={(value) => handleSelectChange('is_public', value)} className="flex gap-4 mt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="public" />
                                        <Label htmlFor="public">Public</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="private" />
                                        <Label htmlFor="private">Private</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="primary-btn flex-1" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            {isLoading ? 'Submitting...' : 'Submit for Approval'}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
