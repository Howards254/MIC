import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { DollarSign, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

export default function Investments() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchInvestments();
  }, [user]);

  const fetchInvestments = async () => {
    const { data } = await supabase
      .from('investments')
      .select('*, project:projects(title, status, current_funding, funding_goal)')
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false });
    setInvestments(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Investment History</h1>
        <p className="text-gray-600 mt-2">All your investment transactions</p>
      </div>

      {investments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No investments yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{inv.project?.title}</div>
                    <div className="text-sm text-gray-500">
                      ${inv.project?.current_funding?.toLocaleString()} / ${inv.project?.funding_goal?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
                      <DollarSign size={16} />
                      ${inv.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                      inv.project?.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <CheckCircle size={12} />
                      {inv.project?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(inv.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
