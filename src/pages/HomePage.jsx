import { Zap, DollarSign, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import ProjectCard from '../components/ProjectCard';

export default function HomePage() {
  const featuredProjects = [
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
  ];

  return (
    <div className="min-h-screen">
      <section
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundImage: 'url(https://placehold.co/1920x1080/22543D/FFFFFF?text=MIC)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Innovating Beyond Timber.</h1>
          <p className="text-xl md:text-2xl mb-8">
            Connecting innovators, investors, and talent to build a world without deforestation.
          </p>
          <Button size="lg">Join the Movement</Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">An Ecosystem for Change</h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          We bring together the best minds and resources to create sustainable alternatives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <Zap className="text-green-800" size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Submit Your Idea.</h3>
            <p className="text-gray-600">
              Get your wood-alternative project funded and built.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
              <DollarSign className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Fund the Future.</h3>
            <p className="text-gray-600">
              Invest in vetted, high-impact sustainable startups.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <Briefcase className="text-green-800" size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Find Your Purpose.</h3>
            <p className="text-gray-600">
              Apply for jobs at companies that are changing the world.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Projects You Can Support</h2>
          <p className="text-center text-gray-600 mb-12">
            Make a difference by supporting innovative sustainable projects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">View All Projects</Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-5xl font-bold text-green-800 mb-2">100+</h2>
              <p className="text-gray-600">Projects Funded</p>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-green-800 mb-2">500+</h2>
              <p className="text-gray-600">Jobs Created</p>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-green-800 mb-2">$5M+</h2>
              <p className="text-gray-600">Invested</p>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-green-800 mb-2">50+</h2>
              <p className="text-gray-600">Active Startups</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl mb-8">
            Join our community of innovators and investors building a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">Submit a Project</Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-green-800">
              Become an Investor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
