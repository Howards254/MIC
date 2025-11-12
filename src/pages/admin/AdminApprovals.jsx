import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../supabaseClient';
import Card from '../../components/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { CheckCircle, XCircle, UserPlus, Eye } from 'lucide-react';

export default function AdminApprovals() {
  const { user } = useAuth();
  const [pendingProjects, setPendingProjects] = useState([]);
  const [pendingInvestors, setPendingInvestors] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projectsRes = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const investorsRes = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      const adminsRes = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (projectsRes.error) {
        console.error('Projects Error:', projectsRes.error);
        alert('Error loading projects: ' + projectsRes.error.message);
        return;
      }
      if (investorsRes.error) {
        console.error('Investors Error:', investorsRes.error);
        alert('Error loading investors: ' + investorsRes.error.message);
        return;
      }

      const projectsWithProfiles = await Promise.all(
        (projectsRes.data || []).map(async (project) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', project.innovator_id)
            .single();
          return { ...project, profiles: profile };
        })
      );

      const investorsWithProfiles = await Promise.all(
        (investorsRes.data || []).map(async (investor) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', investor.user_id)
            .single();
          return { ...investor, profiles: profile };
        })
      );

      setPendingProjects(projectsWithProfiles);
      setPendingInvestors(investorsWithProfiles);
      setAllAdmins(adminsRes.data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Unexpected error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProject = async (projectId) => {
    await supabase.from('projects').update({ status: 'approved', approved_by: user.id, approved_at: new Date().toISOString() }).eq('id', projectId);
    fetchData();
  };

  const handleRejectProject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    await supabase.from('projects').update({ 
      status: 'rejected', 
      rejected_by: user.id, 
      rejected_at: new Date().toISOString(),
      rejection_reason: rejectionReason
    }).eq('id', selectedProject.id);
    
    setIsRejectModalOpen(false);
    setRejectionReason('');
    setSelectedProject(null);
    fetchData();
  };

  const handleApproveInvestor = async (profileId, userId) => {
    await supabase.from('investor_profiles').update({ 
      is_approved: true,
      approved_by: user.id, 
      approved_at: new Date().toISOString() 
    }).eq('id', profileId);
    
    fetchData();
  };

  const handleRejectInvestor = async (profileId) => {
    await supabase.from('investor_profiles').delete().eq('id', profileId);
    fetchData();
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('profiles').update({ role: 'admin' }).eq('email', newAdminEmail).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('User not found');
      setIsAddAdminModalOpen(false);
      setNewAdminEmail('');
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals & Management</h1>
          <p className="text-gray-600 mt-1">Review and approve platform submissions</p>
        </div>
        <Button onClick={() => setIsAddAdminModalOpen(true)}><UserPlus size={20} className="mr-2" />Add Admin</Button>
      </div>

      <Card>
        <div className="p-6 border-b bg-gradient-to-r from-green-50 to-green-100">
          <h2 className="text-xl font-bold text-gray-900">Pending Project Approvals ({pendingProjects.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Project</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Submitted By</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Funding Goal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pendingProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    <div className="text-xs text-gray-500">{project.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{project.profiles?.full_name}</div>
                    <div className="text-xs text-gray-500">{project.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">${project.funding_goal?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(project.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { setSelectedProject(project); setIsViewModalOpen(true); }}><Eye size={16} className="mr-1" />View</Button>
                      <Button size="sm" onClick={() => handleApproveProject(project.id)}><CheckCircle size={16} className="mr-1" />Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedProject(project); setIsRejectModalOpen(true); }}><XCircle size={16} className="mr-1" />Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingProjects.length === 0 && <div className="p-8 text-center text-gray-500">No pending projects</div>}
        </div>
      </Card>

      <Card>
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Pending Investor Approvals ({pendingInvestors.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Investment Range</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pendingInvestors.map((investor) => (
                <tr key={investor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{investor.profiles?.full_name}</div>
                    <div className="text-xs text-gray-500">{investor.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{investor.company_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">{investor.investment_range}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(investor.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { setSelectedInvestor(investor); setIsViewModalOpen(true); }}><Eye size={16} className="mr-1" />View</Button>
                      <Button size="sm" onClick={() => handleApproveInvestor(investor.id, investor.user_id)}><CheckCircle size={16} className="mr-1" />Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectInvestor(investor.id)}><XCircle size={16} className="mr-1" />Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingInvestors.length === 0 && <div className="p-8 text-center text-gray-500">No pending investor applications</div>}
        </div>
      </Card>

      <Card>
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-purple-100">
          <h2 className="text-xl font-bold text-gray-900">Platform Administrators ({allAdmins.length})</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {allAdmins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold mr-3">{admin.full_name?.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-gray-900">{admin.full_name}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Added {new Date(admin.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Project">
        <div className="space-y-4">
          <p className="text-gray-600">Provide a reason for rejecting this project:</p>
          <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} placeholder="Enter rejection reason..." required />
          <div className="flex gap-4 pt-4">
            <Button fullWidth variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button fullWidth onClick={handleRejectProject} disabled={!rejectionReason}>Reject Project</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={selectedProject ? "Project Details" : "Investor Details"}>
        {selectedProject && (
          <div className="space-y-4">
            <div><p className="text-sm font-medium text-gray-600">Title</p><p className="text-gray-900">{selectedProject.title}</p></div>
            <div><p className="text-sm font-medium text-gray-600">Description</p><p className="text-gray-900">{selectedProject.description}</p></div>
            <div><p className="text-sm font-medium text-gray-600">Category</p><p className="text-gray-900">{selectedProject.category}</p></div>
            <div><p className="text-sm font-medium text-gray-600">Funding Goal</p><p className="text-gray-900">${selectedProject.funding_goal?.toLocaleString()}</p></div>
            <div><p className="text-sm font-medium text-gray-600">Timeline</p><p className="text-gray-900">{selectedProject.timeline}</p></div>
          </div>
        )}
        {selectedInvestor && (
          <div className="space-y-4">
            <div><p className="text-sm font-medium text-gray-600">Company</p><p className="text-gray-900">{selectedInvestor.company_name || 'N/A'}</p></div>
            <div><p className="text-sm font-medium text-gray-600">Investment Range</p><p className="text-gray-900">{selectedInvestor.investment_range}</p></div>
            <div><p className="text-sm font-medium text-gray-600">Areas of Interest</p><p className="text-gray-900">{selectedInvestor.areas_of_interest?.join(', ')}</p></div>
            <div><p className="text-sm font-medium text-gray-600">Reason</p><p className="text-gray-900">{selectedInvestor.reason}</p></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isAddAdminModalOpen} onClose={() => setIsAddAdminModalOpen(false)} title="Add New Administrator">
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <p className="text-gray-600">Enter the email of an existing user to make them an admin:</p>
          <Input label="User Email" type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="user@example.com" required />
          <div className="flex gap-4 pt-4">
            <Button type="button" fullWidth variant="outline" onClick={() => setIsAddAdminModalOpen(false)}>Cancel</Button>
            <Button type="submit" fullWidth>Add Admin</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
