import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';
import { Plus, TrendingUp, Calendar, Eye, Edit, Trash2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('innovator_id', user.id)
      .order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-2">Manage your submitted projects</p>
        </div>
        <Link
          to="/dashboard/submit-project"
          className="flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900"
        >
          <Plus size={20} />
          Submit New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">You haven't submitted any projects yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'approved' ? 'bg-green-100 text-green-800' :
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{project.description}</p>
              
              {project.status === 'rejected' && project.rejection_reason && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{project.rejection_reason}</p>
                  <p className="text-xs text-red-600 mt-2">You can edit and resubmit this project after fixing the issues.</p>
                </div>
              )}
              <div className="flex gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>${project.funds_raised?.toLocaleString() || 0} invested</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>${project.total_donations?.toLocaleString() || 0} donated</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                {project.status === 'approved' && (
                  <Link
                    to={`/project/${project.id}`}
                    className="inline-flex items-center gap-2 text-green-800 hover:text-green-900"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                )}
                <Link
                  to={`/dashboard/edit-project/${project.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Edit size={16} />
                  {project.status === 'rejected' ? 'Fix & Resubmit' : 'Edit'}
                </Link>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
