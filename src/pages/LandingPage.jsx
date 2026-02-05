import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageCircle, Briefcase, Sparkles, Video, BookOpen, Baby, Image,
  UserSearch, Calendar, Wallet, Bookmark, MessageSquare, Globe,
  Clock, Compass, BookMarked, CalendarDays, Users, CheckCircle,
  ArrowRight, Play, Star, Heart
} from "lucide-react";

const features = [
  { icon: MessageCircle, title: "Community Q&A", desc: "Ask and answer Islamic questions" },
  { icon: Briefcase, title: "Ejara Services", desc: "Connect with service providers" },
  { icon: Sparkles, title: "Istikhara Service", desc: "Request spiritual guidance" },
  { icon: Video, title: "Majalis & Lectures", desc: "Watch Islamic content" },
  { icon: BookOpen, title: "Media Library", desc: "Access Islamic resources" },
  { icon: Baby, title: "Kids Section", desc: "Content for children" },
  { icon: Image, title: "Image Gallery", desc: "Islamic art and photos" },
  { icon: UserSearch, title: "Find Maulana", desc: "Connect with scholars" },
  { icon: Calendar, title: "Events", desc: "Community gatherings" },
  { icon: Wallet, title: "Wallet & Payments", desc: "Secure transactions" },
  { icon: Bookmark, title: "Saved Items", desc: "Bookmark favorites" },
  { icon: MessageSquare, title: "Status Updates", desc: "Share moments" }
];

const spiritualTools = [
  { icon: Clock, title: "Prayer Times", desc: "Accurate prayer schedules" },
  { icon: Compass, title: "Qibla Compass", desc: "Find prayer direction" },
  { icon: BookMarked, title: "Duas & Ziyarat", desc: "Daily supplications" },
  { icon: CalendarDays, title: "Islamic Calendar", desc: "Hijri dates & events" }
];

const steps = [
  { num: "01", title: "Create Account", desc: "Sign up in seconds with email or social login" },
  { num: "02", title: "Choose Your Role", desc: "Select user type: General, Maulana, or Scholar" },
  { num: "03", title: "Explore Features", desc: "Access all community tools and resources" },
  { num: "04", title: "Learn & Contribute", desc: "Grow spiritually and help others" }
];

const stats = [
  { value: "50K+", label: "Users Worldwide" },
  { value: "5K+", label: "Majalis Hosted" },
  { value: "20K+", label: "Questions Answered" },
  { value: "3K+", label: "Services Completed" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png" 
              alt="Zahoor" 
              className="w-10 h-10 rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-xl font-bold text-emerald-800">Zahoor</h1>
              <p className="text-xs text-emerald-600">Global Shia Community</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Home")}>
              <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                Sign In
              </Button>
            </Link>
            <Link to={createPageUrl("Home")}>
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Cpath d='M30 30m-25,0a25,25 0 1,1 50,0a25,25 0 1,1 -50,0'/%3E%3Cpath d='M30 5v50M5 30h50'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            ✨ Hearts Await Zahoor
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-6">
            Connecting the Global<br />Shia Community
          </h1>
          <p className="text-xl text-emerald-700 mb-8 max-w-2xl mx-auto">
            Learn, connect, and grow spiritually through one unified digital platform. 
            Access Islamic knowledge, community services, and spiritual guidance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={createPageUrl("Home")}>
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg px-8 py-6">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6">
              <Play className="mr-2 w-5 h-5" /> Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">About Zahoor</h2>
          <p className="text-lg text-emerald-700 leading-relaxed">
            Zahoor is a comprehensive Shia community platform designed to unite Muslims worldwide. 
            We provide spiritual, educational, and community services all in one place—from prayer times 
            and duas to connecting with scholars and accessing quality Islamic content. Whether you're 
            seeking knowledge, guidance, or community support, Zahoor is your digital companion.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Comprehensive Features</h2>
            <p className="text-lg text-emerald-700">Everything you need for your spiritual journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-emerald-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spiritual Tools */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Essential Spiritual Tools</h2>
            <p className="text-lg text-emerald-700">Daily resources for your Islamic practice</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spiritualTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Card key={idx} className="border-emerald-100 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-2">{tool.title}</h3>
                    <p className="text-sm text-emerald-600">{tool.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">How It Works</h2>
            <p className="text-lg text-emerald-700">Get started in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-emerald-100 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-emerald-900 mb-3">{step.title}</h3>
                <p className="text-emerald-700">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-12 -right-4 w-8 h-8 text-emerald-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Community Impact</h2>
            <p className="text-lg text-emerald-700">Growing together, stronger every day</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-emerald-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ahmed Hassan", role: "Community Member", text: "Zahoor has transformed my spiritual journey. The Q&A section connects me with knowledgeable scholars instantly." },
              { name: "Fatima Zahra", role: "Parent", text: "The kids section is amazing! My children love the Islamic stories and I feel confident about the content." },
              { name: "Maulana Ali", role: "Scholar", text: "An excellent platform to reach and help the community. The Istikhara service is beautifully implemented." }
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-emerald-100">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-emerald-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-emerald-900">{testimonial.name}</p>
                    <p className="text-sm text-emerald-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join Zahoor Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of a growing global community dedicated to spiritual growth and unity.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={createPageUrl("Home")}>
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6">
                Create Free Account
              </Button>
            </Link>
            <Link to={createPageUrl("Home")}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png" 
                  alt="Zahoor" 
                  className="w-8 h-8 rounded"
                />
                <span className="font-bold text-lg">Zahoor</span>
              </div>
              <p className="text-emerald-200 text-sm">
                Connecting the global Shia community through faith, knowledge, and unity.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <div className="space-y-2 text-emerald-200 text-sm">
                <div><Link to={createPageUrl("AboutUs")} className="hover:text-white">About Us</Link></div>
                <div><Link to={createPageUrl("Home")} className="hover:text-white">Features</Link></div>
                <div><Link to={createPageUrl("GoPremium")} className="hover:text-white">Premium</Link></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <div className="space-y-2 text-emerald-200 text-sm">
                <div><Link to={createPageUrl("HelpAndReportContent")} className="hover:text-white">Help Center</Link></div>
                <div><Link to={createPageUrl("Questions")} className="hover:text-white">Community</Link></div>
                <div><Link to={createPageUrl("Events")} className="hover:text-white">Events</Link></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <div className="space-y-2 text-emerald-200 text-sm">
                <div><Link to={createPageUrl("TermsAndConditions")} className="hover:text-white">Terms of Service</Link></div>
                <div><Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white">Privacy Policy</Link></div>
                <div><Link to={createPageUrl("HelpAndReportContent")} className="hover:text-white">Contact</Link></div>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-200 text-sm">© 2026 Zahoor. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Heart className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}