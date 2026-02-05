import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Mail, Phone, Share2, Users, Target, Globe, CheckCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cream-50"
      style={{
        '--tw-bg-opacity': '1',
        backgroundColor: 'rgba(254, 252, 247, var(--tw-bg-opacity))'
      }}
    >
      <div 
        className="relative p-6 pt-10 text-white bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-b-3xl shadow-lg"
        style={{
          backgroundImage: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--heading-color) 100%)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M30 30m-20,0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3Cpath d='M30 10v40M10 30h40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="absolute top-4 left-4 text-white hover:bg-white/20">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center relative z-10">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/2c0282437_487ad098c_yabaqiyatullah.png" 
            alt="Zahoor Logo" 
            className="w-20 h-20 mx-auto mb-4 rounded-3xl shadow-lg"
          />
          <h1 className="text-3xl font-bold">About Zahoor</h1>
          <p className="text-lg opacity-90 mt-2">"Hearts Await Zahoor"</p>
        </div>
      </div>

      <main className="p-6 space-y-8">
        <Card className="shadow-lg border-emerald-200/30 bg-white">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full"><Users className="w-6 h-6 text-emerald-600" /></div>
            <CardTitle className="text-2xl text-emerald-800">Who We Are</CardTitle>
          </CardHeader>
          <CardContent className="text-emerald-800/90 leading-relaxed">
            <p>
              Zahoor is a dedicated digital platform designed to unite the global Shia Muslim community. We aim to provide a comprehensive ecosystem that caters to the spiritual, educational, and social needs of our users, all within a single, easy-to-use application inspired by the teachings of the Ahlulbayt (a.s.).
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-emerald-200/30 bg-white">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full"><Target className="w-6 h-6 text-emerald-600" /></div>
            <CardTitle className="text-2xl text-emerald-800">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-emerald-800/90 leading-relaxed space-y-3">
            <p>Our primary mission is to foster a sense of unity and provide valuable services that enrich the lives of our community members. This includes:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" /><span>Facilitating <strong className="text-amber-600">Ejara Services</strong> with transparency and trust.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" /><span>Connecting users for authentic answers via our <strong className="text-amber-600">Q&A</strong> platform.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" /><span>A central hub for <strong className="text-amber-600">Majalis, Mahfil, and community events</strong>.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" /><span>Offering <strong className="text-amber-600">Live Streaming</strong> of religious gatherings and lectures.</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-emerald-200/30 bg-white">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full"><Globe className="w-6 h-6 text-emerald-600" /></div>
            <CardTitle className="text-2xl text-emerald-800">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-emerald-800/90 leading-relaxed">
            <p>
              We envision Zahoor as the definitive digital hub for Shia Muslims worldwide—a place where faith is strengthened, knowledge is shared, and community bonds are nurtured. We strive to be the most trusted platform for all spiritual and community-related needs.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-emerald-200/30 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-800">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-emerald-800 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
              <Mail className="w-6 h-6 text-emerald-600" />
              <span>support@zahoor.app</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-800 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
              <Phone className="w-6 h-6 text-emerald-600" />
              <span>+91 123-456-7890</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-800 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
              <Share2 className="w-6 h-6 text-emerald-600" />
              <span>Follow us on social media: @ZahoorApp</span>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
            <Button onClick={() => navigate(createPageUrl('Home'))} className="w-full h-14 rounded-full text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <Home className="w-6 h-6 mr-3" />
              Back to Home
            </Button>
        </div>
      </main>
    </div>
  );
}