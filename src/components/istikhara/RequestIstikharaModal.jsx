import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function RequestIstikharaModal({ open, onOpenChange, onSubmit }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState('');
  const fixedCharge = 50;

  const handleSubmit = () => {
    if (!query.trim()) {
      alert("Please describe your concern.");
      return;
    }
    
    // For demo purposes, we'll simulate the payment and directly submit
    onSubmit({ query, notes });
    onOpenChange(false);
    setQuery('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-bg max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-emerald-800">New Istikhara Request</DialogTitle>
          <DialogDescription className="text-emerald-600">
            Please describe your matter with sincerity.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="query" className="text-emerald-700">Concern / Query</Label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'Should I accept this job offer?' or 'Is this marriage proposal suitable for me?'"
              className="mt-1 h-32 dialog-input"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-emerald-700">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other details you wish to provide."
              className="mt-1 dialog-input"
            />
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
            <p className="text-emerald-700">Service Hadiya (Fixed)</p>
            <p className="text-3xl font-bold text-emerald-800">₹{fixedCharge}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="primary-btn">Confirm & Pay ✅</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}