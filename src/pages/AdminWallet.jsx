import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { WalletTransaction } from '@/entities/WalletTransaction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminWallet() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingWithdrawals: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allTransactions = await WalletTransaction.list('-created_date', 500);
      setTransactions(allTransactions);

      const totalRevenue = allTransactions
        .filter(t => t.status === 'completed' && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const pendingWithdrawals = allTransactions
        .filter(t => t.transaction_type === 'withdrawal' && t.status === 'pending')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const today = new Date().toISOString().split('T')[0];
      const completedToday = allTransactions
        .filter(t => t.status === 'completed' && t.created_date && t.created_date.startsWith(today))
        .length;

      setStats({ totalRevenue, pendingWithdrawals, completedToday });
      setLoading(false);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setLoading(false);
    }
  };

  const handleApproveWithdrawal = async (transactionId) => {
    if (confirm('Approve this withdrawal request?')) {
      try {
        await WalletTransaction.update(transactionId, { status: 'completed' });
        alert('Withdrawal approved');
        loadData();
      } catch (error) {
        console.error('Error approving withdrawal:', error);
        alert('Failed to approve withdrawal');
      }
    }
  };

  const handleRejectWithdrawal = async (transactionId) => {
    if (confirm('Reject this withdrawal request?')) {
      try {
        await WalletTransaction.update(transactionId, { status: 'failed' });
        alert('Withdrawal rejected');
        loadData();
      } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        alert('Failed to reject withdrawal');
      }
    }
  };

  const columns = [
    {
      key: 'user_id',
      label: 'User ID',
      render: (value) => <span className="font-mono text-xs">{value.substring(0, 8)}...</span>
    },
    {
      key: 'transaction_type',
      label: 'Type',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <span className={value > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {value > 0 ? '+' : ''}₹{Math.abs(value).toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          completed: 'bg-green-100 text-green-700',
          pending: 'bg-yellow-100 text-yellow-700',
          failed: 'bg-red-100 text-red-700'
        };
        return (
          <Badge className={colors[value] || 'bg-gray-100'}>
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'created_date',
      label: 'Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy HH:mm')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        row.transaction_type === 'withdrawal' && row.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApproveWithdrawal(row.id);
              }}
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRejectWithdrawal(row.id);
              }}
            >
              <XCircle className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        ) : null
      )
    }
  ];

  return (
    <AdminLayout currentPage="wallet">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet & Payments</h1>
          <p className="text-gray-600">Manage transactions and withdrawal requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            loading={loading}
          />
          <StatCard
            icon={Clock}
            label="Pending Withdrawals"
            value={`₹${stats.pendingWithdrawals.toLocaleString()}`}
            loading={loading}
          />
          <StatCard
            icon={TrendingUp}
            label="Completed Today"
            value={stats.completedToday}
            loading={loading}
          />
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={transactions}
            searchable
            exportable
            onExport={() => alert('Export functionality coming soon')}
          />
        )}
      </div>
    </AdminLayout>
  );
}