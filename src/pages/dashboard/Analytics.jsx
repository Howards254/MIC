import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { TrendingUp, Eye, DollarSign, Users } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFunding: 0,
    totalApplications: 0,
    projectViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    const [projects, applications] = await Promise.all([
      supabase.from('projects').select('*').eq('user_id', user.id),
      supabase.from('job_applications').select('*').eq('user_id', user.id)
    ]);

    const totalFunding = projects.data?.reduce((sum, p) => sum + (p.current_funding || 0), 0) || 0;

    setStats({
      totalProjects: projects.data?.length || 0,
      totalFunding,
      totalApplications: applications.data?.length || 0,
      projectViews: 0
    });
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Total Funding', value: `$${stats.totalFunding.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Job Applications', value: stats.totalApplications, icon: Users, color: 'bg-purple-500' },
    { label: 'Project Views', value: stats.projectViews, icon: Eye, color: 'bg-orange-500' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Your activity overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
