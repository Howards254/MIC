import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';

export default function SubmitProject() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('projects').insert([{
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      funding_goal: parseFloat(formData.funding_goal),
      category: formData.category,
      stage: formData.stage,
      team_size: formData.team_size ? parseInt(formData.team_size) : null,
      timeline: formData.timeline || 'TBD',
      technology: formData.technology,
      impact_metrics: formData.impact_metrics,
      unique_value: formData.unique_value,
      market_size: formData.market_size,
      video_url: formData.video_url,
      status: 'pending',
      funds_raised: 0
    }]);

    if (error) {
      console.error('Error:', error);
      alert('Error submitting project: ' + error.message);
      setLoading(false);
      return;
    }

    navigate('/dashboard/projects');
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Submit New Project</h1>
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
              placeholder="Number of team members"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 12 months to market"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technology/Materials Used</label>
            <textarea
              rows={3}
              value={formData.technology}
              onChange={(e) => setFormData({...formData, technology: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="What technology or materials are you using?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Environmental Impact Goals</label>
            <textarea
              rows={3}
              value={formData.impact_metrics}
              onChange={(e) => setFormData({...formData, impact_metrics: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Reduce CO2 by 50%, Save 1000 trees annually"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What Makes Your Project Unique?</label>
            <textarea
              rows={3}
              value={formData.unique_value}
              onChange={(e) => setFormData({...formData, unique_value: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Your competitive advantage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Size</label>
            <input
              type="text"
              value={formData.market_size}
              onChange={(e) => setFormData({...formData, market_size: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., $500M TAM, Growing 20% annually"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Video URL (Optional)</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="YouTube or Vimeo link"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
