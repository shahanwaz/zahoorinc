import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Ban, Eye, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await User.list('-created_date');
      setUsers(allUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      try {
        // Implement suspend logic
        alert('User suspended successfully');
        loadUsers();
      } catch (error) {
        console.error('Error suspending user:', error);
        alert('Failed to suspend user');
      }
    }
  };

  const columns = [
    {
      key: 'full_name',
      label: 'Name',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(value)}&background=10b981&color=fff`}
            alt={value}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'user_type',
      label: 'Role',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value || 'general'}
        </Badge>
      )
    },
    {
      key: 'created_date',
      label: 'Joined',
      render: (value) => value ? format(new Date(value), 'MMM dd, yyyy') : 'N/A'
    },
    {
      key: 'wallet_balance',
      label: 'Wallet',
      render: (value) => `₹${(value || 0).toLocaleString()}`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row);
              setShowDetailModal(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSuspendUser(row.id);
            }}
          >
            <Ban className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage and monitor all platform users</p>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            onRowClick={(user) => {
              setSelectedUser(user);
              setShowDetailModal(true);
            }}
            searchable
            exportable
            onExport={() => {
              // Implement export logic
              alert('Export functionality coming soon');
            }}
          />
        )}
      </div>

      {/* User Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.full_name)}&background=10b981&color=fff`}
                  alt={selectedUser.full_name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.full_name}</h3>
                  <Badge className="capitalize">{selectedUser.user_type || 'general'}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </p>
                  <p className="font-medium">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wallet Balance</p>
                  <p className="font-medium">₹{(selectedUser.wallet_balance || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joined Date</p>
                  <p className="font-medium">
                    {selectedUser.created_date ? format(new Date(selectedUser.created_date), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Activity
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                  Suspend User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}