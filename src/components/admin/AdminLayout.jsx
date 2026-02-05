
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/entities/User';
import { AdminUser } from '@/entities/AdminUser';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Users, BookOpen, Sparkles, MessageCircle, 
  Video, GraduationCap, Wallet, BarChart3, MessageSquare, 
  Wrench, FileText, Settings, Shield, Menu, X, LogOut,
  Bell, Search
} from 'lucide-react';

export default function AdminLayout({ children, currentPage }) {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await User.me();
      
      if (!user) {
        // Not logged in at all - redirect to admin login
        navigate(createPageUrl('AdminLogin'));
        setLoading(false);
        return;
      }

      // Check if user is an admin
      const adminUsers = await AdminUser.filter({ user_id: user.id });
      
      if (adminUsers.length === 0 || !adminUsers[0].is_active) {
        // User is not an admin or admin account is inactive
        alert('Access Denied: You do not have administrative privileges.');
        navigate(createPageUrl('AdminLogin'));
        setLoading(false);
        return;
      }

      // User is an active admin
      setCurrentAdmin({ ...user, adminRole: adminUsers[0].role, adminId: adminUsers[0].id });
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      // In case of any error during check, redirect to login
      navigate(createPageUrl('AdminLogin'));
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await User.logout();
        // After logout, redirect to AdminLogin
        navigate(createPageUrl('AdminLogin'));
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: 'AdminDashboard', roles: ['all'] },
    { icon: Users, label: 'User Management', path: 'AdminUsers', roles: ['super_admin', 'moderator'] },
    { icon: BookOpen, label: 'Ejara Services', path: 'AdminEjara', roles: ['super_admin', 'moderator', 'finance_admin'] },
    { icon: Sparkles, label: 'Istikhara', path: 'AdminIstikhara', roles: ['super_admin', 'moderator', 'finance_admin'] },
    { icon: MessageCircle, label: 'Community Q&A', path: 'AdminQA', roles: ['super_admin', 'moderator', 'content_admin'] },
    { icon: Video, label: 'Live Streaming', path: 'AdminStreaming', roles: ['super_admin', 'moderator', 'content_admin'] },
    { icon: GraduationCap, label: 'Tuition & Learning', path: 'AdminTuition', roles: ['super_admin', 'moderator'] },
    { icon: Wallet, label: 'Wallet & Payments', path: 'AdminWallet', roles: ['super_admin', 'finance_admin'] },
    { icon: BarChart3, label: 'Reports & Analytics', path: 'AdminReports', roles: ['super_admin', 'finance_admin'] },
    { icon: MessageSquare, label: 'Feedback & Messages', path: 'AdminFeedback', roles: ['super_admin', 'support_admin', 'moderator'] },
    { icon: Wrench, label: 'Support & Disputes', path: 'AdminSupport', roles: ['super_admin', 'support_admin', 'finance_admin'] },
    { icon: FileText, label: 'Content Management', path: 'AdminContent', roles: ['super_admin', 'content_admin'] },
    { icon: Settings, label: 'Settings', path: 'AdminSettings', roles: ['super_admin'] },
    { icon: Shield, label: 'Admin Roles', path: 'AdminRoles', roles: ['super_admin'] },
  ];

  const hasAccess = (roles) => {
    if (!currentAdmin) return false;
    return roles.includes('all') || roles.includes(currentAdmin.adminRole);
  };

  const isActive = (path) => location.pathname === createPageUrl(path);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If not loading and currentAdmin is null, it means redirection has occurred.
  // We should not render the layout in this case.
  if (!currentAdmin) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/2c0282437_487ad098c_yabaqiyatullah.png"
                alt="Zahoor"
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <h1 className="text-lg font-bold text-emerald-800">Zahoor</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-128px)]">
          {menuItems.filter(item => hasAccess(item.roles)).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={createPageUrl(item.path)}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-gray-500'}`} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3">
            <img
              src={currentAdmin.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAdmin.full_name)}&background=10b981&color=fff`}
              alt={currentAdmin.full_name}
              className="w-10 h-10 rounded-full"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{currentAdmin.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentAdmin.adminRole.replace('_', ' ')}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
