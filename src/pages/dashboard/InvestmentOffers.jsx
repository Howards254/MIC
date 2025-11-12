import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { DollarSign, MessageCircle, Check, X, TrendingUp, AlertCircle } from 'lucide-react';
import InvestmentChat from '../../components/investments/InvestmentChat';

export default function InvestmentOffers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [responseForm, setResponseForm] = useState({
    action: '',
    message: '',
    counter_equity: '',
    counter_amount: ''
  });

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    try {
      // First get user's projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id);

      if (!projects || projects.length === 0) {
        setOffers([]);
        setLoading(false);
        return;
      }

      const projectIds = projects.map(p => p.id);

      // Get investment commitments
      const { data: commitments, error } = await supabase
        .from('investment_commitments')
        .select('*')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch related data separately
      const offersWithData = await Promise.all(
        (commitments || []).map(async (commitment) => {
          const [projectRes, investorRes] = await Promise.all([
            supabase.from('projects').select('title, description').eq('id', commitment.project_id).maybeSingle(),
            supabase.from('profiles').select('full_name, email').eq('id', commitment.investor_id).maybeSingle()
          ]);

          return {
            ...commitment,
            projects: projectRes.data || { title: 'Unknown Project', description: '' },
            profiles: investorRes.data || { full_name: 'Unknown Investor', email: '' }
          };
        })
      );

      setOffers(offersWithData.filter(o => o.projects && o.profiles));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (offerId, action) => {
    setResponding(true);
    try {
      const updates = {
        innovator_response: action,
        innovator_message: responseForm.message || null,
        responded_at: new Date().toISOString(),
        status: action === 'accepted' ? 'agreed' : action === 'rejected' ? 'rejected_by_innovator' : 'negotiating'
      };

      if (action === 'accepted') {
        updates.deal_agreed = true;
        updates.agreed_at = new Date().toISOString();
        updates.final_equity_percentage = offers.find(o => o.id === offerId)?.equity_percentage;
        updates.final_amount = offers.find(o => o.id === offerId)?.amount;
      } else if (action === 'counter_offered') {
        updates.counter_equity_percentage = parseFloat(responseForm.counter_equity);
        updates.counter_amount = parseFloat(responseForm.counter_amount);
      }

      const { error } = await supabase
        .from('investment_commitments')
        .update(updates)
        .eq('id', offerId);

      if (error) throw error;

      // Send message
      await supabase.from('investment_messages').insert({
        commitment_id: offerId,
        sender_id: user.id,
        sender_type: 'innovator',
        message: responseForm.message || `Offer ${action}`,
        message_type: action === 'accepted' ? 'acceptance' : action === 'rejected' ? 'rejection' : 'counter_offer'
      });

      alert(`Offer ${action} successfully!`);
      setResponseForm({ action: '', message: '', counter_equity: '', counter_amount: '' });
      fetchOffers();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setResponding(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Investment Offers</h1>
        <p className="text-gray-600 mt-2">Review and respond to investment offers for your projects</p>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No investment offers yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`p-6 ${
                offer.deal_agreed ? 'bg-green-50' :
                offer.innovator_response === 'rejected' ? 'bg-red-50' :
                offer.innovator_response === 'counter_offered' ? 'bg-yellow-50' :
                'bg-blue-50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{offer.projects.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">From: {offer.profiles.full_name}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    offer.deal_agreed ? 'bg-green-200 text-green-800' :
                    offer.innovator_response === 'rejected' ? 'bg-red-200 text-red-800' :
                    offer.innovator_response === 'counter_offered' ? 'bg-yellow-200 text-yellow-800' :
                    offer.innovator_response === 'accepted' ? 'bg-green-200 text-green-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {offer.deal_agreed ? 'Deal Agreed' :
                     offer.innovator_response === 'rejected' ? 'Rejected' :
                     offer.innovator_response === 'counter_offered' ? 'Counter Offered' :
                     offer.innovator_response === 'accepted' ? 'Accepted' :
                     'Pending Response'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Investment Amount</p>
                    <p className="text-2xl font-bold text-green-600">${offer.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Net: ${offer.net_amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Equity Requested</p>
                    <p className="text-2xl font-bold text-blue-600">{offer.equity_percentage}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Platform Takes</p>
                    <p className="text-lg font-bold text-gray-700">5% equity</p>
                    <p className="text-xs text-gray-500">${offer.platform_fee.toLocaleString()} fee</p>
                  </div>
                </div>

                {offer.message && (
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Investor Message:</p>
                    <p className="text-gray-600">{offer.message}</p>
                  </div>
                )}

                {offer.innovator_response === 'pending' && (
                  <div className="space-y-4 mt-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setResponseForm({ ...responseForm, action: 'accepted' })}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Check size={20} />
                        Accept Offer
                      </button>
                      <button
                        onClick={() => setResponseForm({ ...responseForm, action: 'counter_offered' })}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                      >
                        <TrendingUp size={20} />
                        Counter Offer
                      </button>
                      <button
                        onClick={() => setResponseForm({ ...responseForm, action: 'rejected' })}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X size={20} />
                        Reject
                      </button>
                    </div>

                    {responseForm.action && (
                      <div className="bg-white p-4 rounded-lg space-y-3">
                        {responseForm.action === 'counter_offered' && (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium mb-1">Counter Amount ($)</label>
                                <input
                                  type="number"
                                  value={responseForm.counter_amount}
                                  onChange={(e) => setResponseForm({ ...responseForm, counter_amount: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder={offer.amount}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Counter Equity (%)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={responseForm.counter_equity}
                                  onChange={(e) => setResponseForm({ ...responseForm, counter_equity: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder={offer.equity_percentage}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        <div>
                          <label className="block text-sm font-medium mb-1">Message to Investor</label>
                          <textarea
                            value={responseForm.message}
                            onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Explain your response..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResponse(offer.id, responseForm.action)}
                            disabled={responding}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                          >
                            {responding ? 'Sending...' : 'Send Response'}
                          </button>
                          <button
                            onClick={() => setResponseForm({ action: '', message: '', counter_equity: '', counter_amount: '' })}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <MessageCircle size={18} />
                  View Conversation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOffer && (
        <InvestmentChat
          commitment={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          userType="innovator"
        />
      )}
    </div>
  );
}
