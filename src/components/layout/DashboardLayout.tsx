import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, TrendingUp, MessageSquare, 
  Briefcase, FileText, Settings, LogOut, Menu, X, DollarSign,
  BarChart3, Users, Bell, Plus, UserPlus, Send, UserCog, Wallet
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const innovatorNavigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Investment Offers', href: '/dashboard/investment-offers', icon: DollarSign },
    { name: 'Messages', href: '/dashboard/messaging', icon: MessageSquare },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Profile Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const investorNavigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Browse Projects', href: '/explore', icon: FolderKanban },
    { name: 'My Investments', href: '/dashboard/portfolio', icon: TrendingUp },
    { name: 'Messages', href: '/dashboard/messaging', icon: MessageSquare },
    { name: 'Investor Profile', href: '/dashboard/investor-profile', icon: UserCog },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Profile Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Platform Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Approvals', href: '/admin/approvals', icon: Settings },
    { name: 'Manage Events', href: '/admin/events', icon: Plus },
    { name: 'Send Notification', href: '/admin/notifications', icon: Send },
    { name: 'Blog Management', href: '/admin/blog', icon: FileText },
    { name: 'All Projects', href: '/admin/all-projects', icon: FolderKanban },
    { name: 'All Users', href: '/admin/all-users', icon: Users },
  ];

  const navigation = profile?.role === 'admin' ? adminNavigation : profile?.role === 'investor' ? investorNavigation : innovatorNavigation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-bold text-green-800">MIC Dashboard</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <span className="text-xl font-bold text-green-800">MIC Dashboard</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center flex-1 px-4">
            <span className="text-lg font-semibold text-gray-900">Dashboard</span>
          </div>
        </div>
        <main className="py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
