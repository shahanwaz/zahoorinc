import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { SupportTicket } from '@/entities/SupportTicket';
import { Dispute } from '@/entities/Dispute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Eye, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ticketsData, disputesData] = await Promise.all([
        SupportTicket.list('-created_date', 500).catch(() => []),
        Dispute.list('-created_date', 500).catch(() => [])
      ]);
      setTickets(ticketsData);
      setDisputes(disputesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading support data:', error);
      setLoading(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket || !resolution.trim()) {
      alert('Please enter a resolution');
      return;
    }
    try {
      await SupportTicket.update(selectedTicket.id, {
        status: 'resolved',
        resolution
      });
      alert('Ticket resolved successfully');
      setShowTicketModal(false);
      setResolution('');
      loadData();
    } catch (error) {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket');
    }
  };

  const handleResolveDispute = async (refundAmount) => {
    if (!selectedDispute) return;
    try {
      await Dispute.update(selectedDispute.id, {
        status: 'resolved',
        resolution,
        refund_amount: refundAmount
      });
      alert('Dispute resolved successfully');
      setShowDisputeModal(false);
      setResolution('');
      loadData();
    } catch (error) {
      console.error('Error resolving dispute:', error);
      alert('Failed to resolve dispute');
    }
  };

  const ticketColumns = [
    {
      key: 'user_name',
      label: 'User',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'subject',
      label: 'Subject',
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => {
        const colors = {
          low: 'bg-gray-100 text-gray-700',
          medium: 'bg-yellow-100 text-yellow-700',
          high: 'bg-orange-100 text-orange-700',
          urgent: 'bg-red-100 text-red-700'
        };
        return (
          <Badge className={colors[value]}>
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          new: 'bg-blue-100 text-blue-700',
          in_progress: 'bg-purple-100 text-purple-700',
          resolved: 'bg-green-100 text-green-700',
          closed: 'bg-gray-100 text-gray-700'
        };
        return (
          <Badge className={colors[value]}>
            {value.replace('_', ' ')}
          </Badge>
        );
      }
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
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTicket(row);
            setShowTicketModal(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  const disputeColumns = [
    {
      key: 'service_type',
      label: 'Service',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value) => (
        <div className="max-w-xs truncate">{value}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-700',
          under_review: 'bg-blue-100 text-blue-700',
          resolved: 'bg-green-100 text-green-700',
          closed: 'bg-gray-100 text-gray-700'
        };
        return (
          <Badge className={colors[value]}>
            {value.replace('_', ' ')}
          </Badge>
        );
      }
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
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDispute(row);
            setShowDisputeModal(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <AdminLayout currentPage="support">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Disputes</h1>
          <p className="text-gray-600">Manage support tickets and resolve disputes</p>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <DataTable
                columns={ticketColumns}
                data={tickets}
                searchable
                exportable
                onExport={() => alert('Export functionality coming soon')}
              />
            )}
          </TabsContent>

          <TabsContent value="disputes">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <DataTable
                columns={disputeColumns}
                data={disputes}
                searchable
                exportable
                onExport={() => alert('Export functionality coming soon')}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Ticket Detail Modal */}
      <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Support Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">User</p>
                  <p className="font-medium">{selectedTicket.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium">{selectedTicket.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <Badge className="capitalize">{selectedTicket.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Priority</p>
                  <Badge className="capitalize">{selectedTicket.priority}</Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Subject</p>
                <p className="font-medium">{selectedTicket.subject}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{selectedTicket.description}</p>
                </div>
              </div>

              {selectedTicket.status !== 'resolved' && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Resolution</p>
                    <Textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Enter resolution details..."
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleResolveTicket}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve Ticket
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispute Detail Modal */}
      <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service Type</p>
                  <Badge className="capitalize">{selectedDispute.service_type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="font-medium">₹{selectedDispute.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{selectedDispute.reason}</p>
                </div>
              </div>

              {selectedDispute.status !== 'resolved' && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Resolution</p>
                    <Textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Enter resolution details..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleResolveDispute(0)}
                      variant="outline"
                      className="flex-1"
                    >
                      Resolve Without Refund
                    </Button>
                    <Button
                      onClick={() => handleResolveDispute(selectedDispute.amount)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Resolve With Full Refund
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}