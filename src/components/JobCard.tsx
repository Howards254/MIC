import Card from './Card';
import Button from './ui/Button';

export default function JobCard({ title, company, location, logoUrl }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={logoUrl || 'https://placehold.co/100x100/cccccc/FFFFFF?text=Logo'}
            alt={company}
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600">{company}</p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
          <p className="text-sm text-gray-600">{location}</p>
          <Button size="sm">Apply Now</Button>
        </div>
      </div>
    </Card>
  );
}
