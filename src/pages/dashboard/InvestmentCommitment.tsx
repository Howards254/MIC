import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';
import { DollarSign, TrendingUp, FileText, AlertCircle } from 'lucide-react';

const PLATFORM_FEE_RATE = 0.05; // 5%
const PLATFORM_EQUITY = 5.0; // 5%

export default function InvestmentCommitment() {
  const { projectId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    equity_percentage: '',
    message: '',
    deal_type: 'equity',
    valuation: ''
  });

  const amount = parseFloat(formData.amount) || 0;
  const platformFee = amount * PLATFORM_FEE_RATE;
  const netAmount = amount - platformFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile?.role !== 'investor') {
      alert('Only approved investors can make investment commitments');
      return;
    }

    if (amount < 10000) {
      alert('Minimum investment is $10,000');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('investment_commitments')
        .insert({
          project_id: projectId,
          investor_id: user.id,
          amount: amount,
          platform_fee: platformFee,
          net_amount: netAmount,
          equity_percentage: parseFloat(formData.equity_percentage),
          platform_equity: PLATFORM_EQUITY,
          message: formData.message || null,
          status: 'pending'
        });

      if (error) throw error;

      alert('Investment commitment submitted! We will review and contact you about upcoming events.');
      navigate('/dashboard/portfolio');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Commitment</h1>
        <p className="text-gray-600">
          Express your interest to invest. Final deal will be signed at our investment event.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800">
          <p className="font-semibold mb-1">Important:</p>
          <p>This is a non-binding commitment. You'll meet the founder at our event, finalize terms, and sign the deal in person. Funds are held in escrow until deal completion.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Amount *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              required
              min="10000"
              step="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Minimum: $10,000</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equity Percentage Requested *
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              required
              min="0.1"
              max="49"
              step="0.1"
              value={formData.equity_percentage}
              onChange={(e) => setFormData({ ...formData, equity_percentage: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="10"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Negotiable at event</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Type
          </label>
          <select
            value={formData.deal_type}
            onChange={(e) => setFormData({ ...formData, deal_type: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="equity">Equity</option>
            <option value="safe">SAFE (Simple Agreement for Future Equity)</option>
            <option value="convertible_note">Convertible Note</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposed Valuation (Optional)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="0"
              step="10000"
              value={formData.valuation}
              onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="500000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message to Founder (Optional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Share why you're interested in this project..."
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-4">Investment Breakdown</h3>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Investment Amount:</span>
            <span className="font-semibold">${amount.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Fee (5%):</span>
            <span className="font-semibold text-red-600">-${platformFee.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm pt-3 border-t">
            <span className="text-gray-600">Net to Startup:</span>
            <span className="font-bold text-green-600 text-lg">${netAmount.toLocaleString()}</span>
          </div>

          <div className="pt-4 border-t mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Your Equity:</span>
              <span className="font-semibold">{formData.equity_percentage || 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Equity:</span>
              <span className="font-semibold text-green-600">{PLATFORM_EQUITY}%</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>We review your commitment</li>
                <li>You're invited to our next investment event</li>
                <li>Meet the founder and finalize terms</li>
                <li>Sign deal documents at the event</li>
                <li>Funds transferred within 48 hours</li>
              </ol>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-lg transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Investment Commitment'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to our Terms of Service and Investment Agreement. This is a non-binding commitment.
        </p>
      </form>
    </div>
  );
}
