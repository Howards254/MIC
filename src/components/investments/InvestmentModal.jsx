import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import Card from '../Card';
import Button from '../ui/Button';
import { X, AlertCircle } from 'lucide-react';

export default function InvestmentModal({ project, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [equity, setEquity] = useState('');
  const [message, setMessage] = useState('');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const { data } = await supabase
      .from('investor_wallets')
      .select('*')
      .eq('investor_id', user.id)
      .single();
    setWallet(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const investAmount = parseFloat(amount);
    const equityPercent = parseFloat(equity);

    if (investAmount < 100) {
      alert('Minimum investment is $100');
      return;
    }

    if (investAmount > wallet?.balance) {
      alert('Insufficient balance. Please deposit funds first.');
      return;
    }

    if (equityPercent < 0.1 || equityPercent > 100) {
      alert('Equity must be between 0.1% and 100%');
      return;
    }

    if (!message.trim()) {
      alert('Please add a message with your investment terms');
      return;
    }

    setLoading(true);
    try {
      // Create investment commitment
      const { data: commitment, error: commitError } = await supabase
        .from('investment_commitments')
        .insert({
          project_id: project.id,
          investor_id: user.id,
          amount: investAmount,
          equity_offered: equityPercent,
          initial_message: message.trim(),
          status: 'pending',
        })
        .select()
        .single();

      if (commitError) throw commitError;

      // Update wallet balance
      const newBalance = wallet.balance - investAmount;
      await supabase
        .from('investor_wallets')
        .update({
          balance: newBalance,
          total_invested: (wallet.total_invested || 0) + investAmount,
        })
        .eq('investor_id', user.id);

      // Record transaction
      await supabase
        .from('investor_wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          investor_id: user.id,
          transaction_type: 'investment',
          amount: investAmount,
          balance_after: newBalance,
          reference_id: commitment.id,
          notes: `Investment in ${project.title}`,
        });

      alert('Investment commitment sent! Check Messages to negotiate with the innovator.');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Investment error:', error);
      alert('Failed to process investment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const platformFee = amount ? (parseFloat(amount) * 0.05).toFixed(2) : '0.00';
  const totalDeduction = amount ? parseFloat(amount) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invest in Project</h2>
              <p className="text-gray-600 mt-1">{project.title}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Wallet Balance */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Available Balance:</strong> ${wallet?.balance?.toLocaleString() || '0.00'}
            </p>
            {(!wallet || wallet.balance < 100) && (
              <p className="text-sm text-red-600 mt-2">
                Insufficient balance. Please deposit funds to your wallet first.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount (USD)
              </label>
              <input
                type="number"
                min="100"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter amount"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum: $100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equity Requested (%)
              </label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 10"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of company equity you want</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Terms & Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Explain your investment terms, expectations, and why you're interested in this project..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will start a conversation with the innovator
              </p>
            </div>

            {/* Fee Breakdown */}
            {amount && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-medium">${parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee (5%):</span>
                  <span className="font-medium">${platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Equity:</span>
                  <span className="font-medium">5%</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Deducted from Wallet:</span>
                  <span>${totalDeduction.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Funds will be held by the platform until deal is signed</li>
                    <li>You can negotiate terms via messaging</li>
                    <li>You can disinvest anytime before deal signing</li>
                    <li>Deal must be signed at an official event</li>
                    <li>After signing, funds transfer within 48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                fullWidth
                disabled={loading || !wallet || wallet.balance < 100}
              >
                {loading ? 'Processing...' : 'Send Investment Offer'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
