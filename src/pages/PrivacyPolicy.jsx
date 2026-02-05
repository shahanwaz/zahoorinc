import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock, FolderOpen, Cog, Handshake, Scale, Download, Home } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Data Collection',
      icon: FolderOpen,
      tag: 'We Collect',
      tagColor: 'bg-blue-100 text-blue-800',
      content: 'We collect information you provide directly to us, such as when you create an account, post an Ejara service, or communicate with us. This includes your name, email, location, and transaction details.'
    },
    {
      title: 'Data Usage',
      icon: Cog,
      tag: 'How We Use',
      tagColor: 'bg-green-100 text-green-800',
      content: 'We use the information we collect to operate, maintain, and provide the features and functionality of the Zahoor app. This includes personalizing your experience, processing wallet transactions, and connecting you with community services.'
    },
    {
      title: 'Data Sharing',
      icon: Handshake,
      tag: "We Don't Sell Data",
      tagColor: 'bg-red-100 text-red-800',
      content: 'We do not share your personal information with third parties for their marketing purposes. We may share information with trusted partners who assist us in operating the app, such as payment gateways (Razorpay, Stripe), provided they agree to keep this information confidential.'
    },
    {
      title: 'User Rights',
      icon: Scale,
      tag: 'Your Control',
      tagColor: 'bg-yellow-100 text-yellow-800',
      content: 'You have the right to access, update, or request deletion of your personal data. You can manage your profile information through the app settings or contact our support team for assistance.'
    }
  ];

  const handleDownload = () => {
    toast.info('Downloading Privacy Policy...', {
      description: 'A PDF version of our policy will be saved to your device.'
    });
  };

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
        <div className="text-center relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-4">
                <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-lg opacity-90 mt-2">How we protect your data</p>
        </div>
      </div>

      <main className="p-6 space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="shadow-lg border-emerald-200/30 bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full"><Icon className="w-5 h-5 text-emerald-600" /></div>
                    <CardTitle className="text-xl text-emerald-800">{section.title}</CardTitle>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${section.tagColor}`}>{section.tag}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-800/90 leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button onClick={handleDownload} variant="outline" className="w-full h-14 rounded-full text-lg border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
            <Download className="w-6 h-6 mr-3" />
            Download PDF
          </Button>
          <Button onClick={() => navigate(createPageUrl('Home'))} className="w-full h-14 rounded-full text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <Home className="w-6 h-6 mr-3" />
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}