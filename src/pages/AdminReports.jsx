import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/entities/User';
import { WalletTransaction } from '@/entities/WalletTransaction';
import { Event } from '@/entities/Event';
import { Question } from '@/entities/Question';
import { Users, DollarSign, Calendar, MessageCircle, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalEvents: 0,
    totalQuestions: 0
  });
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenueByService: [],
    engagementTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [timeRange]);

  const loadReportData = async () => {
    try {
      // Load all data
      const users = await User.list();
      const transactions = await WalletTransaction.list('-created_date', 1000);
      const events = await Event.list();
      const questions = await Question.list();

      // Calculate stats
      const totalRevenue = transactions
        .filter(t => t.status === 'completed' && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalUsers: users.length,
        totalRevenue,
        totalEvents: events.length,
        totalQuestions: questions.length
      });

      // Generate charts data based on time range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const userGrowth = [];
      const engagementTrend = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayUsers = users.filter(u => u.created_date && u.created_date.startsWith(dateStr)).length;
        const dayQuestions = questions.filter(q => q.created_date && q.created_date.startsWith(dateStr)).length;
        const dayEvents = events.filter(e => e.created_date && e.created_date.startsWith(dateStr)).length;

        userGrowth.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: dayUsers
        });

        engagementTrend.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          questions: dayQuestions,
          events: dayEvents
        });
      }

      // Revenue by service type
      const revenueByService = [
        {
          name: 'Ejara',
          value: transactions.filter(t => t.reference_type === 'ejara' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
        },
        {
          name: 'Istikhara',
          value: transactions.filter(t => t.reference_type === 'istikhara' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
        },
        {
          name: 'Donations',
          value: transactions.filter(t => t.reference_type === 'donation' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
        },
        {
          name: 'Premium',
          value: transactions.filter(t => t.reference_type === 'subscription' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
        }
      ];

      setChartData({
        userGrowth,
        revenueByService,
        engagementTrend
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading report data:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const handleExportReport = () => {
    alert('Report export functionality will download CSV/PDF report');
  };

  return (
    <AdminLayout currentPage="reports">
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive platform insights and metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers.toLocaleString()}
            loading={loading}
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            loading={loading}
          />
          <StatCard
            icon={Calendar}
            label="Total Events"
            value={stats.totalEvents.toLocaleString()}
            loading={loading}
          />
          <StatCard
            icon={MessageCircle}
            label="Total Questions"
            value={stats.totalQuestions.toLocaleString()}
            loading={loading}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                User Growth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Revenue by Service Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.revenueByService}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.revenueByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Platform Engagement Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="questions" fill="#10b981" name="Questions" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="events" fill="#3b82f6" name="Events" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}