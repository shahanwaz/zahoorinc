import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, ChevronDown, Smartphone, Building, Wallet as WalletIcon, Globe, Zap } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const amount = params.get('amount') || '500';
  const purpose = params.get('purpose') || 'Add Money';
  
  const [selectedMethod, setSelectedMethod] = useState('');
  const [formData, setFormData] = useState({
    upiId: '',
    bank: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    wallet: ''
  });

  const handlePayment = (method) => {
    console.log(`Processing payment via ${method}:`, formData);
    toast.success('Payment Successful!', {
      description: `₹${amount} has been processed successfully.`,
    });
    navigate(createPageUrl('Wallet?status=payment_success'));
  };

  const paymentMethods = [
    {
      id: 'upi',
      title: 'UPI Payment',
      icon: Smartphone,
      color: 'from-green-500 to-green-600',
      content: (
        <div className="space-y-4">
          <div className="flex gap-3 mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/GooglePay_Logo.svg" alt="GPay" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/PhonePe_Logo.svg" alt="PhonePe" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.svg" alt="Paytm" className="h-8" />
          </div>
          <div>
            <Label>Enter UPI ID</Label>
            <Input 
              placeholder="example@upi" 
              value={formData.upiId}
              onChange={(e) => setFormData({...formData, upiId: e.target.value})}
              className="mt-1"
            />
          </div>
          <Button onClick={() => handlePayment('UPI')} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white">
            Pay ₹{amount} via UPI ✅
          </Button>
        </div>
      )
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      icon: Building,
      color: 'from-blue-500 to-blue-600',
      content: (
        <div className="space-y-4">
          <div>
            <Label>Select Your Bank</Label>
            <Select value={formData.bank} onValueChange={(value) => setFormData({...formData, bank: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sbi">State Bank of India</SelectItem>
                <SelectItem value="hdfc">HDFC Bank</SelectItem>
                <SelectItem value="icici">ICICI Bank</SelectItem>
                <SelectItem value="axis">Axis Bank</SelectItem>
                <SelectItem value="pnb">Punjab National Bank</SelectItem>
                <SelectItem value="bob">Bank of Baroda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => handlePayment('Net Banking')} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            Pay ₹{amount} via Net Banking 💳
          </Button>
        </div>
      )
    },
    {
      id: 'wallets',
      title: 'Digital Wallets',
      icon: WalletIcon,
      color: 'from-purple-500 to-purple-600',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {['Paytm', 'PhonePe', 'Mobikwik'].map((wallet) => (
              <button
                key={wallet}
                onClick={() => setFormData({...formData, wallet})}
                className={`p-3 rounded-lg border transition-all ${
                  formData.wallet === wallet ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-sm font-medium">{wallet}</div>
              </button>
            ))}
          </div>
          <Button onClick={() => handlePayment('Wallet')} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            Pay ₹{amount} via {formData.wallet || 'Wallet'} 👜
          </Button>
        </div>
      )
    },
    {
      id: 'razorpay',
      title: 'Razorpay Gateway',
      icon: Zap,
      color: 'from-emerald-500 to-emerald-600',
      content: (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="text-4xl mb-2">⚡</div>
            <p className="text-sm text-gray-600">All-in-one payment gateway with multiple options</p>
          </div>
          <Button onClick={() => handlePayment('Razorpay')} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            Pay ₹{amount} with Razorpay ⚡
          </Button>
        </div>
      )
    },
    {
      id: 'international',
      title: 'International Payments',
      icon: Globe,
      color: 'from-amber-500 to-amber-600',
      content: (
        <div className="space-y-4">
          <div className="flex gap-3 mb-4">
            <div className="text-2xl">💳</div>
            <div className="text-2xl">🍎</div>
            <div className="text-2xl">💰</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Card Number</Label>
              <Input 
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Expiry</Label>
              <Input 
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>CVV</Label>
              <Input 
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={() => handlePayment('International')} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            Pay ${(parseInt(amount) * 0.012).toFixed(2)} International 🌍
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gold-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-3 hover:bg-emerald-50">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">Choose Payment Method</h1>
              <p className="text-sm text-emerald-600">{purpose} - ₹{amount}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Payment Amount Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Payment Amount</h2>
            <p className="text-4xl font-bold">₹{amount}</p>
            <p className="text-emerald-200 mt-2">{purpose}</p>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Collapsible key={method.id} open={selectedMethod === method.id} onOpenChange={(open) => setSelectedMethod(open ? method.id : '')}>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color} text-white`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-emerald-800">{method.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${selectedMethod === method.id ? 'rotate-180' : ''}`} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {method.content}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}