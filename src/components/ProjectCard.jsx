import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './ui/Button';
import DonateButton from './donations/DonateButton';

export default function ProjectCard({ id, title, description, fundingGoal, fundsRaised = 0, totalDonations = 0, imageUrl }) {
  const totalFunding = fundsRaised + totalDonations;
  const fundingPercentage = (totalFunding / fundingGoal) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={imageUrl || 'https://placehold.co/600x400/22543D/FFFFFF?text=Project'}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-800 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Raised</p>
            <p className="font-bold text-green-800">${totalFunding.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Goal</p>
            <p className="font-semibold text-gray-900">${fundingGoal.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <DonateButton project={{ id, title, description, funding_goal: fundingGoal, total_donations: totalDonations }} variant="secondary" />
          <Button fullWidth>View</Button>
        </div>
      </div>
    </Card>
  );
}
