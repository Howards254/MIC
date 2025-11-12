import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardOverview from './dashboard/DashboardOverview';
import MyProjects from './dashboard/MyProjects';
import SubmitProject from './dashboard/SubmitProject';
import EditProject from './dashboard/EditProject';
import ApplyInvestor from './dashboard/ApplyInvestor';
import BrowseInvestors from './dashboard/BrowseInvestors';
import InvestorProfile from './dashboard/InvestorProfile';
import ProfileSettings from './dashboard/ProfileSettings';
import Messages from './dashboard/Messages';
import JobApplications from './dashboard/JobApplications';
import Analytics from './dashboard/Analytics';
import Portfolio from './dashboard/Portfolio';
import Investments from './dashboard/Investments';
import DealFlow from './dashboard/DealFlow';
import Notifications from './dashboard/Notifications';
import InvestmentCommitment from './dashboard/InvestmentCommitment';
import InvestmentOffers from './dashboard/InvestmentOffers';
import InvestorWallet from './dashboard/InvestorWallet';
import MessagingCenter from './dashboard/MessagingCenter';
import AllProjects from './admin/AllProjects';
import AllUsers from './admin/AllUsers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    } else if (!loading && profile?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, profile, loading, navigate]);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="projects" element={<MyProjects />} />
        <Route path="submit-project" element={<SubmitProject />} />
        <Route path="edit-project/:id" element={<EditProject />} />
        <Route path="apply-investor" element={<ApplyInvestor />} />
        <Route path="browse-investors" element={<BrowseInvestors />} />
        <Route path="investor-profile" element={<InvestorProfile />} />
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="applications" element={<JobApplications />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="investments" element={<Investments />} />
        <Route path="deals" element={<DealFlow />} />
        <Route path="invest/:projectId" element={<InvestmentCommitment />} />
        <Route path="investment-offers" element={<InvestmentOffers />} />
        <Route path="wallet" element={<InvestorWallet />} />
        <Route path="messaging" element={<MessagingCenter />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="all-projects" element={<AllProjects />} />
        <Route path="all-users" element={<AllUsers />} />
      </Routes>
    </DashboardLayout>
  );
}
