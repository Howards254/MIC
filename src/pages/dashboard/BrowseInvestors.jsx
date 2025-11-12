import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { DollarSign, MapPin, Target, Clock, TrendingUp } from 'lucide-react';

export default function BrowseInvestors() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      // Get all approved investor applications
      const { data: applications, error } = await supabase
        .from('investor_applications')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;

      if (!applications || applications.length === 0) {
        setInvestors([]);
        setLoading(false);
        return;
      }

      // Get investor profile details
      const investorsWithProfiles = await Promise.all(
        applications.map(async (app) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', app.user_id)
            .single();

          return {
            ...profile,
            investor_profiles: [{
              company_name: app.company_name,
              investment_range: app.investment_range,
              areas_of_interest: app.areas_of_interest,
              investment_thesis: app.investment_thesis,
              portfolio_companies: app.portfolio_companies,
              preferred_stage: app.preferred_stage,
              ticket_size_min: app.ticket_size_min,
              ticket_size_max: app.ticket_size_max,
              geographic_focus: app.geographic_focus,
              decision_timeline: app.decision_timeline,
              value_add: app.value_add
            }]
          };
        })
      );

      setInvestors(investorsWithProfiles);
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Investors</h1>
        <p className="text-gray-600 mt-2">Connect with investors looking for projects like yours</p>
      </div>

      {investors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No investors available yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {investors.map((investor) => {
            const profile = investor.investor_profiles?.[0];
            if (!profile) return null;
            
            return (
              <div key={investor.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {investor.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{investor.full_name}</h3>
                    <p className="text-gray-600">{profile.company_name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>{profile.investment_range}</span>
                      </div>
                      {profile.geographic_focus && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{profile.geographic_focus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Areas of Interest</p>
                    <p className="text-gray-600">{profile.areas_of_interest}</p>
                  </div>

                  {profile.investment_thesis && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Investment Thesis</p>
                      <p className="text-gray-600">{profile.investment_thesis}</p>
                    </div>
                  )}

                  {profile.value_add && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Value Beyond Capital</p>
                      <p className="text-gray-600">{profile.value_add}</p>
                    </div>
                  )}

                  <div className="flex gap-6 text-sm text-gray-600 pt-3 border-t">
                    {profile.preferred_stage && (
                      <div className="flex items-center gap-1">
                        <Target size={16} />
                        <span>Stage: {profile.preferred_stage}</span>
                      </div>
                    )}
                    {profile.decision_timeline && (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Decides in: {profile.decision_timeline}</span>
                      </div>
                    )}
                    {profile.ticket_size_min && profile.ticket_size_max && (
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} />
                        <span>${profile.ticket_size_min.toLocaleString()} - ${profile.ticket_size_max.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
