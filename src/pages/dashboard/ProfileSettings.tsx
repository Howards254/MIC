import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';
import { Save } from 'lucide-react';

export default function ProfileSettings() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    linkedin: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        linkedin: profile.linkedin || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        website: formData.website,
        linkedin: formData.linkedin
      })
      .eq('id', user.id);

    if (!error) {
      alert('Profile updated successfully!');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Email: <span className="font-medium">{profile?.email}</span></p>
              <p className="text-sm text-gray-600">Role: <span className="font-medium capitalize">{profile?.role}</span></p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
