import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, User, Calendar, Filter } from 'lucide-react';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('admin_audit_log')
        .select(`
          *,
          admin:admin_id (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('action', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'change_role':
        return 'bg-blue-100 text-blue-800';
      case 'suspend_user':
        return 'bg-red-100 text-red-800';
      case 'unsuspend_user':
        return 'bg-green-100 text-green-800';
      case 'approve_investor':
        return 'bg-green-100 text-green-800';
      case 'reject_investor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAction = (action) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const actions = [
    'all',
    'change_role',
    'suspend_user',
    'unsuspend_user',
    'approve_investor',
    'reject_investor'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Audit Log</h1>
        <p className="text-gray-600 mt-2">Track all administrative actions on the platform</p>
      </div>

      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <Filter size={20} className="text-gray-500" />
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => setFilter(action)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === action
                ? 'bg-green-800 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            {action === 'all' ? 'All Actions' : formatAction(action)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Target Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getActionColor(
                          log.action
                        )}`}
                      >
                        <FileText size={12} />
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.admin?.full_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">{log.admin?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 capitalize">
                        {log.target_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md">
                        {log.details && (
                          <div className="space-y-1">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium capitalize">
                                  {key.replace('_', ' ')}:
                                </span>{' '}
                                {typeof value === 'string' ? value : JSON.stringify(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <div>
                          <div>{new Date(log.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No audit logs found
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
