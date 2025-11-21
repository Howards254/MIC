import { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';

const DONATION_TIERS = [
  { amount: 10, label: 'Seedling' },
  { amount: 25, label: 'Sapling' },
  { amount: 50, label: 'Young Tree' },
  { amount: 100, label: 'Mature Tree' },
  { amount: 250, label: 'Forest Guardian' },
  { amount: 500, label: 'Forest Protector' },
  { amount: 1000, label: 'Forest Champion' }
];

const PLATFORM_FEE_RATE = 0.02;

export default function DonateModal({ project, onClose }) {
  const { user, profile } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState(profile?.full_name || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const platformFee = (amount * PLATFORM_FEE_RATE).toFixed(2);
  const netAmount = (amount - platformFee).toFixed(2);

  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (amount < 10) {
      setError('Minimum donation is $10');
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In production, integrate with Stripe here
      // For MVP, we'll create the donation record directly
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          project_id: project.id,
          donor_id: user?.id || null,
          donor_name: isAnonymous ? 'Anonymous' : donorName.trim(),
          donor_email: donorEmail || null,
          amount: amount,
          platform_fee: platformFee,
          net_amount: netAmount,
          message: message || null,
          is_anonymous: isAnonymous,
          status: 'completed'
        });

      if (donationError) throw donationError;

      alert('Thank you for your donation! 🌳');
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold">Support This Project</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleDonate} className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm">{project.description?.substring(0, 150)}...</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Select Amount</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DONATION_TIERS.map((tier) => (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(tier.amount);
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAmount === tier.amount && !customAmount
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-bold text-lg">${tier.amount}</div>
                  <div className="text-xs text-gray-600">{tier.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Custom Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min="10"
                step="0.01"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                placeholder="Enter custom amount"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {!user && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Your Name *</label>
                <input
                  type="text"
                  required={!isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isAnonymous}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={isAnonymous}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message of support..."
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="anonymous" className="text-sm">
              Donate anonymously
            </label>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Donation Amount:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Platform Fee (2%):</span>
              <span>${platformFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Project Receives:</span>
              <span className="text-green-600">${netAmount}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || amount < 10}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Processing...' : `Donate $${amount.toFixed(2)}`}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By donating, you agree to our Terms of Service. All donations are final and non-refundable.
          </p>
        </form>
      </div>
    </div>
  );
}
