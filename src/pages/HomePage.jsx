import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, DollarSign, Briefcase, TreePine, Users, TrendingUp, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';
import ProjectCard from '../components/ProjectCard';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80'
  ];

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(3);
      setFeaturedProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/85 to-emerald-900/90" />
        
        {/* Animated Blobs */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-fade-in-down">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Building a Sustainable Future</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Innovating Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">Timber</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Connecting innovators, investors, and talent to build sustainable alternatives and combat deforestation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link to="/signup" className="inline-block">
              <button className="group px-8 py-4 bg-white text-green-800 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Join the Movement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/explore" className="inline-block">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/40 text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-green-800 hover:scale-105 transition-all duration-300 shadow-xl">
                Explore Projects
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300 mb-1">100+</div>
              <div className="text-sm text-green-200">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300 mb-1">$5M+</div>
              <div className="text-sm text-green-200">Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300 mb-1">500+</div>
              <div className="text-sm text-green-200">Jobs Created</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">An Ecosystem for Change</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We bring together the best minds and resources to create sustainable alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Submit Your Idea</h3>
              <p className="text-gray-600 mb-6">
                Get your wood-alternative project funded and built with support from our community.
              </p>
              <Link to="/signup" className="inline-flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
                Get Started <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fund the Future</h3>
              <p className="text-gray-600 mb-6">
                Invest in vetted, high-impact sustainable startups making a real difference.
              </p>
              <Link to="/signup" className="inline-flex items-center text-yellow-600 font-medium group-hover:gap-2 transition-all">
                Become Investor <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Find Your Purpose</h3>
              <p className="text-gray-600 mb-6">
                Apply for jobs at companies that are changing the world for the better.
              </p>
              <Link to="/jobs" className="inline-flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
                Browse Jobs <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
              <Heart className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Featured Projects</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Projects You Can Support</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make a difference by supporting innovative sustainable projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  fundingGoal={project.funding_goal}
                  fundsRaised={project.funds_raised}
                  totalDonations={project.total_donations}
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/explore" className="inline-block">
              <button className="group px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                View All Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Impact</h2>
            <p className="text-lg text-gray-600">Together, we're making a real difference</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <TreePine className="text-green-600" size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">100+</h2>
              <p className="text-gray-600 font-medium">Projects Funded</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="text-yellow-600" size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">500+</h2>
              <p className="text-gray-600 font-medium">Jobs Created</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="text-emerald-600" size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">$5M+</h2>
              <p className="text-gray-600 font-medium">Invested</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Users className="text-green-600" size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">50+</h2>
              <p className="text-gray-600 font-medium">Active Startups</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Join the Movement</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl mb-10 text-green-100 max-w-2xl mx-auto">
            Join our community of innovators and investors building a sustainable future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-block">
              <button className="group px-8 py-4 bg-white text-green-800 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Submit a Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/signup" className="inline-block">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/40 text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-green-800 hover:scale-105 transition-all duration-300 shadow-xl">
                Become an Investor
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
