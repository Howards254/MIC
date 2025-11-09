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
    funding_goal: '',
    category: 'Building Materials',
    stage: 'Idea',
    team_size: '',
    timeline: '',
    technology: '',
    impact_metrics: '',
    unique_value: '',
    market_size: '',
    video_url: ''
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    if (data && data.user_id === user.id) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        funding_goal: data.funding_goal || '',
        category: data.category || 'Building Materials',
        stage: data.stage || 'Idea',
        team_size: data.team_size || '',
        timeline: data.timeline || '',
        technology: data.technology || '',
        impact_metrics: data.impact_metrics || '',
        unique_value: data.unique_value || '',
        market_size: data.market_size || '',
        video_url: data.video_url || ''
      });
    } else {
      navigate('/dashboard/projects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('projects').update({
      title: formData.title,
      description: formData.description,
      funding_goal: parseFloat(formData.funding_goal),
      category: formData.category,
      stage: formData.stage,
      team_size: formData.team_size ? parseInt(formData.team_size) : null,
      timeline: formData.timeline,
      technology: formData.technology,
      impact_metrics: formData.impact_metrics,
      unique_value: formData.unique_value,
      market_size: formData.market_size,
      video_url: formData.video_url
    }).eq('id', id);

    if (!error) {
      navigate('/dashboard/projects');
    }
    setLoading(false);
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
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option>Building Materials</option>
              <option>Furniture</option>
              <option>Packaging</option>
              <option>Textiles</option>
              <option>Other</option>
            </select>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({...formData, stage: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option>Idea</option>
              <option>Prototype</option>
              <option>MVP</option>
              <option>Scaling</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
            <input
              type="number"
              min="1"
              value={formData.team_size}
              onChange={(e) => setFormData({...formData, team_size: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technology/Materials</label>
            <textarea
              rows={3}
              value={formData.technology}
              onChange={(e) => setFormData({...formData, technology: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Environmental Impact Goals</label>
            <textarea
              rows={3}
              value={formData.impact_metrics}
              onChange={(e) => setFormData({...formData, impact_metrics: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What Makes Your Project Unique?</label>
            <textarea
              rows={3}
              value={formData.unique_value}
              onChange={(e) => setFormData({...formData, unique_value: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Size</label>
            <input
              type="text"
              value={formData.market_size}
              onChange={(e) => setFormData({...formData, market_size: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Video URL</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
