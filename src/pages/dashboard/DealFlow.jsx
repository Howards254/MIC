import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { TrendingUp, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DealFlow() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*, profiles(full_name)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Deal Flow</h1>
        <p className="text-gray-600 mt-2">Approved projects available for investment</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No approved projects available</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => {
            const fundingPercent = (project.current_funding / project.funding_goal) * 100;
            return (
              <div key={project.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <User size={16} />
                      <span>by {project.profiles?.full_name}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Approved
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-semibold">{fundingPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(fundingPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">${project.current_funding?.toLocaleString()}</span>
                    <span className="text-gray-600">${project.funding_goal?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/project/${project.id}`}
                    className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900"
                  >
                    View & Invest
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
