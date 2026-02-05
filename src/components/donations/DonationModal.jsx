
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
// Loader2 is no longer needed as the direct submission logic with loading state is removed
// import { Loader2 } from "lucide-react"; 

import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

export default function DonationModal({ open, onOpenChange, initialAmount = '', initialType = 'Chanda' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: initialType,
    amount: initialAmount,
  });
  // isLoading state is no longer needed as the form submission now navigates to a payment page
  // const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const setAmount = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  // The handleConfirmDonation function is replaced by direct navigation on the "Proceed to Payment" button's onClick
  // const handleConfirmDonation = () => {
  //   setIsLoading(true);
  //   // Dummy submission logic
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     onOpenChange(false); // Close the modal
  //     alert("Shukriya! Aapka donation mustahak logon tak pohchaya jayega.");
  //     // Reset form
  //     setFormData({ name: '', email: '', phone: '', type: 'Chanda', amount: '' });
  //   }, 1500);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-bg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-800 text-center">Make a Donation</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} className="dialog-input" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="dialog-input" />
            </div>
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="dialog-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Donation Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(p => ({...p, type: value}))}>
                <SelectTrigger className="dialog-input"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chanda">Chanda</SelectItem>
                  <SelectItem value="Zakat">Zakat</SelectItem>
                  <SelectItem value="Sadqa">Sadqa</SelectItem>
                  <SelectItem value="Khairat">Khairat</SelectItem>
                  <SelectItem value="Khums">Khums</SelectItem>
                  <SelectItem value="Support Zahoor">Support Zahoor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" value={formData.amount} onChange={handleInputChange} className="dialog-input" placeholder="Enter amount" />
            </div>
          </div>
           <div className="flex gap-2 justify-center">
            {[100, 500, 1000, 5000].map(val => (
              <Button key={val} variant="outline" size="sm" onClick={() => setAmount(val)}>₹{val}</Button>
            ))}
          </div>
          <div>
            <Label>Payment Method</Label>
            <div className="p-3 bg-gray-100 rounded-lg text-center text-sm text-gray-500">
              Payment Gateway Integration Coming Soon
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {/* Replaced the old "Confirm Donation" button with the new "Proceed to Payment" button */}
          <Button 
            onClick={() => {
              onOpenChange(false); // Close the modal before navigating
              // Directly navigate to the Payment page with amount and purpose as query parameters
              navigate(`/Payment?amount=${formData.amount}&purpose=Donation`);
            }}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
          >
            Proceed to Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
