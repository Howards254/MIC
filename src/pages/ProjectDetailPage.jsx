import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import PageShell from '../components/layout/PageShell';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { DollarSign, Users, Calendar, Briefcase } from 'lucide-react';
import DonateButton from '../components/donations/DonateButton';
import DonationStats from '../components/donations/DonationStats';
import DonorList from '../components/donations/DonorList';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [owner, setOwner] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [investMessage, setInvestMessage] = useState('');
  const [jobForm, setJobForm] = useState({
    title: '', description: '', location: '', job_type: 'full-time', salary_range: '', requirements: '', responsibilities: ''
  });

  useEffect(() => {
    fetchProject();
    fetchJobs();
    fetchDonations();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data: projectData } = await supabase.from('projects').select('*').eq('id', id).single();
      const { data: ownerData } = await supabase.from('profiles').select('*').eq('id', projectData.user_id).single();
      setProject(projectData);
      setOwner(ownerData);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data } = await supabase.from('jobs').select('*').eq('project_id', id).eq('status', 'open');
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      const { data } = await supabase.from('donations').select('*').eq('project_id', id).eq('status', 'completed');
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    if (!user || profile?.role !== 'investor') {
      alert('Only approved investors can invest');
      return;
    }
    try {
      await supabase.from('investments').insert([{
        project_id: id,
        investor_id: user.id,
        amount: parseFloat(investAmount),
        message: investMessage
      }]);
      setIsInvestModalOpen(false);
      setInvestAmount('');
      setInvestMessage('');
      fetchProject();
    } catch (error) {
      console.error('Error investing:', error);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const requirements = jobForm.requirements.split('\n').filter(r => r.trim());
      const responsibilities = jobForm.responsibilities.split('\n').filter(r => r.trim());
      await supabase.from('jobs').insert([{
        ...jobForm,
        requirements,
        responsibilities,
        project_id: id,
        posted_by: user.id
      }]);
      setIsJobModalOpen(false);
      setJobForm({ title: '', description: '', location: '', job_type: 'full-time', salary_range: '', requirements: '', responsibilities: '' });
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;
  if (!project) return <div className="text-center py-12">Project not found</div>;

  const progress = (project.funds_raised / project.funding_goal) * 100;

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
          <p className="text-gray-600 mb-6">{project.description}</p>

          {project.stage && (
            <div className="mb-6">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Stage: {project.stage}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <DollarSign size={20} className="mr-2" />
                <span className="text-sm">Funding Goal</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${project.funding_goal?.toLocaleString()}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <DollarSign size={20} className="mr-2" />
                <span className="text-sm">Raised</span>
              </div>
              <p className="text-2xl font-bold text-green-800">${project.funds_raised?.toLocaleString()}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar size={20} className="mr-2" />
                <span className="text-sm">Timeline</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{project.timeline}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <Users size={20} className="mr-2" />
                <span className="text-sm">Team Size</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{project.team_size || 'N/A'}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-800 h-4 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>

          {project.technology && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Technology/Materials</h3>
              <p className="text-gray-600">{project.technology}</p>
            </div>
          )}

          {project.impact_metrics && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Environmental Impact Goals</h3>
              <p className="text-gray-600">{project.impact_metrics}</p>
            </div>
          )}

          {project.unique_value && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">What Makes This Unique</h3>
              <p className="text-gray-600">{project.unique_value}</p>
            </div>
          )}

          {project.market_size && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Market Opportunity</h3>
              <p className="text-gray-600">{project.market_size}</p>
            </div>
          )}

          {project.video_url && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Pitch Video</h3>
              <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="text-green-800 hover:underline">
                Watch Pitch Video →
              </a>
            </div>
          )}

          <div className="flex gap-4">
            <DonateButton project={project} variant="primary" />
            {profile?.role === 'investor' && (
              <Button onClick={() => setIsInvestModalOpen(true)} size="lg">Invest in This Project</Button>
            )}
            {user?.id === project.user_id && (
              <Button onClick={() => setIsJobModalOpen(true)} variant="outline" size="lg">
                <Briefcase size={20} className="mr-2" />
                Post a Job
              </Button>
            )}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <DonationStats project={project} donorCount={donations.length} />
          </Card>
          <Card className="p-6">
            <DonorList projectId={id} />
          </Card>
        </div>

        {owner && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Owner</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {owner.full_name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{owner.full_name}</h3>
                <p className="text-gray-600">{owner.email}</p>
                {owner.location && <p className="text-sm text-gray-500">{owner.location}</p>}
              </div>
            </div>
            {owner.bio && (
              <div className="mt-4">
                <p className="text-gray-600">{owner.bio}</p>
              </div>
            )}
          </Card>
        )}

        {jobs.length > 0 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.job_type}</span>
                    {job.salary_range && <><span>•</span><span>{job.salary_range}</span></>}
                  </div>
                  <Button size="sm" className="mt-3" onClick={() => navigate(`/jobs`)}>View Details</Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Modal isOpen={isInvestModalOpen} onClose={() => setIsInvestModalOpen(false)} title="Invest in Project">
        <form onSubmit={handleInvest} className="space-y-6">
          <Input
            label="Investment Amount ($)"
            type="number"
            required
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
            placeholder="10000"
          />
          <Textarea
            label="Message to Project Owner (Optional)"
            value={investMessage}
            onChange={(e) => setInvestMessage(e.target.value)}
            rows={4}
            placeholder="Share why you're excited about this project..."
          />
          <div className="flex gap-4 pt-4">
            <Button type="button" fullWidth variant="outline" onClick={() => setIsInvestModalOpen(false)}>Cancel</Button>
            <Button type="submit" fullWidth>Confirm Investment</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} title="Post a Job">
        <form onSubmit={handlePostJob} className="space-y-6">
          <Input label="Job Title" required value={jobForm.title} onChange={(e) => setJobForm({...jobForm, title: e.target.value})} />
          <Textarea label="Description" required rows={4} value={jobForm.description} onChange={(e) => setJobForm({...jobForm, description: e.target.value})} />
          <Input label="Location" required value={jobForm.location} onChange={(e) => setJobForm({...jobForm, location: e.target.value})} />
          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={jobForm.job_type} onChange={(e) => setJobForm({...jobForm, job_type: e.target.value})}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <Input label="Salary Range" value={jobForm.salary_range} onChange={(e) => setJobForm({...jobForm, salary_range: e.target.value})} placeholder="$50,000 - $70,000" />
          <Textarea label="Requirements (one per line)" required rows={4} value={jobForm.requirements} onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})} />
          <Textarea label="Responsibilities (one per line)" required rows={4} value={jobForm.responsibilities} onChange={(e) => setJobForm({...jobForm, responsibilities: e.target.value})} />
          <div className="flex gap-4 pt-4">
            <Button type="button" fullWidth variant="outline" onClick={() => setIsJobModalOpen(false)}>Cancel</Button>
            <Button type="submit" fullWidth>Post Job</Button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
