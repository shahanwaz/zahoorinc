import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function TransactionItem({ transaction }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatAmount = (amount) => {
    return amount >= 0 ? `+₹${amount.toLocaleString()}` : `-₹${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
      {/* Transaction Icon */}
      <div className="text-2xl">{transaction.icon}</div>
      
      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-emerald-800 truncate">{transaction.title}</h4>
          <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
            <span className="flex items-center gap-1">
              {getStatusIcon(transaction.status)}
              {transaction.status}
            </span>
          </Badge>
        </div>
        <p className="text-sm text-gray-600 truncate">{transaction.description}</p>
        <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.date)}</p>
      </div>
      
      {/* Amount */}
      <div className="text-right">
        <p className={`font-bold text-lg ${getAmountColor(transaction.amount)}`}>
          {formatAmount(transaction.amount)}
        </p>
      </div>
    </div>
  );
}