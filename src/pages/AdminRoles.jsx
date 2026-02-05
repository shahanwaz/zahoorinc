
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { AdminUser } from '@/entities/AdminUser';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminRoles() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    role: 'moderator'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await AdminUser.list('-created_date');
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading admins:', error);
      setLoading(false);
    }
  };

  const handleSaveAdmin = async () => {
    if (!formData.user_id.trim()) {
      alert('Please enter a user ID');
      return;
    }

    try {
      if (editingAdmin) {
        await AdminUser.update(editingAdmin.id, { role: formData.role });
        alert('Admin role updated successfully');
      } else {
        await AdminUser.create(formData);
        alert('Admin created successfully');
      }
      setShowModal(false);
      setFormData({ user_id: '', role: 'moderator' });
      setEditingAdmin(null);
      loadAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
      alert('Failed to save admin');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      try {
        await AdminUser.delete(id);
        alert('Admin removed successfully');
        loadAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Failed to remove admin');
      }
    }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      user_id: admin.user_id,
      role: admin.role
    });
    setShowModal(true);
  };

  const columns = [
    {
      key: 'user_id',
      label: 'User ID',
      render: (value) => <span className="font-mono text-xs">{value.substring(0, 12)}...</span>
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => {
        const colors = {
          super_admin: 'bg-red-100 text-red-700',
          moderator: 'bg-blue-100 text-blue-700',
          finance_admin: 'bg-green-100 text-green-700',
          support_admin: 'bg-yellow-100 text-yellow-700',
          content_admin: 'bg-purple-100 text-purple-700'
        };
        return (
          <Badge className={colors[value]}>
            {value.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge className={value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'two_factor_enabled',
      label: '2FA',
      render: (value) => (
        <Badge variant="outline" className={value ? 'text-green-600' : 'text-gray-400'}>
          {value ? 'Enabled' : 'Disabled'}
        </Badge>
      )
    },
    {
      key: 'last_login',
      label: 'Last Login',
      render: (value) => value ? format(new Date(value), 'MMM dd, HH:mm') : 'Never'
    },
    {
      key: 'created_date',
      label: 'Created',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditAdmin(row);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAdmin(row.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout currentPage="roles">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Roles & Permissions</h1>
            <p className="text-gray-600">Manage admin accounts and access control</p>
          </div>
          <Button onClick={() => {
            setEditingAdmin(null);
            setFormData({ user_id: '', role: 'moderator' });
            setShowModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Admin
          </Button>
        </div>

        {/* Role Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-600" />
                <h4 className="font-semibold text-sm">Super Admin</h4>
              </div>
              <p className="text-xs text-gray-600">Full platform control</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-sm">Moderator</h4>
              </div>
              <p className="text-xs text-gray-600">Content moderation</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <h4 className="font-semibold text-sm">Finance Admin</h4>
              </div>
              <p className="text-xs text-gray-600">Payments & wallets</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-yellow-600" />
                <h4 className="font-semibold text-sm">Support Admin</h4>
              </div>
              <p className="text-xs text-gray-600">User support</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <h4 className="font-semibold text-sm">Content Admin</h4>
              </div>
              <p className="text-xs text-gray-600">Content management</p>
            </CardContent>
          </Card>
        </div>

        {/* Admins Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={admins}
            searchable
            exportable
            onExport={() => alert('Export functionality coming soon')}
          />
        )}
      </div>

      {/* Add/Edit Admin Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">User ID</label>
              <Input
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                placeholder="Enter user ID"
                disabled={!!editingAdmin}
              />
              <p className="text-xs text-gray-500 mt-1">The ID of the user to make admin</p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="finance_admin">Finance Admin</SelectItem>
                  <SelectItem value="support_admin">Support Admin</SelectItem>
                  <SelectItem value="content_admin">Content Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveAdmin} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {editingAdmin ? 'Update Admin' : 'Add Admin'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
