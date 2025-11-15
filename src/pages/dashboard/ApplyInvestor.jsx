import { useState } from 'react';
import { ChevronRight, ChevronLeft, Building2, Target, TrendingUp } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';

export default function ApplyInvestor({ rejectionReason }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isResubmit, setIsResubmit] = useState(!!rejectionReason);
  const [formData, setFormData] = useState({
    company_name: '',
    investment_range: '',
    areas_of_interest: '',
    linkedin_profile: '',
    reason: '',
    investment_thesis: '',
    ticket_size_min: '',
    ticket_size_max: '',
    geographic_focus: '',
    decision_timeline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      user_id: user.id,
      company_name: formData.company_name,
      investment_thesis: formData.investment_thesis,
      min_ticket_size: formData.ticket_size_min ? parseFloat(formData.ticket_size_min) : null,
      max_ticket_size: formData.ticket_size_max ? parseFloat(formData.ticket_size_max) : null,
      sectors_of_interest: formData.areas_of_interest.split(',').map(s => s.trim()).filter(s => s),
      geographic_focus: formData.geographic_focus ? [formData.geographic_focus] : [],
      linkedin_url: formData.linkedin_profile,
      is_approved: false,
      rejection_reason: null,
      rejected_at: null,
      rejected_by: null
    };

    const { error } = isResubmit 
      ? await supabase.from('investor_profiles').update(profileData).eq('user_id', user.id)
      : await supabase.from('investor_profiles').insert([profileData]);

    if (error) {
      alert(error.code === '23505' ? 'Application already submitted. Please wait for approval.' : 'Error: ' + error.message);
    } else {
      alert(isResubmit ? 'Application resubmitted! Admin will review it soon.' : 'Application submitted! Admin will review it soon.');
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.company_name.trim() || !formData.reason.trim()) {
        alert('Please fill in all required fields');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.investment_range || !formData.areas_of_interest.trim()) {
        alert('Please fill in all required fields');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-red-900 mb-1">Application Rejected</p>
            <p className="text-sm text-red-800">{rejectionReason}</p>
            <p className="text-xs text-red-700 mt-2">Please fix the issues and resubmit your application.</p>
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isResubmit ? 'Resubmit Your' : 'Complete Your'} Investor Profile</h1>
          <p className="text-gray-600">Step {step} of 3</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-800 text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-green-800' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-800 text-white' : 'bg-gray-200'}`}>2</div>
            <div className={`w-20 h-1 ${step >= 3 ? 'bg-green-800' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-800 text-white' : 'bg-gray-200'}`}>3</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="text-green-800" size={28} />
                  <h2 className="text-xl font-bold text-gray-900">Company Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input type="text" required value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input type="url" value={formData.linkedin_profile} onChange={(e) => setFormData({...formData, linkedin_profile: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="https://linkedin.com/in/yourprofile" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to invest? *</label>
                  <textarea required rows={4} value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-green-800" size={28} />
                  <h2 className="text-xl font-bold text-gray-900">Investment Focus</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range *</label>
                  <select required value={formData.investment_range} onChange={(e) => setFormData({...formData, investment_range: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select range</option>
                    <option>$10K - $50K</option>
                    <option>$50K - $100K</option>
                    <option>$100K - $500K</option>
                    <option>$500K+</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Ticket ($)</label>
                    <input type="number" value={formData.ticket_size_min} onChange={(e) => setFormData({...formData, ticket_size_min: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="10000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Ticket ($)</label>
                    <input type="number" value={formData.ticket_size_max} onChange={(e) => setFormData({...formData, ticket_size_max: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="100000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest *</label>
                  <textarea required rows={3} value={formData.areas_of_interest} onChange={(e) => setFormData({...formData, areas_of_interest: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Building Materials, Packaging, Textiles" />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Focus</label>
                  <input type="text" value={formData.geographic_focus} onChange={(e) => setFormData({...formData, geographic_focus: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="North America, Global, East Africa" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-green-800" size={28} />
                  <h2 className="text-xl font-bold text-gray-900">Investment Strategy</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Thesis</label>
                  <textarea rows={4} value={formData.investment_thesis} onChange={(e) => setFormData({...formData, investment_thesis: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Your investment philosophy and focus" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Decision Timeline</label>
                  <select value={formData.decision_timeline} onChange={(e) => setFormData({...formData, decision_timeline: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">How fast do you make decisions?</option>
                    <option>1-2 weeks</option>
                    <option>2-4 weeks</option>
                    <option>1-2 months</option>
                    <option>2-3 months</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ChevronLeft size={20} />
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900">
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex-1 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
