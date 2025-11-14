import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardOverview from './dashboard/DashboardOverview';
import MyProjects from './dashboard/MyProjects';
import SubmitProject from './dashboard/SubmitProject';
import EditProject from './dashboard/EditProject';
import ApplyInvestor from './dashboard/ApplyInvestor';
import BrowseInvestors from './dashboard/BrowseInvestors';
import InvestorProfile from './dashboard/InvestorProfile';
import ProfileSettings from './dashboard/ProfileSettings';
import Portfolio from './dashboard/Portfolio';
import Notifications from './dashboard/Notifications';
import InvestmentCommitment from './dashboard/InvestmentCommitment';
import InvestmentOffers from './dashboard/InvestmentOffers';
import InvestorWallet from './dashboard/InvestorWallet';
import MessagingCenter from './dashboard/MessagingCenter';
import InvestorPending from './dashboard/InvestorPending';
import AllProjects from './admin/AllProjects';
import AllUsers from './admin/AllUsers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [investorStatus, setInvestorStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    } else if (!loading && profile?.role === 'admin') {
      navigate('/admin');
    } else if (!loading && profile?.role === 'investor') {
      checkInvestorStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [user, profile, loading, navigate]);

  const checkInvestorStatus = async () => {
    const { data } = await supabase
      .from('investor_profiles')
      .select('is_approved')
      .eq('user_id', user.id)
      .maybeSingle();
    
    setInvestorStatus(data);
    setCheckingStatus(false);
  };

  if (loading || checkingStatus) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  // Investor needs to complete profile
  if (profile?.role === 'investor' && !investorStatus) {
    return <ApplyInvestor />;
  }

  // Investor profile pending approval
  if (profile?.role === 'investor' && investorStatus && !investorStatus.is_approved) {
    return <InvestorPending />;
  }

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
        <Route path="portfolio" element={<Portfolio />} />
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
