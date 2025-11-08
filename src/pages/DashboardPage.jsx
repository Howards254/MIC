import { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = [
    {
      id: 1,
      title: 'Bamboo Composite Building Materials',
      status: 'Approved',
      fundsRaised: 80000,
      fundingGoal: 100000,
    },
    {
      id: 2,
      title: 'Hemp Fiber Insulation System',
      status: 'Pending',
      fundsRaised: 0,
      fundingGoal: 75000,
    },
    {
      id: 3,
      title: 'Recycled Plastic Lumber',
      status: 'Approved',
      fundsRaised: 45000,
      fundingGoal: 90000,
    },
  ];

  const getStatusBadgeClass = (status) => {
    return status === 'Approved'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Manage your projects and track their progress</p>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Submit New Project
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Project Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Funds Raised
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ${project.fundsRaised.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-800 h-2 rounded-full"
                          style={{
                            width: `${(project.fundsRaised / project.fundingGoal) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit New Project"
      >
        <form className="space-y-6">
          <Input
            label="Project Title"
            id="projectTitle"
            placeholder="Enter your project title"
          />

          <Textarea
            label="Project Description"
            id="projectDescription"
            placeholder="Describe your project, its goals, and its impact..."
            rows={6}
          />

          <Input
            label="Funding Goal ($)"
            id="fundingGoal"
            type="number"
            placeholder="100000"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Category
            </label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Select a category</option>
              <option>Building Materials</option>
              <option>Furniture</option>
              <option>Packaging</option>
              <option>Textiles</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button fullWidth variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth>Submit for Approval</Button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
