import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send } from 'lucide-react';

export default function SendNotification() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: 'all',
    user_id: '',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, email');
    setUsers(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.recipient === 'all') {
      const notifications = users.map(user => ({
        user_id: user.id,
        title: formData.title,
        message: formData.message,
        read: false
      }));
      await supabase.from('notifications').insert(notifications);
    } else {
      await supabase.from('notifications').insert([{
        user_id: formData.user_id,
        title: formData.title,
        message: formData.message,
        read: false
      }]);
    }

    alert('Notification sent successfully!');
    setFormData({ recipient: 'all', user_id: '', title: '', message: '' });
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Send Notification</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
            <select
              value={formData.recipient}
              onChange={(e) => setFormData({...formData, recipient: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Users</option>
              <option value="specific">Specific User</option>
            </select>
          </div>

          {formData.recipient === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Choose a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.full_name} ({user.email})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Notification title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Your message to users"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-50"
          >
            <Send size={20} />
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
}
