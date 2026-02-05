import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, FileText, User, Banknote, Video, Signal } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  const handleAccept = () => {
    toast.success('Terms Accepted', {
      description: 'You can now continue using all services.',
    });
    navigate(createPageUrl('Home'));
  };

  const sections = [
    {
      title: 'User Responsibilities',
      icon: User,
      content: 'Users agree not to misuse the platform, post offensive content, or violate community guidelines. All interactions must be respectful and in accordance with Islamic principles. You are responsible for the content you post and for maintaining the confidentiality of your account.'
    },
    {
      title: 'Payments & Wallet Rules',
      icon: Banknote,
      content: 'All payments for Ejara services are processed securely. Hadiya earned is transferred to the provider\'s wallet. Withdrawals are subject to processing fees and may take 3-5 business days. Refunds are handled on a case-by-case basis as per our refund policy, detailed in the Help section.'
    },
    {
      title: 'Live Streaming & Content',
      icon: Video,
      content: 'Content streamed or posted must not be offensive, illegal, or against the principles of the Ja\'fari school of thought. Zahoor reserves the right to remove any content that violates these terms without prior notice. Copyrighted material may not be streamed without permission.'
    },
    {
      title: 'Data Usage & Restrictions',
      icon: Signal,
      content: 'By using the app, you grant Zahoor a license to use the content you provide to operate and improve our services. We will not sell your personal data to third parties. For more details, please review our Privacy Policy.'
    }
  ];

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
                <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Terms & Conditions</h1>
            <p className="text-lg opacity-90 mt-2">Please read and accept to continue</p>
        </div>
      </div>

      <main className="p-6 space-y-4">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-emerald-200/30 rounded-xl shadow-md overflow-hidden">
                <AccordionTrigger className="flex items-center gap-4 p-4 font-semibold text-emerald-800 text-lg hover:no-underline">
                    <Icon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>{section.title}</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 text-emerald-700/90 border-t border-emerald-200/50 bg-emerald-50/20">
                  <p className="leading-relaxed">{section.content}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="pt-6">
          <Button onClick={handleAccept} className="w-full h-14 rounded-full text-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            Accept & Continue ✅
          </Button>
        </div>
      </main>
    </div>
  );
}