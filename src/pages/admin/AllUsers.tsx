import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';
import { Mail, Calendar, Shield, Ban, CheckCircle, Edit2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from '../../lib/toast';

export default function AllUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('role', filter);
    }

    const { data, error } = await query;
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const handleChangeRole = async (userId, newRole) => {
    setActionLoading(true);
    try {
      const { error } = await supabase.rpc('admin_change_user_role', {
        p_user_id: userId,
        p_new_role: newRole
      });

      if (error) throw error;

      toast.success(`User role changed to ${newRole}`);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error(error.message || 'Failed to change user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async (suspend) => {
    if (suspend && !suspensionReason.trim()) {
      toast.error('Please provide a suspension reason');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase.rpc('admin_suspend_user', {
        p_user_id: selectedUser.id,
        p_suspend: suspend,
        p_reason: suspend ? suspensionReason : null
      });

      if (error) throw error;

      toast.success(suspend ? 'User suspended successfully' : 'User unsuspended successfully');
      setIsSuspendModalOpen(false);
      setSelectedUser(null);
      setSuspensionReason('');
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error(error.message || 'Failed to update user suspension status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-600 mt-2">Manage all users on the platform</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'user', 'innovator', 'investor', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === role
                ? 'bg-green-800 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={user.is_suspended ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name || 'No name'}</div>
                        {user.is_suspended && (
                          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            Suspended
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'investor' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'innovator' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_suspended ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.id !== currentUser?.id && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsRoleModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} className="mr-1" />
                          Role
                        </Button>
                        <Button
                          size="sm"
                          variant={user.is_suspended ? 'outline' : 'outline'}
                          onClick={() => {
                            setSelectedUser(user);
                            setIsSuspendModalOpen(true);
                          }}
                        >
                          {user.is_suspended ? (
                            <><CheckCircle size={14} className="mr-1" />Unsuspend</>
                          ) : (
                            <><Ban size={14} className="mr-1" />Suspend</>
                          )}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Change Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
        }}
        title="Change User Role"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Change role for <strong>{selectedUser?.full_name}</strong> ({selectedUser?.email})
          </p>
          <div className="text-sm text-gray-500">
            Current role: <span className="font-semibold capitalize">{selectedUser?.role}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['user', 'innovator', 'investor', 'admin'].map((role) => (
              <Button
                key={role}
                fullWidth
                variant={selectedUser?.role === role ? 'primary' : 'outline'}
                onClick={() => handleChangeRole(selectedUser?.id, role)}
                disabled={actionLoading || selectedUser?.role === role}
              >
                {role === 'admin' && <Shield size={16} className="mr-2" />}
                <span className="capitalize">{role}</span>
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Suspend/Unsuspend Modal */}
      <Modal
        isOpen={isSuspendModalOpen}
        onClose={() => {
          setIsSuspendModalOpen(false);
          setSelectedUser(null);
          setSuspensionReason('');
        }}
        title={selectedUser?.is_suspended ? 'Unsuspend User' : 'Suspend User'}
      >
        <div className="space-y-4">
          {selectedUser?.is_suspended ? (
            <>
              <p className="text-gray-600">
                Are you sure you want to unsuspend <strong>{selectedUser?.full_name}</strong>?
              </p>
              {selectedUser?.suspension_reason && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Previous suspension reason:</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedUser.suspension_reason}</p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => {
                    setIsSuspendModalOpen(false);
                    setSelectedUser(null);
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={() => handleSuspendUser(false)}
                  disabled={actionLoading}
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : 'Unsuspend User'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                Suspend <strong>{selectedUser?.full_name}</strong> ({selectedUser?.email})
              </p>
              <Textarea
                label="Suspension Reason"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={4}
                placeholder="Enter the reason for suspension..."
                required
              />
              <div className="flex gap-3 pt-4">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => {
                    setIsSuspendModalOpen(false);
                    setSelectedUser(null);
                    setSuspensionReason('');
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={() => handleSuspendUser(true)}
                  disabled={actionLoading || !suspensionReason.trim()}
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : 'Suspend User'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
