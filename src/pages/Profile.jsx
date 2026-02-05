
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Feedback } from "@/entities/Feedback";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Edit, 
  Save, 
  Shield,
  Book,
  Share2,
  MessageSquare,
  LogOut,
  Camera,
  CheckCircle,
  Crown,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ImageCropEditor from "@/components/profile/ImageCropEditor"; // Added import

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false); // Added state
  const [selectedImage, setSelectedImage] = useState(null); // Added state

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setEditForm(user);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleImageSelect = (e) => { // Modified function name and logic
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setShowImageEditor(true);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSave = async (blob) => { // New function for saving cropped image
    setUploadingImage(true);
    setShowImageEditor(false);
    
    try {
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const response = await UploadFile({ file });
      const imageUrl = response.file_url;
      
      await User.updateMyUserData({ profile_image: imageUrl });
      
      setCurrentUser({ ...currentUser, profile_image: imageUrl });
      setEditForm({ ...editForm, profile_image: imageUrl });
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      setSelectedImage(null);
    }
  };

  const handleImageCancel = () => { // New function to cancel image editing
    setShowImageEditor(false);
    setSelectedImage(null);
  };

  const handleSaveProfile = async () => {
    try {
      await User.updateMyUserData(editForm);
      setCurrentUser(editForm);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleShare = async () => {
    if (!currentUser) return;
    
    const referralLink = `${window.location.origin}?ref=${currentUser.id}`;
    const shareText = `Join me on Zahoor! A dedicated platform for our community to connect, learn, and grow together.\n\n${referralLink}`;
    
    // Try native share first
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: 'Zahoor - The App for the Global Shia Community',
          text: shareText,
        });
        return; // Success - exit early
      } catch (error) {
        // If user cancels, error.name will be 'AbortError'
        if (error.name === 'AbortError') {
          console.log('Share cancelled by user');
          return;
        }
        // For other errors, fall through to clipboard copy
        console.log('Native share failed, falling back to clipboard:', error);
      }
    }
    
    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 3000);
      alert('Referral link copied to clipboard! Share it with your friends.');
    } catch (clipboardError) {
      console.error('Clipboard copy failed:', clipboardError);
      // Last resort - show the link
      alert(`Please copy this link manually:\n\n${referralLink}`);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim() || !currentUser) return;
    try {
      await Feedback.create({
        feedback_text: feedbackText,
        user_id: currentUser.id,
        user_email: currentUser.email,
        category: "Other"
      });
      setFeedbackText("");
      setShowFeedbackDialog(false);
      alert("Thank you for your feedback! We appreciate you helping us improve.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Sorry, we couldn't submit your feedback at this time. Please try again later.");
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await User.logout();
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const userTypeColors = {
    maulana: 'bg-amber-100 text-amber-700 border-amber-200',
    tutor: 'bg-blue-100 text-blue-700 border-blue-200',
    zakir: 'bg-purple-100 text-purple-700 border-purple-200',
    zakera: 'bg-pink-100 text-pink-700 border-pink-200',
    admin: 'bg-red-100 text-red-700 border-red-200',
    general: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pb-24">
      {/* Header Banner with Profile */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-600 to-emerald-800 overflow-visible">
        {/* Islamic Pattern Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M30 30m-20,0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3Cpath d='M30 10v40M10 30h40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Profile Image - Centered on Banner Edge */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            {/* Profile Picture Container */}
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-emerald-100">
              {uploadingImage ? (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              ) : (
                <img 
                  src={currentUser.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name)}&background=10b981&color=fff&size=256`} 
                  alt={currentUser.full_name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Camera Button for Upload */}
            <label 
              htmlFor="profile-image-upload" 
              className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center cursor-pointer border-3 border-white shadow-xl transition-all hover:scale-110 active:scale-95"
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect} // Changed onChange handler
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
            
            {/* Verification Badge */}
            {currentUser.is_verified && (
              <div className="absolute top-0 right-0 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-xl">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content - Padding for Profile Picture */}
      <div className="px-4 pt-20 space-y-6">
        {/* Name and Role */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">{currentUser.full_name}</h1>
          <p className="text-emerald-700 mb-3">{currentUser.email}</p>
          
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge className={`${userTypeColors[currentUser.user_type || 'general']} border font-medium`}>
              {currentUser.user_type === 'maulana' && '🎓 Maulana'}
              {currentUser.user_type === 'tutor' && '📚 Tutor'}
              {currentUser.user_type === 'zakir' && '🎤 Zakir'}
              {currentUser.user_type === 'zakera' && '👩‍🦱 Zakera'}
              {currentUser.user_type === 'admin' && '👑 Admin'}
              {(!currentUser.user_type || currentUser.user_type === 'general') && '👤 Community Member'}
            </Badge>
            
            {currentUser.is_verified && (
              <Badge className="bg-green-100 text-green-700 border border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          
          <Link to={createPageUrl("GoPremium")} className="block">
            <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 font-semibold shadow-md">
              <Crown className="w-4 h-4 mr-2" />
              Go Premium
            </Button>
          </Link>
        </div>

        {/* Profile Information */}
        <div className="glassmorphism rounded-2xl p-5 border border-emerald-200/50 shadow-lg">
          <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-600" />
            Profile Information
          </h2>
          
          <div className="space-y-4">
            {currentUser.phone && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <Phone className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Phone</p>
                  <p className="text-emerald-900">{currentUser.phone}</p>
                </div>
              </div>
            )}

            {currentUser.location && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Location</p>
                  <p className="text-emerald-900">
                    {currentUser.location.city}, {currentUser.location.country}
                  </p>
                </div>
              </div>
            )}

            {currentUser.bio && (
              <div className="p-3 bg-emerald-50 rounded-xl">
                <p className="text-xs text-emerald-700 font-medium mb-2">Bio</p>
                <p className="text-emerald-900 leading-relaxed">{currentUser.bio}</p>
              </div>
            )}

            {currentUser.expertise && currentUser.expertise.length > 0 && (
              <div className="p-3 bg-emerald-50 rounded-xl">
                <p className="text-xs text-emerald-700 font-medium mb-2">Areas of Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {currentUser.expertise.map((skill, index) => (
                    <Badge key={index} className="bg-emerald-200 text-emerald-800 border-0">
                      <Book className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community & Support */}
        <div className="glassmorphism rounded-2xl p-5 border border-emerald-200/50 shadow-lg">
          <h2 className="text-lg font-bold text-emerald-900 mb-4">Community & Support</h2>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 justify-start"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">
                {isLinkCopied ? 'Link Copied!' : 'Share the App'}
              </span>
            </Button>

            <Button
              variant="outline"
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 justify-start"
              onClick={() => setShowFeedbackDialog(true)}
            >
              <MessageSquare className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">Provide Feedback</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-red-300 text-red-600 hover:bg-red-50 justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-white border-emerald-200 max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-emerald-900 text-xl font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-emerald-800 font-medium">Phone Number</Label>
              <Input
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="mt-1 border-emerald-200 focus:border-emerald-500"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <Label className="text-emerald-800 font-medium">Bio</Label>
              <Textarea
                value={editForm.bio || ''}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                className="mt-1 border-emerald-200 focus:border-emerald-500"
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div>
              <Label className="text-emerald-800 font-medium">City</Label>
              <Input
                value={editForm.location?.city || ''}
                onChange={(e) => setEditForm({
                  ...editForm, 
                  location: {...(editForm.location || {}), city: e.target.value}
                })}
                className="mt-1 border-emerald-200 focus:border-emerald-500"
                placeholder="Your city"
              />
            </div>

            <div>
              <Label className="text-emerald-800 font-medium">Country</Label>
              <Input
                value={editForm.location?.country || ''}
                onChange={(e) => setEditForm({
                  ...editForm, 
                  location: {...(editForm.location || {}), country: e.target.value}
                })}
                className="mt-1 border-emerald-200 focus:border-emerald-500"
                placeholder="Your country"
              />
            </div>

            {(currentUser.user_type === 'maulana' || currentUser.user_type === 'tutor') && (
              <div>
                <Label className="text-emerald-800 font-medium">Areas of Expertise</Label>
                <Input
                  value={editForm.expertise?.join(', ') || ''}
                  onChange={(e) => setEditForm({
                    ...editForm, 
                    expertise: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="mt-1 border-emerald-200 focus:border-emerald-500"
                  placeholder="Fiqh, Quran, etc. (comma separated)"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="bg-white border-emerald-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald-900 text-xl font-bold">Help Us Improve</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-emerald-700">We value your feedback. Please let us know how we can make Zahoor better for you.</p>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500 min-h-[120px]"
              placeholder="Your suggestions, bug reports, or feature requests..."
            />
            <Button
              onClick={handleFeedbackSubmit}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              disabled={!feedbackText.trim()}
            >
              Submit Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Crop Editor */}
      {showImageEditor && selectedImage && (
        <ImageCropEditor
          imageSrc={selectedImage}
          onSave={handleImageSave}
          onCancel={handleImageCancel}
        />
      )}
    </div>
  );
}
