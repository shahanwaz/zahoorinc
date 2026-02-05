import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import { User } from '@/entities/User';
import { WalletTransaction } from '@/entities/WalletTransaction';
import { Istikhara } from '@/entities/Istikhara';
import { Event } from '@/entities/Event';
import { Users, DollarSign, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeServices: 0,
    totalRevenue: 0,
    pendingWithdrawals: 0,
    newUsersToday: 0,
    revenueToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load users
      const users = await User.list();
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = users.filter(u => u.created_date && u.created_date.startsWith(today)).length;

      // Load transactions
      const transactions = await WalletTransaction.list('-created_date', 1000);
      const totalRevenue = transactions
        .filter(t => t.status === 'completed' && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const revenueToday = transactions
        .filter(t => t.status === 'completed' && t.amount > 0 && t.created_date && t.created_date.startsWith(today))
        .reduce((sum, t) => sum + t.amount, 0);

      const pendingWithdrawals = transactions
        .filter(t => t.transaction_type === 'withdrawal' && t.status === 'pending')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      // Load active services
      const istikharaRequests = await Istikhara.filter({ status: 'pending' });
      const events = await Event.list();
      const activeServices = istikharaRequests.length + events.length;

      setStats({
        totalUsers: users.length,
        activeServices,
        totalRevenue,
        pendingWithdrawals,
        newUsersToday,
        revenueToday
      });

      // Generate chart data (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayUsers = users.filter(u => u.created_date && u.created_date.startsWith(dateStr)).length;
        const dayRevenue = transactions
          .filter(t => t.status === 'completed' && t.amount > 0 && t.created_date && t.created_date.startsWith(dateStr))
          .reduce((sum, t) => sum + t.amount, 0);

        last7Days.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: dayUsers,
          revenue: dayRevenue
        });
      }
      setChartData(last7Days);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of Zahoor platform metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={stats.newUsersToday > 0 ? ((stats.newUsersToday / stats.totalUsers) * 100).toFixed(1) : 0}
            changeType="positive"
            loading={loading}
          />
          <StatCard
            icon={Activity}
            label="Active Services"
            value={stats.activeServices.toLocaleString()}
            loading={loading}
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueToday > 0 ? ((stats.revenueToday / stats.totalRevenue) * 100).toFixed(1) : 0}
            changeType="positive"
            loading={loading}
          />
          <StatCard
            icon={AlertTriangle}
            label="Pending Withdrawals"
            value={`₹${stats.pendingWithdrawals.toLocaleString()}`}
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                User Growth (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
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

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Revenue (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value) => `₹${value}`}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Activity feed coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}