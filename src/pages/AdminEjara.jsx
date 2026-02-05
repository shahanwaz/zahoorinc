import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminEjara() {
  const [ejaraPosts, setEjaraPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEjaraPosts();
  }, []);

  const loadEjaraPosts = async () => {
    // Mock data - replace with actual entity calls
    const mockData = [
      {
        id: 1,
        type: 'qaza_namaz',
        title: 'Qaza Namaz for Father',
        days_count: 180,
        participants_needed: 6,
        participants_joined: 2,
        hadiya_per_person: 5000,
        status: 'active',
        poster_name: 'Ali Hassan',
        created_date: new Date().toISOString()
      },
      {
        id: 2,
        type: 'quran_recitation',
        title: 'Quran Recitation for Mother',
        quran_count: 10,
        participants_needed: 5,
        participants_joined: 5,
        hadiya_per_person: 2000,
        status: 'completed',
        poster_name: 'Fatima Khan',
        created_date: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    setEjaraPosts(mockData);
    setLoading(false);
  };

  const columns = [
    {
      key: 'title',
      label: 'Service',
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'poster_name',
      label: 'Posted By',
    },
    {
      key: 'hadiya_per_person',
      label: 'Hadiya',
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      key: 'participants_joined',
      label: 'Progress',
      render: (value, row) => `${value}/${row.participants_needed}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge className={value === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'created_date',
      label: 'Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.status === 'active' && (
            <>
              <Button variant="ghost" size="sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="sm">
                <XCircle className="w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout currentPage="ejara">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ejara Services</h1>
          <p className="text-gray-600">Manage spiritual service requests and completions</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={ejaraPosts}
            searchable
            exportable
            onExport={() => alert('Export functionality coming soon')}
          />
        )}
      </div>
    </AdminLayout>
  );
}