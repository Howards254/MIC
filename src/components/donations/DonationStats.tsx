import { Heart, Users, TrendingUp } from 'lucide-react';

export default function DonationStats({ project, donorCount }) {
  const totalDonations = project.total_donations || 0;
  const fundingGoal = project.funding_goal || 0;
  const percentageRaised = fundingGoal > 0 ? (totalDonations / fundingGoal) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-green-600 fill-green-600" />
        <h3 className="font-semibold text-lg">Community Support</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-2xl font-bold text-green-600">
            ${totalDonations.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Total Donations</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{donorCount}</div>
          <div className="text-xs text-gray-600">Donors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {percentageRaised.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">of Goal</div>
        </div>
      </div>

      {fundingGoal > 0 && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress to ${fundingGoal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(percentageRaised, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
