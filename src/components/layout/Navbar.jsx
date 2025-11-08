import { Link } from 'react-router-dom';
import { Menu, Leaf } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="text-green-800" size={32} />
            <span className="text-2xl font-bold text-green-800">MIC</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Home
            </Link>
            <Link to="/innovators" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Innovators
            </Link>
            <Link to="/investors" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Investors
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Jobs
            </Link>
            <Link to="/explore" className="text-gray-700 hover:text-green-800 font-medium transition-colors">
              Explore Projects
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>

          <button className="md:hidden text-gray-700">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
