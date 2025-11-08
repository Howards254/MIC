import { Link } from 'react-router-dom';
import { Leaf, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="text-green-500" size={28} />
              <span className="text-xl font-bold text-white">MIC</span>
            </div>
            <p className="text-sm">
              Connecting innovators, investors, and talent to build a world without deforestation.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/innovators" className="hover:text-white transition-colors">
                  Innovators
                </Link>
              </li>
              <li>
                <Link to="/investors" className="hover:text-white transition-colors">
                  Investors
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Maathai Innovation Catalyst. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
