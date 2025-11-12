import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PageShell from '../components/layout/PageShell';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Projects</h1>
        <p className="text-gray-600">Discover and support innovative sustainable projects</p>
      </div>

      <div className="mb-8 flex gap-4 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
        <button onClick={() => setFilter('Building Materials')} className={`px-4 py-2 rounded-lg ${filter === 'Building Materials' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Building Materials</button>
        <button onClick={() => setFilter('Furniture')} className={`px-4 py-2 rounded-lg ${filter === 'Furniture' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Furniture</button>
        <button onClick={() => setFilter('Packaging')} className={`px-4 py-2 rounded-lg ${filter === 'Packaging' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Packaging</button>
        <button onClick={() => setFilter('Textiles')} className={`px-4 py-2 rounded-lg ${filter === 'Textiles' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Textiles</button>
        <button onClick={() => setFilter('Energy')} className={`px-4 py-2 rounded-lg ${filter === 'Energy' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Energy</button>
        <button onClick={() => setFilter('Agriculture')} className={`px-4 py-2 rounded-lg ${filter === 'Agriculture' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Agriculture</button>
        <button onClick={() => setFilter('Other')} className={`px-4 py-2 rounded-lg ${filter === 'Other' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Other</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            fundingGoal={project.funding_goal}
            fundsRaised={project.funds_raised || 0}
            totalDonations={project.total_donations || 0}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No projects found in this category</p>
        </div>
      )}
    </PageShell>
  );
}
