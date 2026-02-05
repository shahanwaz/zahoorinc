import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Maulana } from "@/entities/Maulana";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  MessageCircle,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  CheckCircle,
  Share2,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MaulanaProfile() {
  const navigate = useNavigate();
  const [maulana, setMaulana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("istikhara");
  const [requestMessage, setRequestMessage] = useState("");

  // Mock reviews data (can be fetched from a Reviews entity later)
  const [reviews] = useState([
    {
      id: 1,
      user_name: "Ali Hassan",
      rating: 5,
      comment: "Very knowledgeable Maulana. His guidance helped me immensely with understanding Fiqh matters.",
      date: "2024-12-15"
    },
    {
      id: 2,
      user_name: "Fatima Zahra",
      rating: 5,
      comment: "Excellent teacher for Quran studies. Patient and explains concepts clearly.",
      date: "2024-12-10"
    },
    {
      id: 3,
      user_name: "Ahmed Raza",
      rating: 4,
      comment: "Great majlis speeches. Very inspiring and informative.",
      date: "2024-12-05"
    }
  ]);

  useEffect(() => {
    loadMaulanaProfile();
  }, []);

  const loadMaulanaProfile = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const maulanaId = urlParams.get('id');

      if (!maulanaId) {
        alert("Invalid Maulana ID");
        navigate(-1);
        return;
      }

      const maulanas = await Maulana.filter({ id: maulanaId });
      if (maulanas.length === 0) {
        alert("Maulana not found");
        navigate(-1);
        return;
      }

      setMaulana(maulanas[0]);
    } catch (error) {
      console.error("Error loading maulana profile:", error);
      alert("Failed to load profile");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestService = () => {
    if (!requestMessage.trim()) {
      alert("Please enter your request details");
      return;
    }

    alert(`Service request sent to ${maulana.name}!\n\nService: ${requestType}\nMessage: ${requestMessage}\n\nYou will be contacted soon.`);
    setShowRequestModal(false);
    setRequestMessage("");
  };

  const handleShare = async () => {
    const shareText = `Check out ${maulana.name}'s profile on Zahoor!\n\nExpertise: ${maulana.services?.join(", ")}\nLocation: ${maulana.location?.city}, ${maulana.location?.country}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: maulana.name,
          text: shareText,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log('Share failed, falling back to clipboard');
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Profile link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!maulana) {
    return null;
  }

  const roleBadge = maulana.amama_type === "black"
    ? { icon: GraduationCap, label: "Maulana", color: "bg-emerald-100 text-emerald-700 border-emerald-300" }
    : { icon: GraduationCap, label: "Zakir", color: "bg-blue-100 text-blue-700 border-blue-300" };
  const RoleIcon = roleBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-emerald-50">
      {/* Header with Banner */}
      <div className="relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-white/90 hover:bg-white shadow-lg rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
        </div>

        {/* Share Button */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="bg-white/90 hover:bg-white shadow-lg rounded-full"
          >
            <Share2 className="w-5 h-5 text-emerald-800" />
          </Button>
        </div>

        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-500">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4'%3E%3Cpath d='M30 30m-20,0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3Cpath d='M30 10v40M10 30h40'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                {maulana.profile_image_url ? (
                  <img 
                    src={maulana.profile_image_url} 
                    alt={maulana.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                    <span className="text-4xl font-bold text-emerald-600">
                      {maulana.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {maulana.is_verified && (
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 px-4 pb-8">
        {/* Name and Basic Info */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-emerald-900">{maulana.name}</h1>
            <Badge className={`${roleBadge.color} border flex items-center gap-1`}>
              <RoleIcon className="w-3 h-3" />
              {roleBadge.label}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{maulana.location?.city}, {maulana.location?.country}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= (maulana.rating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {maulana.rating?.toFixed(1) || "0.0"} ({maulana.review_count || 0} reviews)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center max-w-md mx-auto">
            <Button
              onClick={() => setShowRequestModal(true)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Request Service
            </Button>
            {maulana.contact_info?.phone && (
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                onClick={() => window.open(`tel:${maulana.contact_info.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 bg-emerald-50 border border-emerald-200">
            <TabsTrigger value="about" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              About
            </TabsTrigger>
            <TabsTrigger value="expertise" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Expertise
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Services
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <Card className="border-emerald-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {maulana.bio || "No biography available."}
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-emerald-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {maulana.contact_info?.phone && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-emerald-700 font-medium">Phone</p>
                      <p className="text-emerald-900">{maulana.contact_info.phone}</p>
                    </div>
                  </div>
                )}
                {maulana.contact_info?.email && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-emerald-700 font-medium">Email</p>
                      <p className="text-emerald-900">{maulana.contact_info.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            {maulana.availability && maulana.availability.length > 0 && (
              <Card className="border-emerald-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-emerald-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {maulana.availability.map((time, index) => (
                      <Badge key={index} variant="outline" className="border-emerald-300 text-emerald-700">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-4">
            <Card className="border-emerald-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Areas of Specialization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {maulana.services && maulana.services.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {maulana.services.map((service, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-lg border border-emerald-200 text-center"
                      >
                        <p className="font-medium text-emerald-900">{service}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specializations listed.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setRequestType("istikhara"); setShowRequestModal(true); }}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">🤲</span>
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-1">Request Istikhara</h3>
                    <p className="text-sm text-gray-600">Seek spiritual guidance through Istikhara</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setRequestType("majlis"); setShowRequestModal(true); }}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">🕌</span>
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-1">Invite for Majlis</h3>
                    <p className="text-sm text-gray-600">Request for majlis or religious program</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setRequestType("tuition"); setShowRequestModal(true); }}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-1">Quran/Islamic Studies</h3>
                    <p className="text-sm text-gray-600">Request tutoring or lessons</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setRequestType("ejara"); setShowRequestModal(true); }}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">✨</span>
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-1">Ejara Services</h3>
                    <p className="text-sm text-gray-600">Request Ejara (Roza, Namaz, etc.)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {maulana.expected_hadiya && (
              <Card className="border-amber-200 bg-amber-50 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <p className="text-sm text-amber-700 font-medium">Expected Hadiya</p>
                      <p className="text-lg font-bold text-amber-900">{maulana.expected_hadiya}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="border-emerald-100 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-emerald-600">
                          {review.user_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-emerald-900">{review.user_name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-emerald-100 shadow-md">
                <CardContent className="pt-6 text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No reviews yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Service Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="bg-white border-emerald-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald-900 text-xl font-bold">Request Service</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-emerald-800 font-medium mb-2 block">Service Type</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger className="border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="istikhara">🤲 Request Istikhara</SelectItem>
                  <SelectItem value="majlis">🕌 Invite for Majlis</SelectItem>
                  <SelectItem value="tuition">📚 Quran/Islamic Studies</SelectItem>
                  <SelectItem value="ejara">✨ Ejara Services</SelectItem>
                  <SelectItem value="nikah">💍 Nikah Ceremony</SelectItem>
                  <SelectItem value="other">📝 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-emerald-800 font-medium mb-2 block">Message</Label>
              <Textarea
                placeholder="Please provide details about your request..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500 min-h-[120px]"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                💡 Your request will be sent to {maulana.name}. They will contact you to discuss details and availability.
              </p>
            </div>

            <Button
              onClick={handleRequestService}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              disabled={!requestMessage.trim()}
            >
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}