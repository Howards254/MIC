import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminApprovals from './admin/AdminApprovals';
import AdminBlog from './admin/AdminBlog';
import AllProjects from './admin/AllProjects';
import AllUsers from './admin/AllUsers';
import SendNotification from './admin/SendNotification';
import ManageEvents from './admin/ManageEvents';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, profile, loading]);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="approvals" element={<AdminApprovals />} />
        <Route path="notifications" element={<SendNotification />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="all-projects" element={<AllProjects />} />
        <Route path="all-users" element={<AllUsers />} />
      </Routes>
    </DashboardLayout>
  );
}
