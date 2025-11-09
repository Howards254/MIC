import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchInvestments();
  }, [user]);

  const fetchInvestments = async () => {
    const { data } = await supabase
      .from('investments')
      .select('*, project:projects(title, description, current_funding, funding_goal)')
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false });
    setInvestments(data || []);
    setLoading(false);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
        <p className="text-gray-600 mt-2">Track your investments</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-500 p-4 rounded-lg">
            <DollarSign size={32} className="text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">${totalInvested.toLocaleString()}</p>
            <p className="text-gray-600">Total Invested</p>
          </div>
        </div>
      </div>

      {investments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">You haven't made any investments yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{inv.project?.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{inv.project?.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ${inv.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>${inv.project?.current_funding?.toLocaleString()} / ${inv.project?.funding_goal?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Invested {new Date(inv.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
