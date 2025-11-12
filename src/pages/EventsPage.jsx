import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import PageShell from '../components/layout/PageShell';
import useAuth from '../hooks/useAuth';

export default function EventsPage() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true });
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId, ticketPrice) => {
    if (!user) {
      alert('Please sign in to register for events');
      return;
    }

    const registrationType = profile?.role === 'investor' ? 'investor' : 'innovator';

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          registration_type: registrationType,
          payment_amount: ticketPrice,
          ticket_paid: ticketPrice === 0,
          status: ticketPrice === 0 ? 'confirmed' : 'pending'
        });

      if (error) throw error;
      alert('Registration successful! Check your email for details.');
      fetchEvents();
    } catch (error) {
      if (error.code === '23505') {
        alert('You are already registered for this event');
      } else {
        alert('Registration failed: ' + error.message);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Investment Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet investors and innovators face-to-face. Sign deals. Build the future.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No upcoming events. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold">{event.title}</h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {new Date(event.event_date) > new Date() ? 'Upcoming' : 'Ongoing'}
                    </span>
                  </div>
                  <p className="text-green-100">{event.description}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-medium">
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span>{event.location}</span>
                  </div>

                  {event.venue_details && (
                    <p className="text-sm text-gray-600 pl-8">{event.venue_details}</p>
                  )}

                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-green-600" />
                    <span>Max {event.max_attendees} attendees</span>
                  </div>

                  <button
                    onClick={() => handleRegister(event.id, 0)}
                    className="w-full mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    Register Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What to Expect</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2 text-green-800">Before the Event</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Review startup pitches</li>
                <li>• Schedule 1-on-1 meetings</li>
                <li>• Prepare questions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-green-800">During the Event</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Pitch presentations</li>
                <li>• Speed networking</li>
                <li>• Deal negotiations</li>
                <li>• Sign agreements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-green-800">After the Event</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Funds transferred (48hrs)</li>
                <li>• Equity documentation</li>
                <li>• Ongoing support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
