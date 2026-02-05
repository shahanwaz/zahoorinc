import React, { useState, useEffect } from 'react';
import { Feedback } from '@/entities/Feedback';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Search, 
  Eye, 
  CheckCircle, 
  Trash2,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchQuery, statusFilter, categoryFilter]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await Feedback.list('-created_date');
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = [...feedbacks];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(f => 
        f.feedback_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(f => f.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(f => f.category === categoryFilter);
    }

    setFilteredFeedbacks(filtered);
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      await Feedback.update(feedbackId, { status: newStatus });
      await loadFeedbacks();
      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await Feedback.delete(feedbackId);
      await loadFeedbacks();
      if (selectedFeedback?.id === feedbackId) {
        setShowDetailModal(false);
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  const viewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      viewed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
      resolved: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Post: 'bg-blue-50 text-blue-600',
      Event: 'bg-purple-50 text-purple-600',
      User: 'bg-orange-50 text-orange-600',
      Message: 'bg-green-50 text-green-600',
      Other: 'bg-gray-50 text-gray-600'
    };
    return colors[category] || 'bg-gray-50 text-gray-600';
  };

  const stats = {
    total: feedbacks.length,
    new: feedbacks.filter(f => f.status === 'new').length,
    in_progress: feedbacks.filter(f => f.status === 'in_progress').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length
  };

  return (
    <AdminLayout currentPage="feedback">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Feedback & Messages</h1>
          <p className="text-emerald-600 mt-1">Review and respond to user feedback and reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">New</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.new}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">In Progress</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.in_progress}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Post">Post</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Message">Message</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Feedback Messages ({filteredFeedbacks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading feedback...</p>
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No feedback found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => viewDetails(feedback)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(feedback.category)}>
                            {feedback.category}
                          </Badge>
                          <Badge className={`${getStatusColor(feedback.status)} border`}>
                            {feedback.status.replace('_', ' ')}
                          </Badge>
                          {feedback.screenshot_url && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              Screenshot
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-900 font-medium mb-1 line-clamp-2">
                          {feedback.feedback_text}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{feedback.user_email}</span>
                          <span>•</span>
                          <span>{new Date(feedback.created_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewDetails(feedback);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              {/* Status and Category */}
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(selectedFeedback.category)}>
                  {selectedFeedback.category}
                </Badge>
                <Badge className={`${getStatusColor(selectedFeedback.status)} border`}>
                  {selectedFeedback.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> {selectedFeedback.user_email}</p>
                  <p><span className="font-medium">User ID:</span> {selectedFeedback.user_id}</p>
                  <p><span className="font-medium">Submitted:</span> {new Date(selectedFeedback.created_date).toLocaleString()}</p>
                </div>
              </div>

              {/* Feedback Content */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Feedback Message</h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                  {selectedFeedback.feedback_text}
                </p>
              </div>

              {/* Screenshot */}
              {selectedFeedback.screenshot_url && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Screenshot</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={selectedFeedback.screenshot_url} 
                      alt="Feedback screenshot"
                      className="w-full"
                    />
                  </div>
                  <a 
                    href={selectedFeedback.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mt-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in new tab
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Update Status
                  </label>
                  <Select 
                    value={selectedFeedback.status} 
                    onValueChange={(value) => handleStatusChange(selectedFeedback.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete(selectedFeedback.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Feedback
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}