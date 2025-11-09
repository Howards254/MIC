import { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function DonorList({ projectId }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, [projectId]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading donors...</div>;
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Be the first to support this project!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Recent Donors ({donations.length})</h3>
      <div className="space-y-3">
        {donations.map((donation) => (
          <div key={donation.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600 fill-green-600" />
                <span className="font-medium">{donation.donor_name}</span>
              </div>
              <span className="font-bold text-green-600">${donation.amount}</span>
            </div>
            {donation.message && (
              <div className="flex gap-2 text-sm text-gray-600 mt-2">
                <MessageCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="italic">"{donation.message}"</p>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              {new Date(donation.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
