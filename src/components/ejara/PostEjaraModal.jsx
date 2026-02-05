import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function PostEjaraModal({ open, onOpenChange, onPostCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceType: '',
    forWhom: '',
    quantity: '',
    rate: '',
    total: 0
  });

  const serviceRates = {
    roza: 500,
    quran: 2000,
    namaz: 30,
    majlis: 5000,
    dua: 800
  };

  const handleServiceTypeChange = (value) => {
    const rate = serviceRates[value] || 0;
    const total = parseInt(formData.quantity || 0) * rate;
    setFormData({ ...formData, serviceType: value, rate, total });
  };

  const handleQuantityChange = (value) => {
    const total = parseInt(value || 0) * (formData.rate || 0);
    setFormData({ ...formData, quantity: value, total });
  };

  const handlePayAndPost = () => {
    // Navigate to payment page with ejara details
    const paymentUrl = createPageUrl(`Payment?amount=${formData.total}&purpose=Post Ejara Service`);
    navigate(paymentUrl);
    onOpenChange(false);
    
    // In real app, would create post after successful payment
    setTimeout(() => {
      onPostCreated(formData);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-emerald-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-800">Post Ejara Service</DialogTitle>
          <p className="text-sm text-emerald-600">Create a new Ejara service request</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="font-semibold text-emerald-700">Service Type</Label>
            <Select value={formData.serviceType} onValueChange={handleServiceTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roza">Roza (Fasting) - ₹500 each</SelectItem>
                <SelectItem value="quran">Quran Recitation - ₹2000 each</SelectItem>
                <SelectItem value="namaz">Namaz (Prayer) - ₹30 each</SelectItem>
                <SelectItem value="majlis">Majlis - ₹5000 each</SelectItem>
                <SelectItem value="dua">Dua Session - ₹800 each</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-semibold text-emerald-700">For Whom? (Marhoom ka naam)</Label>
            <Input 
              value={formData.forWhom}
              onChange={(e) => setFormData({...formData, forWhom: e.target.value})}
              placeholder="Enter name of the departed soul"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="font-semibold text-emerald-700">Quantity</Label>
            <Input 
              type="number"
              value={formData.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="How many?"
              className="mt-1"
            />
          </div>

          {formData.rate > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Rate per service:</span>
                  <span className="font-semibold">₹{formData.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-semibold">{formData.quantity || 0}</span>
                </div>
                <hr className="border-emerald-200" />
                <div className="flex justify-between text-lg font-bold text-emerald-800">
                  <span>Total Payable:</span>
                  <span>₹{formData.total}</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handlePayAndPost}
            disabled={!formData.serviceType || !formData.forWhom || !formData.quantity}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
          >
            Confirm & Pay ₹{formData.total}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}