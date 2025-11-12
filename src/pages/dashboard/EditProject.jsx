import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';

export default function EditProject() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Building Materials',
    problem_statement: '',
    solution: '',
    target_market: '',
    business_model: '',
    funding_goal: '',
    timeline: '',
    team_size: '',
    technology: '',
    impact_metrics: ''
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Fetch error:', error);
        alert(`Error loading project: ${error.message}`);
        navigate('/dashboard/projects');
        return;
      }

      if (!data) {
        alert('Project not found');
        navigate('/dashboard/projects');
        return;
      }

      if (data.innovator_id !== user.id) {
        alert('You do not have permission to edit this project');
        navigate('/dashboard/projects');
        return;
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'Building Materials',
        problem_statement: data.problem_statement || '',
        solution: data.solution || '',
        target_market: data.target_market || '',
        business_model: data.business_model || '',
        funding_goal: data.funding_goal || '',
        timeline: data.timeline || '',
        team_size: data.team_size || '',
        technology: data.technology || '',
        impact_metrics: data.impact_metrics || ''
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      alert(`Unexpected error: ${err.message}`);
      navigate('/dashboard/projects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        problem_statement: formData.problem_statement || null,
        solution: formData.solution || null,
        target_market: formData.target_market || null,
        business_model: formData.business_model || null,
        funding_goal: parseFloat(formData.funding_goal)
      };

      // Only add optional fields if they have values
      if (formData.timeline) updateData.timeline = formData.timeline;
      if (formData.team_size) updateData.team_size = parseInt(formData.team_size);
      if (formData.technology) updateData.technology = formData.technology;
      if (formData.impact_metrics) updateData.impact_metrics = formData.impact_metrics;

      // If project was rejected, reset status to pending for resubmission
      const { data: currentProject } = await supabase
        .from('projects')
        .select('status')
        .eq('id', id)
        .single();
      
      if (currentProject?.status === 'rejected') {
        updateData.status = 'pending';
        updateData.rejection_reason = null;
        updateData.rejected_at = null;
        updateData.rejected_by = null;
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Update error:', error);
        alert(`Error updating project: ${error.message}\n\nDetails: ${error.details || 'No additional details'}\n\nHint: ${error.hint || 'Check console for more info'}`);
        return;
      }

      if (!data || data.length === 0) {
        alert('No project was updated. You may not have permission to edit this project.');
        return;
      }

      if (currentProject?.status === 'rejected') {
        alert('Project updated and resubmitted for review!');
      } else {
        alert('Project updated successfully!');
      }
      navigate('/dashboard/projects');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Project</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Brief overview of your project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              <option>Building Materials</option>
              <option>Furniture</option>
              <option>Packaging</option>
              <option>Textiles</option>
              <option>Energy</option>
              <option>Agriculture</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement</label>
            <textarea
              rows={3}
              value={formData.problem_statement}
              onChange={(e) => setFormData({...formData, problem_statement: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="What problem are you solving?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Solution</label>
            <textarea
              rows={3}
              value={formData.solution}
              onChange={(e) => setFormData({...formData, solution: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="How does your project solve this problem?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
            <textarea
              rows={3}
              value={formData.target_market}
              onChange={(e) => setFormData({...formData, target_market: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Who are your customers?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Model</label>
            <textarea
              rows={3}
              value={formData.business_model}
              onChange={(e) => setFormData({...formData, business_model: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="How will you make money?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal ($)</label>
            <input
              type="number"
              required
              min="1000"
              value={formData.funding_goal}
              onChange={(e) => setFormData({...formData, funding_goal: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Minimum $1,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline (Optional)</label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 12 months to market"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size (Optional)</label>
            <input
              type="number"
              min="1"
              value={formData.team_size}
              onChange={(e) => setFormData({...formData, team_size: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Number of team members"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technology/Materials (Optional)</label>
            <textarea
              rows={3}
              value={formData.technology}
              onChange={(e) => setFormData({...formData, technology: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="What technology or materials are you using?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Environmental Impact (Optional)</label>
            <textarea
              rows={3}
              value={formData.impact_metrics}
              onChange={(e) => setFormData({...formData, impact_metrics: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Reduce CO2 by 50%, Save 1000 trees annually"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/projects')}
              className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
