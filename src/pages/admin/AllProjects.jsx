import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    setLoading(true);
    let query = supabase
      .from('projects')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (!error) setProjects(data || []);
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
        <p className="text-gray-600 mt-2">Manage all projects on the platform</p>
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? 'bg-green-800 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600">by {project.profiles?.full_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'approved' ? 'bg-green-100 text-green-800' :
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>Goal: ${project.funding_goal?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Link
                to={`/project/${project.id}`}
                className="mt-4 inline-flex items-center gap-2 text-green-800 hover:text-green-900"
              >
                <Eye size={16} />
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
