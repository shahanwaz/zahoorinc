import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, change, changeType = 'positive', loading = false }) {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${changeType === 'positive' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <Icon className={`w-6 h-6 ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`} />
              </div>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {changeType === 'positive' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {change}%
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}