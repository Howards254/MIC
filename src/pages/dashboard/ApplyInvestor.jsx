import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';

export default function ApplyInvestor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    investment_range: '',
    areas_of_interest: '',
    linkedin_profile: '',
    reason: '',
    investment_thesis: '',
    portfolio_companies: '',
    preferred_stage: '',
    ticket_size_min: '',
    ticket_size_max: '',
    geographic_focus: '',
    decision_timeline: '',
    value_add: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('investor_profiles').insert([{
      user_id: user.id,
      company_name: formData.company_name,
      investment_thesis: formData.investment_thesis,
      min_ticket_size: formData.ticket_size_min ? parseFloat(formData.ticket_size_min) : null,
      max_ticket_size: formData.ticket_size_max ? parseFloat(formData.ticket_size_max) : null,
      sectors_of_interest: formData.areas_of_interest.split(',').map(s => s.trim()).filter(s => s),
      geographic_focus: formData.geographic_focus ? [formData.geographic_focus] : [],
      linkedin_url: formData.linkedin_profile,
      is_approved: false
    }]);

    if (error) {
      console.error('Error:', error);
      alert('Error submitting application: ' + error.message);
      setLoading(false);
      return;
    }

    if (error) {
      if (error.code === '23505') {
        alert('You have already submitted an investor application. Please wait for admin approval.');
      }
    } else {
      alert('Application submitted! Admin will review it soon.');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Apply to Become an Investor</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range</label>
            <select
              value={formData.investment_range}
              onChange={(e) => setFormData({...formData, investment_range: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select range</option>
              <option>$10K - $50K</option>
              <option>$50K - $100K</option>
              <option>$100K - $500K</option>
              <option>$500K+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
            <textarea
              required
              rows={3}
              value={formData.areas_of_interest}
              onChange={(e) => setFormData({...formData, areas_of_interest: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Separate with commas: Building Materials, Packaging, Textiles"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedin_profile}
              onChange={(e) => setFormData({...formData, linkedin_profile: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to invest?</label>
            <textarea
              required
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Thesis</label>
            <textarea
              rows={4}
              value={formData.investment_thesis}
              onChange={(e) => setFormData({...formData, investment_thesis: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="What's your investment philosophy and focus?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Companies (Optional)</label>
            <textarea
              rows={3}
              value={formData.portfolio_companies}
              onChange={(e) => setFormData({...formData, portfolio_companies: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="List some companies you've invested in"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Investment Stage</label>
            <select
              value={formData.preferred_stage}
              onChange={(e) => setFormData({...formData, preferred_stage: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select stage</option>
              <option>Idea</option>
              <option>Prototype</option>
              <option>MVP</option>
              <option>Scaling</option>
              <option>All Stages</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Ticket Size ($)</label>
              <input
                type="number"
                value={formData.ticket_size_min}
                onChange={(e) => setFormData({...formData, ticket_size_min: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Ticket Size ($)</label>
              <input
                type="number"
                value={formData.ticket_size_max}
                onChange={(e) => setFormData({...formData, ticket_size_max: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="100000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Focus</label>
            <input
              type="text"
              value={formData.geographic_focus}
              onChange={(e) => setFormData({...formData, geographic_focus: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., North America, Global, East Africa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decision Timeline</label>
            <select
              value={formData.decision_timeline}
              onChange={(e) => setFormData({...formData, decision_timeline: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">How fast do you make decisions?</option>
              <option>1-2 weeks</option>
              <option>2-4 weeks</option>
              <option>1-2 months</option>
              <option>2-3 months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value Beyond Capital</label>
            <textarea
              rows={4}
              value={formData.value_add}
              onChange={(e) => setFormData({...formData, value_add: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="What expertise, network, or resources do you bring to portfolio companies?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
