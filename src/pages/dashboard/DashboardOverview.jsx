import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  TrendingUp, DollarSign, FolderKanban, Briefcase, 
  MessageSquare, ArrowUpRight, Plus 
} from 'lucide-react';

export default function DashboardOverview() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (profile.role === 'investor') {
        const [investmentsRes, walletRes, messagesRes] = await Promise.all([
          supabase.from('investment_commitments').select('*').eq('investor_id', user.id),
          supabase.from('investor_wallets').select('*').eq('investor_id', user.id).single(),
          supabase.from('messages').select('*', { count: 'exact' }).eq('receiver_id', user.id).eq('is_read', false)
        ]);

        const totalInvested = walletRes.data?.total_invested || 0;

        setStats({
          totalInvested,
          activeInvestments: investmentsRes.data?.length || 0,
          portfolioProjects: investmentsRes.data?.length || 0,
          unreadMessages: messagesRes.count || 0
        });
      } else {
        const [projectsRes, messagesRes] = await Promise.all([
          supabase.from('projects').select('*').eq('innovator_id', user.id),
          supabase.from('messages').select('*', { count: 'exact' }).eq('receiver_id', user.id).eq('is_read', false)
        ]);

        const approvedProjects = projectsRes.data?.filter(p => p.status === 'approved').length || 0;
        const totalFunding = projectsRes.data?.reduce((sum, p) => sum + (parseFloat(p.funds_raised) || 0), 0) || 0;

        setStats({
          totalProjects: projectsRes.data?.length || 0,
          approvedProjects,
          totalFunding,
          unreadMessages: messagesRes.count || 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
        </div>
        <Link to={profile?.role === 'investor' ? '/explore' : '/dashboard/projects'}>
          <Button><Plus size={20} className="mr-2" />{profile?.role === 'investor' ? 'Browse Projects' : 'New Project'}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profile?.role === 'investor' ? (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">${stats.totalInvested?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg"><DollarSign className="text-green-800" size={24} /></div>
              </div>
              <div className="flex items-center mt-4 text-sm text-green-600"><ArrowUpRight size={16} className="mr-1" /><span>Active portfolio</span></div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Investments</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeInvestments}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg"><TrendingUp className="text-blue-800" size={24} /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Portfolio Projects</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.portfolioProjects}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg"><FolderKanban className="text-purple-800" size={24} /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.unreadMessages}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg"><MessageSquare className="text-yellow-800" size={24} /></div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg"><FolderKanban className="text-green-800" size={24} /></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{stats.approvedProjects} approved</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">${stats.totalFunding?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg"><DollarSign className="text-blue-800" size={24} /></div>
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600"><ArrowUpRight size={16} className="mr-1" /><span>Raised so far</span></div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.unreadMessages}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg"><MessageSquare className="text-yellow-800" size={24} /></div>
              </div>
            </Card>
          </>
        )}
      </div>


    </div>
  );
}
