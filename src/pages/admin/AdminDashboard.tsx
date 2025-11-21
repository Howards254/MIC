import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Users, FolderKanban, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [allUsers, allProjects, allInvestors, allInvestments, pendingProjects, pendingInvestors, approvedProjects, rejectedProjects] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }).eq('role', 'investor'),
        supabase.from('investment_commitments').select('amount'),
        supabase.from('projects').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('investor_profiles').select('*', { count: 'exact' }).eq('is_approved', false),
        supabase.from('projects').select('*', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('projects').select('*', { count: 'exact' }).eq('status', 'rejected')
      ]);

      const totalInvestments = allInvestments.data?.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0;

      setStats({
        totalUsers: allUsers.count || 0,
        totalProjects: allProjects.count || 0,
        totalInvestors: allInvestors.count || 0,
        totalInvestments,
        pendingProjects: pendingProjects.count || 0,
        pendingInvestors: pendingInvestors.count || 0,
        approvedProjects: approvedProjects.count || 0,
        rejectedProjects: rejectedProjects.count || 0,
        regularUsers: (allUsers.count || 0) - (allInvestors.count || 0)
      });

      const { data: recentProjects } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5);
      
      const projectsWithProfiles = await Promise.all(
        (recentProjects || []).map(async (project) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', project.innovator_id)
            .single();
          return { ...project, profiles: profile };
        })
      );
      setRecentActivity(projectsWithProfiles || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-1">Complete platform statistics and management</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg"><Users className="text-white" size={24} /></div>
            <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">USERS</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.regularUsers} regular, {stats.totalInvestors} investors</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg"><FolderKanban className="text-white" size={24} /></div>
            <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">PROJECTS</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.approvedProjects} approved, {stats.pendingProjects} pending</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg"><TrendingUp className="text-white" size={24} /></div>
            <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">INVESTMENTS</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${(stats.totalInvestments / 1000).toFixed(1)}K</p>
          <p className="text-sm text-gray-600 mt-1">Total platform investments</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500 rounded-lg"><AlertCircle className="text-white" size={24} /></div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">PENDING</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingProjects + stats.pendingInvestors}</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting your review</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="text-green-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Approved</h3>
          </div>
          <p className="text-4xl font-bold text-green-600">{stats.approvedProjects}</p>
          <p className="text-sm text-gray-600 mt-2">Projects live on platform</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Clock className="text-yellow-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Pending Review</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{stats.pendingProjects}</p>
          <p className="text-sm text-gray-600 mt-2">Projects awaiting approval</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <XCircle className="text-red-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Rejected</h3>
          </div>
          <p className="text-4xl font-bold text-red-600">{stats.rejectedProjects}</p>
          <p className="text-sm text-gray-600 mt-2">Projects not approved</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Health Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Approval Rate</span>
              <span className="text-sm font-bold text-green-600">{((stats.approvedProjects / (stats.totalProjects || 1)) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(stats.approvedProjects / (stats.totalProjects || 1)) * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Investor Conversion</span>
              <span className="text-sm font-bold text-blue-600">{((stats.totalInvestors / (stats.totalUsers || 1)) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(stats.totalInvestors / (stats.totalUsers || 1)) * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Platform Activity</span>
              <span className="text-sm font-bold text-purple-600">High</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Project Submissions</h3>
          <Activity className="text-gray-400" size={24} />
        </div>
        <div className="space-y-4">
          {recentActivity.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{project.title}</p>
                <p className="text-sm text-gray-600">{project.profiles?.full_name} • {project.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'approved' ? 'bg-green-100 text-green-800' :
                  project.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{project.status}</span>
                <span className="text-sm text-gray-500">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
