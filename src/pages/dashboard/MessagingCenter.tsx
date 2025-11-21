import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Card from '../../components/Card';
import Button from '../../components/ui/Button';
import { Send, MessageCircle } from 'lucide-react';

export default function MessagingCenter() {
  const { user, profile } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.commitment_id);
      subscribeToMessages(selectedConversation.commitment_id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Get all commitments where user is involved
      const { data: commitments } = await supabase
        .from('investment_commitments')
        .select(`
          id,
          project_id,
          investor_id,
          amount,
          status,
          created_at
        `)
        .or(`investor_id.eq.${user.id},project_id.in.(select id from projects where innovator_id = '${user.id}')`)
        .order('created_at', { ascending: false });

      if (!commitments) return;

      // Fetch related data
      const conversationsWithDetails = await Promise.all(
        commitments.map(async (commitment) => {
          const { data: project } = await supabase
            .from('projects')
            .select('title, innovator_id')
            .eq('id', commitment.project_id)
            .maybeSingle();

          if (!project) return null;

          const otherId = profile.role === 'investor' ? project.innovator_id : commitment.investor_id;
          const { data: otherProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', otherId)
            .maybeSingle();

          if (!otherProfile) return null;

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('message, created_at')
            .eq('commitment_id', commitment.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('commitment_id', commitment.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);

          return {
            commitment_id: commitment.id,
            project_title: project.title,
            other_user: otherProfile,
            other_user_id: otherId,
            amount: commitment.amount,
            status: commitment.status,
            last_message: lastMsg?.message,
            last_message_time: lastMsg?.created_at,
            unread_count: unreadCount || 0,
          };
        })
      );

      setConversations(conversationsWithDetails.filter(c => c !== null));


    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (commitmentId) => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('commitment_id', commitmentId)
        .order('created_at', { ascending: true });

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('commitment_id', commitmentId)
        .eq('receiver_id', user.id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = (commitmentId) => {
    const channel = supabase
      .channel(`messages:${commitmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `commitment_id=eq.${commitmentId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await supabase.from('messages').insert({
        commitment_id: selectedConversation.commitment_id,
        sender_id: user.id,
        receiver_id: selectedConversation.other_user_id,
        message: newMessage.trim(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (loading) return <div className="p-8">Loading messages...</div>;

  return (
    <div className="h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Conversations List */}
        <Card className="p-4 overflow-y-auto">
          <h2 className="font-semibold text-gray-900 mb-4">Conversations</h2>
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.commitment_id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConversation?.commitment_id === conv.commitment_id
                      ? 'bg-green-50 border-2 border-green-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm text-gray-900">{conv.other_user.full_name}</p>
                    {conv.unread_count > 0 && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{conv.project_title}</p>
                  <p className="text-xs text-gray-500 truncate">{conv.last_message || 'No messages yet'}</p>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Messages Area */}
        <Card className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">{selectedConversation.other_user.full_name}</h3>
                <p className="text-sm text-gray-600">{selectedConversation.project_title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Investment: ${selectedConversation.amount.toLocaleString()} • Status: {selectedConversation.status}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender_id === user.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-green-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <Button type="submit">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
