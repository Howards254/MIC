import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './ui/Button';

export default function ProjectCard({ id, title, description, fundingGoal, fundsRaised, daysLeft, imageUrl }) {
  const fundingPercentage = (fundsRaised / fundingGoal) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={imageUrl || 'https://placehold.co/600x400/cccccc/FFFFFF?text=Project+Image'}
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

        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="font-semibold text-green-800">{fundingPercentage.toFixed(0)}% Funded</span>
          <span className="text-gray-600">{daysLeft} Days Left</span>
        </div>

        <Link to={`/project/${id}`}>
          <Button fullWidth>Learn More & Donate</Button>
        </Link>
      </div>
    </Card>
  );
}
