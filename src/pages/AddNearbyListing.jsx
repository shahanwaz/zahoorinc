import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/entities/User';
import { UploadFile } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Navigation, Loader2, Camera } from 'lucide-react';

export default function AddNearbyListing() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    latitude: '',
    longitude: '',
    image_url: '',
    // Category-specific fields
    specialty: '', // for doctors
    experience: '', // for nauhakhwan, maulana
    expertise: '', // for maulana
    facilities: '', // for graveyards
    students: '', // for hawza
    books: '', // for libraries
    rating: '', // for halal food
    established: '', // for charity, businesses, ziyarat
    members: '' // for community
  });

  useEffect(() => {
    loadUser();
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const categoryLabels = {
    mosques: "🕌 Mosque/Imambargah",
    community: "🏴 Community Organization",
    nauhakhwan: "🎤 Nauhakhwan",
    maulana: "👳 Maulana",
    graveyards: "⚰️ Graveyard",
    hawza: "📖 Hawza/Madarsa",
    libraries: "📚 Library",
    "halal-food": "🍲 Halal Food",
    charity: "❤️ Charity/NGO",
    doctors: "🏥 Doctor",
    ziyarat: "🕌 Ziyarat Spot",
    businesses: "🛍️ Business"
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const response = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: response.file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          alert("Current location detected!");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Please log in to add a listing.");
      return;
    }

    if (!formData.name || !formData.description || !formData.address) {
      alert("Please fill in all required fields (Name, Description, Address)");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would create the listing in your database
      // For now, just showing success message
      alert(`${categoryLabels[category]} listing created successfully! It will be visible after admin approval.`);
      navigate(-1);
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'doctors':
        return (
          <div>
            <Label className="text-emerald-800 font-semibold">Specialty *</Label>
            <Input
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="e.g., Cardiology, Pediatrics"
              required
            />
          </div>
        );
      
      case 'nauhakhwan':
      case 'maulana':
        return (
          <>
            <div>
              <Label className="text-emerald-800 font-semibold">Experience</Label>
              <Input
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="mt-1 border-emerald-200"
                placeholder="e.g., 15+ years"
              />
            </div>
            {category === 'maulana' && (
              <div>
                <Label className="text-emerald-800 font-semibold">Expertise</Label>
                <Input
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="mt-1 border-emerald-200"
                  placeholder="e.g., Fiqh, Khutba, Philosophy"
                />
              </div>
            )}
          </>
        );
      
      case 'graveyards':
        return (
          <div>
            <Label className="text-emerald-800 font-semibold">Facilities</Label>
            <Input
              value={formData.facilities}
              onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="e.g., 24/7 Access, Parking"
            />
          </div>
        );
      
      case 'hawza':
        return (
          <div>
            <Label className="text-emerald-800 font-semibold">Number of Students</Label>
            <Input
              type="number"
              value={formData.students}
              onChange={(e) => setFormData({ ...formData, students: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="e.g., 300"
            />
          </div>
        );
      
      case 'libraries':
        return (
          <div>
            <Label className="text-emerald-800 font-semibold">Number of Books</Label>
            <Input
              value={formData.books}
              onChange={(e) => setFormData({ ...formData, books: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="e.g., 5000+"
            />
          </div>
        );
      
      case 'halal-food':
        return (
          <div>
            <Label className="text-emerald-800 font-semibold">Rating</Label>
            <Input
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="e.g., 4.5/5"
            />
          </div>
        );
      
      case 'charity':
      case 'businesses':
      case 'ziyarat':
        return (
          <div>
            <Label className="text-emerald-800 font-semibold">Established Year</Label>
            <Input
              type="number"
              value={formData.established}
              onChange={(e) => setFormData({ ...formData, established: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="e.g., 1995"
            />
          </div>
        );
      
      case 'community':
        return (
          <div>
            <Label className="text-emerald-800 font-semibold">Number of Members</Label>
            <Input
              type="number"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="e.g., 1200"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-emerald-50"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">Add Listing</h1>
              <p className="text-sm text-emerald-600">{categoryLabels[category]}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="p-4 pb-24">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Image Upload */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200">
            <Label className="text-emerald-800 font-semibold mb-2 block">Upload Image</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-emerald-200">
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                ) : formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload').click()}
                  disabled={uploadingImage}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                <p className="text-xs text-gray-500 mt-1">Recommended: 300x200px</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-800">Basic Information</h3>
            
            <div>
              <Label className="text-emerald-800 font-semibold">Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 border-emerald-200"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <Label className="text-emerald-800 font-semibold">Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 border-emerald-200"
                placeholder="Describe this listing..."
                rows={4}
                required
              />
            </div>

            {renderCategorySpecificFields()}
          </div>

          {/* Contact Info */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-800">Contact Information</h3>
            
            <div>
              <Label className="text-emerald-800 font-semibold">Phone Number</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 border-emerald-200"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <Label className="text-emerald-800 font-semibold">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 border-emerald-200"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label className="text-emerald-800 font-semibold">Website</Label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 border-emerald-200"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Location */}
          <div className="glassmorphism rounded-2xl p-4 border border-emerald-200 space-y-4">
            <h3 className="font-bold text-emerald-800">Location</h3>
            
            <div>
              <Label className="text-emerald-800 font-semibold">Address *</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 border-emerald-200"
                placeholder="Enter full address"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-emerald-800 font-semibold">Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="mt-1 border-emerald-200"
                  placeholder="28.6139"
                />
              </div>
              <div>
                <Label className="text-emerald-800 font-semibold">Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="mt-1 border-emerald-200"
                  placeholder="77.2090"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Use Current Location
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Approval'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}