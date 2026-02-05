import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Istikhara } from '@/entities/Istikhara';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminIstikhara() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await Istikhara.list('-created_date');
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading istikhara requests:', error);
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'user_name',
      label: 'User',
    },
    {
      key: 'query',
      label: 'Query',
      render: (value) => (
        <div className="max-w-xs truncate">{value}</div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => `₹${value}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-700',
          taken: 'bg-blue-100 text-blue-700',
          responded: 'bg-green-100 text-green-700',
          completed: 'bg-gray-100 text-gray-700'
        };
        return (
          <Badge className={colors[value] || 'bg-gray-100'}>
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'scholar_name',
      label: 'Scholar',
      render: (value) => value || 'Unassigned'
    },
    {
      key: 'created_date',
      label: 'Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <AdminLayout currentPage="istikhara">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Istikhara Requests</h1>
          <p className="text-gray-600">Manage and monitor Istikhara services</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={requests}
            searchable
            exportable
            onExport={() => alert('Export functionality coming soon')}
          />
        )}
      </div>
    </AdminLayout>
  );
}