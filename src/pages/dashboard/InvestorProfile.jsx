import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { Save } from 'lucide-react';

export default function InvestorProfile() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    investment_range: '',
    areas_of_interest: '',
    investment_thesis: '',
    portfolio_companies: '',
    preferred_stage: '',
    ticket_size_min: '',
    ticket_size_max: '',
    geographic_focus: '',
    decision_timeline: '',
    value_add: ''
  });

  useEffect(() => {
    if (profile?.role === 'investor') {
      fetchProfile();
    }
  }, [profile]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('investor_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setHasProfile(true);
      setFormData({
        company_name: data.company_name || '',
        investment_range: data.investment_range || '',
        areas_of_interest: data.areas_of_interest || '',
        investment_thesis: data.investment_thesis || '',
        portfolio_companies: data.portfolio_companies || '',
        preferred_stage: data.preferred_stage || '',
        ticket_size_min: data.ticket_size_min || '',
        ticket_size_max: data.ticket_size_max || '',
        geographic_focus: data.geographic_focus || '',
        decision_timeline: data.decision_timeline || '',
        value_add: data.value_add || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      user_id: user.id,
      company_name: formData.company_name,
      investment_range: formData.investment_range,
      areas_of_interest: formData.areas_of_interest,
      investment_thesis: formData.investment_thesis,
      portfolio_companies: formData.portfolio_companies,
      preferred_stage: formData.preferred_stage,
      ticket_size_min: formData.ticket_size_min ? parseInt(formData.ticket_size_min) : null,
      ticket_size_max: formData.ticket_size_max ? parseInt(formData.ticket_size_max) : null,
      geographic_focus: formData.geographic_focus,
      decision_timeline: formData.decision_timeline,
      value_add: formData.value_add
    };

    if (hasProfile) {
      await supabase.from('investor_profiles').update(profileData).eq('user_id', user.id);
    } else {
      await supabase.from('investor_profiles').insert([profileData]);
      setHasProfile(true);
    }

    alert('Profile updated successfully!');
    setLoading(false);
  };

  if (profile?.role !== 'investor') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Only approved investors can manage investor profiles.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Investor Profile</h1>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Thesis</label>
            <textarea
              rows={4}
              value={formData.investment_thesis}
              onChange={(e) => setFormData({...formData, investment_thesis: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Companies</label>
            <textarea
              rows={3}
              value={formData.portfolio_companies}
              onChange={(e) => setFormData({...formData, portfolio_companies: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Stage</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Ticket ($)</label>
              <input
                type="number"
                value={formData.ticket_size_min}
                onChange={(e) => setFormData({...formData, ticket_size_min: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Ticket ($)</label>
              <input
                type="number"
                value={formData.ticket_size_max}
                onChange={(e) => setFormData({...formData, ticket_size_max: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decision Timeline</label>
            <select
              value={formData.decision_timeline}
              onChange={(e) => setFormData({...formData, decision_timeline: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select timeline</option>
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
