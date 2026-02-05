import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, Building } from 'lucide-react';

export default function BankTransferModal({ open, onOpenChange, onTransfer, maxAmount }) {
  const [formData, setFormData] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    amount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }
    if (parseFloat(formData.amount) > maxAmount) {
      alert('Amount exceeds available balance');
      return;
    }
    onTransfer(formData);
    setFormData({ accountNumber: '', confirmAccountNumber: '', ifscCode: '', amount: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-emerald-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
            <Building className="w-6 h-6" />
            Bank Transfer
          </DialogTitle>
          <p className="text-sm text-emerald-600">Transfer money to your bank account</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label className="font-semibold text-emerald-700">Bank Account Number</Label>
            <Input 
              type="text"
              value={formData.accountNumber} 
              onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} 
              className="mt-1 border-emerald-200 focus:border-emerald-500"
              placeholder="Enter account number"
              required
            />
          </div>

          <div>
            <Label className="font-semibold text-emerald-700">Confirm Account Number</Label>
            <Input 
              type="text"
              value={formData.confirmAccountNumber} 
              onChange={(e) => setFormData({...formData, confirmAccountNumber: e.target.value})} 
              className="mt-1 border-emerald-200 focus:border-emerald-500"
              placeholder="Re-enter account number"
              required
            />
          </div>

          <div>
            <Label className="font-semibold text-emerald-700">IFSC Code</Label>
            <Input 
              type="text"
              value={formData.ifscCode} 
              onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})} 
              className="mt-1 border-emerald-200 focus:border-emerald-500"
              placeholder="IFSC Code (e.g., SBIN0001234)"
              required
            />
          </div>

          <div>
            <Label className="font-semibold text-emerald-700">
              Amount (Max: ₹{maxAmount.toLocaleString()})
            </Label>
            <Input 
              type="number"
              value={formData.amount} 
              onChange={(e) => setFormData({...formData, amount: e.target.value})} 
              className="mt-1 border-emerald-200 focus:border-emerald-500"
              placeholder="Enter amount"
              max={maxAmount}
              required
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Bank transfers usually take 1-3 business days to process. You will receive a confirmation once the transfer is completed.
            </p>
          </div>

          <Button type="submit" className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <ArrowUpRight className="w-5 h-5 mr-2" />
            Transfer ₹{formData.amount || '0'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}