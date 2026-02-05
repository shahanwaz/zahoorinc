import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

import BankTransferModal from '@/components/wallet/BankTransferModal';
import TransactionItem from '@/components/wallet/TransactionItem';

export default function Wallet() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [walletBalance, setWalletBalance] = useState(3750.50);

  // Mock transaction data
  const [transactions] = useState([
    {
      id: 1,
      type: 'earned',
      title: 'Earned from Roza Ejara',
      description: 'Completed 5 Roza for Late Fatima Begum',
      amount: 2500,
      date: '2025-01-15T10:30:00Z',
      status: 'completed',
      icon: '🟢'
    },
    {
      id: 2,
      type: 'added',
      title: 'Added Money',
      description: 'Added via UPI (GPay)',
      amount: 1000,
      date: '2025-01-14T15:20:00Z',
      status: 'completed',
      icon: '➕'
    },
    {
      id: 3,
      type: 'earned',
      title: 'Earned from Quran Ejara',
      description: 'Completed 1 Quran recitation for Late Ahmed Khan',
      amount: 2000,
      date: '2025-01-13T09:15:00Z',
      status: 'completed',
      icon: '🟢'
    },
    {
      id: 4,
      type: 'withdrawn',
      title: 'Bank Transfer',
      description: 'Transferred to SBI Account ending 1234',
      amount: -1750,
      date: '2025-01-12T14:45:00Z',
      status: 'completed',
      icon: '🔴'
    },
    {
      id: 5,
      type: 'added',
      title: 'Added Money',
      description: 'Added via Net Banking (HDFC)',
      amount: 500,
      date: '2025-01-11T11:30:00Z',
      status: 'pending',
      icon: '➕'
    },
    {
      id: 6,
      type: 'earned',
      title: 'Earned from Namaz Ejara',
      description: 'Completed 30 Namaz for Late Hassan Abbas',
      amount: 900,
      date: '2025-01-10T16:20:00Z',
      status: 'completed',
      icon: '🟢'
    }
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('status') === 'payment_success') {
      toast.success('Payment Successful!', {
        description: 'Money has been added to your wallet.',
      });
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const handleAddMoney = () => {
    navigate(createPageUrl('Payment?purpose=Add Money&amount=500'));
  };

  const handleBankTransfer = (transferData) => {
    console.log('Bank transfer:', transferData);
    toast.success('Transfer Initiated!', {
      description: `₹${transferData.amount} will be transferred to your bank account.`,
    });
    setShowBankTransfer(false);
  };

  const formatAmount = (amount) => {
    return amount >= 0 ? `+₹${amount.toLocaleString()}` : `-₹${Math.abs(amount).toLocaleString()}`;
  };

  const getTransactionStats = () => {
    const totalEarned = transactions.filter(t => t.type === 'earned' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const totalAdded = transactions.filter(t => t.type === 'added' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawn = Math.abs(transactions.filter(t => t.type === 'withdrawn' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0));
    
    return { totalEarned, totalAdded, totalWithdrawn };
  };

  const stats = getTransactionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gold-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-3 hover:bg-emerald-50">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <h1 className="text-xl font-bold text-emerald-800">My Wallet</h1>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Available Balance</span>
              </div>
              <h2 className="text-4xl font-bold mb-2">₹{walletBalance.toLocaleString()}</h2>
              <p className="text-emerald-200">Your Islamic Wallet Balance</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleAddMoney} className="bg-white/20 hover:bg-white/30 text-white border-0 h-14">
                <Plus className="w-5 h-5 mr-2" />
                Add Money
              </Button>
              <Button onClick={() => setShowBankTransfer(true)} className="bg-white/20 hover:bg-white/30 text-white border-0 h-14">
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Withdraw to Bank
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🟢</div>
              <p className="text-sm text-gray-600 mb-1">Total Earned</p>
              <p className="font-bold text-green-600">₹{stats.totalEarned.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">➕</div>
              <p className="text-sm text-gray-600 mb-1">Total Added</p>
              <p className="font-bold text-blue-600">₹{stats.totalAdded.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🔴</div>
              <p className="text-sm text-gray-600 mb-1">Total Withdrawn</p>
              <p className="font-bold text-red-600">₹{stats.totalWithdrawn.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Transfer Modal */}
      <BankTransferModal
        open={showBankTransfer}
        onOpenChange={setShowBankTransfer}
        onTransfer={handleBankTransfer}
        maxAmount={walletBalance}
      />
    </div>
  );
}