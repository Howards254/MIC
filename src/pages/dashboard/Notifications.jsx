import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { Bell, Calendar, X } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    fetchNotifications();
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">Stay updated with system messages</p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-lg shadow p-6 ${!notif.read ? 'border-l-4 border-green-800' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell size={20} className={!notif.read ? 'text-green-800' : 'text-gray-400'} />
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{notif.message}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    {new Date(notif.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="mt-4 text-sm text-green-800 hover:text-green-900"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
