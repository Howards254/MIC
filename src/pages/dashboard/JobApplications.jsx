import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { Briefcase, Calendar, Building } from 'lucide-react';

export default function JobApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('job_applications')
      .select('*, job:jobs(title, company, location)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setApplications(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <p className="text-gray-600 mt-2">Track your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">You haven't applied to any jobs yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{app.job?.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building size={16} />
                      {app.job?.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {app.status}
                </span>
              </div>
              {app.cover_letter && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
                  <p className="text-sm text-gray-600">{app.cover_letter}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
