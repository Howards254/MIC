import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Card from '../../components/Card';
import Button from '../../components/ui/Button';
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function InvestorWallet() {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const { data: walletData } = await supabase
        .from('investor_wallets')
        .select('*')
        .eq('investor_id', user.id)
        .single();

      const { data: txData } = await supabase
        .from('investor_wallet_transactions')
        .select('*')
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      setWallet(walletData);
      setTransactions(txData || []);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (amount < 10) {
      alert('Minimum deposit is $10');
      return;
    }

    setProcessing(true);
    try {
      // TODO: Integrate with Pesaflow payment gateway
      // For now, simulate deposit
      const newBalance = (wallet?.balance || 0) + amount;
      
      // Update wallet
      await supabase
        .from('investor_wallets')
        .update({
          balance: newBalance,
          total_deposited: (wallet?.total_deposited || 0) + amount,
        })
        .eq('investor_id', user.id);

      // Record transaction
      await supabase
        .from('investor_wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          investor_id: user.id,
          transaction_type: 'deposit',
          amount: amount,
          balance_after: newBalance,
          payment_method: 'pesaflow',
          payment_reference: `DEP-${Date.now()}`,
          notes: 'Wallet deposit',
        });

      setDepositAmount('');
      setShowDepositModal(false);
      fetchWalletData();
      alert('Deposit successful!');
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8">Loading wallet...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
        <Button onClick={() => setShowDepositModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Deposit Funds
        </Button>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${wallet?.balance?.toLocaleString() || '0.00'}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deposited</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${wallet?.total_deposited?.toLocaleString() || '0.00'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${wallet?.total_invested?.toLocaleString() || '0.00'}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Disinvested</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${wallet?.total_disinvested?.toLocaleString() || '0.00'}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance After</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tx.transaction_type === 'deposit' ? 'bg-green-100 text-green-800' :
                      tx.transaction_type === 'investment' ? 'bg-blue-100 text-blue-800' :
                      tx.transaction_type === 'disinvestment' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <span className={tx.transaction_type === 'investment' ? 'text-red-600' : 'text-green-600'}>
                      {tx.transaction_type === 'investment' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    ${tx.balance_after.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {tx.payment_reference || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </Card>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deposit Funds</h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  min="10"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum deposit: $10</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Payment via Pesaflow</strong><br />
                  You will be redirected to complete payment securely.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowDepositModal(false)}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth disabled={processing}>
                  {processing ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
