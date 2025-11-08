import PageShell from '../components/layout/PageShell';
import Card from '../components/Card';
import Button from '../components/ui/Button';

export default function AdminPage() {
  const pendingProjects = [
    {
      id: 1,
      title: 'Mushroom-Based Packaging Solutions',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2025-11-05',
    },
    {
      id: 2,
      title: 'Algae-Based Bioplastics',
      submittedBy: 'Michael Chen',
      submittedDate: '2025-11-06',
    },
    {
      id: 3,
      title: 'Wheat Straw Board Manufacturing',
      submittedBy: 'Emily Rodriguez',
      submittedDate: '2025-11-07',
    },
  ];

  const pendingInvestors = [
    {
      id: 1,
      name: 'David Williams',
      email: 'david.williams@investment.com',
      appliedDate: '2025-11-04',
    },
    {
      id: 2,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@ventures.com',
      appliedDate: '2025-11-06',
    },
  ];

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage project approvals and investor applications</p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Project Approvals</h2>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Project Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Submitted By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{project.submittedBy}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{project.submittedDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="success">
                          Approve
                        </Button>
                        <Button size="sm" variant="danger">
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Investor Approvals</h2>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date Applied
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingInvestors.map((investor) => (
                  <tr key={investor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{investor.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{investor.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{investor.appliedDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="success">
                          Approve
                        </Button>
                        <Button size="sm" variant="danger">
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
