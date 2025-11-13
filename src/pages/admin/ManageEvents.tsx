import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    venue_details: '',
    max_attendees: 100,
    ticket_price: 0,
    status: 'upcoming'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    setEvents(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        await supabase
          .from('events')
          .update(formData)
          .eq('id', editingEvent.id);
      } else {
        await supabase.from('events').insert([formData]);
      }

      setShowForm(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        venue_details: '',
        max_attendees: 100,
        ticket_price: 0,
        status: 'upcoming'
      });
      fetchEvents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date.split('T')[0] + 'T' + event.event_date.split('T')[1].substring(0, 5),
      location: event.location,
      venue_details: event.venue_details || '',
      max_attendees: event.max_attendees,
      ticket_price: event.ticket_price,
      status: event.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          
          <input
            type="text"
            required
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            placeholder="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="datetime-local"
            required
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            required
            placeholder="Location (e.g., Nairobi, Kenya)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Venue Details (optional)"
            value={formData.venue_details}
            onChange={(e) => setFormData({ ...formData, venue_details: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              required
              min="10"
              placeholder="Max Attendees"
              value={formData.max_attendees}
              onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ticket Price"
              value={formData.ticket_price}
              onChange={(e) => setFormData({ ...formData, ticket_price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{event.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} />
                {new Date(event.event_date).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                {event.location}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={16} />
                Max {event.max_attendees} attendees
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-semibold">
                  {event.ticket_price > 0 ? `$${event.ticket_price}` : 'Free'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
