import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import { Send, MessageSquare } from 'lucide-react';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(full_name), receiver:profiles!messages_receiver_id_fkey(full_name)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Your conversations</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No messages yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {messages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {message.sender_id === user.id ? `To: ${message.receiver?.full_name}` : `From: ${message.sender?.full_name}`}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
                </div>
                {!message.read && message.receiver_id === user.id && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">New</span>
                )}
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
