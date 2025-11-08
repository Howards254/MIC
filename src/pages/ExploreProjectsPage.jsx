import PageShell from '../components/layout/PageShell';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExploreProjectsPage() {
  const projects = [
    {
      id: 1,
      title: 'Bamboo Composite Building Materials',
      description: 'Revolutionary building materials made from sustainable bamboo composites that rival traditional timber in strength and durability.',
      fundingGoal: 100000,
      fundsRaised: 80000,
      daysLeft: 15,
    },
    {
      id: 2,
      title: 'Mycelium-Based Packaging',
      description: 'Eco-friendly packaging solutions grown from mycelium that are fully biodegradable and replace plastic foam packaging.',
      fundingGoal: 75000,
      fundsRaised: 52000,
      daysLeft: 22,
    },
    {
      id: 3,
      title: 'Hemp Fiber Furniture',
      description: 'Beautiful, sustainable furniture crafted from hemp fibers, offering a renewable alternative to traditional wood furniture.',
      fundingGoal: 120000,
      fundsRaised: 95000,
      daysLeft: 8,
    },
    {
      id: 4,
      title: 'Recycled Plastic Lumber',
      description: 'Durable lumber products made entirely from recycled ocean plastics, creating sustainable building materials.',
      fundingGoal: 90000,
      fundsRaised: 45000,
      daysLeft: 30,
    },
    {
      id: 5,
      title: 'Cork-Based Flooring Solutions',
      description: 'Premium flooring made from sustainably harvested cork, providing an eco-friendly alternative to hardwood.',
      fundingGoal: 85000,
      fundsRaised: 70000,
      daysLeft: 12,
    },
    {
      id: 6,
      title: 'Algae Bioplastic Manufacturing',
      description: 'Industrial-scale production of bioplastics from algae, replacing petroleum-based plastics.',
      fundingGoal: 150000,
      fundsRaised: 120000,
      daysLeft: 5,
    },
    {
      id: 7,
      title: 'Wheat Straw Particleboard',
      description: 'High-quality particleboard manufactured from agricultural waste wheat straw.',
      fundingGoal: 70000,
      fundsRaised: 35000,
      daysLeft: 25,
    },
    {
      id: 8,
      title: 'Coconut Fiber Insulation',
      description: 'Natural insulation materials made from coconut fibers, offering excellent thermal properties.',
      fundingGoal: 95000,
      fundsRaised: 78000,
      daysLeft: 18,
    },
    {
      id: 9,
      title: 'Recycled Cardboard Furniture',
      description: 'Stylish and sturdy furniture pieces created from recycled cardboard and paper products.',
      fundingGoal: 60000,
      fundsRaised: 55000,
      daysLeft: 7,
    },
  ];

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore All Projects</h1>
        <p className="text-gray-600 text-lg">
          Discover innovative projects creating sustainable alternatives to wood products.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-4">
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option>All Categories</option>
          <option>Building Materials</option>
          <option>Furniture</option>
          <option>Packaging</option>
          <option>Textiles</option>
        </select>

        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option>Sort By: Featured</option>
          <option>Sort By: Most Funded</option>
          <option>Sort By: Newest</option>
          <option>Sort By: Ending Soon</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <ChevronLeft size={20} className="mr-2" />
          Previous
        </Button>
        <Button variant="outline">
          Next
          <ChevronRight size={20} className="ml-2" />
        </Button>
      </div>
    </PageShell>
  );
}
