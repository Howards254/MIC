import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf, LogOut, User, Bell, LayoutDashboard } from 'lucide-react';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="text-green-800" size={32} />
            <span className="text-2xl font-bold text-green-800">MIC</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Home
            </Link>
            <Link to="/explore" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Explore Projects
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Jobs
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Events
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Blog
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 font-medium">
                    <LayoutDashboard size={18} />
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard/notifications" className="text-gray-700 hover:text-green-800">
                  <Bell size={20} />
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {profile?.full_name?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-green-800 font-medium px-4 py-2">
                Home
              </Link>
              <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-green-800 font-medium px-4 py-2">
                Explore Projects
              </Link>
              <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-green-800 font-medium px-4 py-2">
                Jobs
              </Link>
              <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-green-800 font-medium px-4 py-2">
                Events
              </Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-green-800 font-medium px-4 py-2">
                Blog
              </Link>
              
              <div className="border-t pt-4 px-4 space-y-3">
                {user ? (
                  <>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                        <LayoutDashboard size={18} />
                        Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard/notifications" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700">
                      <Bell size={20} />
                      Notifications
                    </Link>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {profile?.full_name?.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} fullWidth>
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" fullWidth>Sign In</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" fullWidth>Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
