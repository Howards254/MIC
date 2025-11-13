import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageShell from '../components/layout/PageShell';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MapPin, Briefcase, DollarSign, ExternalLink } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        const jobsWithProjects = await Promise.all(
          data.map(async (job) => {
            const { data: project } = await supabase
              .from('projects')
              .select('title')
              .eq('id', job.project_id)
              .single();
            return { ...job, project };
          })
        );
        setJobs(jobsWithProjects);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
        <p className="text-gray-600">Find your purpose at companies changing the world</p>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                <p className="text-lg text-green-800 font-semibold mb-2">{job.project?.title}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {job.job_type}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{job.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                {job.location}
              </div>
              {job.salary_range && (
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2" />
                  {job.salary_range}
                </div>
              )}
            </div>

            {job.requirements && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                How to Apply:
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{job.how_to_apply}</p>
            </div>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No job openings available at the moment</p>
        </div>
      )}


    </PageShell>
  );
}
