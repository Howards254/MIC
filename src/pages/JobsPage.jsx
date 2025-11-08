import PageShell from '../components/layout/PageShell';
import JobCard from '../components/JobCard';
import Input from '../components/ui/Input';

export default function JobsPage() {
  const jobs = [
    {
      id: 1,
      title: 'Material Scientist',
      company: 'BambooTech Industries',
      location: 'Remote',
    },
    {
      id: 2,
      title: 'Sustainability Consultant',
      company: 'EcoMaterials Inc.',
      location: 'San Francisco, CA',
    },
    {
      id: 3,
      title: 'Production Manager',
      company: 'MyceliumWorks',
      location: 'Portland, OR',
    },
    {
      id: 4,
      title: 'Research & Development Engineer',
      company: 'HempFiber Solutions',
      location: 'Remote',
    },
    {
      id: 5,
      title: 'Marketing Director',
      company: 'GreenBuild Materials',
      location: 'New York, NY',
    },
    {
      id: 6,
      title: 'Quality Assurance Specialist',
      company: 'SustainaCork',
      location: 'Austin, TX',
    },
  ];

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
        <p className="text-gray-600 text-lg">
          Join companies building sustainable alternatives and make a real impact.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Search by keyword..." />

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>All Locations</option>
            <option>Remote</option>
            <option>San Francisco, CA</option>
            <option>New York, NY</option>
            <option>Austin, TX</option>
            <option>Portland, OR</option>
          </select>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>All Startups</option>
            <option>BambooTech Industries</option>
            <option>EcoMaterials Inc.</option>
            <option>MyceliumWorks</option>
            <option>HempFiber Solutions</option>
            <option>GreenBuild Materials</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </PageShell>
  );
}
