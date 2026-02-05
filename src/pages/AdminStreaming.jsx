import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StopCircle, Eye, Trash2, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminStreaming() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    // Mock data - replace with actual streaming entity when available
    const mockData = [
      {
        id: 1,
        title: 'Majlis - Shahadat Imam Ali (a.s.)',
        host_name: 'Maulana Abbas Rizvi',
        status: 'live',
        viewers: 234,
        started_at: new Date().toISOString(),
        duration: '45:30'
      },
      {
        id: 2,
        title: 'Dua-e-Kumail Commentary',
        host_name: 'Maulana Ahmed Raza',
        status: 'scheduled',
        scheduled_for: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: 3,
        title: 'Fazail-e-Imam Hussain (a.s.)',
        host_name: 'Maulana Ali Mehdi',
        status: 'ended',
        viewers: 512,
        ended_at: new Date(Date.now() - 3600000).toISOString(),
        duration: '1:15:45'
      }
    ];
    setStreams(mockData);
    setLoading(false);
  };

  const handleTerminateStream = async (streamId) => {
    if (confirm('Are you sure you want to terminate this live stream?')) {
      try {
        alert('Stream terminated successfully');
        loadStreams();
      } catch (error) {
        console.error('Error terminating stream:', error);
        alert('Failed to terminate stream');
      }
    }
  };

  const handleDeleteStream = async (streamId) => {
    if (confirm('Are you sure you want to delete this stream recording?')) {
      try {
        alert('Stream deleted successfully');
        loadStreams();
      } catch (error) {
        console.error('Error deleting stream:', error);
        alert('Failed to delete stream');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Stream Title',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'host_name',
      label: 'Host',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          live: 'bg-red-100 text-red-700 animate-pulse',
          scheduled: 'bg-blue-100 text-blue-700',
          ended: 'bg-gray-100 text-gray-700'
        };
        return (
          <Badge className={colors[value]}>
            {value === 'live' && '🔴 '}
            {value.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      key: 'viewers',
      label: 'Viewers',
      render: (value, row) => (
        row.status === 'live' ? (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            {value || 0}
          </div>
        ) : row.status === 'ended' ? (
          <span className="text-gray-500">{value || 0} watched</span>
        ) : '-'
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value) => value || '-'
    },
    {
      key: 'date',
      label: 'Date/Time',
      render: (_, row) => {
        if (row.status === 'live') {
          return `Started ${format(new Date(row.started_at), 'HH:mm')}`;
        } else if (row.status === 'scheduled') {
          return format(new Date(row.scheduled_for), 'MMM dd, HH:mm');
        } else {
          return format(new Date(row.ended_at), 'MMM dd, HH:mm');
        }
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {row.status === 'live' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleTerminateStream(row.id);
              }}
            >
              <StopCircle className="w-4 h-4 text-red-500" />
            </Button>
          )}
          {row.status === 'ended' && (
            <>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStream(row.id);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout currentPage="streaming">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Streaming</h1>
          <p className="text-gray-600">Monitor and manage live streams and recordings</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={streams}
            searchable
            exportable
            onExport={() => alert('Export functionality coming soon')}
          />
        )}
      </div>
    </AdminLayout>
  );
}