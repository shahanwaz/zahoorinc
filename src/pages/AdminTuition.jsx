import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminTuition() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    // Mock data - replace with actual tutor/course entities
    const mockData = [
      {
        id: 1,
        name: 'Dr. Fatima Zahra',
        email: 'fatima.zahra@example.com',
        subject: 'Quranic Arabic',
        experience: '10+ years',
        students: 45,
        rating: 4.8,
        status: 'approved',
        joined_date: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 2,
        name: 'Maulana Hassan Ali',
        email: 'hassan.ali@example.com',
        subject: 'Islamic Jurisprudence',
        experience: '15+ years',
        students: 32,
        rating: 4.9,
        status: 'pending',
        joined_date: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Sister Zainab Ahmed',
        email: 'zainab.ahmed@example.com',
        subject: 'Hadith Studies',
        experience: '8 years',
        students: 28,
        rating: 4.7,
        status: 'approved',
        joined_date: new Date(Date.now() - 60 * 86400000).toISOString()
      }
    ];
    setTutors(mockData);
    setLoading(false);
  };

  const handleApproveTutor = async (tutorId) => {
    if (confirm('Approve this tutor application?')) {
      try {
        alert('Tutor approved successfully');
        loadTutors();
      } catch (error) {
        console.error('Error approving tutor:', error);
        alert('Failed to approve tutor');
      }
    }
  };

  const handleRejectTutor = async (tutorId) => {
    if (confirm('Reject this tutor application?')) {
      try {
        alert('Tutor rejected');
        loadTutors();
      } catch (error) {
        console.error('Error rejecting tutor:', error);
        alert('Failed to reject tutor');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Tutor Name',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'subject',
      label: 'Subject',
    },
    {
      key: 'experience',
      label: 'Experience',
    },
    {
      key: 'students',
      label: 'Students',
      render: (value) => value || 0
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          {value?.toFixed(1) || 'N/A'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          approved: 'bg-green-100 text-green-700',
          pending: 'bg-yellow-100 text-yellow-700',
          rejected: 'bg-red-100 text-red-700'
        };
        return (
          <Badge className={colors[value]}>
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'joined_date',
      label: 'Joined',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          {row.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveTutor(row.id);
                }}
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectTutor(row.id);
                }}
              >
                <XCircle className="w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout currentPage="tuition">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tuition & Learning</h1>
          <p className="text-gray-600">Manage tutors, courses, and enrollments</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tutors}
            searchable
            exportable
            onExport={() => alert('Export functionality coming soon')}
          />
        )}
      </div>
    </AdminLayout>
  );
}