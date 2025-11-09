import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import PageShell from '../components/layout/PageShell';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';

export default function JobsPage() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('jobs')
        .select('*, projects(title, description)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to apply');
      return;
    }
    try {
      await supabase.from('job_applications').insert([{
        job_id: selectedJob.id,
        user_id: user.id,
        resume_url: resumeUrl,
        cover_letter: coverLetter
      }]);
      setIsApplyModalOpen(false);
      setResumeUrl('');
      setCoverLetter('');
      alert('Application submitted successfully!');
    } catch (error) {
      if (error.code === '23505') {
        alert('You have already applied to this job');
      } else {
        console.error('Error applying:', error);
      }
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
                <p className="text-lg text-green-800 font-semibold mb-2">{job.projects?.title}</p>
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

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {job.requirements?.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Responsibilities:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {job.responsibilities?.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

            <Button onClick={() => { setSelectedJob(job); setIsApplyModalOpen(true); }}>
              Apply Now
            </Button>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No job openings available at the moment</p>
        </div>
      )}

      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title={`Apply for ${selectedJob?.title}`}>
        <form onSubmit={handleApply} className="space-y-6">
          <Input
            label="Resume URL"
            type="url"
            required
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://drive.google.com/your-resume"
          />
          <Textarea
            label="Cover Letter"
            required
            rows={6}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're a great fit for this role..."
          />
          <div className="flex gap-4 pt-4">
            <Button type="button" fullWidth variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button type="submit" fullWidth>Submit Application</Button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
